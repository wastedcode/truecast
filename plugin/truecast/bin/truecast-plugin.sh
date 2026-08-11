#!/usr/bin/env bash
#
# truecast-plugin.sh — the whole installer lane, as one reviewable script.
#
# The slash commands in ../commands/ are thin adapters: they run this, read ONE result line, and do the
# part that needs judgment (render the plan, ask the user, show the diff). Nothing else. A model
# executing a prose runbook is the biggest risk in this feature, so the runbook is code (D0).
#
#   truecast-plugin.sh install <name> [--project [path]] [--force] [--yes]
#   truecast-plugin.sh update  <name>|--all             [--force] [--yes]
#   truecast-plugin.sh list
#   truecast-plugin.sh remove  <name> [--project [path]]         [--yes]
#
# Without --yes: PLAN ONLY. Zero writes. Always.
#
# Human narrative goes to stderr. The LAST line of stdout is always exactly one:
#   TRUECAST_RESULT status=<plan|installed|updated|removed|up-to-date|noop> persona=<name>
#     version=<semver> from=<semver|none> target=<abs path> restart=<true|false>
#     drift=<true|false> foreign=<true|false>
# (one physical line; wrapped here for reading only)
#
# On `update --all` there is one result line PER PERSONA, and a member that could not be updated gets a
# `status=failed … exit=<code> reason=<token>` line rather than silence.
#
# Exit codes: 0 ok (incl. status=plan) · 2 usage · 3 not-found · 4 busy · 5 foreign ·
#             6 one or more --all members failed · 7 precondition · 8 io
#
# It writes the SAME on-disk contract as the npm CLI — `~/.truecast/personas/<name>/{<ver>/core,current,
# meta.json}` plus `~/.claude/agents/<name>.md` — and deliberately NOT `owned.json`: hashing in shell
# would be a second implementation of a contract that must match forever. The CLI adopts what this writes
# (see src/adopt). POSIX + bash 3.2 (macOS) only; no Windows on this lane, no jq, no Node.

set -u
# NOT `set -o pipefail`: a `sed | grep -q` that stops early kills the writer with SIGPIPE, and pipefail
# would report that as the pipeline's failure. Every command whose failure matters is checked explicitly.

# stable globs, sorts and character classes regardless of the user's locale
export LC_ALL=C

# bash 5.2 turned `patsub_replacement` ON by default, which makes a bare `&` in the REPLACEMENT half of
# `${var//pat/repl}` expand to the matched text. A $TRUECAST_HOME containing `&` would therefore expand
# to the placeholder itself, and `{{TRUECAST_HOME}}` would survive into the written agent file —
# silently, exit 0, a teammate whose every Read path is broken. Turn it off. The `|| true` is for
# bash 3.2 (macOS), which has no such option and would otherwise abort here under `set -u`.
shopt -u patsub_replacement 2>/dev/null || true

PLUGIN_VERSION="0.1.0"

NL=$'\n'
CR=$'\r'
TAB=$'\t'

# ---------------------------------------------------------------- output --

say() { printf '%s\n' "$*" >&2; }
warn() { printf 'warning: %s\n' "$*" >&2; }
# A next step attached to whatever fails NEXT. Set it around a step whose failure leaves recoverable
# partial state, so the message says what to do instead of leaving the user to guess.
HINT=""
die() {
  local code=$1
  shift
  printf 'error: %s\n' "$*" >&2
  [ -n "$HINT" ] && printf '  → %s\n' "$HINT" >&2
  exit "$code"
}

# One field out of a captured TRUECAST_RESULT line, or a safe default. Only ever used for the
# space-free fields (version/from/drift/foreign) — `target=` is not re-parsed, since a path may contain
# spaces and this splits on them.
rfield() {
  local v
  v=$(printf '%s' "$1" | tr ' ' '\n' | sed -n "s/^$2=//p" | tail -n 1)
  case "$2" in
  drift | foreign) [ -n "$v" ] || v=false ;;
  *) [ -n "$v" ] || v=none ;;
  esac
  printf '%s' "$v"
}

# A one-token reason for an exit code — machine-readable, so the command can dispatch on it the same way
# it dispatches on the code itself.
exit_reason() {
  case "$1" in
  2) printf 'usage' ;;
  3) printf 'not-found' ;;
  4) printf 'busy' ;;
  5) printf 'foreign' ;;
  7) if [ "$(rfield "${2:-}" drift)" = true ]; then printf 'drift'; else printf 'precondition'; fi ;;
  8) printf 'io' ;;
  *) printf 'error' ;;
  esac
}

# The machine-readable contract. Every successful path prints exactly one of these, last, on stdout.
result() {
  printf 'TRUECAST_RESULT status=%s persona=%s version=%s from=%s target=%s restart=%s drift=%s foreign=%s\n' \
    "$1" "$2" "$3" "$4" "$5" "$6" "$7" "$8"
}

# ------------------------------------------------------------- teardown --

LOCK=""
LOCK_HELD=0
WORK=""
STAGING=""

cleanup() {
  if [ "$LOCK_HELD" = 1 ]; then
    rm -rf "$LOCK" 2>/dev/null
    LOCK_HELD=0
  fi
  # a half-copied core must never be left looking installed; the suffix also matches `truecast doctor`'s
  # stale-staging sweep, so even a SIGKILL leaves residue the CLI already knows how to clean.
  # Containment-checked even on the teardown path: STAGING is derived from clone content (the version).
  # (`${TC_HOME:-}` — the trap can fire before the preconditions have resolved the homes)
  if [ -n "$STAGING" ] && inside "${TC_HOME:-}" "$STAGING"; then rm -rf "$STAGING" 2>/dev/null; fi
  [ -n "$WORK" ] && rm -rf "$WORK" 2>/dev/null
  return 0
}
trap cleanup EXIT
trap 'cleanup; exit 130' INT
trap 'cleanup; exit 143' TERM

# --------------------------------------------------------- preconditions --

# Self-location: the script works when run by hand from a clone, which is what makes it testable.
# No dependency on $CLAUDE_PLUGIN_ROOT — the command tries that only to FIND this file.
SELF=$(cd "$(dirname "$0")" && pwd -P) || die 8 "cannot resolve the script's own location"
SCRIPT="$SELF/$(basename -- "$0")"
PLUGIN_ROOT=$(cd "$SELF/.." && pwd -P) || die 8 "cannot resolve the plugin root"
CLONE=$(cd "$PLUGIN_ROOT/../.." && pwd -P) || die 8 "cannot resolve the marketplace clone"

# A home path we are about to write under must be absolute and free of control characters — otherwise a
# stray value turns `$HOME/.truecast/...` into `/personas/...` or worse.
check_home() {
  case "$2" in
  /*) ;;
  *) die 7 "$1 must be an absolute path (got: $2)" ;;
  esac
  case "$2" in
  *"$NL"* | *"$CR"* | *"$TAB"*) die 7 "$1 must not contain control characters" ;;
  esac
}

[ -n "${HOME:-}" ] || die 7 "HOME is not set; truecast cannot tell where your home directory is"
check_home HOME "$HOME"
# Identical resolution to src/config/resolveConfig — used verbatim, no normalisation.
TC_HOME=${TRUECAST_HOME:-$HOME/.truecast}
CC_HOME=${CLAUDE_HOME:-$HOME/.claude}
check_home TRUECAST_HOME "$TC_HOME"
check_home CLAUDE_HOME "$CC_HOME"

MARKETPLACE="$CLONE/.claude-plugin/marketplace.json"
[ -f "$MARKETPLACE" ] ||
  die 3 "no marketplace at $MARKETPLACE — this script must run from inside the truecast marketplace clone"
grep -q '"name": "truecast"' "$MARKETPLACE" ||
  die 3 "$MARKETPLACE is not the truecast marketplace"

WORK=$(mktemp -d "${TMPDIR:-/tmp}/truecast-plugin.XXXXXX") || die 8 "cannot create a temp dir"

# ------------------------------------------------------------- utilities --

# The PersonaName regex, in shell: ^[a-z][a-z0-9-]*$, no trailing dash, <=64. Runs BEFORE the name
# touches any path, so `../`, `;`, spaces and absolute paths never reach the filesystem.
valid_name() {
  case "$1" in
  "" | *[!a-z0-9-]*) return 1 ;;
  [!a-z]*) return 1 ;;
  *-) return 1 ;;
  esac
  [ "${#1}" -le 64 ]
}

require_name() {
  valid_name "$1" ||
    die 2 "'$1' is not a valid persona name (lowercase letters, digits and dashes; must start with a letter)"
}

# The CLI's SemVer schema, in shell (src/schema/index.ts: /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/).
# THIS IS A SECURITY GATE, not a nicety: the version comes from persona.toml — CLONE CONTENT — and is
# concatenated straight into `$TC_HOME/personas/<name>/<ver>`, which is then mkdir'd, rm -rf'd and
# renamed over. A shell `case` glob's `*` matches `/`, so a lax pattern like `[0-9]*.[0-9]*.[0-9]*`
# happily admits `1.0.0/../../../../Documents` and the write escapes the home. Reject every character
# that isn't in the semver alphabet, plus any `..`, before `$ver` touches a path.
valid_version() {
  local v=$1 core pre major minor patch rest
  # the alphabet, and the shapes a `case` glob would otherwise wave through
  case "$v" in
  "" | *[!0-9A-Za-z.-]* | *..* | .* | *. | -* | *-) return 1 ;;
  esac
  [ "${#v}" -le 64 ] || return 1
  # split the optional prerelease off at the FIRST dash, then require EXACTLY major.minor.patch.
  # A glob cannot express "exactly three numeric components": `[0-9]*.[0-9]*.[0-9]*` happily matches
  # `1.0.0.5`, which zod then rejects — leaving a version dir on disk the CLI can never adopt.
  case "$v" in
  *-*)
    core=${v%%-*}
    pre=${v#*-}
    case "$pre" in "" | *[!0-9A-Za-z.-]*) return 1 ;; esac
    ;;
  *) core=$v ;;
  esac
  major=${core%%.*}
  rest=${core#*.}
  [ "$rest" != "$core" ] || return 1 # no first dot
  minor=${rest%%.*}
  patch=${rest#*.}
  [ "$patch" != "$rest" ] || return 1 # no second dot
  case "$patch" in *.*) return 1 ;; esac # a fourth component
  case "$major$minor$patch" in "" | *[!0-9]*) return 1 ;; esac
  return 0
}

# Containment (the shell mirror of removeContained/RR8): nothing is deleted unless it is UNDER a home.
inside() {
  case "$2" in
  "$1"/*) return 0 ;;
  *) return 1 ;;
  esac
}

safe_rm() {
  inside "$1" "$2" || die 7 "refusing to delete a path outside $1: $2"
  # A delete needs the SAME proof a write needs, and needs it more: `rm -rf` through a symlinked
  # component (a planted `~/.truecast/personas`) destroys whatever it points at. Lexical containment
  # alone never sees that. safe_write is the walk; it refuses a symlink at any component AND at the
  # leaf, which is what we want here — a managed path we own is never itself a link.
  safe_write "$1" "$2"
  rm -rf "$2"
}

# The shell mirror of `writeContained` (src/safety/index.ts) — call this before ANY write, with the root
# that write is declared to stay inside. A leaf `-L` check is not enough: a symlink at a PARENT
# (`.claude/agents -> /elsewhere`, `.truecast -> ~/.ssh`) silently redirects the write while the plan and
# the result line still name the in-repo path. So: prove the target is lexically inside the root, then
# walk every existing component from the root down and refuse a symlink at any of them, then confirm the
# parent's realpath is still under the root. Nothing here follows a link; it only refuses.
safe_write() {
  local root=$1 target=$2 realroot rel part cur parent realparent
  # `..` is refused up front, before anything else: the realpath confirmation below only runs when the
  # parent already EXISTS, so a traversal into a not-yet-created directory would otherwise slip past
  # the one check that would have caught it. This primitive is general — it cannot assume its callers
  # validated their inputs first.
  case "/$target/" in
  */../*) die 7 "refusing a path containing '..': $target" ;;
  esac
  realroot=$(cd "$root" 2>/dev/null && pwd -P) || die 7 "cannot resolve the write root $root"
  inside "$root" "$target" || die 7 "refusing to write outside $root: $target"
  rel=${target#"$root"/}
  cur=$realroot
  while [ -n "$rel" ]; do
    part=${rel%%/*}
    if [ "$part" = "$rel" ]; then rel=""; else rel=${rel#*/}; fi
    [ -n "$part" ] || continue
    cur="$cur/$part"
    [ -L "$cur" ] && die 7 "refusing to write through a symlink at $cur"
  done
  parent=$(dirname "$target")
  if [ -d "$parent" ]; then
    realparent=$(cd "$parent" 2>/dev/null && pwd -P) || die 7 "cannot resolve $parent"
    case "$realparent" in
    "$realroot" | "$realroot"/*) ;;
    *) die 7 "refusing to write outside $root: $target resolves to $realparent" ;;
    esac
  fi
}

json_escape() { printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'; }

# Does this file carry the generated stamp in its header window? The stamp sits under the frontmatter,
# so its line number varies with how many optional keys the persona declares (8 at most). 12 gives
# headroom and stays BOUNDED. src/adopt uses the same window — the two must agree.
has_stamp() { sed -n '1,12p;12q' "$1" 2>/dev/null | grep -q 'GENERATED by truecast'; }

toml_version() {
  sed -n 's/^[[:space:]]*version[[:space:]]*=[[:space:]]*"\([^"]*\)".*/\1/p' "$1" | head -n 1
}

# The tools line of the RENDERED agent file — what the user is actually granting (D7: on this lane the
# plan is the only place the tool grant is surfaced; neither consent surface of the other lanes runs).
body_tools() {
  local t
  t=$(sed -n '1,12s/^tools:[[:space:]]*//p' "$1" | sed -n 1p)
  if [ -n "$t" ]; then printf '%s' "$t"; else printf '%s' "(unrestricted — inherits the session's tools)"; fi
}

# ------------------------------------------------------------- the clone --

CLONE_DIR=""
SRC_VERSION=""

# Locate + validate a persona inside the marketplace clone. Sets CLONE_DIR and SRC_VERSION.
load_clone_persona() {
  local name=$1
  CLONE_DIR="$CLONE/personas/$name"
  [ -d "$CLONE_DIR" ] ||
    die 3 "no persona named '$name' in this marketplace copy — run '/truecast:list' to see what's available"
  [ -f "$CLONE_DIR/core/persona.toml" ] || die 3 "$CLONE_DIR is not a persona (no core/persona.toml)"
  if [ ! -f "$CLONE_DIR/subagent.md" ]; then
    die 3 "this marketplace copy predates the installer — run '/plugin marketplace update truecast', then try again"
  fi
  SRC_VERSION=$(toml_version "$CLONE_DIR/core/persona.toml")
  valid_version "$SRC_VERSION" ||
    die 3 "cannot read a usable version from $CLONE_DIR/core/persona.toml (got: '$SRC_VERSION')"
}

# Render the agent body for THIS machine: the published template with the home token substituted.
# Bash substitution, never sed — a home path containing & | or \ would corrupt a sed replacement.
# `$(cat)` strips the trailing newline; printf restores exactly one, which is what composeAgentFile
# always ends with. That restores byte-identity with the CLI lane (the invariant T-C1 pins).
render_body() {
  local tpl
  tpl=$(cat "$CLONE_DIR/subagent.md") || die 8 "cannot read $CLONE_DIR/subagent.md"
  printf '%s\n' "${tpl//\{\{TRUECAST_HOME\}\}/$TC_HOME}" >"$WORK/body" || die 8 "cannot stage the agent body"
}

# ---------------------------------------------------------------- state --

running_version() { readlink "$TC_HOME/personas/$1/current" 2>/dev/null; }

# Personas with a real install here. A bare dir doesn't count: acquiring the lock creates one, so a
# BUSY run must not leave a phantom entry in `list` or a wasted pass in `update --all`.
installed_personas() {
  local d name
  [ -d "$TC_HOME/personas" ] || return 0
  for d in "$TC_HOME"/personas/*/; do
    [ -d "$d" ] || continue
    name=$(basename "$d")
    valid_name "$name" || continue
    [ -L "$d/current" ] || [ -f "$d/meta.json" ] || continue
    printf '%s\n' "$name"
  done
}

clone_personas() {
  local d name
  [ -d "$CLONE/personas" ] || return 0
  for d in "$CLONE"/personas/*/; do
    [ -d "$d" ] || continue
    name=$(basename "$d")
    valid_name "$name" || continue
    printf '%s\n' "$name"
  done
}

# D6 — how an existing agent file is treated. Sets CLASS to absent | identical | stamped-diff | foreign.
# A symlink at the target is FOREIGN by definition: writing through it would escape the home (T-S2).
CLASS=""
classify_target() {
  local target=$1
  if [ -L "$target" ]; then
    CLASS=foreign
  elif [ ! -e "$target" ]; then
    CLASS=absent
  elif [ ! -f "$target" ]; then
    CLASS=foreign
  elif cmp -s "$WORK/body" "$target"; then
    CLASS=identical
  elif has_stamp "$target"; then
    CLASS=stamped-diff
  else
    CLASS=foreign
  fi
}

lock_persona() {
  local name=$1
  mkdir -p "$TC_HOME/personas" || die 8 "cannot create $TC_HOME/personas"
  # The SAME path proper-lockfile uses for `withPersonaLock` (it mkdirs "<file>.lock"), so this is
  # genuinely mutually exclusive with a running CLI operation — no second mechanism to keep in sync.
  # proper-lockfile CANONICALISES the target first (`realpath: true` is its default), so we must too:
  # with a symlinked home (macOS `/tmp` → `/private/tmp`) the two would otherwise lock different paths
  # and both "hold" it at once. Creating the persona dir to resolve it is exactly what the CLI does.
  mkdir -p "$TC_HOME/personas/$name" || die 8 "cannot create $TC_HOME/personas/$name"
  local real
  real=$(cd "$TC_HOME/personas/$name" && pwd -P) || die 8 "cannot resolve $TC_HOME/personas/$name"
  LOCK="$real.lock"
  if ! mkdir "$LOCK" 2>/dev/null; then
    # 60s, not 10 minutes: operations on this lane take SECONDS, so a lock older than a minute is
    # almost certainly a killed process, and making the user wait ten minutes to recover from a
    # `kill -9` is its own outage. Still comfortably above a live holder's heartbeat — the CLI's
    # proper-lockfile refreshes its mtime every ~15s while it genuinely holds the lock.
    if [ -n "$(find "$LOCK" -maxdepth 0 -mmin +1 2>/dev/null)" ]; then
      warn "a truecast lock older than a minute was left at $LOCK (a killed process?) — taking it over"
      rm -rf "$LOCK"
      mkdir "$LOCK" 2>/dev/null || die 4 "another truecast operation is running ($LOCK)"
    else
      die 4 "another truecast operation may be running ($LOCK) — a stale lock clears itself after about 60 seconds, so wait a moment and retry"
    fi
  fi
  LOCK_HELD=1
}

# ---------------------------------------------------------------- writes --

# 1. copy the craft into the body store, via a staging dir + rename (never a half-copied `core`).
write_body_store() {
  local name=$1 ver=$2 vdir
  vdir="$TC_HOME/personas/$name/$ver"
  safe_write "$TC_HOME" "$vdir/core"
  mkdir -p "$vdir" || die 8 "cannot create $vdir"
  STAGING="$vdir/core.staging-$$"
  safe_write "$TC_HOME" "$STAGING"
  # `$ver` is clone content, so every destructive step here goes through the containment check even
  # though valid_version already gated it — one bypass must not become a delete outside the home.
  safe_rm "$TC_HOME" "$STAGING"
  cp -R "$CLONE_DIR/core" "$STAGING" || die 8 "cannot copy the persona core into $vdir"
  [ -f "$STAGING/persona.toml" ] || die 8 "the copied core is incomplete (no persona.toml)"
  safe_rm "$TC_HOME" "$vdir/core"
  mv "$STAGING" "$vdir/core" || die 8 "cannot move the staged core into place"
  STAGING=""
}

# Where this marketplace copy came from — the `source` half of a meta record, and the thing a plan
# compares against to spot a fork. One owner, so the record and the warning can never disagree.
clone_origin() {
  local remote
  remote=$(git -C "$CLONE" config --get remote.origin.url 2>/dev/null)
  [ -n "$remote" ] || remote="$CLONE" # no git / no remote: the clone path is a valid `path` source
  # Strip URL userinfo before this is PERSISTED and PRINTED: a clone made with an embedded credential
  # (`https://ghp_TOKEN@github.com/...`) would otherwise write the token into meta.json and the plan.
  # Same rule the CLI applies in `redactUrl` before a source reaches the lock or the terminal.
  remote=$(printf '%s' "$remote" | sed 's|://[^/@]*@|://|')
  # …and strip control characters, mirroring SourceRef's `noControlChars`. `$(…)` only eats TRAILING
  # newlines, so an embedded one would land inside a JSON string and make meta.json unparseable — which
  # the CLI reports as META_CORRUPT and which stops the two lanes converging. (Found by T-S4.)
  printf '%s' "$remote" | tr -d '\000-\037\177'
}

# 2. meta.json — written ONLY when absent. Merging JSON in shell (no jq guarantee) is a duplication we
#    refuse; any CLI install/update repairs a stale record (D5).
write_meta_if_absent() {
  local name=$1 ver=$2 meta remote commit
  meta="$TC_HOME/personas/$name/meta.json"
  safe_write "$TC_HOME" "$meta"
  [ -e "$meta" ] && return 0
  remote=$(clone_origin)
  commit=$(git -C "$CLONE" rev-parse HEAD 2>/dev/null)
  case "$commit" in
  "" | *[!0-9a-f]*) commit="local" ;;
  esac
  printf '{\n  "source": "%s#personas/%s",\n  "versions": [\n    {\n      "ver": "%s",\n      "commit": "%s"\n    }\n  ]\n}\n' \
    "$(json_escape "$remote")" "$name" "$ver" "$commit" >"$meta.tmp-$$" || die 8 "cannot write $meta"
  mv "$meta.tmp-$$" "$meta" || die 8 "cannot write $meta"
}

# 3. re-point `current` — only at a version dir that exists and holds a manifest (the shell mirror of
#    promoteCurrent's RR1 guard).
promote_current() {
  local name=$1 ver=$2 pdir
  pdir="$TC_HOME/personas/$name"
  # `current` is the one target that IS a symlink (ours), so check its PARENT chain, not the leaf
  safe_write "$TC_HOME" "$pdir"
  [ -f "$pdir/$ver/core/persona.toml" ] || die 8 "refusing to point current at an incomplete $ver"
  ln -sfn "$ver" "$pdir/current" || die 8 "cannot re-point $pdir/current"
}

# 4. the user-visible surface, LAST (G1). Atomic: same-dir temp + rename, so a full disk can never leave
#    a truncated teammate.
# Set by do_install_or_update when --force is repairing an install that already looks current.
REPAIR=false

RESTART=false
write_agent_file() {
  local target=$1 root=$2 dir
  dir=$(dirname "$target")
  # Claude Code reads the agents dir at session start; if it isn't there yet, say so. Decided BEFORE
  # any mkdir, because on the user lane the root IS this dir and creating it would hide the answer.
  [ -d "$dir" ] || RESTART=true
  # The root must exist to be resolved. On the user lane it is the agents dir and creating it is ours to
  # do; on --project it is the repo root, which always exists, so this is a no-op there. Crucially the
  # `mkdir` of the target's own parents happens AFTER safe_write, so an untrusted repo's symlinked
  # `.claude` can never have directories created inside whatever it points at.
  mkdir -p "$root" || die 8 "cannot create $root"
  safe_write "$root" "$target"
  mkdir -p "$dir" || die 8 "cannot create $dir"
  cp "$WORK/body" "$target.tmp-$$" || die 8 "cannot write $target"
  mv "$target.tmp-$$" "$target" || die 8 "cannot write $target"
}

# --project only: the file is machine-local (absolute pointers into THIS user's home), so it must never
# be committed. Precedent: attachPersona appends `.truecast/agents/*/core`.
append_gitignore() {
  local root=$1 line=$2 gi
  gi="$root/.gitignore"
  # `>>` follows a symlink: a repo shipping `.gitignore -> ~/.bashrc` would have us append to the user's
  # shell profile.
  safe_write "$root" "$gi"
  if [ -f "$gi" ] && grep -qxF "$line" "$gi"; then return 0; fi
  if [ -s "$gi" ] && [ -n "$(tail -c 1 "$gi")" ]; then printf '\n' >>"$gi"; fi
  printf '%s\n' "$line" >>"$gi" || die 8 "cannot append to $gi"
}

# --project only: drop the ignore line we added, on detach. EXACT whole-line match only (`grep -xF`) —
# anything else in the user's .gitignore, including a broader pattern that happens to cover our file, is
# theirs and stays.
remove_gitignore_line() {
  local root=$1 line=$2 gi tmp
  gi="$root/.gitignore"
  [ -L "$gi" ] && return 0 # never rewrite through a symlink; leave it entirely alone
  [ -f "$gi" ] || return 0
  grep -qxF "$line" "$gi" 2>/dev/null || return 0
  tmp="$gi.tmp-$$"
  grep -vxF "$line" "$gi" >"$tmp"
  case $? in
  0 | 1) mv "$tmp" "$gi" || die 8 "cannot rewrite $gi" ;; # 1 = the file is now empty, which is fine
  *)
    rm -f "$tmp"
    die 8 "cannot rewrite $gi"
    ;;
  esac
}

# --project only: scaffold the standing brief the D1 overlay reads, ONLY if absent (never clobber edits).
scaffold_mandate() {
  local root=$1 name=$2 mandate
  # `mkdir -p` and `cp` both follow a symlinked component: a repo shipping `.truecast -> ~/.ssh` would
  # have us create dirs and write a file THERE.
  mandate="$root/.truecast/agents/$name/instance/mandate.md"
  safe_write "$root" "$mandate"
  [ -e "$mandate" ] && return 0
  mkdir -p "$(dirname "$mandate")" || die 8 "cannot create $(dirname "$mandate")"
  if [ -f "$CLONE_DIR/instance-template/mandate.md" ]; then
    cp "$CLONE_DIR/instance-template/mandate.md" "$mandate" || die 8 "cannot write $mandate"
  else
    printf '# Mandate — %s\n\nDescribe this project and what %s should do here.\n' "$name" "$name" >"$mandate" ||
      die 8 "cannot write $mandate"
  fi
}

# --------------------------------------------------------------- verbs --

NAME=""
YES=0
FORCE=0
ALL=0
PROJECT=0
PROJECT_ROOT=""

parse_args() {
  while [ $# -gt 0 ]; do
    case "$1" in
    --yes) YES=1 ;;
    --force) FORCE=1 ;;
    --all) ALL=1 ;;
    --project)
      PROJECT=1
      if [ $# -gt 1 ]; then
        case "$2" in
        -*) ;;
        *)
          PROJECT_ROOT=$2
          shift
          ;;
        esac
      fi
      ;;
    -*) die 2 "unknown option: $1" ;;
    *)
      [ -z "$NAME" ] || die 2 "unexpected argument: $1"
      NAME=$1
      ;;
    esac
    shift
  done
}

resolve_project_root() {
  local root=${PROJECT_ROOT:-$PWD}
  [ -d "$root" ] || die 3 "no such directory: $root"
  PROJECT_ROOT=$(cd "$root" && pwd -P) || die 3 "cannot resolve $root"
}

# Where the agent file goes. Project scope shadows user scope, and is machine-local (D8).
# Sets TARGET (the agent file) and TARGET_ROOT (the root that write must not escape). Deliberately NOT
# a `$(...)` function: a command substitution runs in a subshell, so a global set inside it is lost —
# and TARGET_ROOT silently empty is exactly how a containment check turns into a no-op.
#
# The two lanes declare DIFFERENT roots, on purpose:
#   user     → `$CC_HOME/agents`. The root itself is resolved (`pwd -P`), so `~/.claude/agents` MAY be a
#              symlink — the dotfiles pattern, which the npm CLI already permits, so refusing it here
#              would split the lanes. The walk still applies below it and the leaf FOREIGN check stays.
#   --project → the repo root. A cloned repo is untrusted: every component under it, `.claude` and
#              `.claude/agents` included, must be a real directory. Strict, and deliberately asymmetric.
TARGET=""
TARGET_ROOT=""
set_agent_target() {
  if [ "$PROJECT" = 1 ]; then
    TARGET_ROOT=$PROJECT_ROOT
    TARGET="$PROJECT_ROOT/.claude/agents/$1.md"
  else
    TARGET_ROOT="$CC_HOME/agents"
    TARGET="$CC_HOME/agents/$1.md"
  fi
}

# install and update share every step; they differ only in what they report and what "nothing to do"
# means. One implementation, so the two verbs can never drift apart.
do_install_or_update() {
  local verb=$1 name=$2 from=$3 target ver drift=false
  load_clone_persona "$name"
  ver=$SRC_VERSION
  render_body
  set_agent_target "$name"
  target=$TARGET
  classify_target "$target"

  local body_store="$TC_HOME/personas/$name/$ver/core/persona.toml"
  local pointer_ok=0
  [ "$(running_version "$name")" = "$ver" ] && [ -f "$body_store" ] && pointer_ok=1

  if [ "$CLASS" = foreign ]; then
    say "$target exists and truecast did not write it."
    result plan "$name" "$ver" "$from" "$target" false false true
    die 5 "refusing to overwrite a file truecast did not generate: $target"
  fi

  # --force turns an up-to-date install into a REPAIR: re-copy the craft even though the agent file and
  # the pointer both look right. Without this a gutted or half-copied `<ver>/core` is unfixable from
  # this lane — every install short-circuits on "already installed" and never looks at the tree.
  REPAIR=false
  if [ "$CLASS" = identical ] && [ "$pointer_ok" = 1 ]; then
    if [ "$FORCE" != 1 ]; then
      say "$name@$ver is already installed and up to date."
      say "  if it is behaving as though its craft is missing, repair it: re-run with --force."
      result up-to-date "$name" "$ver" "$from" "$target" false false false
      return 0
    fi
    REPAIR=true
  fi

  [ "$CLASS" = stamped-diff ] && drift=true

  if [ "$YES" != 1 ]; then
    plan_report "$verb" "$name" "$ver" "$from" "$target" "$drift"
    result plan "$name" "$ver" "$from" "$target" "$(agents_dir_missing "$target")" "$drift" false
    return 0
  fi

  if [ "$drift" = true ] && [ "$FORCE" != 1 ]; then
    # emit the line before dying: an error path is exactly where a caller most needs to know WHICH
    # persona and WHY, and `update --all` reads this to report the member instead of skipping it
    result plan "$name" "$ver" "$from" "$target" false true false
    die 7 "$target was generated by truecast but differs from $name@$ver — show the user the diff, then re-run with --force"
  fi

  lock_persona "$name"
  write_body_store "$name" "$ver"
  write_meta_if_absent "$name" "$ver"
  promote_current "$name" "$ver"
  if [ "$PROJECT" = 1 ]; then
    append_gitignore "$PROJECT_ROOT" ".claude/agents/$name.md"
    scaffold_mandate "$PROJECT_ROOT" "$name"
  fi
  # Everything above this line is already on disk. If the agent file can't be written (a symlinked
  # parent, a full disk), the install is half-done but not broken — G1 means the half we skipped is the
  # only user-visible one — so say plainly that fixing the target and re-running finishes it.
  HINT="the craft is already installed; fix the problem above and re-run this same command to finish"
  write_agent_file "$target" "$TARGET_ROOT"
  HINT=""

  say ""
  say "✓ $name@$ver is ready — mention it as @$name."
  say "  if @$name isn't recognised, restart Claude Code once (the agents directory is read at session start)."
  if [ "$verb" = install ]; then
    result installed "$name" "$ver" "$from" "$target" "$RESTART" "$drift" false
  else
    result updated "$name" "$ver" "$from" "$target" "$RESTART" "$drift" false
  fi
}

# true when writing this target would CREATE the agents dir — Claude Code only scans it at session start.
agents_dir_missing() {
  if [ -d "$(dirname "$1")" ]; then printf 'false'; else printf 'true'; fi
}

# Everything the user needs to consent: the version, the TOOL GRANT, every path, the restart hint, and
# the exact diff when an existing generated file will be replaced.
plan_report() {
  local verb=$1 name=$2 ver=$3 from=$4 target=$5 drift=$6 meta
  meta="$TC_HOME/personas/$name/meta.json"
  say ""
  if [ "$REPAIR" = true ]; then
    say "plan: reinstall $name@$ver   (repair: re-copy the craft from your local marketplace copy)"
    say "  the agent file and the version pointer already look correct; this replaces the craft tree."
  elif [ "$verb" = update ] && [ "$from" != none ]; then
    say "plan: update $name  $from → $ver   (from your local marketplace copy)"
  else
    say "plan: install $name@$ver   (from your local marketplace copy)"
  fi
  say "  tools granted to @$name: $(body_tools "$WORK/body")"
  say "  writes:"
  say "    craft    $TC_HOME/personas/$name/$ver/core/"
  [ -e "$meta" ] || say "    record   $meta"
  say "    pointer  $TC_HOME/personas/$name/current → $ver"
  if [ "$PROJECT" = 1 ]; then
    say "    agent    $target   (this project only; not portable, so it is gitignored)"
    say "    ignore   $PROJECT_ROOT/.gitignore  += .claude/agents/$name.md"
    say "    brief    $PROJECT_ROOT/.truecast/agents/$name/instance/mandate.md   (only if absent)"
  else
    say "    agent    $target"
  fi
  say "  nothing has been written yet."
  if [ "$(agents_dir_missing "$target")" = true ]; then
    say "  note: the agents directory does not exist yet — you will need to restart Claude Code once."
  fi
  # source-mismatch (D5). Two things are worth interrupting for, and one is not:
  #   different persona  → this record was written for someone else entirely. Warn.
  #   different ORIGIN   → same persona, another repo: a FORK. Installing replaces their craft with
  #                        ours, which is exactly the surprise D5 wanted surfaced. Warn.
  #   no `#personas/` fragment → a CLI install from a plain path tells us nothing about which persona
  #                        or repo it came from. Absence of evidence is not a mismatch, and warning on
  #                        it just trains people to click past warnings. Stay silent.
  if [ -e "$meta" ]; then
    local recorded frag origin here
    recorded=$(sed -n 's/.*"source"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' "$meta" | sed -n 1p)
    frag=${recorded##*#personas/}
    if [ "$frag" != "$recorded" ] && [ -n "$frag" ]; then
      origin=${recorded%%#personas/*}
      here=$(clone_origin)
      if [ "$frag" != "$name" ]; then
        say "  source-mismatch: this install came from $recorded — a DIFFERENT persona ($frag)."
        say "    installing from this marketplace copy will replace its craft. Ask before proceeding."
      elif [ "$origin" != "$here" ]; then
        say "  source-mismatch: this $name came from $origin, not from this marketplace copy ($here)."
        say "    it may be a fork. Installing will replace its craft with this copy's. Ask before proceeding."
      fi
    fi
  fi
  if [ "$drift" = true ]; then
    say ""
    say "  the existing agent file was generated by truecast and DIFFERS from $name@$ver:"
    # labels, not paths: the right-hand file is a scratch temp whose name is noise to the user (and a
    # leak of where we stage). `-L` is in both GNU and BSD diff.
    diff -u -L "installed: $target" -L "new: $name@$ver" "$target" "$WORK/body" >&2
    say ""
    say "  applying will replace it. Show this diff to the user and get explicit confirmation."
  fi
}

cmd_install() {
  [ -n "$NAME" ] || die 2 "usage: truecast-plugin.sh install <persona-name> [--project [path]] [--force] [--yes]"
  require_name "$NAME"
  [ "$PROJECT" = 1 ] && resolve_project_root
  do_install_or_update install "$NAME" none
}

cmd_update() {
  if [ "$ALL" = 1 ]; then
    [ -z "$NAME" ] || die 2 "pass a persona name or --all, not both"
    local any=0 failed=0 name flags="" out code line
    [ "$YES" = 1 ] && flags="$flags --yes"
    [ "$FORCE" = 1 ] && flags="$flags --force"
    for name in $(installed_personas); do
      [ -d "$CLONE/personas/$name" ] || continue
      any=1
      # A recursive call per persona: a failure on one never stops the others (mirrors update's RR7).
      # EVERY member must produce exactly one result line, though — a member that dies silently used to
      # leave the previous member's `up-to-date` as the last line of stdout, and a literalist reader
      # reported "all current" while a persona sat un-updated. Capture the child and speak for it.
      out="$WORK/all-$name.out"
      bash "$SCRIPT" update "$name" $flags >"$out"
      code=$?
      line=$(grep '^TRUECAST_RESULT ' "$out" 2>/dev/null | tail -n 1)
      if [ "$code" = 0 ] && [ -n "$line" ]; then
        cat "$out"
      else
        failed=1
        grep -v '^TRUECAST_RESULT ' "$out" >&2 # keep any narrative, drop a half-finished result line
        say "  ✗ $name: $(exit_reason "$code" "$line") (exit $code)"
        printf 'TRUECAST_RESULT status=failed persona=%s version=%s from=%s target=- restart=false drift=%s foreign=%s exit=%s reason=%s\n' \
          "$name" "$(rfield "$line" version)" "$(rfield "$line" from)" \
          "$(rfield "$line" drift)" "$(rfield "$line" foreign)" "$code" "$(exit_reason "$code" "$line")"
      fi
    done
    if [ "$any" = 0 ]; then
      say "no truecast-installed personas found under $TC_HOME/personas."
      result noop - none none - false false false
      return 0
    fi
    if [ "$failed" = 1 ]; then
      say ""
      say "some personas were not updated — see the failed= lines above. Handle each one on its own;"
      say "never re-run --all with --force to make them go away."
      exit 6
    fi
    return 0
  fi

  [ -n "$NAME" ] || die 2 "usage: truecast-plugin.sh update <persona-name>|--all [--force] [--yes]"
  require_name "$NAME"
  [ "$PROJECT" = 1 ] && resolve_project_root
  local from
  from=$(running_version "$NAME")
  [ -n "$from" ] ||
    die 3 "'$NAME' is not installed — use '/truecast:install $NAME'"
  do_install_or_update update "$NAME" "$from"
}

cmd_remove() {
  [ -n "$NAME" ] || die 2 "usage: truecast-plugin.sh remove <persona-name> [--project [path]] [--yes]"
  require_name "$NAME"
  [ "$PROJECT" = 1 ] && resolve_project_root
  local name=$NAME target pdir from
  set_agent_target "$name"
  target=$TARGET
  pdir="$TC_HOME/personas/$name"
  from=$(running_version "$name")
  [ -n "$from" ] || from=none

  # --project DETACHES: it removes this repo's agent file and leaves the shared body store alone. The
  # craft is global (a user-scope install of the same persona reads it), so deleting it here would leave
  # a live teammate pointing at nothing — the exact state G1 exists to prevent. Mirrors the CLI, where
  # `remove` without `--global` detaches and preserves the cache.
  local purge_store=1
  [ "$PROJECT" = 1 ] && purge_store=0

  if [ ! -e "$target" ] && [ ! -L "$target" ] && { [ "$purge_store" = 0 ] || [ ! -d "$pdir" ]; }; then
    if [ "$PROJECT" = 1 ]; then
      say "$name is not installed in $PROJECT_ROOT — nothing to remove."
    else
      say "$name is not installed by truecast — nothing to remove."
    fi
    result noop "$name" none "$from" "$target" false false false
    return 0
  fi

  # foreign check without a rendered body: only the stamp matters for "may we delete this?"
  local foreign=false
  if [ -e "$target" ] || [ -L "$target" ]; then
    if [ -L "$target" ] || [ ! -f "$target" ] || ! has_stamp "$target"; then
      foreign=true
    fi
  fi

  # NEW-1 — the delete path gets the SAME containment walk as the write path. `rm -f` follows a
  # symlinked parent exactly as a write does: a repo shipping `.claude/agents -> ~/.claude/agents` had
  # `remove --project` delete the user's real teammate while the plan showed the in-repo path. Checked
  # here, before the plan is printed, so the plan can never name a path that isn't the one acted on.
  if [ -e "$target" ] || [ -L "$target" ]; then
    safe_write "$TARGET_ROOT" "$target"
  fi

  # A FOREIGN agent file STOPS the removal outright — we delete NOTHING (G1). Deleting the craft and
  # leaving the file would produce the one state G1 forbids: a teammate Claude Code still loads, whose
  # every craft path now dangles, and which a re-install then refuses to repair (exit 5 FOREIGN). The
  # user's file is the user's to resolve; until they do, their install stays whole.
  if [ "$foreign" = true ]; then
    say ""
    say "$target exists and truecast did not generate it."
    say "  nothing was removed. Delete or rename that file yourself, then run this again —"
    say "  removing the craft while that file stays would leave @$name loaded but broken."
    result plan "$name" "$from" "$from" "$target" false false true
    exit 5
  fi

  if [ "$YES" != 1 ]; then
    say ""
    say "plan: remove $name"
    [ -e "$target" ] && say "    DELETE   $target"
    if [ "$purge_store" = 1 ]; then
      [ -d "$pdir" ] && say "    DELETE   $pdir/   (every cached version of the craft)"
      say "  ⚠ projects with a .truecast/agents/$name/core symlink will break next session (they cannot be enumerated)."
    else
      say "    KEEP     $pdir/   (the shared craft; other projects and a user-scope install still need it)"
      say "  to remove the craft too, run '/truecast:remove $name' without --project."
    fi
    say "  nothing has been written yet."
    result plan "$name" "$from" "$from" "$target" false false "$foreign"
    return 0
  fi

  lock_persona "$name"
  # G1 in reverse: the user-visible surface goes FIRST, so there is no window with a live teammate whose
  # craft has been deleted.
  if [ -e "$target" ] || [ -L "$target" ]; then
    rm -f "$target" || die 8 "cannot remove $target"
    # --project only: drop the exact line we added, and nothing else the user put there
    [ "$PROJECT" = 1 ] && remove_gitignore_line "$PROJECT_ROOT" ".claude/agents/$name.md"
  fi
  if [ "$purge_store" = 1 ] && [ -d "$pdir" ]; then safe_rm "$TC_HOME" "$pdir"; fi

  say ""
  say "✓ removed $name"
  [ "$purge_store" = 0 ] && say "  the shared craft under $pdir/ was kept."
  result removed "$name" "$from" "$from" "$target" false false false
}

cmd_list() {
  local name installed available agent managed
  printf '%-22s %-11s %-11s %-12s %s\n' PERSONA INSTALLED AVAILABLE "AGENT FILE" "MANAGED BY"
  for name in $( (installed_personas; clone_personas) | sort -u); do
    installed=$(running_version "$name")
    [ -n "$installed" ] || installed="-"
    if [ -f "$CLONE/personas/$name/core/persona.toml" ]; then
      available=$(toml_version "$CLONE/personas/$name/core/persona.toml")
    else
      available="-"
    fi
    # Claude Code gives the PROJECT file precedence, so it is the one in effect when both exist.
    # Check user first and let project win, or the table would name a file that is being shadowed.
    agent="-"
    [ -f "$CC_HOME/agents/$name.md" ] && agent="user"
    [ -f "$PWD/.claude/agents/$name.md" ] && agent="project"
    # The only derivable signal is the CLI's ledger: present ⇒ the CLI manages it (it adopts a
    # plugin-lane install on first use), absent but installed ⇒ this lane wrote it.
    if [ -f "$TC_HOME/personas/$name/owned.json" ]; then
      managed="cli"
    elif [ "$installed" != "-" ]; then
      managed="plugin"
    else
      managed="-"
    fi
    printf '%-22s %-11s %-11s %-12s %s\n' "$name" "$installed" "$available" "$agent" "$managed"
  done
  result noop - none none - false false false
}

# ---------------------------------------------------------------- main --

VERB=${1:-}
[ $# -gt 0 ] && shift
case "$VERB" in
install)
  parse_args ${1+"$@"}
  cmd_install
  ;;
update)
  parse_args ${1+"$@"}
  cmd_update
  ;;
remove)
  parse_args ${1+"$@"}
  cmd_remove
  ;;
list)
  parse_args ${1+"$@"}
  cmd_list
  ;;
--version)
  say "truecast-plugin.sh $PLUGIN_VERSION (marketplace clone: $CLONE)"
  ;;
"" | -h | --help | help)
  say "truecast-plugin.sh $PLUGIN_VERSION"
  say ""
  say "  install <name> [--project [path]] [--force] [--yes]"
  say "  update  <name>|--all             [--force] [--yes]"
  say "  list"
  say "  remove  <name> [--project [path]]         [--yes]"
  say ""
  say "Without --yes nothing is written: you get a plan and a TRUECAST_RESULT line."
  [ -z "$VERB" ] && exit 2
  ;;
*)
  die 2 "unknown command: $VERB (expected install, update, list or remove)"
  ;;
esac
