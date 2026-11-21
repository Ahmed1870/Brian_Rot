import React from 'react';
import {useT, cursorAt, WP, clickTimes, ramp, win} from '../lib/anim';
import {Shell, Slicer, ReportCard, slItem, RBP, TABR, center} from '../lib/PBI';
import {DaxBox} from '../lib/Dax';
import {Annot, Cursor, Card, AR} from '../lib/ui';
import {DAX, selectedProduct, hasOne} from '../lib/data41';
import {a, BOUNDS} from '../sync';
import {COL, FONT_AR} from '../theme';
import {ctxAt, SelEv, Sfx} from '../lib/scene41';

const EV: SelEv[] = [{t: 148.0, prods: ['Laptop']}, {t: 153.5, prods: []}, {t: 159.0, prods: ['Laptop']}, {t: 160.2, prods: ['Laptop', 'Mouse']}];
const T_TAB = 126.0;
const T_NEW = 127.0;
const T_MEAS = 141.0;
export const WP4: WP[] = [
  {t: BOUNDS[3], x: 1000, y: 600},
  {t: T_TAB, ...center(TABR.Modeling), click: true},
  {t: T_NEW, ...center(RBP.newMeasure), click: true},
  {t: 143.5, x: 900, y: 600},
  {t: 148.0, ...slItem('prod', 0), click: true},
  {t: 153.5, ...slItem('prod', 0), click: true},
  {t: 159.0, ...slItem('prod', 0), click: true},
  {t: 160.2, ...slItem('prod', 1), click: true},
  {t: 163.0, x: 1000, y: 700},
];
export const S4_SFX: Sfx[] = [...clickTimes(WP4).map((t): Sfx => ({t, n: 'click'})), {t: 129, n: 'type'}, {t: 133, n: 'type'}, {t: 137, n: 'type'}, {t: 175, n: 'type'}, {t: 178, n: 'type'}];

const Chip: React.FC<{t: string; o: number}> = ({t, o}) => (
  <div style={{opacity: o, fontSize: 26, padding: '10px 22px', border: `2px solid ${COL.blue}`, background: COL.blueSoft, color: COL.ink, fontWeight: 600}}>{t}</div>
);

export const Scene4: React.FC = () => {
  const T = useT();
  const cur = cursorAt(WP4, T);
  const ctx = ctxAt(EV, T);
  const alt = !hasOne(ctx);
  const showReport = T >= 143.5 && T < a(4, 6, -0.2);
  const oR = ramp(T, 143.5, 0.4);
  const extras = [{name: 'Selected Product', at: T_MEAS, kind: 'measure' as const}, {name: 'Dynamic Title', at: a(4, 6) + 8, kind: 'measure' as const}];
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Shell T={T} cur={cur} tab={T >= T_TAB ? 'Modeling' : 'Home'} extras={extras}>
        <DaxBox T={T} x={450} y={250} w={1060} code={DAX.selected} t0={127.8} t1={140.0} hideAt={143.4} />
        {showReport ? (
          <>
            <Slicer k="prod" sel={ctx.prods} cur={cur} o={oR} />
            <ReportCard x={450} y={250} w={420} label="Selected Product" value={selectedProduct(ctx)} badge="Text" o={oR} hl size={36} color={alt ? COL.amber : COL.green} />
            <Card x={900} y={250} w={610} h={150} o={ramp(T, a(4, 5), 0.4)} border={COL.amber}>
              <div style={{...AR, padding: '16px 24px', fontSize: 30, color: COL.ink, lineHeight: 1.5}}>بدون نتيجة بديلة: القيمة الافتراضية {'{'}Blank{'}'}</div>
            </Card>
          </>
        ) : null}
        {T >= a(4, 6) ? (
          <>
            <DaxBox T={T} x={450} y={250} w={1060} code={DAX.title} t0={a(4, 6, 0.3)} t1={a(4, 6, 6.5)} />
            <div style={{position: 'absolute', left: 450, top: 640, display: 'flex', gap: 18, alignItems: 'center', direction: 'ltr', fontFamily: FONT_AR}}>
              <Chip t="Format visual" o={ramp(T, a(4, 6, 7.2), 0.3)} /><span style={{opacity: ramp(T, a(4, 6, 7.8), 0.3)}}>›</span>
              <Chip t="Title" o={ramp(T, a(4, 6, 7.8), 0.3)} /><span style={{opacity: ramp(T, a(4, 6, 8.4), 0.3)}}>›</span>
              <Chip t="fx" o={ramp(T, a(4, 6, 8.4), 0.3)} /><span style={{opacity: ramp(T, a(4, 6, 9.0), 0.3)}}>›</span>
              <Chip t="Dynamic Title" o={ramp(T, a(4, 6, 9.0), 0.3)} />
            </div>
          </>
        ) : null}
        <Annot T={T} a={a(4, 1)} b={a(4, 3, -0.2)} text="{{SELECTEDVALUE}} بترجع قيمة واحدة، بشرط قيمة فريدة واحدة في السياق" />
        <Annot T={T} a={a(4, 4)} b={a(4, 5)} text="لو مفيش اختيار أو أكتر من منتج: النتيجة البديلة {{No Single Selection}}" />
        <Annot T={T} a={a(4, 6)} b={BOUNDS[4]} text="مفيدة في العناوين الديناميكية ورسائل التقرير" />
      </Shell>
      <Cursor c={cur} />
    </div>
  );
};
