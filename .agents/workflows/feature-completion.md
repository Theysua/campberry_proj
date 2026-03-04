---
description: How to finalize and push a completed feature to GitHub
---
# Feature Completion Workflow

After implementing and verifying a new feature or module in the codebase, you MUST follow these steps to preserve a history on GitHub for future checking and rollback.

1. **Stage all changes:** Add all modified, created, or deleted files to the git staging area.
   ```bash
   git add .
   ```

2. **Commit with a descriptive message:** Create a commit explaining what feature was completed.
   ```bash
   git commit -m "feat: <description of the completed feature>"
   ```

3. **Push to remote repository:** Push the committed feature to the remote branch (usually `main`) on GitHub.
   ```bash
   // turbo
   git push origin HEAD
   ```

**CRITICAL RULE:** Every time a feature (like the Authentication Module or a new Public API endpoint) is declared "completed", you must actively run this workflow without the user having to remind you.
