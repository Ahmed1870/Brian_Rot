// SINGLE SOURCE OF TRUTH for where things live on the 1920x1080 canvas.
// Text zones (title/caption) never intersect art boxes. Verify with `npm run check`.
export type Box = {x: number; y: number; w: number; h: number};

export const ZONES: Record<'title' | 'art' | 'caption', Box> = {
  title: {x: 60, y: 24, w: 1800, h: 150},
  art: {x: 60, y: 196, w: 1800, h: 700},
  caption: {x: 60, y: 918, w: 1800, h: 130},
};

export const B = {
  s1: {
    table: {x: 60, y: 200, w: 1000, h: 690},
    out: {x: 1100, y: 200, w: 760, h: 690},
  },
  s2: {
    left: {x: 60, y: 200, w: 880, h: 480},
    right: {x: 980, y: 200, w: 880, h: 480},
    funcs: {x: 60, y: 710, w: 1800, h: 180},
  },
  s3: {
    left: {x: 60, y: 200, w: 880, h: 690},
    right: {x: 980, y: 200, w: 880, h: 690},
  },
  s4: {
    code: {x: 60, y: 200, w: 1800, h: 130},
    input: {x: 60, y: 360, w: 700, h: 530},
    hash: {x: 800, y: 360, w: 640, h: 530},
    count: {x: 1480, y: 360, w: 380, h: 530},
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
