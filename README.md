# Manzooma - SQL From Zero to Professional - Lesson 04: PostgreSQL Data Types

Remotion project, composition ID `Monzoma-SQL-L04`, 1920x1080 @ 30fps, 7200 frames (240 s), strictly 2D (no perspective / 3D / WebGL).
Render output: `out/Lesson04_PostgreSQL-Data-Types.mp4`

## Run on Termux
```bash
termux-setup-storage
pkg install -y unzip git nodejs
cd ~ && rm -rf ~/video-project
unzip -o ~/storage/downloads/Lesson04_PostgreSQL-Data-Types.zip
cd video-project
bash deploy.sh
```
Preview first: `DRY_RUN=1 bash deploy.sh`.

## Notes
- All text is live (HTML/SVG/CSS). The only imported asset is the Monzoma logo vector (`src/logoData.ts`).
- `public/voiceover.mp3` starts at frame 0 (the file already holds its own lead-in silence).
- `npm run generate-audio` builds all SFX + music into `public/gen/` from `src/timeline.json`.
- The composition ID and output name live in `package.json` -> `render`; the GitHub workflow just runs `npm run render`.
