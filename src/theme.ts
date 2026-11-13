// ===== Lesson identity (single source of truth: COMP_ID is used by Root.tsx) =====
export const COMP_ID = 'XL-L47-External-Data';
export const LESSON_NN = '47';
export const OUT_NAME = 'excel-l47-external-data';
export const VOICE_FILE = 'voiceover_lesson_47.mp3';
export const LOGO_FILE = 'manzooma_logo.svg';

// ===== Video spec (from the lesson plan) =====
export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const DUR = 7200; // 240s = exact mp3 duration
export const RENDER_SCALE = 1; // plan for lesson 47 requires Full HD 1920x1080 @ 30fps (no --scale)

// ===== Stage palette (plan) =====
export const COL = {
  slate: '#0F172A', panel: '#1E293B', blue: '#38BDF8', green: '#10B981', amber: '#F59E0B',
  purple: '#A855F7', red: '#EF4444', text: '#F8FAFC', muted: '#94A3B8',
};

// ===== Excel 365 (Windows, modern) metrics at 100% zoom, logical px. Same for every lesson. =====
export const XL = {
  scale: 1.5, winW: 1248, winH: 560, winX: 24, winY: 100,
  titleH: 32, tabsH: 28, ribbonH: 88, fbarH: 24, colHdrH: 20, rowH: 20, colW: 64,
  rowHdrW: 30, sheetBarH: 24, statusH: 24, vscroll: 17, visRows: 16,
  green: '#217346', greenSoft: '#D2E8DB', tint: 'rgba(33,115,70,0.12)',
  grid: '#E1E1E1', hdrBg: '#F3F3F3', hdrText: '#444444', chrome: '#F3F3F3', chromeLine: '#D1D1D1',
  titleBg: '#F3F3F3', // modern light title bar (change here if a green title bar is wanted)
  refColors: ['#2F6FEB', '#E5484D', '#8E4EC6', '#12A150', '#E5A000'],
};
