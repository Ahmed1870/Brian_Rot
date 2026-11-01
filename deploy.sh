#!/usr/bin/env bash
# Deploys this project to ~/Brian_Rot (GitHub: Ahmed1870/Brian_Rot). Run it as a FILE: bash deploy.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
REPO_URL="${REPO_URL:-https://github.com/Ahmed1870/Brian_Rot.git}"
WORK_DIR="${WORK_DIR:-$SCRIPT_DIR/../Brian_Rot}"
BRANCH="${BRANCH:-main}"
COMMIT_MSG="${COMMIT_MSG:-Lesson 01: flat files vs relational database (SQL From Zero to Professional)}"
DRY_RUN="${DRY_RUN:-0}"
SKIP_NPM="${SKIP_NPM:-0}"
KEEP_EXTRA="${KEEP_EXTRA:-}"

echo "==> repo: $REPO_URL  ->  $WORK_DIR  (branch $BRANCH)"
if [ -d "$WORK_DIR/.git" ]; then
  git -C "$WORK_DIR" fetch origin "$BRANCH"
  git -C "$WORK_DIR" checkout "$BRANCH" 2>/dev/null || git -C "$WORK_DIR" checkout -b "$BRANCH"
  git -C "$WORK_DIR" reset --hard "origin/$BRANCH" 2>/dev/null || true
else
  git clone "$REPO_URL" "$WORK_DIR"
  git -C "$WORK_DIR" checkout "$BRANCH" 2>/dev/null || git -C "$WORK_DIR" checkout -b "$BRANCH"
fi

echo "==> cleaning old project (keeping .git and .github)"
cd "$WORK_DIR"
for f in $(ls -A); do
  case "$f" in
    .git|.github) continue ;;
  esac
  skip=0
  for k in $KEEP_EXTRA; do [ "$f" = "$k" ] && skip=1; done
  [ "$skip" = "1" ] || rm -rf "$f"
done

echo "==> copying new project"
for f in $(ls -A "$SCRIPT_DIR"); do
  case "$f" in
    .git|.github|node_modules|out|deploy.sh) continue ;;
  esac
  cp -R "$SCRIPT_DIR/$f" "$WORK_DIR/$f"
done
cp "$SCRIPT_DIR/deploy.sh" "$WORK_DIR/deploy.sh"
rm -rf "$WORK_DIR/public/gen"

mkdir -p "$WORK_DIR/.github/workflows"
if ! grep -rqs "remotion" "$WORK_DIR/.github/workflows" 2>/dev/null; then
  echo "==> no remotion workflow found, adding render.yml"
  cp "$SCRIPT_DIR/.github/workflows/render.yml" "$WORK_DIR/.github/workflows/render.yml"
fi

if [ "$DRY_RUN" = "1" ]; then
  echo "==> DRY_RUN: files prepared in $WORK_DIR, nothing installed or pushed"
  exit 0
fi

if [ "$SKIP_NPM" != "1" ]; then
  echo "==> npm install + type check"
  npm install --no-audit --no-fund
  npx tsc --noEmit
fi

echo "==> commit + push"
git add -A
git commit -m "$COMMIT_MSG" || echo "(nothing new to commit)"
git push --force origin "$BRANCH"
echo "==> done. GitHub Actions will render BrainRotViral now."
