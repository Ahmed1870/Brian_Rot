#!/usr/bin/env bash
# Swap System deploy: sync repo -> wipe (keep .git/.github) -> copy project -> name checks -> tsc -> push
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
REPO_URL="${REPO_URL:-https://github.com/Ahmed1870/Brian_Rot.git}"
BRANCH="${BRANCH:-main}"
WORK_DIR="${WORK_DIR:-$HOME/brian_rot_work}"
COMMIT_MSG="${COMMIT_MSG:-Lesson update (swap)}"
DRY_RUN="${DRY_RUN:-0}"; SKIP_NPM="${SKIP_NPM:-0}"; KEEP_EXTRA="${KEEP_EXTRA:-0}"
fail() { echo "FAIL: $*" >&2; exit 1; }

echo "== 1) sync repo =="
if [ -d "$WORK_DIR/.git" ]; then
  git -C "$WORK_DIR" remote set-url origin "$REPO_URL"
  git -C "$WORK_DIR" fetch origin
  if git -C "$WORK_DIR" rev-parse --verify -q "origin/$BRANCH" >/dev/null; then
    git -C "$WORK_DIR" checkout -q -B "$BRANCH" "origin/$BRANCH"
  else
    git -C "$WORK_DIR" checkout -q -B "$BRANCH"
  fi
else
  rm -rf "$WORK_DIR"; git clone "$REPO_URL" "$WORK_DIR"
  git -C "$WORK_DIR" checkout -q -B "$BRANCH" "origin/$BRANCH" 2>/dev/null || git -C "$WORK_DIR" checkout -q -B "$BRANCH"
fi

echo "== 2) wipe old project (keep .git, .github) =="
find "$WORK_DIR" -mindepth 1 -maxdepth 1 ! -name .git ! -name .github -exec rm -rf {} +
mkdir -p "$WORK_DIR/.github/workflows"
rm -rf "$WORK_DIR"/.github/workflows/*

echo "== 3) copy new project =="
(cd "$HERE" && tar cf - --exclude=node_modules --exclude=out --exclude=.git .) | (cd "$WORK_DIR" && tar xf -)
cd "$WORK_DIR"

echo "== 4) name checks =="
COMP_ID="$(sed -n 's/.*COMP_ID *= *"\([^"]*\)".*/\1/p' src/theme.ts | head -1)"
[ -n "$COMP_ID" ] || fail "COMP_ID not found in src/theme.ts"
echo "$COMP_ID" | grep -Eq '^XL-L[0-9]{2}-[A-Za-z0-9-]+$' || fail "COMP_ID format: $COMP_ID"
NN="${COMP_ID:4:2}"
OUT="$(echo "$COMP_ID" | tr 'A-Z' 'a-z')"
VO="voiceover_lesson_${NN}.mp3"
grep -q 'COMP_ID' src/Root.tsx || fail "Root.tsx must use COMP_ID"
grep -q "\"$COMP_ID\"" src/Root.tsx && fail "Root.tsx has literal comp id"
grep -q "render src/index.ts $COMP_ID out/$OUT.mp4" package.json || fail "package.json build mismatch"
[ "$(ls .github/workflows | wc -l | tr -d ' ')" = "1" ] || fail "need exactly one workflow file"
WF=".github/workflows/$(ls .github/workflows)"
grep -q "COMP_ID: $COMP_ID" "$WF" || fail "workflow COMP_ID mismatch"
grep -q "OUT_NAME: $OUT" "$WF" || fail "workflow OUT_NAME mismatch"
grep -q "render src/index.ts $COMP_ID out/$OUT.mp4" "$WF" || fail "workflow render command mismatch"
grep -q "name: $OUT" "$WF" || fail "workflow artifact name mismatch"
grep -q "test -s out/$OUT.mp4" "$WF" || fail "workflow output check mismatch"
grep -q "$VO" "$WF" || fail "workflow voiceover mismatch"
[ -s "public/$VO" ] || fail "missing public/$VO"
grep -q "$VO" src/theme.ts || fail "theme.ts does not reference $VO"
grep -q 'staticFile(VOICE)' src/Video.tsx || fail "Video.tsx must read the voiceover with staticFile"
STALE="$(grep -rhoE '(SQL|XL)-L[0-9]+[A-Za-z0-9-]*' src package.json .github 2>/dev/null | sort -u | grep -vx "$COMP_ID" || true)"
[ -z "$STALE" ] || fail "stale lesson ids found: $STALE"
if [ "$KEEP_EXTRA" != "1" ]; then
  EXTRA="$(ls public | grep -v -x -e "$VO" -e manzooma_logo.svg || true)"
  [ -z "$EXTRA" ] || fail "unexpected files in public: $EXTRA"
fi
echo "names OK: $COMP_ID -> out/$OUT.mp4 ($VO)"

if [ "$DRY_RUN" = "1" ]; then echo "DRY_RUN: stopping before npm/push"; exit 0; fi

echo "== 5) npm + tsc =="
if [ "$SKIP_NPM" != "1" ]; then npm install --no-audit --no-fund && npx tsc --noEmit; else echo "SKIP_NPM=1 (skipped)"; fi

echo "== 6) commit + push =="
git config user.email >/dev/null 2>&1 || git config user.email "deploy@manzooma.local"
git config user.name >/dev/null 2>&1 || git config user.name "Manzooma Deploy"
git add -A
git commit -q -m "$COMMIT_MSG" --allow-empty
git push --force origin "HEAD:$BRANCH"
echo "DONE: pushed $COMP_ID"
