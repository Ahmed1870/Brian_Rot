#!/usr/bin/env bash
# Swap System deploy: replaces the repo content with this lesson project and force-pushes.
# Env: DRY_RUN SKIP_NPM KEEP_EXTRA WORK_DIR REPO_URL BRANCH COMMIT_MSG
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_URL="${REPO_URL:-https://github.com/Ahmed1870/Brian_Rot}"
BRANCH="${BRANCH:-main}"
WORK_DIR="${WORK_DIR:-$HOME/manzooma-repo}"
THEME="$HERE/src/theme.ts"
COMP_ID="$(sed -n 's/^export const COMP_ID = "\(.*\)";/\1/p' "$THEME")"
OUT_NAME="$(sed -n 's/^export const OUT_NAME = "\(.*\)";/\1/p' "$THEME")"
NN="$(sed -n 's/^export const LESSON_NUM = "\(.*\)";/\1/p' "$THEME")"
VOICE="voiceover_lesson_${NN}.mp3"
COMMIT_MSG="${COMMIT_MSG:-Lesson ${NN}: ${COMP_ID}}"
fail() { echo "DEPLOY STOPPED: $*" >&2; exit 1; }

# 1) naming checks on the NEW project (before touching the repo)
[[ "$COMP_ID" =~ ^XL-L[0-9]{2}-[A-Za-z0-9-]+$ ]] || fail "COMP_ID '$COMP_ID' is invalid"
[[ "$COMP_ID" == XL-L${NN}-* ]] || fail "COMP_ID does not match lesson number $NN"
[[ "$OUT_NAME" =~ ^[a-z0-9-]+$ ]] || fail "OUT_NAME '$OUT_NAME' is invalid"
grep -q "export const VOICE_FILE = \"$VOICE\"" "$THEME" || fail "VOICE_FILE is not $VOICE"
[ -s "$HERE/public/$VOICE" ] || fail "public/$VOICE is missing"
grep -q "COMP_ID" "$HERE/src/Root.tsx" || fail "Root.tsx does not use COMP_ID"
grep -qE "XL-L[0-9]{2}|SQL-L[0-9]+" "$HERE/src/Root.tsx" && fail "Root.tsx has a hard-coded lesson id"
grep -q "remotion render src/index.ts $COMP_ID out/$OUT_NAME.mp4" "$HERE/package.json" || fail "package.json build is not $COMP_ID -> out/$OUT_NAME.mp4"
WF="$HERE/.github/workflows"
[ "$(ls "$WF" | wc -l)" = "1" ] || fail "exactly one workflow file is required"
grep -q "remotion render src/index.ts $COMP_ID out/$OUT_NAME.mp4" "$WF"/*.yml || fail "workflow render command mismatch"
grep -q "name: $OUT_NAME\$" "$WF"/*.yml || fail "workflow artifact name must be $OUT_NAME"
grep -q "test -s out/$OUT_NAME.mp4" "$WF"/*.yml || fail "workflow lacks test -s on the video"
grep -q "no-package-lock" "$WF"/*.yml || fail "workflow install step must use --no-package-lock"
if grep -rnE "SQL-L[0-9]+|XL-L[0-9]{2}-[A-Za-z0-9-]+" "$HERE/src" "$HERE/package.json" "$WF" | grep -v "$COMP_ID" | grep -q .; then
  grep -rnE "SQL-L[0-9]+|XL-L[0-9]{2}-[A-Za-z0-9-]+" "$HERE/src" "$HERE/package.json" "$WF" | grep -v "$COMP_ID" >&2
  fail "stale lesson id found (SQL or older Excel lesson)"
fi
if [ -z "${KEEP_EXTRA:-}" ]; then
  extra="$(ls "$HERE/public" | grep -vxE "$VOICE|manzooma_logo.svg" || true)"
  [ -z "$extra" ] || fail "unexpected files in public: $extra"
fi
echo "names OK: $COMP_ID -> out/$OUT_NAME.mp4 | $VOICE"

# 2) sync repo
if [ -d "$WORK_DIR/.git" ]; then
  git -C "$WORK_DIR" remote set-url origin "$REPO_URL"
  git -C "$WORK_DIR" fetch origin "$BRANCH" 2>/dev/null || true
  git -C "$WORK_DIR" checkout -B "$BRANCH" "origin/$BRANCH" 2>/dev/null || git -C "$WORK_DIR" checkout -B "$BRANCH"
else
  rm -rf "$WORK_DIR"
  git clone "$REPO_URL" "$WORK_DIR" 2>/dev/null || { mkdir -p "$WORK_DIR"; git -C "$WORK_DIR" init -q; git -C "$WORK_DIR" remote add origin "$REPO_URL"; }
  git -C "$WORK_DIR" checkout -B "$BRANCH"
fi

# 3) wipe everything except .git and .github, drop old workflows, copy the new project
find "$WORK_DIR" -mindepth 1 -maxdepth 1 ! -name .git ! -name .github -exec rm -rf {} +
rm -rf "$WORK_DIR/.github/workflows"
mkdir -p "$WORK_DIR/.github/workflows"
cp -r "$HERE/src" "$HERE/public" "$WORK_DIR/"
cp "$HERE/package.json" "$HERE/tsconfig.json" "$HERE/deploy.sh" "$HERE/.gitignore" "$WORK_DIR/"
cp "$WF"/*.yml "$WORK_DIR/.github/workflows/"

# 4) name checks again on the copied repo
cd "$WORK_DIR"
[ "$(ls .github/workflows | wc -l)" = "1" ] || fail "repo has more than one workflow after copy"
if grep -rnE "SQL-L[0-9]+|XL-L[0-9]{2}-[A-Za-z0-9-]+" src package.json .github | grep -v "$COMP_ID" | grep -q .; then fail "stale lesson id in repo copy"; fi

# 5) install + typecheck
if [ -z "${SKIP_NPM:-}" ]; then
  npm install
  npx tsc --noEmit
else
  echo "SKIP_NPM set: npm install and tsc skipped"
fi

# 6) commit + push (never commit a lockfile made on Termux: CI must resolve its own Linux tree)
rm -f package-lock.json
git add -A
if git ls-files --error-unmatch package-lock.json >/dev/null 2>&1; then fail "package-lock.json is tracked: remove it"; fi
git -c user.name="${GIT_AUTHOR_NAME:-manzooma-bot}" -c user.email="${GIT_AUTHOR_EMAIL:-bot@manzooma.local}" commit -q -m "$COMMIT_MSG" || echo "nothing to commit"
if [ -n "${DRY_RUN:-}" ]; then echo "DRY_RUN set: not pushing"; exit 0; fi
git push --force origin "$BRANCH"
echo "pushed: $COMMIT_MSG"
