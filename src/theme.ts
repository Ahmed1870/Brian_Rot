export const FPS = 30;
export const DURATION = 1050;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const C = {
  bg: '#050505',
  white: '#FFFFFF',
  yellow: '#FFE600',
  gold: '#FFE600',
  cyan: '#00F0FF',
  blue: '#2563EB',
  blue2: '#3B82F6',
  navy: '#0B1330',
  red: '#FF3B5C',
  green: '#22C55E',
  magenta: '#FF2BD6',
  text: '#F1F5F9',
  dim: '#94A3B8',
} as const;

export const BRAND = {
  name: 'Monzoma Digital',
  handle: '@monzoma.digital',
  solutions: 'solutions.gomaaintelligence.me',
  analytics: 'analytics.gomaaintelligence.me',
} as const;

/** Scene native start frames (content timelines are relative to these). */
export const STARTS = [0, 240, 540, 780] as const;
