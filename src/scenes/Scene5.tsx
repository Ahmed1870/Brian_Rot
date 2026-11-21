import React from 'react';
import {useT, cursorAt, WP, clickTimes, ramp} from '../lib/anim';
import {Shell, Slicer, ReportCard, slItem, RBP, center} from '../lib/PBI';
import {DaxBox} from '../lib/Dax';
import {Annot, Cursor} from '../lib/ui';
import {DAX, selectedProduct, hasOne, status} from '../lib/data41';
import {a, BOUNDS} from '../sync';
import {COL} from '../theme';
import {ctxAt, SelEv, Sfx} from '../lib/scene41';

const EV: SelEv[] = [{t: 187.9, prods: ['Laptop']}, {t: 207.8, prods: []}, {t: 210.2, prods: ['Laptop']}, {t: 211.2, prods: ['Laptop', 'Mouse']}, {t: 215.5, prods: ['Laptop']}, {t: 223.0, prods: ['Laptop', 'Mouse']}];
export const WP5: WP[] = [
  {t: BOUNDS[4], x: 1000, y: 600},
  {t: 187.9, ...slItem('prod', 0), click: true},
  {t: 192.9, ...center(RBP.newMeasure), click: true},
  {t: 207.8, ...slItem('prod', 0), click: true},
  {t: 210.2, ...slItem('prod', 0), click: true},
  {t: 211.2, ...slItem('prod', 1), click: true},
  {t: 215.5, ...slItem('prod', 1), click: true},
  {t: 223.0, ...slItem('prod', 1), click: true},
  {t: 226.0, x: 1000, y: 700},
];
export const S5_SFX: Sfx[] = [...clickTimes(WP5).map((t): Sfx => ({t, n: 'click'})), {t: 195, n: 'type'}, {t: 199, n: 'type'}];

export const Scene5: React.FC = () => {
  const T = useT();
  const cur = cursorAt(WP5, T);
  const ctx = ctxAt(EV, T);
  const one = hasOne(ctx);
  const o = ramp(T, a(5, 0) - 0.2, 0.4);
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Shell T={T} cur={cur} tab="Modeling" extras={[{name: 'Selected Product', at: -1, kind: 'measure'}, {name: 'Product Selection Status', at: 204.0, kind: 'measure'}]}>
        <Slicer k="prod" sel={ctx.prods} cur={cur} o={o} />
        <ReportCard x={450} y={250} w={330} label="Selected Product" value={selectedProduct(ctx)} badge="Text" o={o} size={30} />
        <ReportCard x={810} y={250} w={330} label="HASONEVALUE ( Products[Product] )" value={one ? 'TRUE' : 'FALSE'} badge="Boolean" o={o} hl color={one ? COL.green : COL.red} />
        <ReportCard x={1170} y={250} w={340} label="Product Selection Status" value={status(ctx)} badge="Text" o={ramp(T, 204.0, 0.4)} size={30} />
        <DaxBox T={T} x={450} y={440} w={1060} code={DAX.status} t0={193.6} t1={203.0} />
        <Annot T={T} a={a(5, 0, 2.0)} b={a(5, 1)} tone="ok" text="{{HASONEVALUE}} مش بترجع اسم المنتج: ناتجها {{True}} أو {{False}}" />
        <Annot T={T} a={a(5, 2)} b={a(5, 3)} tone="ok" text="قيمة فريدة واحدة في السياق: {{True}}" />
        <Annot T={T} a={a(5, 3)} b={a(5, 4)} tone="warn" text="صفر أو أكتر من قيمة فريدة: {{False}}" />
        <Annot T={T} a={a(5, 4)} b={BOUNDS[5] + 0.5} text="نسمح بحساب معين عند وجود اختيار واحد، أو نعرض رسالة مختلفة" />
      </Shell>
      <Cursor c={cur} />
    </div>
  );
};
