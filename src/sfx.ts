// Sound design (synthesized for this course). Frames are absolute (30fps).
export const MUSIC_FILE = "datacamp_tech_ambient.mp3";
export const MUSIC_VOL = 0.12;
export const MUSIC_FADE_AT = 5970;

export type Sfx = {file: string; at: number; frames: number; vol: number};
const S = (file: string, at: number, sec: number, vol = 0.5): Sfx => ({file, at, frames: Math.ceil(sec * 30) + 2, vol});

export const SFX: Sfx[] = [
  S("typing_fast.mp3", 860, 1.5, 0.4),
  S("array_spill_pop.mp3", 982, 1.25),
  S("typing_fast.mp3", 1598, 1.5, 0.4),
  S("spill_error_alert.mp3", 1660, 1.35),
  S("typing_fast.mp3", 1753, 1.5, 0.4),
  S("spill_error_alert.mp3", 1815, 1.35, 0.4),
  S("typing_fast.mp3", 1898, 1.5, 0.4),
  S("spill_error_alert.mp3", 1960, 1.35, 0.4),
  S("obstacle_clear_snap.mp3", 2188, 1.12),
  S("obstacle_clear_snap.mp3", 2273, 1.12),
  S("obstacle_clear_snap.mp3", 2333, 1.12),
  S("typing_fast.mp3", 3022, 1.5, 0.4),
  S("spill_operator_chime.mp3", 3142, 1.55),
  S("typing_fast.mp3", 3202, 1.5, 0.35),
  S("array_spill_pop.mp3", 3362, 1.25, 0.4),
  S("typing_fast.mp3", 3417, 1.5, 0.35),
  S("implicit_intersection_lock.mp3", 3472, 1.15),
  S("typing_fast.mp3", 4118, 1.5, 0.4),
  S("legacy_formula_fade.mp3", 4373, 1.6),
  S("typing_fast.mp3", 4418, 1.5, 0.4),
  S("modern_engine_snap.mp3", 4493, 1.15),
  S("typing_fast.mp3", 5394, 1.5, 0.4),
  S("array_spill_pop.mp3", 5474, 1.25),
  S("typing_fast.mp3", 5604, 1.5, 0.35),
  S("spill_operator_chime.mp3", 5684, 1.55, 0.4),
  S("enterprise_dynamic_array_seal.mp3", 5734, 3.25),
  S("academic_outro_theme.mp3", 6000, 30.6, 0.45),
];
