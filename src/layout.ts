// SINGLE SOURCE OF TRUTH for where things live on the 1920x1080 canvas.
export type Box = {x: number; y: number; w: number; h: number};

export const ZONES: Record<'title' | 'art' | 'caption', Box> = {
  title: {x: 60, y: 24, w: 1800, h: 150},
  art: {x: 60, y: 196, w: 1800, h: 700},
  caption: {x: 60, y: 918, w: 1800, h: 130},
};

export const B = {
  s1: {
    board: {x: 60, y: 200, w: 1200, h: 690},
    side: {x: 1300, y: 200, w: 560, h: 690},
  },
  s2: {
    code: {x: 60, y: 200, w: 1800, h: 230},
    table: {x: 60, y: 460, w: 1200, h: 430},
    shield: {x: 1300, y: 460, w: 560, h: 430},
  },
  s3: {
    trap: {x: 60, y: 200, w: 880, h: 690},
    fix: {x: 980, y: 200, w: 880, h: 690},
  },
  s4: {
    buffer: {x: 60, y: 200, w: 1800, h: 430},
    io: {x: 60, y: 660, w: 880, h: 230},
    speed: {x: 980, y: 660, w: 880, h: 230},
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
