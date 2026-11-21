# QA report — PBI-L40-FilterAllRemoveFiltersAllExcept

## Actually executed (build sandbox)
- ffprobe: audio = 300.016 s; narration ends ~294.5 s, then ~5.4 s silence; 25 pauses found.
- Scene starts (s): S1 0 · S2 38.82 · S3 86.06 · S4 120.78 · S5 167.75 · S6 217.49 · S7 257.32 · S8 295.0 (frame 8850). From aligning the script to the audio (S5 starts mid-segment, interpolated).
- `node scripts/validate.mjs`: 1920x1080, 30 fps, 9000 frames, 8 scenes, last 150 frames silent.
- `tsc --noEmit` (strict) against STUB declarations of react/remotion: clean. NOT run against the real packages (no network).
- All scenes rendered to HTML with real React in headless Chromium (Remotion API shimmed): 300 frames scanned for NaN/undefined/Infinity — 0 hits; 26 frames inspected visually (tables, Slicer selection states, cards, code highlight, RTL/bidi).
- Numbers shown are computed from the data model in code: 37,550 · 34,500 · 79.89/3.33/4.79/11.98% · 86.96/13.04/40.98/59.02% match the lesson sheet.
- `DRY_RUN=1 SKIP_TSC=1 bash deploy.sh`: names consistent, no lockfile/node_modules/out in staging, public holds only audio+logo+SFX.

## NOT executed
- Real `remotion render` and the GitHub Actions run (MODULE_NOT_FOUND fix applied but untested on GitHub).
- deploy.sh's real `npm install` + `tsc` (runs on your phone).
- Audio mixing (voice + SFX) was not listened to.
- Cairo font is not bundled (see README).
- Fidelity to the live Power BI Desktop UI: hand-drawn approximation.
- Timing inside scenes is estimated (±2–3 s) until a timed transcript exists.
