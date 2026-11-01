# Manzooma - SQL From Zero to Professional - Lesson 01

Remotion project, composition ID `BrainRotViral`, 1920x1080 @ 30fps, 6900 frames (230 s).

## Run on Termux
```bash
termux-setup-storage
pkg install -y unzip git nodejs
cd ~ && rm -rf ~/video-project
unzip -o ~/storage/downloads/manzooma-lesson01.zip
cd video-project
bash deploy.sh
```
Preview first: `DRY_RUN=1 bash deploy.sh`.

## Notes
- Everything is live text/SVG/CSS. No images, no AI-generated assets. The only imported asset is the Monzoma logo vector (`src/logoData.ts`, traced from by68Z01.svg).
- `public/voiceover.mp3` starts at frame 0 (the file already contains its own lead-in silence).
- `npm run generate-audio` builds all SFX + music into `public/gen/` from `src/timeline.json`.
- All timings live in `src/timeline.json`; visuals and audio both read it.
