// Sound design (synthesized for this course). Frames are absolute (30fps).
export const MUSIC_FILE = "datacamp_tech_ambient.mp3";
export const MUSIC_VOL = 0.12;
export const MUSIC_FADE_AT = 6240;

export type Sfx = {file: string; at: number; frames: number; vol: number};
const S = (file: string, at: number, sec: number, vol = 0.5): Sfx => ({file, at, frames: Math.ceil(sec * 30) + 2, vol});

export const SFX: Sfx[] = [
  S("typing_fast.mp3", 460, 1.4, 0.4),
  S("radar_lock.mp3", 560, 1.3),
  S("typing_fast.mp3", 690, 1.4, 0.4),
  S("matrix_value_snap.mp3", 770, 0.5),
  S("free_pass_chime.mp3", 840, 1.4, 0.4),
  S("typing_fast.mp3", 1279, 1.4, 0.4),
  S("free_pass_chime.mp3", 1549, 1.4),
  S("structural_shield_snap.mp3", 1964, 0.9),
  S("structural_shield_snap.mp3", 2000, 0.9, 0.35),
  S("typing_fast.mp3", 2647, 1.4, 0.4),
  S("crosshair_laser.mp3", 3207, 1.15),
  S("matrix_value_snap.mp3", 3317, 0.5),
  S("crosshair_laser.mp3", 3492, 1.15, 0.35),
  S("matrix_value_snap.mp3", 3522, 0.5),
  S("crosshair_laser.mp3", 3647, 1.15, 0.35),
  S("matrix_value_snap.mp3", 3677, 0.5),
  S("free_pass_chime.mp3", 4274, 1.4, 0.4),
  S("speedometer_boost.mp3", 4497, 1.9),
  S("typing_fast.mp3", 5499, 1.4, 0.4),
  S("speedometer_boost.mp3", 5661, 1.9, 0.35),
  S("enterprise_index_match_seal.mp3", 5799, 2.7),
  S("academic_outro_theme.mp3", 6270, 30.6, 0.45),
];
