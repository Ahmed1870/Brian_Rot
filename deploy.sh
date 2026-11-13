#!/usr/bin/env bash
# Swap System deploy: sync repo -> wipe (keep .git/.github) -> drop old workflow -> copy project -> name checks -> npm+tsc -> force push.
# Env: DRY_RUN SKIP_NPM KEEP_EXTRA WORK_DIR REPO_URL BRANCH COMMIT_MSG
set -euo pipefail
SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_URL="${REPO_URL:-https://github.com/Ahmed1870/Brian_Rot.git}"
BRANCH="${BRANCH:-main}"
WORK_DIR="${WORK_DIR:-$HOME/Brian_Rot_work}"
THEME="$SRC/src/theme.ts"
COMP_ID="$(sed -n 's/^export const COMP_ID = "\(.*\)";/\1/p' "$THEME")"
OUT_NAME="$(sed -n 's/^export const OUT_NAME = "\(.*\)";/\1/p' "$THEME")"
VOICE="$(sed -n 's/^export const VOICE = "\(.*\)";/\1/p' "$THEME")"
LOGO="$(sed -n 's/^export const LOGO = "\(.*\)";/\1/p' "$THEME")"
COMMIT_MSG="${COMMIT_MSG:-Lesson ${COMP_ID}}"
say(){ echo "[deploy] $*"; }
fail(){ echo "[deploy] STOP: $*" >&2; exit 1; }

check_names(){ # $1 = project dir
  local d="$1"
  [[ "$COMP_ID" =~ ^XL-L[0-9]{2}-[A-Za-z0-9-]+$ ]] || fail "COMP_ID '$COMP_ID' must look like XL-L05-VLOOKUP"
  local nn="${COMP_ID:4:2}"
  [[ "$VOICE" == "voiceover_lesson_${nn}.mp3" ]] || fail "VOICE '$VOICE' does not carry lesson number $nn"
  grep -q "COMP_ID = \"$COMP_ID\"" "$d/src/theme.ts" || fail "theme.ts COMP_ID mismatch"
  grep -q "COMP_ID" "$d/src/Root.tsx" && ! grep -q "XL-L" "$d/src/Root.tsx" || fail "Root.tsx must use COMP_ID, not a literal"
  grep -q "$COMP_ID" "$d/package.json" || fail "package.json build does not render $COMP_ID"
  grep -q "out/$OUT_NAME.mp4" "$d/package.json" || fail "package.json output name mismatch"
  [[ "$(ls "$d/.github/workflows" | wc -l)" -eq 1 ]] || fail "exactly one workflow file is allowed"
  local wf; wf="$d/.github/workflows/$(ls "$d/.github/workflows")"
  grep -q "COMP_ID: $COMP_ID" "$wf" && grep -q "OUT_NAME: $OUT_NAME" "$wf" || fail "workflow COMP_ID/OUT_NAME mismatch"
  grep -q "name: $OUT_NAME" "$wf" || fail "artifact name must equal $OUT_NAME"
  grep -q "$VOICE" "$wf" || fail "workflow guard does not mention $VOICE"
  [[ -s "$d/public/$VOICE" ]] || fail "public/$VOICE missing or empty"
  local extra; extra="$(find "$d/public" -type f ! -name "$VOICE" ! -name "$LOGO" | head -3)"
  [[ -z "$extra" ]] || fail "unexpected files in public: $extra"
  local stale
  stale="$(grep -rEno 'SQL-L[0-9]+[A-Za-z0-9-]*|XL-L[0-9]{2}-[A-Za-z0-9-]+|voiceover_lesson_[0-9]+' "$d/src" "$d/package.json" "$d/.github" "$d/deploy.sh" 2>/dev/null | grep -vF "$COMP_ID" | grep -vE "voiceover_lesson_${nn}\$" | grep -v 'deploy.sh:.*XL-L\[' || true)"
  stale="$(echo "$stale" | grep -v 'deploy.sh' || true)"
  [[ -z "$stale" ]] || fail "old lesson identifiers found: $(echo "$stale" | tr '\n' ' ')"
  say "name checks OK ($COMP_ID -> out/$OUT_NAME.mp4)"
}

say "1/6 checking project before touching the repo"
check_names "$SRC"

say "2/6 sync repo"
if [[ -d "$WORK_DIR/.git" ]]; then
  git -C "$WORK_DIR" remote set-url origin "$REPO_URL"
  git -C "$WORK_DIR" fetch origin "$BRANCH" 2>/dev/null || true
  git -C "$WORK_DIR" checkout -q -B "$BRANCH" "origin/$BRANCH" 2>/dev/null || git -C "$WORK_DIR" checkout -q -B "$BRANCH"
  git -C "$WORK_DIR" reset -q --hard "origin/$BRANCH" 2>/dev/null || true
else
  git clone -q "$REPO_URL" "$WORK_DIR"
  git -C "$WORK_DIR" checkout -q -B "$BRANCH" "origin/$BRANCH" 2>/dev/null || git -C "$WORK_DIR" checkout -q -B "$BRANCH"
fi

say "3/6 wipe old project (keeping .git and .github) and old workflow"
if [[ "${KEEP_EXTRA:-0}" != "1" ]]; then
  find "$WORK_DIR" -mindepth 1 -maxdepth 1 ! -name .git ! -name .github -exec rm -rf {} +
fi
rm -rf "$WORK_DIR/.github/workflows"; mkdir -p "$WORK_DIR/.github/workflows"

say "4/6 copy new project"
tar -C "$SRC" --exclude=node_modules --exclude=out -cf - . | tar -C "$WORK_DIR" -xf -
check_names "$WORK_DIR"

if [[ "${SKIP_NPM:-0}" == "1" ]]; then say "5/6 SKIP_NPM=1 -> npm install and tsc skipped"; else
  say "5/6 npm install + tsc"
  (cd "$WORK_DIR" && npm install --no-audit --no-fund && npx tsc --noEmit)
fi

say "6/6 commit + push --force origin $BRANCH"
cd "$WORK_DIR"
git config user.name >/dev/null 2>&1 || git config user.name "Manzooma Deploy"
git config user.email >/dev/null 2>&1 || git config user.email "deploy@manzooma.local"
git add -A
git commit -q --allow-empty -m "$COMMIT_MSG"
if [[ "${DRY_RUN:-0}" == "1" ]]; then say "DRY_RUN=1 -> not pushing"; else git push --force origin "$BRANCH"; say "pushed. Open GitHub Actions to watch the render."; fi
