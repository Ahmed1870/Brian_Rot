import {loadFont as loadAr} from "@remotion/google-fonts/IBMPlexSansArabic";
import {loadFont as loadMono} from "@remotion/google-fonts/JetBrainsMono";

export const LESSON_NO = "33";
export const COMP_ID = "XL-L33-Dynamic-Arrays";
export const OUT_NAME = "xl-l33-dynamic-arrays";
export const VOICE_FILE = "voiceover_lesson_33.mp3";
export const LOGO_FILE = "manzooma_logo.svg";

export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const DURATION = 7200;

// Course progress: lesson 33 of 76 = 43.4% (per the plan)
export const UNIT_DONE = 33;
export const UNIT_TOTAL = 76;
export const UNIT_PROGRESS = UNIT_DONE / UNIT_TOTAL;

export const FONT_AR = loadAr("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["arabic", "latin"],
} as never).fontFamily;
export const FONT_MONO = loadMono("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
} as never).fontFamily;
export const MONO = `${FONT_MONO}, ${FONT_AR}, monospace`;

export const C = {
  bg: "#0F172A",
  panel: "#1E293B",
  line: "#334155",
  blue: "#38BDF8",
  green: "#10B981",
  amber: "#F59E0B",
  purple: "#A855F7",
  red: "#EF4444",
  text: "#F8FAFC",
  mute: "#94A3B8",
};

// Excel (Microsoft 365 desktop, light theme) palette
export const X = {
  green: "#107C41",
  greenTint: "rgba(16,124,65,0.13)",
  chrome: "#F3F3F3",
  ribbon: "#FAFAFA",
  border: "#D1D1D1",
  hdr: "#E6E6E6",
  hdrSel: "#CFCFCF",
  grid: "#DCDCDC",
  tblHdr: "#4EA72E",
  tblBand: "#DCEBD5",
  text: "#242424",
  mute: "#616161",
};

// Fixed UI metrics (shared by every lesson)
export const M = {
  x: 60,
  y: 92,
  w: 1800,
  titleH: 38,
  tabsH: 34,
  ribbonH: 112,
  fbarH: 34,
  hdrH: 24,
  rowH: 24,
  rowHdrW: 46,
  rows: 24,
  sheetH: 30,
  statusH: 24,
};
export const RIBBON_Y = M.titleH + M.tabsH;
export const GRID_Y = RIBBON_Y + M.ribbonH + M.fbarH + M.hdrH;
export const WIN_H = GRID_Y + M.rows * M.rowH + M.sheetH + M.statusH;
export const COLS: number[] = [100, 130, 150, 50, 100, 130, 150, 50, 100, 130, 150, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80];
