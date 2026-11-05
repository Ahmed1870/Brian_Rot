# Manzooma - SQL From Zero to Professional - Lesson 27: Temporal Processing (DATE_TRUNC, EXTRACT, INTERVAL, AGE)

Remotion project, composition ID `Monzoma-SQL-L27`, 1920x1080 @ 30fps, 7200 frames (240 s), strictly 2D.
Render output: `out/Lesson27_Temporal-Date-Functions.mp4` (ID and file name live in `package.json` -> `render`).

## Run on Termux
```bash
termux-setup-storage
pkg install -y unzip git nodejs
cd ~ && rm -rf ~/video-project
unzip -o ~/storage/downloads/Lesson27_Temporal-Date-Functions.zip
cd video-project
bash deploy.sh
```
Preview first: `DRY_RUN=1 bash deploy.sh`. `deploy.sh` aborts if the ID in package.json and src/Root.tsx differ, and retries the push up to 5 times.
