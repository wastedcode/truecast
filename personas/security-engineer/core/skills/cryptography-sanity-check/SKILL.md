---
name: cryptography-sanity-check
description: Use when code does anything cryptographic — hashing passwords, encrypting data, signing tokens, generating randomness — catch the common crypto misuse and never let anyone roll their own.
---
# Cryptography sanity check — don't roll your own, and catch the common misuse

Almost no one should design a cryptographic primitive, and almost every crypto bug is a **misuse of a good
primitive**, not a broken algorithm. Your job is to spot the misuse and route to vetted libraries.

## The rules that catch most crypto bugs
- **Don't roll your own.** No custom ciphers, custom MACs, custom "encryption" by XOR/base64/obfuscation. Use
  a vetted high-level library (libsodium/NaCl, the platform's audited crypto, Tink) — and its **misuse-resistant**
  high-level API, not raw block-cipher knobs.
- **Password storage**: a slow, salted, adaptive hash — **argon2id, bcrypt, or scrypt**. Never MD5/SHA-1/SHA-256
  for passwords (fast = crackable), never plaintext, never reversible "encryption" of passwords.
- **Encryption**: use **authenticated encryption** (AES-GCM, ChaCha20-Poly1305) — never unauthenticated CBC/ECB.
  **ECB leaks structure; never use it.** A **nonce/IV must be unique per key** (random for GCM, or a counter);
  reuse breaks the scheme. Don't hand-pad.
- **Randomness**: security tokens, session ids, keys, salts, password-reset tokens come from a **cryptographically
  secure RNG** (`crypto.randomBytes`, `secrets`, `/dev/urandom`) — **never `Math.random()`/`rand()`**, which is
  predictable.
- **Signatures/tokens**: verify with a **server-chosen** algorithm; reject `alg:none`; HMAC needs a high-entropy
  secret (weak HMAC secrets are offline-crackable). Validate before you trust (`review-authn-authz` for JWT).
- **Comparisons**: compare secrets/MACs/tokens with a **constant-time** equality, not `==` (timing oracle).
- **Transport**: TLS for data in transit; don't disable certificate verification "to make it work" — that's a
  silent MITM hole.
- **Key management**: keys live in a KMS/secrets manager, are rotatable, and are scoped — not hardcoded
  (`secrets-and-config-discipline`).

## The discipline
- Most "encryption" findings are really *encoding* (base64) or *unauthenticated* ciphers — name which it is.
- When the design needs real crypto (a protocol, a key-exchange, a novel scheme), that's an architecture call —
  escalate to **software-architect** and recommend a vetted standard rather than inventing one.
- Grade by what the misuse exposes (`grade-and-remediate-risk`) — `Math.random()` for a CSS color is a note;
  for a password-reset token it's a P0.
