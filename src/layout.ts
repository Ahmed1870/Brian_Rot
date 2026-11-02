// SINGLE SOURCE OF TRUTH for where things live on the 1920x1080 canvas.
// Rule: text zones (title/caption) never intersect art zones. Run `npm run check` to verify.
export type Box = {x: number; y: number; w: number; h: number};

export const ZONES: Record<'title' | 'art' | 'caption', Box> = {
  title: {x: 60, y: 24, w: 1800, h: 150},
  art: {x: 60, y: 196, w: 1800, h: 700},
  caption: {x: 60, y: 918, w: 1800, h: 130},
};

export const B = {
  s1: {
    code: {x: 60, y: 200, w: 600, h: 400},
    legend: {x: 60, y: 630, w: 600, h: 260},
    pipe: {x: 700, y: 200, w: 1160, h: 690},
  },
  s2: {
    left: {x: 60, y: 200, w: 880, h: 690},
    right: {x: 980, y: 200, w: 880, h: 690},
  },
  s3: {
    editor: {x: 60, y: 200, w: 840, h: 430},
    chips: {x: 60, y: 660, w: 840, h: 230},
    table: {x: 940, y: 200, w: 920, h: 690},
  },
  s4: {
    circuit: {x: 60, y: 200, w: 1000, h: 690},
    trap: {x: 1100, y: 200, w: 760, h: 690},
  },
  s5: {
    seq: {x: 60, y: 200, w: 880, h: 470},
    idx: {x: 980, y: 200, w: 880, h: 470},
    bad: {x: 60, y: 700, w: 880, h: 190},
    good: {x: 980, y: 700, w: 880, h: 190},
  },
  s6: {
    main: {x: 60, y: 50, w: 1000, h: 980},
    next: {x: 1100, y: 50, w: 760, h: 470},
    res: {x: 1100, y: 560, w: 760, h: 470},
  },
} satisfies Record<string, Record<string, Box>>;
