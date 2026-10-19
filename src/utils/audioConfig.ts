export type Stem = {file: string; frame: number; volume: number; note: string};
export const VOICE = {file: 'vo_free_templates_20s.mp3', volume: 1};

/** Tactile SFX fired on exact frames (public/). */
export const STEMS: Stem[] = [
  {file: 'paper_flip.mp3', frame: 0, volume: 0.9, note: 'Sub-bass thump + soft paper pull (fast hook)'},
  {file: 'servo_slide.mp3', frame: 132, volume: 0.9, note: 'Hydraulic acrylic shelf slide + emerald ring'},
  {file: 'quick_card_swipe.mp3', frame: 258, volume: 0.9, note: 'Card 1 in'},
  {file: 'quick_card_swipe.mp3', frame: 288, volume: 0.9, note: 'Flip -> card 2'},
  {file: 'quick_card_swipe.mp3', frame: 318, volume: 0.9, note: 'Flip -> card 3'},
  {file: 'quick_card_swipe.mp3', frame: 348, volume: 0.9, note: 'Flip -> card 4'},
  {file: 'quick_card_swipe.mp3', frame: 366, volume: 0.7, note: 'One-press download button'},
  {file: 'metallic_lock.mp3', frame: 396, volume: 0.9, note: 'Seal locks in'},
  {file: 'ping.mp3', frame: 426, volume: 0.5, note: 'Handle badge'},
  {file: 'ping.mp3', frame: 474, volume: 0.9, note: 'CTA button pops'},
];
