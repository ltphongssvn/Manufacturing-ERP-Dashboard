#!/bin/bash
# /Manufacturing-ERP-Dashboard/git-clean-commit.sh
if ! grep -q "^\.backups/$" .gitignore 2>/dev/null; then
    echo ".backups/" >> .gitignore
fi
if [ -n "$(git status --porcelain | grep '^??')" ]; then
    echo "Moving untracked files to .backups/"
    mkdir -p .backups
    for file in $(git status --porcelain | grep '^??' | cut -c4-); do
        if [ "$file" != ".backups/" ]; then
            dir=$(dirname ".backups/$file")
            mkdir -p "$dir"
            mv "$file" ".backups/$file" 2>/dev/null && echo "Moved: $file"
        fi
    done
fi
# Check only for unstaged changes (second column)
if [ -n "$(git status --porcelain | grep '^ M')" ]; then
    echo "ERROR: Unstaged modifications detected."
    exit 1
fi
echo "Working directory is pristine ✓"
