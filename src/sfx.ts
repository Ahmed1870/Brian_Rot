// Sound design (synthesized for this course). Frames are absolute (30fps).
export const MUSIC_FILE = "datacamp_tech_ambient.mp3";
export const MUSIC_VOL = 0.12;
export const MUSIC_FADE_AT = 6055;

export type Sfx = {file: string; at: number; frames: number; vol: number};
const S = (file: string, at: number, sec: number, vol = 0.5): Sfx => ({file, at, frames: Math.ceil(sec * 30) + 2, vol});

export const SFX: Sfx[] = [
  S("column_generation_stream.mp3", 760, 1.8),
  S("conditional_dialog_pop.mp3", 1470, 1.1),
  S("typing_fast.mp3", 1502, 1.5, 0.4),
  S("typing_fast.mp3", 1617, 1.5, 0.35),
  S("typing_fast.mp3", 1712, 1.5, 0.35),
  S("column_lock_chime.mp3", 1902, 1.65),
  S("custom_column_formula_sound.mp3", 2477, 1.2),
  S("typing_fast.mp3", 2554, 1.5, 0.4),
  S("m_formula_execution_snap.mp3", 2721, 1.3),
  S("custom_column_formula_sound.mp3", 2789, 1.2, 0.4),
  S("typing_fast.mp3", 2849, 1.5, 0.4),
  S("m_formula_execution_snap.mp3", 3014, 1.3, 0.4),
  S("parameter_binding.mp3", 3619, 1.55),
  S("typing_fast.mp3", 3668, 1.5, 0.4),
  S("parameter_binding.mp3", 4028, 1.55, 0.4),
  S("parameter_binding.mp3", 4125, 1.55, 0.4),
  S("advanced_editor_code_lock.mp3", 4169, 1.5),
  S("m_formula_execution_snap.mp3", 5008, 1.3, 0.4),
  S("parameter_binding.mp3", 5293, 1.55, 0.4),
  S("m_formula_execution_snap.mp3", 5323, 1.3, 0.4),
  S("enterprise_mlogic_seal.mp3", 5508, 3.65),
  S("academic_outro_theme.mp3", 6085, 30.6, 0.45),
];
