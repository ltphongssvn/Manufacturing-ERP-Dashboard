# Manufacturing ERP Dashboard - Project Setup & Workflows
# /Manufacturing-ERP-Dashboard/PROJECT_SETUP.md

## Tech Stack
- React 19 + TypeScript
- Vite (build tool)
- Pre-commit hooks (pristine workflow)

## Established Workflows

### 1. File Change Workflow
All file-changing commands chain with `&& git status`:
```bash
npm install package && git status
cat > file.ts << 'EOF' && git status
```

### 2. Git Pristine Workflow
**NEVER** use `git add .` or `git add -A`

**Process:**
```bash
# Make changes
# Test locally
git status  # Check state
git add file1 file2 file3  # Selective staging
git commit -m "type: description"
git status  # Verify clean
```

**Commit Types:**
- `feat:` New feature
- `fix:` Bug fix
- `chore:` Tooling/config
- `docs:` Documentation
- `refactor:` Code restructure
- `test:` Tests
- `perf:` Performance

### 3. Untracked Files Handling
```bash
./git-clean-commit.sh  # Moves untracked to .backups/
```

**Never delete untracked files** - always move to `.backups/`

### 4. Pre-commit Hooks
Auto-runs on commit:
- `detect-secrets`: Blocks API keys/secrets
- `auto-clean-untracked`: Moves untracked files
- `verify-selective-staging`: Shows staged files

### 5. Clean Code Principles

**Components:**
- One component per file
- < 50 lines per component
- Single responsibility
- File header: `// /path/from/root/ComponentName.tsx`

**Naming:**
- Components: `PascalCase`
- Hooks: `useCamelCase`
- Types: `PascalCase` + suffix (`SensorData`)
- Constants: `UPPER_SNAKE_CASE`

**TypeScript:**
- No `any` types
- Explicit return types
- Interface over type for objects

**State Management:**
- `useReducer` for complex state
- `useMemo`/`useCallback` for performance
- Document state shape in comments

## Initial Setup (New Project)
```bash
# 1. Create project
npm create vite@latest project-name -- --template react-ts
cd project-name

# 2. Initialize git
git init
git add .
git commit -m "chore: initial Vite setup"

# 3. Copy setup files
cp path/to/template/.pre-commit-config.yaml .
cp path/to/template/git-clean-commit.sh .
cp path/to/template/GIT_HOOKS_SETUP.md .
chmod +x git-clean-commit.sh

# 4. Install hooks
pre-commit install
detect-secrets scan > .secrets.baseline

# 5. Update .gitignore
echo ".backups/" >> .gitignore

# 6. Commit setup
git add .gitignore .pre-commit-config.yaml .secrets.baseline GIT_HOOKS_SETUP.md git-clean-commit.sh
git commit -m "chore: add git hooks for pristine workflow"
```

## Development Workflow
```bash
# Start dev server
npm run dev

# Make changes to files
# Test changes in browser

# Check git status
git status

# Stage specific files (NEVER git add .)
git add src/components/NewComponent.tsx src/types/sensor.ts

# Commit (hooks run automatically)
git commit -m "feat: add production line sensor component"

# Verify clean
git status

# Push
git push origin main
```

## Testing Changes
```bash
# Before commit:
npm run build  # Verify builds
npm run dev    # Test locally

# After commit:
git status  # Must be clean
```

## Directory Structure
```
Manufacturing-ERP-Dashboard/
├── .backups/           # Untracked files (gitignored)
├── .git/
├── node_modules/
├── public/
├── src/
│   ├── components/     # React components
│   ├── hooks/          # Custom hooks
│   ├── types/          # TypeScript types
│   ├── utils/          # Helper functions
│   ├── App.tsx
│   └── main.tsx
├── .gitignore
├── .pre-commit-config.yaml
├── .secrets.baseline
├── git-clean-commit.sh
├── GIT_HOOKS_SETUP.md
├── PROJECT_SETUP.md
├── package.json
└── vite.config.ts
```

## Common Commands
```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview production build

# Git workflow
git status               # Check state
./git-clean-commit.sh    # Clean untracked
git add <files>          # Stage specific
git commit -m "msg"      # Commit (hooks run)
git status               # Verify clean

# Hooks
pre-commit run --all-files  # Test all hooks
```

## Troubleshooting

**Hook fails on commit:**
```bash
git status  # Check for untracked files
./git-clean-commit.sh  # Move to .backups/
```

**Need to bypass hooks (emergency only):**
```bash
git commit --no-verify -m "msg"
```

**Undo last commit (keep changes):**
```bash
git reset --soft HEAD~1
```

## 6. Documentation Workflow (Before Merging)

**REQUIRED before merging feature branches:**
````bash
# On feature branch, create README in code directory
cat > src/component-name/README.md << 'DOCS'
# Component/Module Name
# /src/component-name/README.md

## Overview
Brief description

## Files
- file1.ts: Purpose
- file2.tsx: Purpose

## Usage Example
```typescript
// code example
```

## Implementation Notes
- Key decisions
- Performance considerations
DOCS

# Stage and commit documentation
git add src/component-name/README.md
git commit -m "docs: add README for component-name"

# Then merge to develop
git checkout develop
git merge feature/component-name
````

**README Contents:**
- What code does
- File explanations
- Usage examples
- Key implementation decisions
- Performance notes

**Purpose:** Zero cognitive load for collaborators and future self.
