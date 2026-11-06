// SINGLE SOURCE OF TRUTH for where things live on the 1920x1080 canvas.
export type Box = {x: number; y: number; w: number; h: number};

export const ZONES: Record<'title' | 'art' | 'caption', Box> = {
  title: {x: 60, y: 24, w: 1800, h: 150},
  art: {x: 60, y: 196, w: 1800, h: 700},
  caption: {x: 60, y: 918, w: 1800, h: 130},
};

export const B = {
  s1: {
    unique: {x: 60, y: 200, w: 880, h: 690},
    partial: {x: 980, y: 200, w: 880, h: 690},
  },
  s2: {
    code: {x: 60, y: 200, w: 1800, h: 190},
    tree: {x: 60, y: 420, w: 1200, h: 470},
    err: {x: 1300, y: 420, w: 560, h: 470},
  },
  s3: {
    code: {x: 60, y: 200, w: 1800, h: 150},
    full: {x: 60, y: 380, w: 880, h: 510},
    part: {x: 980, y: 380, w: 880, h: 510},
  },
  s4: {
    qa: {x: 60, y: 200, w: 600, h: 330},
    qb: {x: 60, y: 560, w: 600, h: 330},
    opt: {x: 700, y: 200, w: 520, h: 690},
    pis: {x: 1260, y: 200, w: 600, h: 330},
    seq: {x: 1260, y: 560, w: 600, h: 330},
  },
  s5: {
    code: {x: 60, y: 200, w: 1000, h: 690},
    report: {x: 1100, y: 200, w: 760, h: 690},
  },
  s6: {
    main: {x: 60, y: 50, w: 1000, h: 980},
    next: {x: 1100, y: 50, w: 760, h: 470},
    res: {x: 1100, y: 560, w: 760, h: 470},
  },
} satisfies Record<string, Record<string, Box>>;
