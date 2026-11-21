import {useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {A, SCENES} from '../cues';
import type {Cues} from '../cues';
import type {Pt} from '../lib/anim';
import {pop} from '../lib/anim';
import {Desk} from '../lib/desk';
import {Slicer, slicerItemC, TableVis, CodeBlock} from '../lib/rep';
import {Callout, Cursor, Ltr, Code} from '../lib/ui';
import {PRODUCTS, NOFILTER, visible, rowCtx, total, denomAll, fmt, pct, nameOf} from '../lib/calc';
import type {Ctx} from '../lib/calc';

const T = {job: A('a3_job'), col: A('a3_col'), tbl: A('a3_tbl'), use: A('a3_useful')};
const S0 = SCENES[2].from;
const cLap = T.col + 40;
export const CUES3: Cues = {click: [cLap], pop: [S0 + 8, T.job, T.col, T.tbl, T.use, T.use + 20], key: []};
const CODE = 'Sales % All Products =\nDIVIDE (\n    [Total Sales],\n    CALCULATE (\n        [Total Sales],\n        ALL ( Products[Product] )\n    )\n)';
const SL = {x: 110, y: 260, w: 250};
const lap = slicerItemC(SL.x, SL.y, 0);
const PTS: Pt[] = [[S0, 1000, 700], [cLap - 18, lap.x, lap.y], [cLap + 6, lap.x, lap.y], [cLap + 70, 700, 820]];

const Box = ({fr, at, x, color, title, den, res}: {fr: number; at: number; x: number; color: string; title: string; den: string; res: string}) => {
  const p = pop(fr, at, 12);
  if (p < 0.01) return null;
  return (
    <div style={{position: 'absolute', left: x, top: 660 + (1 - p) * 14, width: 440, opacity: p, background: C.white, border: '3px solid ' + color, padding: '12px 18px', boxSizing: 'border-box', direction: 'rtl', textAlign: 'right', fontFamily: FONT}}>
      <div style={{fontSize: 30, fontWeight: 700, color}}>{title}</div>
      <div style={{fontSize: 26, color: C.gray, marginTop: 4}}>{den}</div>
      <div style={{fontSize: 50, fontWeight: 700, color: C.ink, direction: 'ltr', textAlign: 'left'}}>{res}</div>
    </div>
  );
};

export const Scene3 = ({from}: {from: number}) => {
  const fr = useCurrentFrame() + from;
  const selLap = fr >= cLap;
  const ctx: Ctx = {prods: selLap ? [1] : null, cats: null};
  const ids = visible(ctx);
  const rows = ids.map((id) => {
    const rc = rowCtx(ctx, id, false);
    return [nameOf(id), fmt(total(rc)), pct(total(rc), denomAll(rc))];
  });
  rows.push(['Total', fmt(total(ctx)), pct(total(ctx), denomAll(ctx))]);
  const hiLines = fr >= T.col ? [5] : [];
  const lapTotal = total({prods: [1], cats: null});
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, background: C.white}}>
      <Desk view="report" tab="Home" selTable="Products" showPS={false} measures={['Total Sales', 'Sales % All Products']}>
        <div style={{position: 'absolute', left: 90, top: 230, width: 1470, height: 790, background: C.white, border: '1px solid #D2D0CE'}} />
        <Slicer x={SL.x} y={SL.y} w={SL.w} title="Product" items={PRODUCTS.map((p) => p.name)} sel={PRODUCTS.map((p) => selLap && p.id === 1)} />
        <TableVis x={390} y={260} cols={[{h: 'Product', w: 170}, {h: 'Sales', w: 150, num: true}, {h: 'Sales % All Products', w: 290, num: true}]} rows={rows} boldLast hiRows={selLap ? [0] : []} />
        <CodeBlock x={1010} y={260} w={540} text={CODE} size={22} hi={hiLines} tok={fr >= T.col ? {line: 5, text: '[Product]', color: '#FCA5A5'} : undefined} op={pop(fr, T.job, 12)} />
        <Callout fr={fr} at={S0 + 8} out={T.job} x={1010} y={620} w={540} color={C.purple} title={<span>الدالة <Ltr>ALL</Ltr></span>} />
        <Callout fr={fr} at={T.job} out={T.col} x={1010} y={620} w={540} color={C.purple} title="نتجاهل فلاتر معينة" />
        <Callout fr={fr} at={T.col} out={T.tbl} x={1010} y={620} w={540} color={C.purple} title={<span><Ltr>ALL</Ltr> على عمود <Ltr>Product</Ltr></span>} body="فلتر المنتج ما بيأثرش على المقام" />
        <Callout fr={fr} at={T.tbl} out={T.use} x={1010} y={620} w={540} color={C.blue} title="وعلى جدول كامل" body={<span><Code size={22}>ALL ( Products )</Code> بتزيل الفلاتر عن أعمدته</span>} />
        <Box fr={fr} at={T.use} x={110} color={C.red} title="من غير ALL" den={'المقام = إجمالي المنتج المحدد ' + fmt(lapTotal)} res={pct(lapTotal, lapTotal)} />
        <Box fr={fr} at={T.use + 20} x={570} color={C.green} title="مع ALL" den={'المقام = إجمالي كل المنتجات ' + fmt(denomAll(ctx))} res={pct(lapTotal, denomAll(ctx))} />
        <Cursor fr={fr} pts={PTS} clicks={CUES3.click} />
      </Desk>
    </div>
  );
};
