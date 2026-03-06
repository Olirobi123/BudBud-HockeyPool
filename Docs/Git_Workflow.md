# Git Workflow & Deployment

## Branch Strategy

| Branch | Environment | Purpose |
|--------|-------------|---------|
| `main` | Production | Stable, deployed code |
| `dev` | Development | Integration of features |
| `feature/*` | Local | Individual feature development |

### Promotion Flow

```
feature/* → dev → main
```

---

## Workflow

### 1. Starting a New Feature

Always branch from `dev`:

```bash
git checkout dev
git pull --rebase origin dev
git checkout -b feature/descriptive-name
```

### 2. During Development

```bash
git add <files>
git commit -m "feat: description of change"
```

Follow conventional commit style. Never add Claude as co-author.

### 3. Feature Complete — Create PR

Rebase on latest `dev` before opening a PR to keep history linear:

```bash
git fetch origin
git rebase origin/dev
git push -u origin feature/descriptive-name
gh pr create --base dev --title "..." --body "..."
```

Merge strategy on GitHub: **Squash and merge** or **Rebase and merge** — never "Create a merge commit".

### 4. Promoting dev → main

1. Create a PR from `dev` to `main`:
   ```bash
   gh pr create --base main --head dev
   ```

2. Merge using **Squash and merge** on GitHub.

3. After merging, reset `dev` to match `main`:
   ```bash
   git fetch origin
   git checkout dev
   git reset --hard origin/main
   git push --force-with-lease origin dev
   ```

**Never push directly to `main` or `dev`.**

---

## Commit Message Convention

Use conventional commits:

- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `style:` — Formatting, no code change
- `refactor:` — Code restructuring
- `test:` — Adding tests
- `chore:` — Maintenance tasks

## Branch Naming

- `feature/add-player-search`
- `feature/fix-cors-issue`
- `feature/update-health-endpoint`

---

## Environment Variables

- `DATABASE_URL` — Database connection string
- `ALLOWED_ORIGINS` — CORS allowed origins
- `CRON_API_TOKEN` — API token for cron/snapshot endpoints
- `PORT` — Server port (default 5000)
