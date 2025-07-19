# Development Guidelines

## Branch Protection Rules

### Main Branch Access

-   **Only codeowners** (repository maintainers) can directly push to the `main` branch
-   **All other contributors** must use the pull request workflow with proper branching rules
-   Direct pushes to `main` by non-codeowners will be **blocked**

### Required for All Contributors

-   Create feature branches following naming conventions
-   Submit pull requests for code review
-   Pass all CI/CD checks before merging
-   Get approval from codeowners

## Branch Naming Convention

All branches (except `main`) must follow this pattern: `<type>/<name>`

### Valid Types:

-   `fix/` - Bug fixes
-   `feature/` - New features
-   `feat/` - New features (short form)
-   `refactor/` - Code refactoring
-   `chore/` - Maintenance tasks
-   `docs/` - Documentation changes
-   `test/` - Adding or updating tests

### Examples:

-   `fix/login-issue`
-   `feature/pension-calculator`
-   `feat/new-chart-component`
-   `refactor/calculator-utils`
-   `chore/update-dependencies`
-   `docs/api-documentation`
-   `test/add-unit-tests`

## Commit Message Convention

All commit messages must start with one of the allowed types followed by a colon, or be merge commits:

### Format:

```
<type>: <description>
<type>(<scope>): <description>  # with optional scope
Merge <branch-info>             # merge commits (case insensitive)
```

### Examples:

-   `fix: resolve login authentication issue`
-   `feature: add pension calculator component`
-   `feat(ui): implement responsive design`
-   `refactor: simplify calculation logic`
-   `chore: update dependencies to latest versions`
-   `docs: add API documentation`
-   `test: add unit tests for calculator`
-   `Merge branch 'fix/ci-cd' into main`
-   `merge pull request #123 from user/feature-branch`

### Setting up commit message template (optional):

```bash
git config commit.template .gitmessage
```

## Workflow

### For Codeowners:

1. Can push directly to `main` if needed (emergency fixes, etc.)
2. Should still prefer the PR workflow for transparency and code review

### For Contributors:

1. **Clone the repository**: `git clone https://github.com/filippobrugnolaro/retire-right-lab.git`
2. **Create a branch** with proper naming: `git checkout -b feature/my-new-feature`
3. **Make commits** with proper messages: `git commit -m "feat: add new feature"`
4. **Push branch**: `git push origin feature/my-new-feature`
5. **Create Pull Request** on GitHub
6. **Wait for review** - both branch name and commit messages will be validated
7. **Get approval** from codeowners and ensure CI passes
8. **Merge** will be done by codeowner or automatically after approval

### Important Notes:

-   ❌ **Cannot push directly to main** (except codeowners)
-   ✅ **Must follow branch naming rules** (`<type>/<name>`)
-   ✅ **Must follow commit message rules** (start with `fix`, `feat`, etc.)
-   ✅ **Must pass all CI checks** (build, lint, tests)
-   ✅ **Must get codeowner approval** before merge
