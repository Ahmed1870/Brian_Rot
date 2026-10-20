# Replace repository contents with this project

**Warning:** the commands below destructively replace tracked files in `Brian_Rot` and force-push to `main`. Make a backup first and confirm this is the intended repository/branch.

```bash
# From the parent directory where you want the repository
cd Brian_Rot

# Optional safety backup of current branch
git branch backup-before-lesson25

# Remove tracked content and untracked files, keeping Git metadata
git rm -r --ignore-unmatch .
git clean -fdx

# Copy/extract the project ZIP contents into this repository root.
# If the ZIP is in Downloads, for example:
unzip -o ~/Downloads/monzoma-lesson25-remotion.zip -d .

# Confirm .git still exists and inspect what will be committed
git status --short
git add .
git commit -m "Feat: Complete Remotion Motion Graphics for Lesson 25 - Cohort & Churn Analysis"
git push origin main --force
```

Notes:
- `git clean -fdx` removes ignored files such as `node_modules`, build outputs and local `.env` files. Back up anything important first.
- Do not run `git clean` from the wrong directory.
- The commands assume the desired branch is `main` and that overwriting the remote history is intentional.
