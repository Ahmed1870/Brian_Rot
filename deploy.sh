#!/usr/bin/env bash
# Uploads this lesson project to GitHub (force-push to main). DRY_RUN=1 -> checks only, no push.
# SKIP_TSC=1 -> skip the TypeScript check (only if npm has no network).
set -euo pipefail

REPO_URL="https://github.com/Ahmed1870/Brian_Rot"
BRANCH="main"
EXPECT_ID="PY-L05-VariablesTypes"

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$HERE"
fail() { echo "❌ $*" >&2; exit 1; }
ok() { echo "✔ $*"; }

# ---- 1) read the ID from theme.ts and compare it everywhere ----
ID="$(sed -n "s/.*COMP_ID = '\([^']*\)'.*/\1/p" src/theme.ts | head -n 1)"
[ -n "$ID" ] || fail "COMP_ID not found in src/theme.ts"
[ "$ID" = "$EXPECT_ID" ] || fail "theme.ts COMP_ID ($ID) != deploy.sh EXPECT_ID ($EXPECT_ID)"
echo "$ID" | grep -Eq '^PY-L[0-9]{2}-[A-Za-z0-9]+$' || fail "ID format must be PY-L<NN>-<Topic>: $ID"
LOW="$(echo "$ID" | tr 'A-Z' 'a-z')"
NN="$(echo "$ID" | sed -E 's/^PY-L([0-9]{2})-.*/\1/')"
VOICE="voiceover_lesson_${NN}.mp3"

grep -q "id={COMP_ID}" src/Root.tsx || fail "src/Root.tsx does not register the composition with COMP_ID"
grep -q "\"name\": \"$LOW\"" package.json || fail "package.json name must be $LOW"
grep -q "$ID" README.md || fail "README.md does not mention $ID"
grep -q "remotion render src/index.ts $ID out/$LOW.mp4" .github/workflows/render.yml || fail "render.yml render command does not use $ID / out/$LOW.mp4"
grep -q "name: $ID" .github/workflows/render.yml || fail "render.yml artifact name != $ID"
grep -q "path: out/$LOW.mp4" .github/workflows/render.yml || fail "render.yml artifact path != out/$LOW.mp4"
grep -q "VOICE_FILE = '$VOICE'" src/theme.ts || fail "theme.ts VOICE_FILE != $VOICE"
[ -f "public/$VOICE" ] || fail "missing audio file public/$VOICE"
ok "names match: $ID / $LOW / $VOICE"

# ---- 2) public/ content, versions, line endings ----
for f in public/*; do
  b="$(basename "$f")"
  case "$b" in "$VOICE"|logo.svg|sfx_*.mp3) ;; *) fail "unexpected file in public/: $b";; esac
done
ok "public/ content is valid"
grep -Eq '"(remotion|@remotion/[a-z]+|react|react-dom|typescript|@types/react)": "[\^~]' package.json && fail "package.json has ^ or ~ ranges (pin exact versions)"
V="$(sed -n 's/.*"remotion": "\([^"]*\)".*/\1/p' package.json)"
for p in @remotion/cli @remotion/renderer; do
  pv="$(sed -n "s#.*\"$p\": \"\([^\"]*\)\".*#\1#p" package.json)"
  [ "$pv" = "$V" ] || fail "$p version ($pv) != remotion ($V)"
done
ok "remotion packages pinned to $V"
for f in deploy.sh .github/workflows/render.yml; do
  if grep -q $'\r' "$f"; then fail "CRLF line endings in $f"; fi
done
grep -q "no-package-lock" .github/workflows/render.yml || fail "render.yml install step lacks --no-package-lock"
[ -f .gitignore ] || fail ".gitignore missing"
grep -q "package-lock.json" .gitignore || fail ".gitignore must ignore package-lock.json"
ok "line endings / install step / .gitignore"

# ---- 3) staging copy (no node_modules / out / lockfile) ----
STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE" "${TSCDIR:-}"' EXIT
mkdir -p "$STAGE/video-project"
tar --exclude=node_modules --exclude=out --exclude=package-lock.json --exclude=.git -cf - . | (cd "$STAGE/video-project" && tar xf -)
rm -f "$STAGE/video-project/package-lock.json"
S="$STAGE/video-project"
[ ! -e "$S/package-lock.json" ] || fail "lockfile in staging"
[ -z "$(find "$S" -name node_modules -o -name package-lock.json | head -n 1)" ] || fail "node_modules/lockfile in staging"
[ -z "$(find "$S" -type f -size +50M | head -n 1)" ] || fail "file larger than 50MB in staging"
[ -f "$S/.github/workflows/render.yml" ] || fail "workflow path wrong in staging"
[ "$(ls "$S/.github/workflows" | wc -l | tr -d ' ')" = "1" ] || fail "only one workflow file is allowed"
ok "staging is clean"

# ---- 4) TypeScript check (same tsconfig) ----
if [ "${SKIP_TSC:-0}" = "1" ]; then
  echo "⚠ SKIP_TSC=1 -> TypeScript check skipped"
else
  TSCDIR="$(mktemp -d)"
  cp -r "$S/src" "$S/tsconfig.json" "$TSCDIR/"
  ( cd "$TSCDIR" && echo '{"name":"tsc-check","private":true}' > package.json \
    && npm install --no-audit --no-fund --no-package-lock --no-save --ignore-scripts typescript@5.5.4 @types/react@18.3.3 react@18.3.1 react-dom@18.3.1 remotion@$V >/dev/null 2>&1 \
    && ./node_modules/.bin/tsc --noEmit -p tsconfig.json ) || fail "TypeScript check failed (or npm install failed). See above; use SKIP_TSC=1 only if you are offline."
  ok "tsc clean"
fi

# ---- 5) git ----
cd "$S"
git init -q -b "$BRANCH"
git config user.name "Ahmed Gomaa"
git config user.email "Ahmed1870@users.noreply.github.com"
git remote add origin "$REPO_URL"
git add -A
git commit -q -m "$ID: lesson video project"
echo "files staged: $(git ls-files | wc -l)"
if [ "${DRY_RUN:-0}" = "1" ]; then
  git ls-files | head -n 60
  ok "DRY_RUN: nothing pushed (remote=$REPO_URL branch=$BRANCH)"
  exit 0
fi
git push -f origin "$BRANCH"
ok "pushed to $REPO_URL ($BRANCH) -> Actions will render $ID"
