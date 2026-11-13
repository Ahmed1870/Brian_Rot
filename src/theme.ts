// Lesson identity: every name in the project is derived from these values.
export const LESSON_NUM = "55";
export const COMP_ID = "XL-L55-FILTER-PROPAGATION";
export const OUT_NAME = "xl-l55-filter-propagation";
export const VOICE_FILE = "voiceover_lesson_55.mp3";
export const LOGO_FILE = "manzooma_logo.svg";
export const XLSX_NAME = "manzooma_sales_2026.xlsx";

// Video spec (change WIDTH/HEIGHT here only; the UI scales from S).
export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const DURATION = 7200;

// Layout: a Slate caption strip on top, the Excel window below.
export const STRIP_H = 72;
export const S = 1.25; // Excel logical px -> output px
export const WIN_W = WIDTH / S; // 1536
export const WIN_H = (HEIGHT - STRIP_H) / S; // 806.4

// Excel metrics in logical px (Microsoft 365 desktop, Windows, 100%).
export const M = {
  titleBar: 30,
  tabs: 30,
  ribbon: 94,
  formula: 28,
  colHdr: 20,
  rowHdr: 40,
  rowH: 20,
  colW: 64,
  sheetBar: 28,
  statusBar: 24,
};
export const GRID_TOP = M.titleBar + M.tabs + M.ribbon + M.formula + M.colHdr; // body top
export const BODY_H = WIN_H - GRID_TOP - M.sheetBar - M.statusBar;
export const NSLOT = Math.ceil(BODY_H / M.rowH);

export const C = {
  slate: "#0F172A",
  slate2: "#1E293B",
  text: "#F8FAFC",
  blue: "#38BDF8",
  green: "#10B981",
  amber: "#F59E0B",
  purple: "#A855F7",
  red: "#EF4444",
  gold: "#FBBF24",
  // Excel light UI
  xGreen: "#107C41",
  xGreenDark: "#0B5A2E",
  xSel: "rgba(16,124,65,0.14)",
  chrome: "#F3F3F3",
  ribbon: "#F9F9F9",
  line: "#D6D6D6",
  grid: "#DCDCDC",
  hdr: "#F2F2F2",
  hdrSel: "#CFE5D8",
  ink: "#1F1F1F",
  inkSoft: "#605E5C",
  filtBlue: "#0563C1",
};
