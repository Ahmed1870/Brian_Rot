#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

# Deploy this lesson into the user's already-connected BrainRotViral checkout.
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="${BRAINROTVIRAL_DIR:-$HOME/BrainRotViral}"
BRANCH="${DEPLOY_BRANCH:-main}"

if [[ ! -d "$REPO_DIR/.git" ]]; then
  echo "ERROR: Existing Git checkout not found at: $REPO_DIR"
  echo "Set BRAINROTVIRAL_DIR to the path of your already-connected BrainRotViral repo."
  exit 1
fi

if ! git -C "$REPO_DIR" remote get-url origin >/dev/null 2>&1; then
  echo "ERROR: origin remote is not configured in the existing checkout."
  exit 1
fi

echo "Deploy target: $REPO_DIR"
echo "Branch: $BRANCH"
echo "This will replace tracked project files in that checkout; .git is preserved."
read -r -p "Continue? [y/N] " answer
[[ "$answer" == "y" || "$answer" == "Y" ]] || { echo "Cancelled."; exit 0; }

git -C "$REPO_DIR" fetch origin "$BRANCH"
git -C "$REPO_DIR" checkout "$BRANCH"
git -C "$REPO_DIR" pull --ff-only origin "$BRANCH"

# Remove working-tree files while preserving the existing Git metadata.
find "$REPO_DIR" -mindepth 1 -maxdepth 1 ! -name ".git" -exec rm -rf -- {} +

# Copy this lesson project into the existing checkout.
tar -C "$PROJECT_DIR" --exclude="./.git" --exclude="./node_modules" --exclude="./out" -cf - . |
  tar -C "$REPO_DIR" -xf -

cd "$REPO_DIR"
npm install
npm run typecheck
git add -A
git commit -m "Deploy Manzooma SQL Lesson 21" || echo "No changes to commit"
git push origin "$BRANCH"
