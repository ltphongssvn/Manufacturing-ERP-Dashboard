# Git Hooks Setup for Manufacturing ERP Dashboard
# /Manufacturing-ERP-Dashboard/GIT_HOOKS_SETUP.md

## Overview
Ensures pristine working directory and prevents large files from entering the repository.

## Installation Steps

### 1. Pre-commit already installed
```bash
which pre-commit  # Should show: /home/lenovo/miniconda3/bin/pre-commit
```

### 2. Install hooks
```bash
pre-commit install
```

### 3. Create pre-merge hook
```bash
cat > .git/hooks/pre-merge-commit << 'HOOK'
#!/bin/bash
echo "Pre-merge check: Scanning for large files..."
if git diff --cached --name-only | xargs -I {} sh -c "[ -f {} ] && [ \$(stat -c%s {}) -gt 5242880 ]" 2>/dev/null; then
    echo "ERROR: Large files (>5MB) detected in merge. Abort."
    exit 1
fi
echo "Pre-merge check passed"
exit 0
HOOK
chmod +x .git/hooks/pre-merge-commit
```

### 4. Create secrets baseline
```bash
detect-secrets scan > .secrets.baseline
```

### 5. Update .gitignore
```bash
echo ".backups/" >> .gitignore
```

## Usage

### Clean commit workflow:
```bash
./git-clean-commit.sh  # Moves untracked files to .backups/
git add <specific-files>  # Stage only relevant files
git commit -m "message"  # Hooks verify pristine state
git push origin main
```

### Test hooks:
```bash
pre-commit run --all-files
```

## What Each Hook Does
- **detect-secrets**: Prevents committing secrets/API keys
- **block-large-files**: Prevents files >5MB (hard fail)
- **auto-clean-untracked**: Automatically moves untracked files to .backups/
- **verify-selective-staging**: Shows what's being committed
- **pre-merge-commit**: Blocks large files during merges

## Clean Code Workflow
1. Make changes
2. Test locally
3. Run `./git-clean-commit.sh`
4. Stage specific files: `git add file1 file2 file3`
5. Commit: `git commit -m "feat: description"`
6. Verify: `git status` (should be clean)
7. Push: `git push origin main`
