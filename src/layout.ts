// SINGLE SOURCE OF TRUTH for where things live on the 1920x1080 canvas.
export type Box = {x: number; y: number; w: number; h: number};

export const ZONES: Record<'title' | 'art' | 'caption', Box> = {
  title: {x: 60, y: 24, w: 1800, h: 150},
  art: {x: 60, y: 196, w: 1800, h: 700},
  caption: {x: 60, y: 918, w: 1800, h: 130},
};

export const B = {
  s1: {
    stage: {x: 60, y: 200, w: 1800, h: 470},
    note: {x: 60, y: 700, w: 1800, h: 190},
  },
  s2: {
    code: {x: 60, y: 200, w: 1000, h: 380},
    alias: {x: 60, y: 610, w: 1000, h: 280},
    result: {x: 1100, y: 200, w: 760, h: 690},
  },
  s3: {
    inner: {x: 60, y: 200, w: 880, h: 690},
    left: {x: 980, y: 200, w: 880, h: 690},
  },
  s4: {
    code: {x: 60, y: 200, w: 860, h: 690},
    tree: {x: 960, y: 200, w: 900, h: 690},
  },
  s5: {
    code: {x: 60, y: 200, w: 1000, h: 350},
    pairs: {x: 60, y: 580, w: 1000, h: 310},
    store: {x: 1100, y: 200, w: 760, h: 690},
  },
  s6: {
    main: {x: 60, y: 50, w: 1000, h: 980},
    next: {x: 1100, y: 50, w: 760, h: 470},
    res: {x: 1100, y: 560, w: 760, h: 470},
  },
} satisfies Record<string, Record<string, Box>>;
