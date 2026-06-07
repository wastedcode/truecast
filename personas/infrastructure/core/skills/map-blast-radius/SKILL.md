---
name: map-blast-radius
description: Use before any change touches prod — enumerate what's stateful, what's a one-way door, what's reversible, and who's downstream, so rigor matches risk and the irreversible parts get caught early.
---
# Map the blast radius — find the one-way doors before you walk through them

Most prod disasters are not the change you feared — they're the *second-order* consequence you didn't map.
Before shipping, draw the blast radius: what this change can break, what it can't undo, and who depends on it.

## The map
1. **What's stateful?** Data, schemas, queues, caches, persistent volumes. Stateless replace is cheap;
   stateful change carries data risk and slower rollback.
2. **What's a one-way door?** (Bezos's term.) Changes that are expensive or impossible to reverse:
   - destructive DB migrations (drop column, type change, backfill), data deletes/truncations
   - DNS changes (TTL means rollback isn't instant), TLS/cert rotation
   - secret/key rotation, IAM/permission removal, irreversible external API calls
   - anything that fans out to clients you don't control (mobile app versions, cached config)
   Two-way doors get speed; one-way doors get a plan, a backup, and a second pair of eyes.
3. **What's the reversibility of each piece?** For each part: is the rollback instant (redeploy old image),
   slow (DNS propagation), or impossible (deleted data)? An impossible-rollback piece needs a *backup +
   restore tested*, not a rollback.
4. **Who's downstream?** (Trace consequences — first/second/third order.) What reads this, what's coupled to
   its current behavior (Hyrum's Law: every observable behavior is someone's dependency, *including its
   absence*), what breaks if it's briefly down or briefly inconsistent.
5. **What's the worst case?** Multi-tenant data crossover, total outage, silent data corruption — name it, and
   size your rigor to it.

## Make irreversible changes safe
- **Decouple the irreversible step.** Expand/contract for schema: add the new column, backfill, dual-write,
  cut over reads, *then* (much later) drop the old — never drop-and-pray in one deploy.
- **Backup before the destructive step**, and confirm the restore works.
- **Stage one-way doors behind a reversible flag** so the *behavior* can be turned off even if the
  infrastructure change can't be instantly undone.

## The discipline
- The thing that ends initiatives is the un-mapped one-way door, not the routine deploy.
- If you can't name the rollback for a piece, that piece is not ready to ship.
