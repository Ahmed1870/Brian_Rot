import timing from './timing.json';

export type SfxKind = 'whoosh' | 'trans' | 'pop' | 'click' | 'tick' | 'type' | 'confirm' | 'error' | 'ding';
export type Ev = { k: number; off: number; dur?: number; sfx?: SfxKind };

// All visual events, expressed relative to sentence anchors of each scene (single source for visuals + SFX).
export const EV = {
  1: {
    intro: { k: 0, off: 0, sfx: 'whoosh' }, file: { k: 1, off: 0.3, sfx: 'pop' },
    f1: { k: 1, off: 1.0, sfx: 'tick' }, f2: { k: 1, off: 2.4, sfx: 'tick' }, f3: { k: 1, off: 3.8, sfx: 'tick' },
    m1: { k: 2, off: 0.6, sfx: 'pop' }, m2: { k: 2, off: 2.6, sfx: 'pop' }, m3: { k: 2, off: 4.6, sfx: 'pop' },
    badge: { k: 3, off: 0.2, sfx: 'confirm' },
    c1: { k: 4, off: 0.3, sfx: 'pop' }, c2: { k: 4, off: 1.9, sfx: 'pop' }, c3: { k: 4, off: 3.5, sfx: 'pop' },
  },
  2: {
    trans: { k: 0, off: 0, sfx: 'trans' },
    t1: { k: 1, off: 0.5, dur: 2.4, sfx: 'type' }, t2: { k: 2, off: 0.3, dur: 2.0, sfx: 'type' },
    eq: { k: 3, off: 0.3, sfx: 'click' },
    t3: { k: 4, off: 0.1, dur: 1.8, sfx: 'type' }, t4: { k: 4, off: 2.4, dur: 4.0, sfx: 'type' },
    run: { k: 5, off: 0.4, sfx: 'click' }, out: { k: 5, off: 1.7, sfx: 'confirm' },
  },
  3: {
    trans: { k: 0, off: 0, sfx: 'trans' },
    t1: { k: 1, off: 0.8, dur: 2.3, sfx: 'type' }, t2: { k: 1, off: 3.6, dur: 2.2, sfx: 'type' },
    run: { k: 2, off: 0.2, sfx: 'click' }, out: { k: 2, off: 1.3, sfx: 'confirm' },
    t3: { k: 3, off: 0.05, dur: 2.3, sfx: 'type' },
    o1: { k: 3, off: 0.6, sfx: 'pop' }, o2: { k: 3, off: 1.2, sfx: 'pop' }, o3: { k: 3, off: 1.8, sfx: 'pop' },
    cmp: { k: 4, off: 0.3, sfx: 'pop' }, neq: { k: 4, off: 2.2, sfx: 'confirm' },
    t4: { k: 5, off: 0.2, dur: 2.4, sfx: 'type' },
    b1: { k: 5, off: 2.2, sfx: 'error' }, b2: { k: 5, off: 3.5, sfx: 'error' }, b3: { k: 5, off: 4.7, sfx: 'error' },
    end: { k: 6, off: 0.3 },
  },
  4: {
    trans: { k: 0, off: 0, sfx: 'trans' }, t1: { k: 1, off: 0.2 },
    cInt: { k: 2, off: 0.2, sfx: 'pop' }, cFloat: { k: 3, off: 0.2, sfx: 'pop' },
    e1: { k: 4, off: 0.1, dur: 1.6, sfx: 'type' }, e2: { k: 4, off: 2.3, dur: 2.6, sfx: 'type' },
    h1: { k: 4, off: 1.9, sfx: 'tick' }, h2: { k: 4, off: 5.0, sfx: 'tick' }, end: { k: 5, off: 0.2 },
  },
  5: {
    trans: { k: 0, off: 0, sfx: 'trans' }, card: { k: 0, off: 0.4, sfx: 'pop' },
    q: { k: 1, off: 0.4, sfx: 'pop' }, t1: { k: 1, off: 0.6, dur: 2.2, sfx: 'type' },
    t2: { k: 2, off: 0.2, dur: 2.4, sfx: 'type' }, t3: { k: 3, off: 0.4, dur: 2.4, sfx: 'type' },
    idl: { k: 3, off: 3.6, sfx: 'pop' }, ph: { k: 3, off: 6.0, sfx: 'pop' },
    n1: { k: 4, off: 0.6, sfx: 'tick' }, n2: { k: 4, off: 3.4, sfx: 'tick' }, nc: { k: 5, off: 0.1, sfx: 'confirm' },
  },
  6: {
    trans: { k: 0, off: 0, sfx: 'trans' }, card: { k: 0, off: 0.8, sfx: 'pop' },
    pT: { k: 0, off: 2.2, sfx: 'click' }, pF: { k: 0, off: 3.6, sfx: 'click' },
    q1: { k: 1, off: 0.4, sfx: 'pop' }, q2: { k: 2, off: 0.1, sfx: 'pop' },
    t1: { k: 3, off: 0.2, dur: 2.0, sfx: 'type' }, t2: { k: 3, off: 2.4, dur: 2.5, sfx: 'type' },
    cap: { k: 4, off: 0.3, sfx: 'tick' }, cmp1: { k: 5, off: 0.4, sfx: 'pop' }, cmp2: { k: 5, off: 2.6, sfx: 'pop' },
    end: { k: 6, off: 0.3 },
  },
  7: {
    trans: { k: 0, off: 0, sfx: 'trans' }, t0: { k: 0, off: 0.1, dur: 2.5, sfx: 'type' },
    t1: { k: 1, off: 0.6, dur: 2.6, sfx: 'type' },
    run1: { k: 2, off: 0.1, sfx: 'click' }, out1: { k: 2, off: 1.0, sfx: 'confirm' },
    t2: { k: 3, off: 0.2, dur: 2.4, sfx: 'type' },
    run2: { k: 3, off: 2.9, sfx: 'click' }, out2: { k: 3, off: 3.6, sfx: 'confirm' },
    r2: { k: 3, off: 4.0, sfx: 'pop' }, r3: { k: 3, off: 4.8, sfx: 'pop' }, r4: { k: 3, off: 5.6, sfx: 'pop' },
    use: { k: 4, off: 0.3 }, keep: { k: 5, off: 0.3, sfx: 'confirm' },
  },
  8: {
    trans: { k: 0, off: 0, sfx: 'trans' }, map: { k: 0, off: 0.6, sfx: 'pop' },
    t1: { k: 1, off: 0.5, dur: 1.1, sfx: 'type' }, ex: { k: 1, off: 2.2, sfx: 'pop' },
    t2: { k: 2, off: 0.0, dur: 3.8, sfx: 'type' },
    t3: { k: 3, off: 0.1, dur: 2.5, sfx: 'type' }, run: { k: 3, off: 3.0, sfx: 'click' }, out: { k: 3, off: 4.0, sfx: 'confirm' },
    sw: { k: 4, off: 0.0, sfx: 'trans' }, t4: { k: 4, off: 0.15, dur: 1.6, sfx: 'type' },
    run2: { k: 5, off: 0.2, sfx: 'click' }, err: { k: 5, off: 1.1, sfx: 'error' }, ve: { k: 5, off: 2.8, sfx: 'tick' },
  },
  9: {
    trans: { k: 0, off: 0, sfx: 'trans' }, rd: { k: 1, off: 0.3, sfx: 'pop' },
    t1: { k: 2, off: 0.1, dur: 1.1, sfx: 'type' }, t2: { k: 2, off: 1.4, dur: 1.2, sfx: 'type' },
    run: { k: 2, off: 2.7, sfx: 'click' }, out: { k: 3, off: 0.4, sfx: 'confirm' },
    ax1: { k: 3, off: 0.8, sfx: 'pop' }, x26: { k: 3, off: 2.8, sfx: 'error' },
    ax2: { k: 4, off: 0.3, sfx: 'pop' }, x6: { k: 4, off: 2.4, sfx: 'error' }, warn: { k: 5, off: 0.4, sfx: 'confirm' },
  },
  10: {
    trans: { k: 0, off: 0, sfx: 'trans' }, t1: { k: 1, off: 0.1, dur: 4.2, sfx: 'type' },
    b1: { k: 1, off: 1.5, sfx: 'pop' }, b2: { k: 1, off: 2.5, sfx: 'pop' }, b3: { k: 1, off: 3.6, sfx: 'pop' }, b4: { k: 1, off: 4.8, sfx: 'pop' },
    t2: { k: 2, off: 0.1, dur: 3.5, sfx: 'type' }, run: { k: 2, off: 3.8, sfx: 'click' }, out: { k: 2, off: 4.6, sfx: 'confirm' },
    s1: { k: 3, off: 0.0, sfx: 'pop' }, s2: { k: 4, off: 0.2, sfx: 'pop' }, s3: { k: 4, off: 1.8, sfx: 'pop' },
    next: { k: 5, off: 0.4, sfx: 'ding' }, sheet: { k: 6, off: 0.2, sfx: 'pop' },
  },
} as const;

export type SceneId = keyof typeof EV;
export const SCENE_TIMING = timing.scenes;
export const sceneStart = (id: number) => SCENE_TIMING[id - 1].start;
export const sceneEnd = (id: number) => SCENE_TIMING[id - 1].end;

/** local seconds (relative to scene start) of an event */
export const ev = (id: SceneId, name: string) => {
  const e = (EV[id] as unknown as Record<string, Ev>)[name];
  if (!e) throw new Error(`unknown event ${id}.${name}`);
  const sc = SCENE_TIMING[id - 1];
  const abs = sc.sentenceStarts[e.k] + e.off;
  return { t: abs - sc.start, dur: e.dur ?? 0, abs };
};
/** local seconds of sentence k start */
export const sent = (id: number, k: number, off = 0) => {
  const sc = SCENE_TIMING[id - 1];
  return sc.sentenceStarts[k] - sc.start + off;
};

export const allSfx = () => {
  const out: { abs: number; kind: SfxKind; dur: number; id: string }[] = [];
  (Object.keys(EV) as unknown as SceneId[]).forEach((sid) => {
    const m = EV[sid] as unknown as Record<string, Ev>;
    Object.keys(m).forEach((name) => {
      const e = m[name];
      if (e.sfx) out.push({ abs: SCENE_TIMING[Number(sid) - 1].sentenceStarts[e.k] + e.off, kind: e.sfx, dur: e.dur ?? 0, id: `${sid}.${name}` });
    });
  });
  return out.sort((a, b) => a.abs - b.abs);
};
