# Chrix Nudger — finish the GitHub setup

The local repo (commits, branches, scaffold, CI workflow) is fully built and bundled into `chrix-nudger.bundle` in this folder. To finish the project-setup step (create public GitHub repo, push, open PR, merge) run these commands on your machine.

> Why a bundle? My sandbox can't reach your GitHub auth and can't write a working `.git` directory into this mounted folder. A bundle is a single binary blob that contains the full git history; cloning it gives you a real local repo identical to what I built.

---

## Step 1 — Clone the bundle into a fresh folder next to this one

From a terminal opened to `Documents/claude/` (or wherever you want the project to live):

```bash
git clone "Chrix Nudger/chrix-nudger.bundle" chrix-nudger
cd chrix-nudger
git remote remove origin              # remove the bundle as origin
git checkout main
```

You should now see two branches:

```bash
git branch -a
# * main
#   feature/project-setup
```

## Step 2 — Create the public GitHub repo and push

```bash
gh repo create princechrix/chrix-nudger \
  --public \
  --source=. \
  --remote=origin \
  --description="Desktop focus tool — interruptive, fullscreen, multi-monitor nudges" \
  --push
```

That pushes `main` and sets the default branch.

## Step 3 — Push the feature branch and open the PR

```bash
git push -u origin feature/project-setup

gh pr create \
  --base main \
  --head feature/project-setup \
  --title "feat: project setup, scaffold, and CI" \
  --body "Bootstraps the project per the enforced development order, step 1.

- pnpm@9.12.0 pinned via packageManager
- Minimal Electron boot (main + preload + renderer stub)
- ESLint with eslint:recommended + style rules
- GitHub Actions CI: pnpm install, lint, electron-builder pack
- .gitignore excludes node_modules, build output, and all AI-assistant artifacts
"
```

## Step 4 — Wait for CI, then merge

```bash
gh pr checks --watch          # waits until checks finish
gh pr merge --squash --delete-branch
git checkout main
git pull
```

Step 1 of the development sequence is now done. You're ready for `feature/electron-boot` (basic app launch enhancements) or jump straight to `feature/session-storage` per the spec — your call when we resume.

---

## Cleanup of the partial state in this folder (optional)

There's a leftover `.git/` directory in this folder from an earlier failed init in the sandbox. Once your real repo lives in a sibling folder you can delete this folder entirely or just remove `.git/`, the bundle, and this `SETUP.md`. Keep `focus-nudger-proposal.md` if you still want it as the reference spec.

## Sanity check before you push

```bash
pnpm install
pnpm lint        # should exit 0
node -e "require('fs').existsSync(require('./package.json').main) || process.exit(1)"
```
