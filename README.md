# Manzooma - SQL From Zero to Professional - Lesson 23: Correlated Subqueries & EXISTS / NOT EXISTS

Remotion project, composition ID `Monzoma-SQL-L23`, 1920x1080 @ 30fps, 7200 frames (240 s), strictly 2D.
Render output: `out/Lesson23_Correlated-Subqueries-EXISTS.mp4` (the ID and file name live in `package.json` -> `render`).

## Run on Termux
```bash
termux-setup-storage
pkg install -y unzip git nodejs
cd ~ && rm -rf ~/video-project
unzip -o ~/storage/downloads/Lesson23_Correlated-Subqueries-EXISTS.zip
cd video-project
bash deploy.sh
```
Preview first: `DRY_RUN=1 bash deploy.sh`. `deploy.sh` aborts if the ID in package.json and src/Root.tsx differ, and retries the push up to 5 times.
