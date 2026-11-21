// الـ ID الوحيد للدرس - يُقرأ حرفياً بواسطة scripts/validate.mjs ويُقارن بكل الملفات.
export const COMP_ID = 'PBI-L41-ValuesDistinctSelectedValueHasOneValue';

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const DURATION = 9000; // 300 ثانية × 30 FPS
export const AUDIO_FILE = 'voiceover_lesson_41.mp3';

export const LESSON = {
  num: 41,
  title: 'VALUES وDISTINCT وSELECTEDVALUE وHASONEVALUE',
  unit: 'الوحدة: أساسيات DAX',
  next: ['KEEPFILTERS', 'CROSSFILTER', 'Dynamic Filtering'],
};

export const COL = {
  yellow: '#F2C811', yellowSoft: '#FDF1B8', sel: '#FBE9A6', ink: '#201F1E', text: '#323130', sub: '#605E5C',
  line: '#E1DFDD', bg: '#FAF9F8', panel: '#F3F2F1', white: '#FFFFFF', red: '#C4314B', redSoft: '#FCE4E8',
  green: '#107C10', greenSoft: '#DFF6DD', blue: '#0F6CBD', blueSoft: '#DCEBFA', amber: '#B26B00', amberSoft: '#FFF0CC',
  fn: '#0B5CAD', str: '#B5481A', col: '#0A7A6F', num: '#6B3FA0',
};

// Cairo أولاً (يُحمَّل من public/fonts إن وُجد)، ثم DejaVu المضمّن كبديل مضمون.
export const FONT_UI = "'PBIInter','Cairo','PBIArabic','DejaVu Sans',sans-serif";
export const FONT_AR = "'Cairo','PBIArabic','PBIInter','DejaVu Sans',sans-serif";
export const FONT_MONO = "'PBIMono','DejaVu Sans Mono',monospace";
