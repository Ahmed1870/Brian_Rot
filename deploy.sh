#!/usr/bin/env bash
# Swap-system deploy: sync repo -> wipe (keep .git/.github) -> copy new project -> checks -> npm+tsc -> force push.
# Env: DRY_RUN SKIP_NPM KEEP_EXTRA WORK_DIR REPO_URL BRANCH COMMIT_MSG
set -euo pipefail
SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_URL="${REPO_URL:-https://github.com/Ahmed1870/Brian_Rot.git}"
BRANCH="${BRANCH:-main}"
WORK_DIR="${WORK_DIR:-$HOME/Brian_Rot}"
DRY_RUN="${DRY_RUN:-0}"; SKIP_NPM="${SKIP_NPM:-0}"; KEEP_EXTRA="${KEEP_EXTRA:-}"
die() { echo "✗ $*" >&2; exit 1; }
ok()  { echo "✓ $*"; }

# ---------- 0) read identity from the NEW project ----------
COMP_ID="$(grep -oP 'COMP_ID = "\K[^"]+' "$SRC/src/theme.ts")" || die "COMP_ID not found in theme.ts"
OUT_NAME="$(grep -oP 'OUT_NAME = "\K[^"]+' "$SRC/src/theme.ts")" || die "OUT_NAME not found in theme.ts"
[[ "$COMP_ID" =~ ^XL-L([0-9]{2,3})-[A-Za-z0-9-]+$ ]] || die "bad COMP_ID format: $COMP_ID"
NN="${BASH_REMATCH[1]}"
COMMIT_MSG="${COMMIT_MSG:-Lesson $NN: $COMP_ID}"

# ---------- 1) sync repo ----------
if [ -d "$WORK_DIR/.git" ]; then
  git -C "$WORK_DIR" fetch origin "$BRANCH" >/dev/null 2>&1 && git -C "$WORK_DIR" checkout -q "$BRANCH" 2>/dev/null || true
  git -C "$WORK_DIR" reset -q --hard "origin/$BRANCH" 2>/dev/null || true
else
  git clone -q "$REPO_URL" "$WORK_DIR" 2>/dev/null || { mkdir -p "$WORK_DIR" && git -C "$WORK_DIR" init -q && git -C "$WORK_DIR" remote add origin "$REPO_URL"; }
  git -C "$WORK_DIR" checkout -q -B "$BRANCH" 2>/dev/null || true
fi
ok "repo synced: $WORK_DIR"

# ---------- 2) wipe everything except .git and .github (+KEEP_EXTRA) ----------
cd "$WORK_DIR"
for p in $(ls -A); do
  [ "$p" = ".git" ] && continue
  [ "$p" = ".github" ] && continue
  keep=0; for k in $KEEP_EXTRA; do [ "$p" = "$k" ] && keep=1; done
  [ $keep = 1 ] && continue
  rm -rf -- "$p"
done
# ---------- 3) remove old workflow(s) ----------
rm -rf .github/workflows && mkdir -p .github/workflows
# ---------- 4) copy new project ----------
(cd "$SRC" && tar --exclude=node_modules --exclude=out -cf - .) | tar -xf -
ok "project copied"

# ---------- 5) naming checks (stop before push on any mismatch) ----------
fail=0; bad() { echo "✗ $*" >&2; fail=1; }
[ "$OUT_NAME" = "$(echo "$COMP_ID" | tr 'A-Z' 'a-z')" ] || bad "OUT_NAME ($OUT_NAME) != lowercase COMP_ID"
grep -q "COMP_ID" src/Root.tsx || bad "Root.tsx does not use COMP_ID"
grep -qE 'id="[A-Za-z]+-L[0-9]+' src/Root.tsx && bad "Root.tsx has a literal composition id"
grep -q "out/$OUT_NAME.mp4" package.json && grep -q "$COMP_ID" package.json || bad "package.json build mismatch"
WF=(.github/workflows/*); [ "${#WF[@]}" = "1" ] && [ -f "${WF[0]}" ] || bad "need exactly one workflow file"
grep -q "COMP_ID: $COMP_ID" "${WF[0]}" || bad "workflow COMP_ID mismatch"
grep -q "OUT_NAME: $OUT_NAME" "${WF[0]}" || bad "workflow OUT_NAME mismatch"
grep -q "name: $OUT_NAME\$" "${WF[0]}" || bad "workflow artifact name != OUT_NAME"
grep -q "voiceover_lesson_$NN.mp3" src/theme.ts "${WF[0]}" || bad "voiceover name not lesson $NN"
grep -q 'staticFile(VOICE)' src/Video.tsx || bad "Video.tsx must read the voiceover via staticFile(VOICE)"
[ -s "public/voiceover_lesson_$NN.mp3" ] || bad "public/voiceover_lesson_$NN.mp3 missing"
extra="$(ls public | grep -v -x -e "voiceover_lesson_$NN.mp3" -e manzooma_logo.svg || true)"
[ -z "$extra" ] || bad "unexpected files in public: $extra"
# stale lesson ids (SQL or older Excel lessons)
stale="$(grep -rIoE 'SQL-L[0-9]+[A-Za-z0-9-]*|XL-L[0-9]+-[A-Za-z0-9-]+' src package.json .github remotion.config.ts 2>/dev/null | grep -v -F "$COMP_ID" || true)"
[ -z "$stale" ] || bad "stale lesson ids found: $stale"
[ $fail = 0 ] || die "naming checks failed — NOT pushing"
ok "naming checks passed ($COMP_ID -> out/$OUT_NAME.mp4)"

# ---------- 6) npm + tsc ----------
if [ "$SKIP_NPM" != "1" ]; then
  npm install --no-audit --no-fund >/dev/null 2>&1 || die "npm install failed"
  npx tsc --noEmit || die "TypeScript errors — NOT pushing"
  ok "npm install + tsc"
else ok "SKIP_NPM=1 (npm/tsc skipped)"; fi

# ---------- 7) commit + push ----------
git add -A
git -c user.name="${GIT_AUTHOR_NAME:-manzooma}" -c user.email="${GIT_AUTHOR_EMAIL:-bot@manzooma.local}" commit -q -m "$COMMIT_MSG" || echo "(nothing new to commit)"
if [ "$DRY_RUN" = "1" ]; then ok "DRY_RUN=1: skipped push"; exit 0; fi
git push --force origin "$BRANCH"
ok "pushed -> GitHub Actions will render $OUT_NAME.mp4"
