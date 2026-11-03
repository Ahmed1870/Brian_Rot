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
    venn: {x: 60, y: 200, w: 1200, h: 690},
    side: {x: 1300, y: 200, w: 560, h: 690},
  },
  s2: {
    left: {x: 60, y: 200, w: 880, h: 690},
    right: {x: 980, y: 200, w: 880, h: 690},
  },
  s3: {
    editor: {x: 60, y: 200, w: 1000, h: 690},
    tables: {x: 1100, y: 200, w: 760, h: 690},
  },
  s4: {
    hash: {x: 60, y: 200, w: 880, h: 690},
    loop: {x: 980, y: 200, w: 880, h: 690},
  },
  s5: {
    code: {x: 60, y: 200, w: 900, h: 690},
    pipe: {x: 1000, y: 200, w: 860, h: 330},
    invoice: {x: 1000, y: 560, w: 860, h: 330},
  },
  s6: {
    main: {x: 60, y: 50, w: 1000, h: 980},
    next: {x: 1100, y: 50, w: 760, h: 470},
    res: {x: 1100, y: 560, w: 760, h: 470},
  },
} satisfies Record<string, Record<string, Box>>;
