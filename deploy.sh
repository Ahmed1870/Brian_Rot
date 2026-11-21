#!/usr/bin/env bash
# Deploy PBI-L16-NullBlankErrors to GitHub (force-push to main). Env: DRY_RUN=1 (no push), SKIP_TSC=1 (skip npm install + tsc).
set -euo pipefail
REPO_URL="https://github.com/Ahmed1870/Brian_Rot.git"
BRANCH="main"
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"
die() { echo "❌ $1" >&2; exit 1; }

ID="$(sed -n "s/.*COMP_ID = '\([^']*\)'.*/\1/p" src/theme.ts | head -n1)"
[ -n "$ID" ] || die "COMP_ID not found in src/theme.ts"
LOW="$(printf '%s' "$ID" | tr 'A-Z' 'a-z')"
NN="$(printf '%s' "$ID" | sed -n 's/^PBI-L\([0-9][0-9]\)-.*/\1/p')"
[ -n "$NN" ] || die "COMP_ID '$ID' must look like PBI-L<NN>-<Topic>"
echo "ID=$ID  lower=$LOW  lesson=$NN"

grep -q "COMP_ID" src/Root.tsx || die "Root.tsx does not use COMP_ID"
[ "$(sed -n 's/.*"name": "\([^"]*\)".*/\1/p' package.json | head -n1)" = "$LOW" ] || die "package.json name != $LOW"
grep -q "$ID" README.md || die "README.md missing $ID"
grep -q "$ID" .github/workflows/render.yml || die "render.yml missing composition/artifact name $ID"
grep -q "out/$LOW.mp4" .github/workflows/render.yml || die "render.yml missing out/$LOW.mp4"
grep -q "$ID" package.json || die "package.json build script missing $ID"
grep -q "out/$LOW.mp4" package.json || die "package.json missing out/$LOW.mp4"
VO="voiceover_lesson_$NN.mp3"
[ -f "public/$VO" ] || die "missing public/$VO (voice-over file)"
grep -q "VO_FILE = '$VO'" src/theme.ts || die "theme.ts VO_FILE != $VO"

[ -f .gitignore ] || die ".gitignore missing"
for f in package-lock.json node_modules out; do grep -qx "$f" .gitignore || die ".gitignore missing $f"; done
grep -q "no-package-lock" .github/workflows/render.yml || die "render.yml Install step lacks --no-package-lock"
grep -Eq '"(remotion|@remotion/[a-z-]+)": "[\^~]' package.json && die "remotion packages must be exact versions (no ^ or ~)"
for f in deploy.sh .github/workflows/render.yml; do
  if grep -q $'\r' "$f"; then die "CRLF line endings in $f"; fi
done
[ "$(ls .github/workflows | wc -l | tr -d ' ')" = "1" ] || die "exactly one workflow file allowed"
extra="$(ls public | grep -Ev "^(voiceover_lesson_[0-9]+\.mp3|logo\.svg|sfx_[a-z]+\.wav)$" || true)"
[ -z "$extra" ] || die "unexpected files in public: $extra"

STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE" "${TSCDIR:-}"' EXIT
tar -C "$DIR" --exclude=node_modules --exclude=out --exclude=package-lock.json --exclude=.git -cf - . | tar -C "$STAGE" -xf -
[ ! -e "$STAGE/package-lock.json" ] || die "lockfile in staging"
[ ! -e "$STAGE/node_modules" ] || die "node_modules in staging"
[ ! -e "$STAGE/out" ] || die "out in staging"
big="$(find "$STAGE" -type f -size +50M | head -n1)"
[ -z "$big" ] || die "file larger than 50MB: $big"

if [ "${SKIP_TSC:-0}" != "1" ]; then
  echo "▶ tsc check (npm install in a temp copy)…"
  TSCDIR="$(mktemp -d)"
  tar -C "$STAGE" -cf - . | tar -C "$TSCDIR" -xf -
  (cd "$TSCDIR" && npm install --no-audit --no-fund --no-package-lock >/dev/null 2>&1) || die "npm install failed (re-run, or SKIP_TSC=1 to skip the type check)"
  (cd "$TSCDIR" && npx tsc --noEmit -p tsconfig.json) || die "tsc failed — fix TypeScript errors first"
  echo "✔ tsc clean"
fi

cd "$STAGE"
git init -q
git checkout -q -b "$BRANCH"
git config user.name "Ahmed Gomaa"
git config user.email "ahmed-gomaa@users.noreply.github.com"
git add -A
git commit -q -m "$ID"
git remote add origin "$REPO_URL"
if [ "${DRY_RUN:-0}" = "1" ]; then
  echo "DRY_RUN: would force-push $ID to $REPO_URL ($BRANCH)"
  git ls-files | head -50
  exit 0
fi
git push -f origin "$BRANCH"
echo "✅ pushed $ID → $REPO_URL ($BRANCH). Watch the Actions tab for the render."
