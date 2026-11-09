// Sound design (synthesized for this course). Frames are absolute (30fps).
export const MUSIC_FILE = "datacamp_tech_ambient.mp3";
export const MUSIC_VOL = 0.12;
export const MUSIC_FADE_AT = 6240;

export type Sfx = {file: string; at: number; frames: number; vol: number};
const S = (file: string, at: number, sec: number, vol = 0.5): Sfx => ({file, at, frames: Math.ceil(sec * 30) + 2, vol});

export const SFX: Sfx[] = [
  S("typing_fast.mp3", 640, 1.5, 0.4),
  S("calendar_snap.mp3", 720, 0.75),
  S("typing_fast.mp3", 760, 1.5, 0.4),
  S("calendar_snap.mp3", 850, 0.75),
  S("holiday_skip_chime.mp3", 1900, 1.3),
  S("project_deadline_lock.mp3", 2046, 1.15),
  S("typing_fast.mp3", 2637, 1.5, 0.4),
  S("fraction_chime.mp3", 2737, 1.3),
  S("typing_fast.mp3", 3207, 1.5, 0.4),
  S("datedif_bug_alert.mp3", 3380, 1.25),
  S("typing_fast.mp3", 3607, 1.5, 0.4),
  S("fraction_chime.mp3", 3737, 1.3, 0.4),
  S("typing_fast.mp3", 4190, 1.5, 0.4),
  S("spilled_calendar_snap.mp3", 4320, 1.15),
  S("schedule_update_chime.mp3", 4620, 1.2),
  S("schedule_update_chime.mp3", 4700, 1.2, 0.35),
  S("typing_fast.mp3", 5479, 1.5, 0.4),
  S("spilled_calendar_snap.mp3", 5581, 1.15, 0.4),
  S("typing_fast.mp3", 5659, 1.5, 0.4),
  S("spilled_calendar_snap.mp3", 5751, 1.15, 0.4),
  S("enterprise_date_engine_seal.mp3", 5799, 2.9),
  S("academic_outro_theme.mp3", 6270, 30.6, 0.45),
];
