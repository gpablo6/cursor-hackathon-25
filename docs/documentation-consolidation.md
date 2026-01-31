# Documentation Consolidation Strategy

Goal: reduce the number of docs while preserving the information people actually need to run, develop, and deploy the app.

## Guiding principles

- Prefer a small number of canonical docs ("hubs") per domain.
- Move details into sections instead of separate files.
- Keep checklists as short sections, not standalone files.
- Keep summaries only when they add context that is not already in the canonical doc.
- Every doc must have a clear owner and a last-validated date.

## Proposed target structure

Create three canonical docs and retire/merge the rest:

1. `README.md`
   - What the project is, quick start, and links to the two other canonical docs.

2. `docs/deployment.md`
   - All deployment and Docker content, including Railway steps, environment variables, and troubleshooting.

3. `docs/architecture-and-integration.md`
   - System overview, architecture, integration details, workflows, and API notes.

## Proposed consolidation map (current -> target)

- `DEPLOYMENT.md` -> `docs/deployment.md` (core content)
- `DEPLOYMENT_CHECKLIST.md` -> `docs/deployment.md` (checklist section)
- `ARCHITECTURE.md` -> `docs/architecture-and-integration.md`
- `ARCHITECTURE_DEPLOYMENT.md` -> `docs/architecture-and-integration.md`
- `INTEGRATION.md` -> `docs/architecture-and-integration.md`
- `INTEGRATION_SUMMARY.md` -> merge into `docs/architecture-and-integration.md` or delete if redundant
- `DOCKER.md` -> `docs/deployment.md`
- `DOCKER_INDEX.md` -> remove (index is replaced by README links)
- `DOCKER_DEPLOYMENT_SUMMARY.md` -> merge into `docs/deployment.md` or delete if redundant
- `DOCKER_SETUP_COMPLETE.md` -> merge into `docs/deployment.md` or delete if redundant
- `QUICKSTART_DOCKER.md` -> merge quick start into `README.md`
- `RAILWAY_QUICK_REFERENCE.md` -> `docs/deployment.md` (quick reference section)
- `CHECKLIST.md` -> fold into the relevant canonical doc or remove

## Consolidation workflow

1. Inventory and tag
   - List all docs, tag each as canonical, duplicate, obsolete, or checklist.

2. Draft the canonical docs
   - Build the two docs in `docs/` and update `README.md` with links.

3. Merge content
   - Copy relevant sections into the canonical docs.
   - Keep the most up-to-date or complete version of overlapping sections.

4. De-duplicate
   - Remove redundant sections and outdated steps.
   - Normalize commands and environment variable names.

5. Retire old files
   - Replace removed files with short stubs for 30-60 days, or delete directly if safe.
   - Update any links in the repo that pointed to old docs.

6. Add ownership and validation
   - Add a small metadata block at the top of each canonical doc:
     - Owner
     - Last validated
     - Scope

## Success criteria

- Total docs reduced to 3 canonical docs + any required legal/contributing files.
- No duplicate deployment or Docker instructions.
- All docs are linked from `README.md` and easy to find.

## Optional maintenance rule

- New docs must live under `docs/` and be linked from `README.md`.
- If a new doc overlaps an existing topic, update the canonical doc instead.
