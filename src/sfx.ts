// Sound design (all files synthesized for this course, royalty-free). Frames are absolute (30fps).
export const MUSIC_FILE = "datacamp_tech_ambient.mp3";
export const MUSIC_VOL = 0.12;
export const MUSIC_FADE_AT = 6240; // ambient fades out as the outro theme starts

export const SFX_FILES = [
  "ctrl_t_popup.mp3", "digital_transform.mp3", "typing_fast.mp3", "total_row_pop.mp3", "syntax_highlight.mp3",
  "growth_pulse.mp3", "auto_connect.mp3", "enterprise_seal_shine.mp3", "academic_outro_theme.mp3",
];

export type Sfx = {file: string; at: number; frames: number; vol: number};
const S = (file: string, at: number, sec: number, vol = 0.5): Sfx => ({file, at, frames: Math.ceil(sec * 30) + 2, vol});

export const SFX: Sfx[] = [
  S("ctrl_t_popup.mp3", 580, 0.5),
  S("digital_transform.mp3", 775, 1.4),
  S("typing_fast.mp3", 1594, 1.4, 0.4),
  S("total_row_pop.mp3", 1868, 0.6),
  S("typing_fast.mp3", 2646, 1.4, 0.4),
  S("typing_fast.mp3", 2836, 1.4, 0.35),
  S("syntax_highlight.mp3", 3367, 1.1),
  S("growth_pulse.mp3", 4143, 1.4),
  S("typing_fast.mp3", 4388, 1.4, 0.4),
  S("growth_pulse.mp3", 4418, 1.4),
  S("auto_connect.mp3", 4738, 1.3),
  S("ctrl_t_popup.mp3", 5530, 0.5),
  S("digital_transform.mp3", 5569, 1.4),
  S("typing_fast.mp3", 5585, 1.4, 0.4),
  S("typing_fast.mp3", 5671, 1.4, 0.4),
  S("enterprise_seal_shine.mp3", 5839, 2.5),
  S("academic_outro_theme.mp3", 6270, 30.6, 0.45),
];
