#!/usr/bin/env bash
# Deploys this project to ~/Brian_Rot (GitHub: Ahmed1870/Brian_Rot). Run it as a FILE: bash deploy.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
REPO_URL="${REPO_URL:-https://github.com/Ahmed1870/Brian_Rot.git}"
WORK_DIR="${WORK_DIR:-$SCRIPT_DIR/../Brian_Rot}"
BRANCH="${BRANCH:-main}"
COMMIT_MSG="${COMMIT_MSG:-Lesson 23: Correlated Subqueries & EXISTS (SQL From Zero to Professional)}"
DRY_RUN="${DRY_RUN:-0}"
SKIP_NPM="${SKIP_NPM:-0}"
KEEP_EXTRA="${KEEP_EXTRA:-}"


# --- naming guard: the lesson ID rendered by package.json must exist in src/Root.tsx ---
LESSON_ID="$(grep -o 'Monzoma-SQL-L[0-9][0-9]*' "$SCRIPT_DIR/package.json" | head -1)"
if [ -z "$LESSON_ID" ] || ! grep -q "id=\"$LESSON_ID\"" "$SCRIPT_DIR/src/Root.tsx"; then
  echo "!! composition ID mismatch between package.json and src/Root.tsx - aborting"; exit 1
fi
echo "==> lesson composition: $LESSON_ID"

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
# Always install the generic workflow and drop older render workflows (they hard-code old lesson IDs and fail)
for w in "$WORK_DIR"/.github/workflows/*; do
  [ -f "$w" ] && grep -qs "remotion" "$w" && rm -f "$w"
done
cp "$SCRIPT_DIR/.github/workflows/render.yml" "$WORK_DIR/.github/workflows/render.yml"
echo "==> workflow: render.yml (runs npm run render -> composition from package.json)"

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
# Termux connections drop on big pushes: force HTTP/1.1, big buffer, and retry
git config http.version HTTP/1.1
git config http.postBuffer 524288000
ok=0
for i in 1 2 3 4 5; do
  if git push --force origin "$BRANCH"; then ok=1; break; fi
  echo "!! push failed ($i/5), retrying in 6s..."; sleep 6
done
if [ "$ok" != "1" ]; then echo "!! push failed 5 times - run: cd $WORK_DIR && git push --force origin $BRANCH"; exit 1; fi
echo "==> done. GitHub Actions will render $LESSON_ID now."
