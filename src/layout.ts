// SINGLE SOURCE OF TRUTH for where things live on the 1920x1080 canvas.
export type Box = {x: number; y: number; w: number; h: number};

export const ZONES: Record<'title' | 'art' | 'caption', Box> = {
  title: {x: 60, y: 24, w: 1800, h: 150},
  art: {x: 60, y: 196, w: 1800, h: 700},
  caption: {x: 60, y: 918, w: 1800, h: 130},
};

export const B = {
  s1: {
    tables: {x: 60, y: 200, w: 1100, h: 690},
    view: {x: 1200, y: 200, w: 660, h: 690},
  },
  s2: {
    raw: {x: 60, y: 200, w: 880, h: 690},
    safe: {x: 980, y: 200, w: 880, h: 690},
  },
  s3: {
    userq: {x: 60, y: 200, w: 540, h: 690},
    rewriter: {x: 640, y: 200, w: 640, h: 690},
    plan: {x: 1320, y: 200, w: 540, h: 690},
  },
  s4: {
    code: {x: 60, y: 200, w: 1100, h: 690},
    rep: {x: 1200, y: 200, w: 660, h: 210},
    bar: {x: 1200, y: 430, w: 660, h: 210},
    drop: {x: 1200, y: 660, w: 660, h: 230},
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
