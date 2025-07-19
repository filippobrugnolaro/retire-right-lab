# Git Commit & Branch Quick Reference

## 🌿 Branch Naming Convention

**Pattern:** `<type>/<name>`

### Valid Types:

-   `fix/` - Bug fixes
-   `feature/` - New features
-   `feat/` - New features (short form)
-   `refactor/` - Code refactoring
-   `chore/` - Maintenance tasks
-   `docs/` - Documentation changes
-   `test/` - Adding or updating tests

### ✅ Valid Examples:

-   `fix/login-issue`
-   `feature/pension-calculator`
-   `feat/responsive-design`
-   `refactor/calculator-utils`
-   `chore/update-dependencies`
-   `docs/api-documentation`
-   `test/unit-tests`

## 💬 Commit Message Convention

### Valid Formats:

1. **Regular commits:** `<type>: <description>`
2. **With scope:** `<type>(<scope>): <description>`
3. **Merge commits:** `Merge <branch-info>` or `merge <info>`

### Valid Types:

-   `fix:` - Bug fixes
-   `feature:` - New features
-   `feat:` - New features (short)
-   `refactor:` - Code refactoring
-   `chore:` - Maintenance
-   `docs:` - Documentation
-   `test:` - Tests
-   `merge` or `Merge` - Merge commits (no colon needed)

### ✅ Valid Examples:

```
fix: resolve login authentication issue
feature: add pension calculator component
feat(ui): implement responsive design
refactor: simplify calculation logic
chore: update dependencies to latest versions
docs: add API documentation
test: add unit tests for calculator
Merge branch 'feature/new-feature' into main
merge pull request #123 from user/branch
```

### ❌ Invalid Examples:

```
bugfix: something          # Use 'fix:' instead
enhancement: new feature   # Use 'feature:' or 'feat:' instead
updated readme            # Missing type prefix
Fix login bug             # Should be lowercase 'fix:'
```

## 🚀 Quick Setup

```bash
# Set up commit message template
git config commit.template .gitmessage

# Create a new feature branch
git checkout -b feature/my-new-feature

# Make a proper commit
git commit -m "feat: add amazing new feature"
```

## 🔍 Validation

Both branch names and commit messages are automatically validated by:

-   **CI workflow** (on PRs and main branch)
-   **Branch validation workflow** (on all branches except main)

All validations must pass before code can be merged! ✅
