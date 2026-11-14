// Single source of truth for lesson naming + Excel UI metrics (1920x1080 design grid).
export const LESSON_NO = "66";
export const COMP_ID = "XL-L66-Scenario-Analysis";
export const OUT_NAME = "xl-l66-scenario-analysis";
export const VOICE_FILE = "voiceover_lesson_66.mp3";
export const LOGO_FILE = "manzooma-logo.svg";
export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const DURATION = 7200;

export const C = {
  bg: "#0F172A", panel: "#1E293B", text: "#F8FAFC", mute: "#94A3B8",
  blue: "#38BDF8", green: "#10B981", amber: "#F59E0B", purple: "#A855F7", red: "#EF4444",
  // Excel (Microsoft 365, modern light look, generic icons)
  xlGreen: "#217346", xlGreenDk: "#185C37", xlSel: "#107C41", xlSelFill: "rgba(16,124,65,0.14)",
  xlBar: "#FFFFFF", xlRibbon: "#F3F3F3", xlLine: "#D4D4D4", xlGrid: "#E1E1E1", xlHdr: "#EDEDED",
  xlHdrSel: "#D3F0E0", xlHdrSelTx: "#0F6B3A", xlTxt: "#242424", xlTxt2: "#616161",
  dlg: "#F0F0F0",
};

// Excel metrics at 1.5x of the 100% desktop layout (row 20px -> 30px, col 64px -> 96px).
export const M = {
  winX: 48, winY: 96, winW: 1824,
  titleH: 40, tabH: 40, ribbonH: 132, fbH: 40, colHdrH: 30, rowH: 30, rowHdrW: 54,
  rows: 15, sheetH: 34, statusH: 28, defColW: 96,
};
export const Y = {
  title: M.winY,
  tabs: M.winY + M.titleH,
  ribbon: M.winY + M.titleH + M.tabH,
  fb: M.winY + M.titleH + M.tabH + M.ribbonH,
  colHdr: M.winY + M.titleH + M.tabH + M.ribbonH + M.fbH,
  grid: M.winY + M.titleH + M.tabH + M.ribbonH + M.fbH + M.colHdrH,
  sheet: M.winY + M.titleH + M.tabH + M.ribbonH + M.fbH + M.colHdrH + M.rows * M.rowH,
  status: M.winY + M.titleH + M.tabH + M.ribbonH + M.fbH + M.colHdrH + M.rows * M.rowH + M.sheetH,
  end: M.winY + M.titleH + M.tabH + M.ribbonH + M.fbH + M.colHdrH + M.rows * M.rowH + M.sheetH + M.statusH,
};

// Illustrative model (manzooma_sales_2026): Net = Units*(Price*(1-Disc)-Cost-Ship)-Fixed
export const MODEL = { price: 500, disc: 0.1, cost: 300, ship: 25, units: 20000, fixed: 1000000, dep: 200000 };
export const profit = (d: number, s: number, p = MODEL.price, u = MODEL.units) =>
  Math.round(u * (p * (1 - d) - MODEL.cost - s) - MODEL.fixed);
export const fmt = (n: number) => (n < 0 ? "-" : "") + Math.abs(n).toLocaleString("en-US");
