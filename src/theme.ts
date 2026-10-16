export const FPS = 30;
export const DURATION = 450;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const C = {
  bg: '#05070F',
  navy: '#0B1330',
  blue: '#2563EB',
  blue2: '#3B82F6',
  cyan: '#00F0FF',
  gold: '#FBBF24',
  amber: '#F59E0B',
  white: '#FFFFFF',
  text: '#E2E8F0',
  dim: '#94A3B8',
  red: '#EF4444',
} as const;

export const BRAND = {
  analytics: 'analytics.gomaaintelligence.me',
  solutions: 'solutions.gomaaintelligence.me',
  phone: '+20 1019672878',
  handleA: '@monzoma.digital',
  handleB: '@monzoma_digital',
} as const;

/** Captions synced to the detected voice-over phrases (global frames). Loop-safe: first fades in, last fades out. */
export const CAPTIONS: {text: string; from: number; to?: number}[] = [
  {text: 'الجمال مش مجرد صدفة..', from: 0, to: 72},
  {text: 'الجمال إتقان، إبتكار، وتناسق بياخد العقل لدنيا تانية!', from: 96, to: 160},
  {text: 'في منظومة ديجيتال،', from: 177, to: 204},
  {text: 'بنصنع لك تجربة رقمية فريدة وبأعلى معايير الإبداع!', from: 214, to: 312},
  {text: 'تواصل معانا دلوقتي،', from: 326, to: 366},
  {text: 'وخلي أفكارك تتحول لواقع مبهر لا ينتهي!', from: 372, to: 428},
];
