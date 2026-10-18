# The Museum of Futures That Never Happened — متحف المستقبل الذي لم يحدث
Remotion + React + TypeScript · 1080x1920 · 30fps · 720 frames · composition id `BrainRotViral`

    npm install
    npm run dev       # studio
    npm run build     # checks audio, renders out/museum-of-futures.mp4

Rendering: a tiny perspective engine (src/lib/engine.ts) projects boxes/quads/dots to SVG - no WebGL, no stock assets, safe in headless CI.
Acts: Act1Pendulum (0-150) · Act2Fracture (150-330) · Act3Lens (330-510) · Act4BrandSeal (510-720) · EditorialText.
Loop: frames 676-720 plunge through the seal's doorway into Act I at its frame-0 state (src/MuseumReel.tsx).
Audio: voiceover.wav + stems from src/utils/audioConfig.ts (regenerate: python3 scripts/make_stems.py).
