export const FPS = 30;
export const DURATION = 7170; // 239s = the voice-over (3:59)
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const C = {
  board: '#1A1D20',   // chalkboard
  chalk: '#EAEAEA',   // off-white chalk
  yellow: '#F4D03F',  // warm yellow highlight
  dim: '#8C9196',
  faint: 'rgba(234,234,234,0.16)',
  // aliases used by shared helpers (Logo, ui icons)
  bg: '#1A1D20', white: '#EAEAEA', text: '#EAEAEA', gold: '#F4D03F', cyan: '#EAEAEA', blue: '#EAEAEA', blue2: '#EAEAEA', red: '#F4D03F',
} as const;

export const BRAND = {
  name: 'monzoma_digital',
  company: 'Gomaa Intelligence',
  platform: 'solutions.gomaaintelligence.me',
  business: 'analytics.gomaaintelligence.me',
  whatsapp: '+201019672878',
  handle: '@monzoma_digital',
} as const;

/**
 * Script: the VO states Sara's result as "151" while her scores are 1/1/1 (R*100+F*10+M = 111).
 * The video follows the script/VO ('151'). Set to '111' here if you re-record that sentence.
 */
export const SARA_SCORE = '151';

/** Voice-over cue sheet in SECONDS (detected from vo_rfm_tutorial.mp3 phrase boundaries). */
export const T = {
  // scene 1
  hook: 0.15, discount: 3.2, wasted: 6.65, weekly: 9.55, onceBuyer: 14.95, rfmIntro: 24.6, rfmName: 31.55, rows3d: 39.6,
  // scene 2
  recency: 44.95, recencyScore: 54.45, frequency: 62.5, frequencyScore: 78.1, monetary: 80.65, monetaryCalc: 84.2,
  rawTable: 91.8, quintiles: 96.85, top20: 109.3, bottom20: 116.65,
  // scene 3
  caseIntro: 120.35, ahmedData: 128.8, ahmedScores: 135.05, ahmedResult: 139.85, ahmedStrategy: 149.6,
  saraData: 152.4, saraScores: 157.05, saraResult: 160.35, saraStrategy: 166.55,
  // scene 4
  sql: 177.1, python: 186.2, powerbi: 195.15, excel: 204.75,
  // scene 5
  heatmap: 214.1, strategies: 222.55,
  // scene 6
  cta: 234.65,
  end: 239,
} as const;

export const SCENES = {
  s1: {from: 0, to: 44.4},
  s2: {from: 44.95, to: 120.0},
  s3: {from: 120.35, to: 176.8},
  s4: {from: 177.1, to: 213.9},
  s5: {from: 214.1, to: 234.3},
  s6: {from: 234.65, to: 239},
} as const;

export const fr = (sec: number) => Math.round(sec * FPS);
