// Lesson identity + all fixed UI metrics (shared by every lesson via kit.tsx)
export const LESSON = 58;
export const TOTAL_LESSONS = 76;
export const UNIT = 12;
export const TOTAL_UNITS = 14;
export const TITLE_EN = "Row, Filter Context & Context Transition";
export const TITLE_AR = "سياق الصف وسياق الفلترة وانتقال السياق";
export const COMP_ID = "XL-L58-DAX-Contexts";
export const OUT_NAME = "xl-l58-dax-contexts";
export const VOICE = "voiceover_lesson_58.mp3";
export const LOGO = "manzooma-logo-white.svg";
export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const DURATION = 7200;

export const C = {
  bg: "#0F172A", panel: "#1E293B", panel2: "#273449", line: "#334155",
  blue: "#38BDF8", green: "#10B981", amber: "#F59E0B", purple: "#A855F7",
  red: "#EF4444", text: "#F8FAFC", dim: "#94A3B8",
};

// Excel/Windows look (light UI inside the dark stage)
export const XL = {
  green: "#217346", greenLight: "#D3EBDD", greenFill: "rgba(33,115,70,0.13)",
  bar: "#F3F3F3", ribbon: "#FFFFFF", line: "#D4D4D4", hdr: "#F0F0F0", hdrSel: "#D3D3D3",
  grid: "#E1E1E1", text: "#262626", dim: "#6B6B6B", tbl: "#4472C4", band: "#D9E1F2",
  dlg: "#F0F0F0", hover: "#E5F3FB", hoverLine: "#99D1FF",
};

// Metrics at 100% (nominal px); the window is drawn at Z x for legibility on phones.
export const M = {
  Z: 1.3,
  win: { x: 50, y: 92, w: 1400, h: 690 },
  title: 30, tabs: 28, ribbon: 96, fbar: 26, colH: 20, rowH: 20, rowHdrW: 30, colW: 64,
  sheetBar: 27, status: 23, scroll: 14, pane: 268, pqLeft: 190, pqRight: 262,
};
export const gx = (nx: number) => M.win.x + nx * M.Z;
export const gy = (ny: number) => M.win.y + ny * M.Z;
