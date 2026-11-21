import React from 'react';
import {useT, cursorAt, WP, clickTimes, ramp} from '../lib/anim';
import {Shell, Slicer, ReportCard, BarChart, slItem} from '../lib/PBI';
import {Annot, Cursor} from '../lib/ui';
import {visible, visibleProducts, selectedProduct, status, dynTitle, amountOf, hasOne} from '../lib/data41';
import {a, BOUNDS} from '../sync';
import {COL} from '../theme';
import {ctxAt, SelEv, Sfx} from '../lib/scene41';

const EV: SelEv[] = [{t: 249.5, prods: ['Laptop']}, {t: 256.3, prods: []}, {t: 259.0, prods: ['Laptop']}, {t: 259.8, prods: ['Laptop', 'Mouse']}, {t: 261.0, prods: ['Mouse']}, {t: 261.6, prods: []}, {t: 262.4, cats: ['Hardware']}];
export const WP6: WP[] = [
  {t: BOUNDS[5], x: 1000, y: 700},
  {t: 249.5, ...slItem('prod', 0), click: true},
  {t: 256.3, ...slItem('prod', 0), click: true},
  {t: 259.0, ...slItem('prod', 0), click: true},
  {t: 259.8, ...slItem('prod', 1), click: true},
  {t: 261.0, ...slItem('prod', 0), click: true},
  {t: 261.6, ...slItem('prod', 1), click: true},
  {t: 262.4, ...slItem('cat', 0), click: true},
  {t: 264.4, x: 1000, y: 700},
];
export const S6_SFX: Sfx[] = clickTimes(WP6).map((t): Sfx => ({t, n: 'click'}));
const ALL = [{name: 'Visible Products', at: -1, kind: 'measure' as const}, {name: 'Selected Product', at: -1, kind: 'measure' as const}, {name: 'Product Selection Status', at: -1, kind: 'measure' as const}, {name: 'Dynamic Title', at: -1, kind: 'measure' as const}];

export const Scene6: React.FC = () => {
  const T = useT();
  const cur = cursorAt(WP6, T);
  const ctx = ctxAt(EV, T);
  const names = visible(ctx).map((p) => p.name);
  const one = hasOne(ctx);
  const hl1 = T >= a(6, 1) && T < a(6, 2);
  const hl2 = T >= a(6, 2) && T < a(6, 3);
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Shell T={T} cur={cur} tab="Modeling" extras={ALL}>
        <Slicer k="cat" sel={ctx.cats} cur={cur} />
        <Slicer k="prod" sel={ctx.prods} cur={cur} />
        <ReportCard x={450} y={250} label="Selected Product" value={selectedProduct(ctx)} badge="Text" hl={hl1} size={30} color={one ? COL.green : COL.amber} />
        <ReportCard x={810} y={250} label="Product Selection Status" value={status(ctx)} badge="Text" hl={hl2} size={30} color={one ? COL.green : COL.amber} />
        <ReportCard x={1170} y={250} w={340} label="Visible Products" value={String(visibleProducts(ctx))} badge="Whole number" />
        <BarChart x={450} y={430} w={1060} h={340} title={dynTitle(ctx)} names={names} amt={amountOf} />
        <Annot T={T} a={a(6, 1)} b={a(6, 2)} text="{{Selected Product}} بتعتمد على {{SELECTEDVALUE}}" />
        <Annot T={T} a={a(6, 2)} b={a(6, 3)} text="{{Product Selection Status}} بتعتمد على {{HASONEVALUE}}" />
        <Annot T={T} a={a(6, 3)} b={a(6, 4)} tone="ok" text="اختيار {{Laptop}}: المنتج {{Laptop}} وحالة {{Single Product}} وعنوان الـ Visual بيتغير" />
        <Annot T={T} a={a(6, 4)} b={BOUNDS[6] + 0.5} text="النتيجة بتتغير حسب السياق، حتى لو جاي من فلتر الفئة" />
      </Shell>
      <Cursor c={cur} />
    </div>
  );
};
