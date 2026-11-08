import {loadFont as loadLato} from "@remotion/google-fonts/Lato";
import {loadFont as loadPlex} from "@remotion/google-fonts/IBMPlexSansArabic";
import {loadFont as loadMono} from "@remotion/google-fonts/JetBrainsMono";

// ── Lesson identity (single source of truth: every name below is derived from it) ──
export const LESSON = 2;
export const COMP_ID = "XL-L02-Data-Types-Number-Formats";
export const OUT_NAME = "excel-lesson-02-data-types";
export const VOICE_FILE = "voiceover_lesson_02.mp3";
export const LOGO_FILE = "manzooma-logo.svg";

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const DURATION = 7200;

const lato = loadLato("normal", {weights: ["400", "700"], subsets: ["latin"]});
const plex = loadPlex("normal", {weights: ["400", "600", "700"], subsets: ["arabic", "latin"]});
const mono = loadMono("normal", {weights: ["400", "700"], subsets: ["latin"]});

export const F = {
  ui: `${lato.fontFamily}, "Segoe UI", Calibri, sans-serif`,
  ar: `${plex.fontFamily}, "Segoe UI", sans-serif`,
  mono: `${mono.fontFamily}, Consolas, monospace`,
};

// ── Excel 365 (Windows, modern look) layout grid, in NATIVE px. The whole window is drawn
// at 1280x656 and scaled by S=1.5 to 1920x984; the remaining 96px is the caption strip. ──
export const M = {
  S: 1.5, W: 1280, H: 656, capH: 96,
  titleH: 32, tabsTop: 32, tabsH: 28,
  ribTop: 60, ribH: 92,
  fbTop: 152, fbH: 28,
  hdrTop: 180, hdrH: 20, rowH: 20, colW: 64, rowHdrW: 32,
  gridTop: 200, sheetTabsTop: 606, sheetTabsH: 26, statusTop: 632, statusH: 24,
  visRows: 20, visCols: 19,
};

export const C = {
  green: "#107C41", greenDark: "#0B5A2E", greenLine: "#217346",
  ribbon: "#FAFAFA", chrome: "#F3F3F3", line: "#D6D6D6", grid: "#E1E1E1", hdr: "#F2F2F2", hdrTxt: "#444444",
  txt: "#262626", sel: "#D3E9DD",
  slate: "#0F172A", slate2: "#1E293B", ink: "#F8FAFC",
  blue: "#38BDF8", emerald: "#10B981", amber: "#F59E0B", purple: "#A855F7", red: "#EF4444", yellow: "#FACC15",
};
export const SFX_FILE = "sfx_lesson_02.mp3";
