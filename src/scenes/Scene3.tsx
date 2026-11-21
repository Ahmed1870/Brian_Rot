import React from 'react';
import {useT, cursorAt, WP, clickTimes, ramp} from '../lib/anim';
import {Shell, Slicer, ReportCard, ListTable, slItem} from '../lib/PBI';
import {DaxCode} from '../lib/Dax';
import {Annot, Cursor} from '../lib/ui';
import {visible, visibleProducts, DAX} from '../lib/data41';
import {a, BOUNDS} from '../sync';
import {COL} from '../theme';
import {ctxAt, SelEv, Sfx} from '../lib/scene41';

const EV: SelEv[] = [{t: 95.0, cats: ['Hardware']}, {t: 104.5, cats: ['Accessories']}, {t: 112.0, cats: []}];
export const WP3: WP[] = [
  {t: BOUNDS[2], x: 1000, y: 600},
  {t: 95.0, ...slItem('cat', 0), click: true},
  {t: 104.5, ...slItem('cat', 1), click: true},
  {t: 112.0, ...slItem('cat', 1), click: true},
  {t: 116.0, x: 1000, y: 650},
];
export const S3_SFX: Sfx[] = clickTimes(WP3).map((t): Sfx => ({t, n: 'click'}));

export const Scene3: React.FC = () => {
  const T = useT();
  const cur = cursorAt(WP3, T);
  const ctx = ctxAt(EV, T);
  const vis = visible(ctx).map((p) => p.name);
  const o = ramp(T, a(3, 0), 0.5) * (1 - ramp(T, BOUNDS[3] - 0.5, 0.4));
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Shell T={T} cur={cur} tab="Modeling" extras={[{name: 'Visible Products', at: -1, kind: 'measure'}]}>
        <Slicer k="cat" sel={ctx.cats} cur={cur} o={o} />
        <ReportCard x={450} y={250} label="Visible Products" value={String(visibleProducts(ctx))} badge="Whole number" o={o} hl />
        <div style={{position: 'absolute', left: 450, top: 430, width: 340, opacity: o, border: `2px solid ${COL.line}`, padding: '10px 14px', overflow: 'hidden', boxSizing: 'border-box'}}><DaxCode code={DAX.visible} size={17} /></div>
        <ListTable x={830} y={250} w={700} head="VALUES ( Products[Product] )" foot="النتيجة في السياق الحالي (توضيح لما ترجعه الدالة، وليس Visual فعلي)" rows={vis} o={o} rowH={46} />
        <Annot T={T} a={a(3, 2)} b={a(3, 3, -0.2)} text="القائمة بتقتصر على المنتجات المتاحة داخل الفلتر الحالي" />
        <Annot T={T} a={a(3, 3)} b={a(3, 4)} text="{{VALUES}} و{{DISTINCT}} مش بيتجاهلوا الفلاتر" />
        <Annot T={T} a={a(3, 4)} b={BOUNDS[3]} text="بيرجعوا القيم الفريدة من البيانات المتاحة في السياق الحالي" />
      </Shell>
      <Cursor c={cur} />
    </div>
  );
};
