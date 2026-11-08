#!/usr/bin/env bash
# Swap-system deploy: sync repo -> wipe old project -> copy new -> name checks -> npm/tsc -> commit -> push --force
# Env: DRY_RUN SKIP_NPM KEEP_EXTRA WORK_DIR REPO_URL BRANCH COMMIT_MSG
set -euo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_URL="${REPO_URL:-https://github.com/Ahmed1870/Brian_Rot.git}"
BRANCH="${BRANCH:-main}"
WORK_DIR="${WORK_DIR:-$HOME/Brian_Rot}"
DRY_RUN="${DRY_RUN:-0}"; SKIP_NPM="${SKIP_NPM:-0}"; KEEP_EXTRA="${KEEP_EXTRA:-0}"

die() { echo "✗ $*" >&2; exit 1; }
ok()  { echo "✓ $*"; }

# ── identity from theme.ts (single source of truth) ──
COMP_ID="$(sed -n 's/.*export const COMP_ID = "\(.*\)";/\1/p' "$SRC/src/theme.ts")"
OUT_NAME="$(sed -n 's/.*export const OUT_NAME = "\(.*\)";/\1/p' "$SRC/src/theme.ts")"
[[ "$COMP_ID" =~ ^XL-L[0-9]{2}-[A-Za-z0-9-]+$ ]] || die "COMP_ID غير صالح: '$COMP_ID'"
[[ "$OUT_NAME" =~ ^[a-z0-9-]+$ ]] || die "OUT_NAME غير صالح: '$OUT_NAME'"
NN="$(echo "$COMP_ID" | sed -n 's/^XL-L\([0-9][0-9]\)-.*/\1/p')"
COMMIT_MSG="${COMMIT_MSG:-Lesson $NN: $COMP_ID}"

# ── 1) sync repo ──
if [ -d "$WORK_DIR/.git" ]; then
  git -C "$WORK_DIR" remote set-url origin "$REPO_URL"
  git -C "$WORK_DIR" fetch origin "$BRANCH" 2>/dev/null || true
  git -C "$WORK_DIR" checkout -B "$BRANCH" 2>/dev/null || git -C "$WORK_DIR" checkout "$BRANCH"
  git -C "$WORK_DIR" reset --hard "origin/$BRANCH" 2>/dev/null || true
else
  git clone --branch "$BRANCH" "$REPO_URL" "$WORK_DIR" 2>/dev/null || { git clone "$REPO_URL" "$WORK_DIR"; git -C "$WORK_DIR" checkout -B "$BRANCH"; }
fi
ok "repo synced: $WORK_DIR"

# ── 2) wipe everything except .git and .github, then old workflow ──
if [ "$KEEP_EXTRA" != "1" ]; then
  find "$WORK_DIR" -mindepth 1 -maxdepth 1 ! -name .git ! -name .github -exec rm -rf {} +
fi
rm -rf "$WORK_DIR/.github/workflows"; mkdir -p "$WORK_DIR/.github/workflows"
ok "old project + workflow removed"

# ── 3) copy new project ──
( cd "$SRC" && tar --exclude=./deploy.sh --exclude=./node_modules --exclude=./out -cf - . ) | ( cd "$WORK_DIR" && tar -xf - )
cp "$SRC/deploy.sh" "$WORK_DIR/deploy.sh"
ok "project copied"

# ── 4) name checks (stop BEFORE push) ──
cd "$WORK_DIR"
bad=0
chk() { if ! eval "$2"; then echo "✗ $1"; bad=1; fi; }
chk "COMP_ID في theme.ts" "grep -q \"COMP_ID = \\\"$COMP_ID\\\"\" src/theme.ts"
chk "Root.tsx يستخدم COMP_ID" "grep -q 'id={COMP_ID}' src/Root.tsx"
chk "Root.tsx فيه اسم درس مكتوب حرفياً" "! grep -Eq '(XL|SQL)-L[0-9]' src/Root.tsx"
chk "package.json build يرندر COMP_ID" "grep -q \"remotion render src/index.ts $COMP_ID out/$OUT_NAME.mp4\" package.json"
chk "render.yml فيه COMP_ID" "grep -q \"COMP_ID: $COMP_ID\" .github/workflows/render.yml"
chk "render.yml فيه اسم الملف الناتج" "grep -q \"OUT_NAME: $OUT_NAME\" .github/workflows/render.yml"
chk "اسم الـ artifact = اسم الملف" "grep -q \"name: $OUT_NAME\" .github/workflows/render.yml && grep -q \"path: out/$OUT_NAME.mp4\" .github/workflows/render.yml"
chk "voiceover_lesson_$NN.mp3 موجود" "test -s public/voiceover_lesson_$NN.mp3"
chk "Video/theme بيقرأوا الفويس بنفس الاسم" "grep -q \"voiceover_lesson_$NN.mp3\" src/theme.ts"
chk "sfx_lesson_$NN.mp3 موجود" "test -s public/sfx_lesson_$NN.mp3"
chk "اللوجو موجود" "test -s public/manzooma-logo.svg"
extra="$(ls public | grep -v -x -e "voiceover_lesson_$NN.mp3" -e "sfx_lesson_$NN.mp3" -e manzooma-logo.svg || true)"
chk "public فيه ملفات زيادة: $extra" "[ -z \"$extra\" ]"
chk "workflow واحد بس" "[ \"\$(ls .github/workflows | wc -l)\" = 1 ]"
stale="$(grep -rEho '(SQL|XL)-L[0-9]{2}-[A-Za-z0-9-]*' --include=* --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=out . 2>/dev/null | sort -u | grep -vx "$COMP_ID" || true)"
chk "معرّف درس قديم/مختلف: $stale" "[ -z \"$stale\" ]"
[ "$bad" = 0 ] || die "فحص الأسماء فشل — لم يتم أي push"
ok "name checks passed ($COMP_ID → out/$OUT_NAME.mp4)"

# ── 5) npm + tsc ──
if [ "$SKIP_NPM" != "1" ]; then
  npm install --no-audit --no-fund
  npx tsc --noEmit
  ok "npm install + tsc passed"
else
  echo "• SKIP_NPM=1: تخطّي npm/tsc"
fi

# ── 6) commit + push ──
git add -A
git -c user.name="${GIT_AUTHOR_NAME:-manzooma-bot}" -c user.email="${GIT_AUTHOR_EMAIL:-bot@manzooma.local}" commit -q -m "$COMMIT_MSG" || echo "• لا تغييرات جديدة"
if [ "$DRY_RUN" = "1" ]; then
  ok "DRY_RUN=1: وقفت قبل الـ push"
else
  git push --force origin "$BRANCH"
  ok "pushed → render يبدأ على GitHub Actions"
fi
