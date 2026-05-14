# scripts/

Repo automation scripts — shell or Node — for one-off tasks that aren't part of the normal `npm` lifecycle.

## What lives here

- **Setup**: `setup.sh` — bootstrap a fresh clone (install deps, copy `.env.example`).
- **Deploy**: `deploy.sh` — wrap GCP deploy (`gcloud run deploy` / `gcloud app deploy`) with project conventions.
- **Data**: `anonymize-sample.js` — strip a real weekly report into a safe-to-commit fixture under `tests/fixtures/xlsx/`.
- **Maintenance**: ad-hoc cleanup, log rotation, GCS lifecycle audits, etc.

## Conventions

- One file per script, name = verb (`setup.sh`, `deploy.sh`, not `helper.sh`).
- Every shell script starts with `#!/usr/bin/env bash` + `set -euo pipefail`.
- Node scripts live at `scripts/<name>.js` and run as `node scripts/<name>.js`.
- Document required env vars in a comment block at the top.
- Make shell scripts executable: `chmod +x scripts/*.sh`.
- Add long-lived scripts as `npm` scripts in `package.json` for discoverability.

## Not here

- CI/CD workflow files — those live in `.github/workflows/`.
- App-level utilities — those live in `src/lib/`.
- Real (un-anonymized) sales data — never. Use `scripts/anonymize-sample.js` first.
