// SINGLE SOURCE OF TRUTH for where things live on the 1920x1080 canvas.
export type Box = {x: number; y: number; w: number; h: number};

export const ZONES: Record<'title' | 'art' | 'caption', Box> = {
  title: {x: 60, y: 24, w: 1800, h: 150},
  art: {x: 60, y: 196, w: 1800, h: 700},
  caption: {x: 60, y: 918, w: 1800, h: 130},
};

export const B = {
  s1: {
    doc: {x: 60, y: 200, w: 1100, h: 690},
    side: {x: 1200, y: 200, w: 660, h: 690},
  },
  s2: {
    left: {x: 60, y: 200, w: 880, h: 690},
    right: {x: 980, y: 200, w: 880, h: 690},
  },
  s3: {
    code: {x: 60, y: 200, w: 1800, h: 170},
    tree: {x: 60, y: 400, w: 1200, h: 490},
    cmp: {x: 1300, y: 400, w: 560, h: 490},
  },
  s4: {
    seq: {x: 60, y: 200, w: 880, h: 690},
    gin: {x: 980, y: 200, w: 880, h: 690},
  },
  s5: {
    code: {x: 60, y: 200, w: 1000, h: 690},
    shop: {x: 1100, y: 200, w: 760, h: 690},
  },
  s6: {
    main: {x: 60, y: 50, w: 1000, h: 980},
    next: {x: 1100, y: 50, w: 760, h: 470},
    res: {x: 1100, y: 560, w: 760, h: 470},
  },
} satisfies Record<string, Record<string, Box>>;
