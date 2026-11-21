import {Ctx} from './data41';

export type Sfx = {t: number; n: 'click' | 'pop' | 'swish' | 'whoosh' | 'type'};
export type SelEv = {t: number; cats?: string[]; prods?: string[]};
/** السياق عند الزمن T = آخر حدث تحديد حدث قبله (حتمي) */
export const ctxAt = (evs: SelEv[], T: number): Ctx => {
  const c: Ctx = {cats: [], prods: []};
  for (const e of evs) {
    if (T >= e.t) {
      if (e.cats) c.cats = e.cats;
      if (e.prods) c.prods = e.prods;
    }
  }
  return c;
};
