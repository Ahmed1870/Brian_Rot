#!/usr/bin/env bash
# Swap System deploy — wipes the old lesson, pushes this one to the fixed repo.
# Env: DRY_RUN SKIP_NPM KEEP_EXTRA WORK_DIR REPO_URL BRANCH COMMIT_MSG
set -euo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_URL="${REPO_URL:-https://github.com/Ahmed1870/Brian_Rot.git}"
BRANCH="${BRANCH:-main}"
WORK_DIR="${WORK_DIR:-$HOME/Brian_Rot_work}"
DRY_RUN="${DRY_RUN:-0}"
SKIP_NPM="${SKIP_NPM:-0}"
KEEP_EXTRA="${KEEP_EXTRA:-0}"

log() { echo "▶ $*"; }
die() { echo "✗ $*" >&2; exit 1; }
const() { sed -n "s/^export const $1 = \"\(.*\)\";/\1/p" "$SRC/src/theme.ts" | head -n1; }

COMP_ID="$(const COMP_ID)"
OUT_NAME="$(const OUT_NAME)"
VOICE_FILE="$(const VOICE_FILE)"
LOGO_FILE="$(const LOGO_FILE)"
LESSON_NO="$(const LESSON_NO)"
[[ "$COMP_ID" =~ ^XL-L[0-9]{2}-[A-Za-z0-9-]+$ ]] || die "COMP_ID غير صالح في theme.ts: '$COMP_ID'"
[[ "${COMP_ID:4:2}" == "$LESSON_NO" ]] || die "رقم الدرس في COMP_ID لا يطابق LESSON_NO"
[[ "$OUT_NAME" == "$(echo "$COMP_ID" | tr 'A-Z' 'a-z')" ]] || die "OUT_NAME لازم يساوي COMP_ID بحروف صغيرة"
[[ "$VOICE_FILE" == "voiceover_lesson_${LESSON_NO}.mp3" ]] || die "اسم الفويس غير مطابق لرقم الدرس"
COMMIT_MSG="${COMMIT_MSG:-Lesson ${LESSON_NO}: ${COMP_ID}}"

# ── 1) sync repo ─────────────────────────────────────────────
log "sync: $REPO_URL ($BRANCH) → $WORK_DIR"
if [ -d "$WORK_DIR/.git" ]; then
  git -C "$WORK_DIR" remote set-url origin "$REPO_URL"
  git -C "$WORK_DIR" fetch origin "$BRANCH" 2>/dev/null && git -C "$WORK_DIR" checkout -q -B "$BRANCH" "origin/$BRANCH" || git -C "$WORK_DIR" checkout -q -B "$BRANCH"
else
  mkdir -p "$(dirname "$WORK_DIR")"
  git clone -q --branch "$BRANCH" "$REPO_URL" "$WORK_DIR" 2>/dev/null || { mkdir -p "$WORK_DIR"; git -C "$WORK_DIR" init -q -b "$BRANCH"; git -C "$WORK_DIR" remote add origin "$REPO_URL"; }
fi

# ── 2) wipe everything except .git and .github ───────────────
if [ "$KEEP_EXTRA" != "1" ]; then
  log "wipe old project"
  find "$WORK_DIR" -mindepth 1 -maxdepth 1 ! -name .git ! -name .github -exec rm -rf {} +
fi
mkdir -p "$WORK_DIR/.github/workflows"
rm -rf "$WORK_DIR/.github/workflows/"* 2>/dev/null || true

# ── 3) copy new project ──────────────────────────────────────
log "copy new project"
(cd "$SRC" && tar cf - --exclude=node_modules --exclude=out --exclude=.git .) | (cd "$WORK_DIR" && tar xf -)

# ── 4) name checks (stop before push on any mismatch) ────────
log "name checks: $COMP_ID → out/$OUT_NAME.mp4"
cd "$WORK_DIR"
chk() { grep -qF -- "$2" "$1" || die "$1 لا يحتوي '$2'"; }
chk package.json "remotion render src/index.ts $COMP_ID out/$OUT_NAME.mp4"
chk .github/workflows/render.yml "COMP_ID: $COMP_ID"
chk .github/workflows/render.yml "OUT_NAME: $OUT_NAME"
chk .github/workflows/render.yml "out/\$OUT_NAME.mp4"
chk .github/workflows/render.yml "name: $OUT_NAME.mp4"
chk src/Root.tsx "id={COMP_ID}"
grep -q "XL-L" src/Root.tsx && die "Root.tsx فيه معرّف درس مكتوب حرفياً"
chk src/Video.tsx "VOICE_FILE"
[ -s "public/$VOICE_FILE" ] || die "الفويس غير موجود: public/$VOICE_FILE"
[ -s "public/$LOGO_FILE" ] || die "اللوجو غير موجود: public/$LOGO_FILE"
ALLOWED=(-e "$VOICE_FILE" -e "$LOGO_FILE" -e datacamp_tech_ambient.mp3 -e typing_fast.mp3 -e academic_outro_theme.mp3 -e column_generation_stream.mp3 -e conditional_dialog_pop.mp3 -e column_lock_chime.mp3 -e custom_column_formula_sound.mp3 -e m_formula_execution_snap.mp3 -e parameter_binding.mp3 -e advanced_editor_code_lock.mp3 -e enterprise_mlogic_seal.mp3)
for n in datacamp_tech_ambient typing_fast academic_outro_theme column_generation_stream conditional_dialog_pop column_lock_chime custom_column_formula_sound m_formula_execution_snap parameter_binding advanced_editor_code_lock enterprise_mlogic_seal; do [ -s "public/$n.mp3" ] || die "ملف صوت ناقص: public/$n.mp3"; done
EXTRA="$(ls public | grep -v -x "${ALLOWED[@]}" || true)"
[ -z "$EXTRA" ] || die "ملفات زيادة في public: $EXTRA"
[ "$(ls .github/workflows | wc -l | tr -d ' ')" = "1" ] || die "لازم workflow واحد فقط"
SCAN=(--include=*.ts --include=*.tsx --include=*.json --include=*.yml --include=*.sh --exclude=deploy.sh --exclude-dir=node_modules --exclude-dir=.git --exclude=package-lock.json)
grep -rIhoE "Monzoma-SQL[-A-Za-z0-9]*|SQL-L[0-9]{2}[-A-Za-z0-9]*" "${SCAN[@]}" . | grep -q . && die "فيه معرّف درس SQL قديم"
BAD="$(grep -rIhoE "XL-L[0-9]{2}-[A-Za-z0-9-]+" "${SCAN[@]}" . | sort -u | grep -vx "$COMP_ID" || true)"
[ -z "$BAD" ] || die "معرّف درس إكسل قديم/مختلف: $BAD"
BAD="$(grep -rIhoE "xl-l[0-9]{2}-[a-z0-9-]+" "${SCAN[@]}" . | sort -u | grep -vx "$OUT_NAME" || true)"
[ -z "$BAD" ] || die "اسم ملف ناتج قديم/مختلف: $BAD"
BAD="$(grep -rIhoE "voiceover_lesson_[0-9]{2}" "${SCAN[@]}" . | sort -u | grep -vx "voiceover_lesson_${LESSON_NO}" || true)"
[ -z "$BAD" ] || die "اسم فويس قديم/مختلف: $BAD"
# ── lockfile / install safety (MODULE_NOT_FOUND guard) ──
WF=.github/workflows/render.yml
grep -q -- "--no-package-lock" "$WF" || die "خطوة Install في render.yml مفيهاش --no-package-lock"
grep -q "npm ci" "$WF" && die "render.yml فيه npm ci (ممنوع)"
grep -q "rm -rf node_modules package-lock.json" "$WF" || die "خطوة Install لازم تبدأ بـ rm -rf node_modules package-lock.json"
grep -qE '"(remotion|@remotion/[a-z-]+)": *"[~^]' package.json && die "نسخ remotion لازم تكون ثابتة (من غير ^ أو ~)"
RV="$(grep -oE '"(remotion|@remotion/[a-z-]+)": *"[0-9][0-9.]*"' package.json | sed -E 's/.*: *"([0-9.]+)"/\1/' | sort -u)"
[ "$(echo "$RV" | wc -l | tr -d ' ')" = "1" ] || die "حزم remotion مش على نسخة واحدة: $RV"
grep -q "compositor-linux-x64-gnu@${RV}" "$WF" || die "نسخة compositor في render.yml لازم تساوي $RV"
grep -qx "package-lock.json" .gitignore || die ".gitignore لازم يحتوي package-lock.json"
log "✓ الأسماء متطابقة + فحوصات lockfile"

# ── 5) install + typecheck ───────────────────────────────────
if [ "$SKIP_NPM" != "1" ]; then
  log "npm install"; npm install --no-audit --no-fund --no-package-lock --loglevel=error
  log "tsc --noEmit"; npx tsc --noEmit
else
  log "SKIP_NPM=1 → تخطي npm install و tsc"
fi

# ── 6) commit + push ─────────────────────────────────────────
if [ "$DRY_RUN" = "1" ]; then log "DRY_RUN=1 → وقفت قبل commit/push"; exit 0; fi
rm -f package-lock.json
git add -A
if git ls-files | grep -qx "package-lock.json"; then die "package-lock.json متضاف في git — وقفت قبل الـ push"; fi
GIT=(git -c user.name="${GIT_AUTHOR_NAME:-Ahmed Gomaa}" -c user.email="${GIT_AUTHOR_EMAIL:-ahmed@users.noreply.github.com}")
"${GIT[@]}" commit -q -m "$COMMIT_MSG" || "${GIT[@]}" commit -q --allow-empty -m "$COMMIT_MSG"
log "push --force origin $BRANCH"
git push --force origin "HEAD:$BRANCH"
log "✓ تم. الرندر هيبدأ على GitHub Actions (workflow: render) → artifact: $OUT_NAME.mp4"
