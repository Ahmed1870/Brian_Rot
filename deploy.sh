#!/usr/bin/env bash
# Swap-system deploy: replaces the project in the fixed repo with this lesson and pushes (render runs on GitHub Actions).
# Env: DRY_RUN=1 (no push) SKIP_NPM=1 KEEP_EXTRA="name1 name2" WORK_DIR REPO_URL BRANCH COMMIT_MSG
set -euo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_URL="${REPO_URL:-https://github.com/Ahmed1870/Brian_Rot.git}"
BRANCH="${BRANCH:-main}"
WORK_DIR="${WORK_DIR:-$HOME/brian_rot_deploy}"
DRY_RUN="${DRY_RUN:-0}"
SKIP_NPM="${SKIP_NPM:-0}"
KEEP_EXTRA="${KEEP_EXTRA:-}"

die() { echo "❌ $*" >&2; exit 1; }
ok() { echo "✅ $*"; }

# ---- lesson identity (single source of truth: src/theme.ts) ----
COMP_ID="$(grep -oE "COMP_ID = '[^']+'" "$SRC/src/theme.ts" | head -1 | sed -E "s/.*'([^']+)'/\1/")"
[ -n "$COMP_ID" ] || die "COMP_ID not found in src/theme.ts"
echo "$COMP_ID" | grep -qE '^XL-L[0-9]{2}-[A-Za-z0-9-]+$' || die "COMP_ID '$COMP_ID' must look like XL-L05-VLOOKUP"
NN="$(echo "$COMP_ID" | sed -E 's/^XL-L([0-9]{2})-.*/\1/')"
OUT="$(echo "$COMP_ID" | tr 'A-Z' 'a-z')"
VOICE="voiceover_lesson_${NN}.mp3"
echo "▶ Lesson $NN | COMP_ID=$COMP_ID | out/$OUT.mp4 | $VOICE"

# ---- 1) sync the repo ----
if [ -d "$WORK_DIR/.git" ]; then
  git -C "$WORK_DIR" remote set-url origin "$REPO_URL"
  git -C "$WORK_DIR" fetch origin "$BRANCH" 2>/dev/null && git -C "$WORK_DIR" checkout -q "$BRANCH" 2>/dev/null && git -C "$WORK_DIR" reset -q --hard "origin/$BRANCH" || true
else
  rm -rf "$WORK_DIR"
  git clone "$REPO_URL" "$WORK_DIR" || die "clone failed"
  git -C "$WORK_DIR" checkout -q "$BRANCH" 2>/dev/null || git -C "$WORK_DIR" checkout -q -b "$BRANCH"
fi
ok "repo synced"

# ---- 2) wipe everything except .git and .github, drop old workflows ----
cd "$WORK_DIR"
shopt -s dotglob nullglob
for f in *; do
  case "$f" in .git|.github) continue ;; esac
  keep=0; for k in $KEEP_EXTRA; do [ "$f" = "$k" ] && keep=1; done
  [ "$keep" = 1 ] || rm -rf -- "$f"
done
mkdir -p .github/workflows
rm -f .github/workflows/*
ok "old project removed"

# ---- 3) copy the new project ----
(cd "$SRC" && tar --exclude=node_modules --exclude=out --exclude=.git -cf - .) | tar -xf -
ok "new project copied"

# ---- 4) name checks (stop before push on any mismatch) ----
bad=0
chk() { if ! grep -q -- "$2" "$1" 2>/dev/null; then echo "❌ $1 missing: $2"; bad=1; fi; }
chk src/theme.ts "COMP_ID = '$COMP_ID'"
chk src/theme.ts "VOICE_FILE = '$VOICE'"
chk package.json "remotion render src/index.ts $COMP_ID out/$OUT.mp4"
chk .github/workflows/render.yml "npx remotion render src/index.ts $COMP_ID out/$OUT.mp4"
chk .github/workflows/render.yml "test -s out/$OUT.mp4"
chk .github/workflows/render.yml "name: $OUT"
chk .github/workflows/render.yml "path: out/$OUT.mp4"
chk .github/workflows/render.yml "grep -q \"$COMP_ID\" src/theme.ts"
chk .github/workflows/render.yml "grep -q \"$COMP_ID\" package.json"
chk .github/workflows/render.yml "public/$VOICE"
grep -q "COMP_ID" src/Root.tsx || { echo "❌ Root.tsx must use COMP_ID"; bad=1; }
if grep -qE "XL-L[0-9]{2}|SQL-L[0-9]+" src/Root.tsx; then echo "❌ Root.tsx has a literal lesson id"; bad=1; fi
[ -f "public/$VOICE" ] || { echo "❌ public/$VOICE missing"; bad=1; }
[ -f public/manzooma_logo.svg ] || { echo "❌ public/manzooma_logo.svg missing"; bad=1; }
extra="$(ls public | grep -vxE "$VOICE|manzooma_logo.svg|sfx_(click|key|tick|pop|whoosh|chime)\.mp3" || true)"
[ -z "$extra" ] || { echo "❌ unexpected files in public: $extra"; bad=1; }
[ "$(ls .github/workflows | wc -l)" = "1" ] || { echo "❌ .github/workflows must contain exactly one file"; bad=1; }
# stale identifiers (SQL course or another Excel lesson)
stale="$(grep -rEn "SQL-L[0-9]+|XL-L[0-9]{2}-[A-Za-z0-9-]+|voiceover_lesson_[0-9]+\.mp3|sql-l[0-9]+|xl-l[0-9]{2}-" src package.json .github README.md 2>/dev/null | grep -v "$COMP_ID" | grep -v "$OUT" | grep -v "$VOICE" || true)"
[ -z "$stale" ] || { echo "❌ stale lesson identifiers:"; echo "$stale"; bad=1; }
[ "$bad" = 0 ] || die "name checks failed - nothing was pushed"
ok "name checks passed"

# ---- 5) install + type check (never commit package-lock.json) ----
rm -f package-lock.json
grep -q '^package-lock.json$' .gitignore || { echo "❌ .gitignore missing 'package-lock.json' entry"; bad=1; }
grep -q 'no-package-lock' .github/workflows/render.yml || { echo "❌ render.yml install step must use --no-package-lock"; bad=1; }
[ "$bad" = 0 ] || die "lockfile/install checks failed - nothing was pushed"
ok "lockfile/install checks passed"

if [ "$SKIP_NPM" = 1 ]; then
  echo "⏭  SKIP_NPM=1 (npm install / tsc skipped)"
else
  npm install --no-audit --no-fund --no-package-lock
  npx tsc --noEmit
  ok "tsc passed"
  rm -f package-lock.json
fi

# ---- 6) commit + push (never commit package-lock.json) ----
git config user.name >/dev/null 2>&1 || git config user.name "Ahmed Gomaa"
git config user.email >/dev/null 2>&1 || git config user.email "ahmed@users.noreply.github.com"
rm -f package-lock.json
git add -A
git rm --cached -f package-lock.json 2>/dev/null || true
rm -f package-lock.json
if git diff --cached --name-only | grep -q '^package-lock.json$'; then
  die "package-lock.json is staged - refusing to push (would cause MODULE_NOT_FOUND on Linux)"
fi
MSG="${COMMIT_MSG:-feat: render Excel course lesson $NN - FILTER Engine & Multi-Criteria Filtering (Boolean AND/OR, #CALC! Shield, SORT+FILTER Chaining) 4m exact}"
git commit -q -m "$MSG" || echo "(nothing to commit)"
if [ "$DRY_RUN" = 1 ]; then
  echo "🧪 DRY_RUN=1: would run: git push --force origin $BRANCH"
else
  git push --force origin "$BRANCH"
  ok "pushed - render starts on GitHub Actions"
fi
