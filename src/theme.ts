// ===== Single source of truth for the lesson identity + UI metrics =====
export const COMP_ID = "XL-L65-Linear-Regression-Forecasting";
export const OUT_NAME = "xl-l65-linear-regression-forecasting";
export const LESSON = 65;
export const LESSONS = 76;
export const UNIT = 13;
export const UNITS = 14;
export const VOICE = "voiceover_lesson_65.mp3";
export const LOGO = "manzooma_logo.svg";
export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const DURATION = 7200;

export const C = {
  bg: "#0F172A", panel: "#1E293B", cyan: "#38BDF8", green: "#10B981",
  amber: "#F59E0B", purple: "#A855F7", red: "#EF4444", text: "#F8FAFC", mute: "#94A3B8",
  xlGreen: "#107C41", xlGreenSoft: "#E6F2EA", xlSelFill: "rgba(16,124,65,0.12)",
  chrome: "#F3F3F3", ribbon: "#FAFAFA", line: "#D4D4D4", grid: "#E1E1E1",
  hdr: "#F5F5F5", hdrSel: "#CFE8D9", ink: "#1F1F1F", ink2: "#616161", white: "#FFFFFF",
};

// Fixed metrics grid (px @1920x1080). Every scene uses these -> identical sizes across lessons.
export const M = {
  winX: 24, winY: 62, winW: 1872, winH: 930,
  title: 44, tabs: 40, ribbon: 128, fbar: 40,
  colH: 30, rowH: 30, rowHdrW: 52, colW: 96,
  sheetBar: 38, status: 32, gridRows: 19,
  capY: 1004, capH: 62,
};
export const GRID_Y = M.winY + M.title + M.tabs + M.ribbon + M.fbar;
