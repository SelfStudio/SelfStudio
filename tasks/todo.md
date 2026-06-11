# SelfStudio upgrade branch

## Plan

- [x] Start from the latest `origin/main` and create `codex/selfstudio-upgrade`.
  Verification: `git status --short --branch` shows the new branch based on `origin/main`.
- [x] Copy the upgrade package from `/Users/lincoln.law/Desktop/selfstudio-upgrade` into the repo, preserving paths.
  Verification: `git diff --stat` shows only the intended upgrade files plus dependency metadata and this task file.
- [x] Install/update dependencies so the lockfile matches the new `package.json`.
  Verification: `pnpm install` completes and updates `pnpm-lock.yaml` as needed.
- [x] Integrate the upgrade with the existing localized route tree.
  Verification: the duplicate dynamic route conflict is removed without dropping locale routing.
- [x] Build the app.
  Verification: `pnpm build` completes successfully.
- [x] Commit and push the finished branch.
  Verification: `git status --short --branch` is clean and the branch tracks `origin/codex/selfstudio-upgrade`.

## Review

- Imported the visual upgrade into the existing localized route tree instead of adding conflicting root dynamic routes.
- Verified with `pnpm build`, `git diff --check`, and local HTTP checks for `/en-us/` and `/en-us/menubro/`.
- `make check` is unavailable in this repo: `No rule to make target 'check'`.
