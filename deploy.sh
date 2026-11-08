#!/usr/bin/env bash
# Swap deploy for Lesson 06 (XL-L06-Cell-References). Env: DRY_RUN SKIP_NPM KEEP_EXTRA WORK_DIR REPO_URL BRANCH COMMIT_MSG
set -euo pipefail
COMP_ID="XL-L06-Cell-References"; OUT_NAME="excel-l06-cell-references"; NN="06"
REPO_URL="${REPO_URL:-https://github.com/Ahmed1870/Brian_Rot.git}"
BRANCH="${BRANCH:-main}"
WORK_DIR="${WORK_DIR:-$HOME/Brian_Rot}"
COMMIT_MSG="${COMMIT_MSG:-Lesson ${NN}: Cell References (${COMP_ID})}"
SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
say() { echo "▶ $*"; }
die() { echo "✖ $*" >&2; exit 1; }

say "1/7 sync repo"
if [ -d "$WORK_DIR/.git" ]; then
  git -C "$WORK_DIR" fetch origin "$BRANCH" 2>/dev/null || true
  git -C "$WORK_DIR" checkout -q "$BRANCH" 2>/dev/null || git -C "$WORK_DIR" checkout -q -b "$BRANCH"
  git -C "$WORK_DIR" reset -q --hard "origin/$BRANCH" 2>/dev/null || true
else
  mkdir -p "$(dirname "$WORK_DIR")"
  git clone -q "$REPO_URL" "$WORK_DIR" 2>/dev/null || { mkdir -p "$WORK_DIR"; git -C "$WORK_DIR" init -q -b "$BRANCH"; git -C "$WORK_DIR" remote add origin "$REPO_URL"; }
  git -C "$WORK_DIR" checkout -q "$BRANCH" 2>/dev/null || git -C "$WORK_DIR" checkout -q -b "$BRANCH"
fi

say "2/7 wipe old project (keep .git and .github)"
if [ "${KEEP_EXTRA:-0}" != "1" ]; then
  find "$WORK_DIR" -mindepth 1 -maxdepth 1 ! -name .git ! -name .github -exec rm -rf {} +
fi
say "3/7 remove old workflow"
mkdir -p "$WORK_DIR/.github/workflows"
rm -f "$WORK_DIR"/.github/workflows/*

say "4/7 copy new project"
(cd "$SRC" && tar cf - --exclude=node_modules --exclude=out --exclude=.git .) | (cd "$WORK_DIR" && tar xf -)

say "5/7 name checks"
cd "$WORK_DIR"
grep -q "COMP_ID = '${COMP_ID}'" src/theme.ts || die "theme.ts COMP_ID mismatch"
grep -q "COMP_ID" src/Root.tsx || die "Root.tsx must use COMP_ID"
grep -q "XL-L" src/Root.tsx && die "Root.tsx has a hard-coded lesson id"
grep -q "XL-L${NN}-Cell-References" package.json || die "package.json COMP_ID mismatch"
grep -q "out/${OUT_NAME}.mp4" package.json || die "package.json output name mismatch"
WF=$(ls .github/workflows); [ "$(echo "$WF" | wc -l)" = "1" ] || die "need exactly one workflow file"
grep -q "COMP_ID: ${COMP_ID}" ".github/workflows/$WF" || die "workflow COMP_ID mismatch"
grep -q "OUT_NAME: ${OUT_NAME}" ".github/workflows/$WF" || die "workflow OUT_NAME mismatch"
grep -q "name: ${OUT_NAME}" ".github/workflows/$WF" || die "artifact name must equal output name"
test -s "public/voiceover_lesson_${NN}.mp3" || die "voiceover_lesson_${NN}.mp3 missing"
grep -q "voiceover_lesson_${NN}.mp3" src/theme.ts || die "theme.ts voice name mismatch"
BAD=$(ls public | grep -v -x -e "voiceover_lesson_${NN}.mp3" -e "manzooma_logo.svg" || true)
[ -z "$BAD" ] || die "unexpected files in public: $BAD"
OLD=$(grep -rEoh "(SQL|XL)-L[0-9]+[A-Za-z0-9-]*" src package.json .github 2>/dev/null | grep -v -x "$COMP_ID" || true)
[ -z "$OLD" ] || die "old lesson id found: $(echo "$OLD" | sort -u | tr '\n' ' ')"
OLDV=$(grep -rEoh "voiceover_lesson_[0-9]+" src package.json .github 2>/dev/null | grep -v -x "voiceover_lesson_${NN}" || true)
[ -z "$OLDV" ] || die "old voiceover name found: $(echo "$OLDV" | sort -u | tr '\n' ' ')"
echo "  names OK"

say "6/7 npm install + tsc"
if [ "${SKIP_NPM:-0}" = "1" ]; then echo "  (skipped)"; else npm install --no-audit --no-fund && npx tsc --noEmit; fi

say "7/7 commit + push"
git config user.name >/dev/null 2>&1 || git config user.name "Ahmed1870"
git config user.email >/dev/null 2>&1 || git config user.email "ahmed1870@users.noreply.github.com"
git add -A
git commit -q --allow-empty -m "$COMMIT_MSG"
if [ "${DRY_RUN:-0}" = "1" ]; then echo "  DRY_RUN: committed locally, not pushed"; else git push --force origin "$BRANCH"; fi
echo "✔ done: ${COMP_ID}"
