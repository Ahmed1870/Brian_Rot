# BrainRotViral — Monzoma Digital master reel (35s, one-take infinite zoom)
Remotion + React + TypeScript · 1080x1920 · 30fps · 1050 frames · composition id `BrainRotViral`

    npm install
    npm run dev       # studio
    npm run build     # checks audio then renders out/BrainRotViral.mp4

src/components: TypographyScene · SplitScreen · DashboardScene · SealScene · GlassBadge
src/lib/camera.ts: the one-take camera. Scene i+1 lives inside a portal of scene i; zoom is e^L, camera = f(zoom).
Loop: frames 1016-1050 zoom back out while content time rewinds to 0, so frame 1050 == frame 0.
Audio: voiceover.wav + stems bass(0) servo(240) fluid(540) ping(780). Regenerate stems: python3 scripts/make_stems.py
