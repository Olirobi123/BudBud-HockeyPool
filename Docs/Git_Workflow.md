# Git Workflow & Deployment

## Branch Strategy

| Branch | Environment | Purpose |
|--------|-------------|---------|
| `main` | Production | Stable, deployed code |
| `acceptation` | Staging | QA and acceptance testing |
| `dev` | Development | Integration of features |
| `feature/*` | Local | Individual feature development |

## Workflow

### 1. Starting a New Feature

```bash
# Ensure dev is up to date
git checkout dev
git pull origin dev

# Create feature branch
git checkout -b feature/my-feature-name
```

### 2. During Development

```bash
# Regular commits
git add <files>
git commit -m "feat: description of change"

# Push to remote
git push -u origin feature/my-feature-name
```

### 3. Feature Complete - Create PR

```bash
# Ensure feature branch is up to date with dev
git fetch origin
git rebase origin/dev

# Push and create PR
git push origin feature/my-feature-name
gh pr create --base dev --title "Feature: description" --body "..."
```

### 4. Promotion to Staging (acceptation)

After PR is merged to `dev` and tested locally:

```bash
git checkout acceptation
git pull origin acceptation
git merge dev
git push origin acceptation
```

### 5. Promotion to Production (main)

After QA approval on staging:

```bash
git checkout main
git pull origin main
git merge acceptation
git push origin main
```

## Commit Message Convention

Use conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Formatting, no code change
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## Branch Naming

- `feature/add-player-search`
- `feature/fix-cors-issue`
- `feature/update-health-endpoint`

## Environment Variables

Each environment may have different values for:

- `DATABASE_URL` - Database connection string
- `ALLOWED_ORIGINS` - CORS allowed origins
- `CRON_API_TOKEN` - API token for health checks
- `PORT` - Server port
