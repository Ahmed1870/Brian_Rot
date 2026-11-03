# Manzooma - SQL From Zero to Professional - Lesson 09: DDL (CREATE DATABASE & CREATE TABLE)

Remotion project, composition ID `Monzoma-SQL-L09`, 1920x1080 @ 30fps, 7200 frames (240 s), strictly 2D (no perspective / 3D / WebGL).
Render output: `out/Lesson09_DDL-Database-Build.mp4`

## Run on Termux
```bash
termux-setup-storage
pkg install -y unzip git nodejs
cd ~ && rm -rf ~/video-project
unzip -o ~/storage/downloads/Lesson09_DDL-Database-Build.zip
cd video-project
bash deploy.sh
```
Preview first: `DRY_RUN=1 bash deploy.sh`.

## Notes
- All text is live (HTML/SVG/CSS). The only imported asset is the Monzoma logo vector (`src/logoData.ts`).
- `public/voiceover.mp3` starts at frame 0. Scene boundaries and cues in `src/timeline.json` follow the actual voice file (speech blocks measured from the audio), not only the plan frames.
- `npm run generate-audio` builds all SFX + music into `public/gen/` from `src/timeline.json`.
- Composition ID and output name live in `package.json` -> `render`; the workflow just runs `npm run render`.
