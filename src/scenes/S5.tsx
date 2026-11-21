import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {A, SCENES} from '../cues';
import type {Cues} from '../cues';
import type {Pt} from '../lib/anim';
import {pop} from '../lib/anim';
import {Desk} from '../lib/desk';
import {Slicer, slicerItemC, TableVis, CodeBlock, Pill} from '../lib/rep';
import {Callout, Cursor, Ltr} from '../lib/ui';
import {NOFILTER, visible, rowCtx, total, denomCat, fmt, pct, nameOf, catOf} from '../lib/calc';
import type {Ctx} from '../lib/calc';

const T = {how: A('a5_how'), ex: A('a5_ex'), keep: A('a5_keep'), lap: A('a5_lap'), mouse: A('a5_mouse')};
const S0 = SCENES[4].from;
const cHw = T.mouse + 100;
export const CUES5: Cues = {click: [cHw], pop: [S0 + 8, T.how, T.ex, T.keep, T.lap, T.mouse], key: []};
const CODE = 'Sales % Category =\nDIVIDE (\n    [Total Sales],\n    CALCULATE (\n        [Total Sales],\n        ALLEXCEPT (\n            Products,\n            Products[Category]\n        )\n    )\n)';
const SL = {x: 110, y: 260, w: 250};
const hw = slicerItemC(SL.x, SL.y, 0);
const PTS: Pt[] = [[S0, 1000, 760], [cHw - 40, 1000, 760], [cHw - 18, hw.x, hw.y], [cHw + 6, hw.x, hw.y], [cHw + 70, 700, 860]];
const ORDER = [1, 4, 2, 3]; // Laptop, Monitor, Mouse, Keyboard

export const Scene5 = ({from}: {from: number}) => {
  const fr = useCurrentFrame() + from;
  const hardware = fr >= cHw;
  const ctx: Ctx = {prods: null, cats: hardware ? ['Hardware'] : null};
  const ids = ORDER.filter((id) => visible(ctx).includes(id));
  const rows = ids.map((id) => {
    const rc = rowCtx(ctx, id, true);
    return [nameOf(id), catOf(id), fmt(total(rc)), pct(total(rc), denomCat(rc))];
  });
  const hiRows: number[] = [];
  ids.forEach((id, i) => {
    if (id === 1 && fr >= T.lap && fr < T.mouse) hiRows.push(i);
    if (id === 2 && fr >= T.mouse && fr < cHw) hiRows.push(i);
  });
  const keep = fr >= T.keep;
  const tblOp = pop(fr, T.ex, 12);
  const hwTot = total({prods: null, cats: ['Hardware']});
  const acTot = total({prods: null, cats: ['Accessories']});
  const lapShare = pct(total({prods: [1], cats: null}), hwTot);
  const mouseShare = pct(total({prods: [2], cats: null}), acTot);
  const boxOp = pop(fr, T.lap, 12);
  const box = (x: number, label: string, v: number, on: boolean, dim: boolean) => (
    <div style={{position: 'absolute', left: x, top: 640, width: 300, height: 100, opacity: boxOp * (dim ? 0.35 : 1), background: C.white, border: '3px solid ' + (on ? C.green : '#C8C6C4'), textAlign: 'center', direction: 'ltr', boxSizing: 'border-box'}}>
      <div style={{fontSize: 40, fontWeight: 700, color: C.ink, marginTop: 8}}>{fmt(v)}</div>
      <div style={{fontSize: 22, color: C.gray}}>{label}</div>
    </div>
  );
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, background: C.white}}>
      <Desk view="report" tab="Home" selTable="Products" showPS={false} measures={['Total Sales', 'Sales % Category']}>
        <div style={{position: 'absolute', left: 90, top: 230, width: 1470, height: 790, background: C.white, border: '1px solid #D2D0CE'}} />
        <Slicer x={SL.x} y={SL.y} w={SL.w} title="Category" items={['Hardware', 'Accessories']} sel={[hardware, false]} op={tblOp} />
        <TableVis x={390} y={260} cols={[{h: 'Product', w: 150, color: keep ? '#FEE2E2' : undefined}, {h: 'Category', w: 170, color: keep ? '#DCFCE7' : undefined}, {h: 'Sales', w: 120, num: true}, {h: '% Category', w: 190, num: true}]} rows={rows} hiRows={hiRows} op={tblOp} />
        {box(390, 'Hardware', hwTot, fr >= T.lap && fr < T.mouse, hardware ? false : false)}
        {box(710, 'Accessories', acTot, fr >= T.mouse && fr < cHw, hardware)}
        <Pill fr={fr} at={T.keep} x={390} y={780} w={320} color={C.green} size={26}>فلتر <Ltr>Category</Ltr> محفوظ</Pill>
        <Pill fr={fr} at={T.keep} x={730} y={780} w={320} color={C.red} size={26}>فلتر <Ltr>Product</Ltr> اتشال</Pill>
        <CodeBlock x={1060} y={260} w={500} text={CODE} size={22} hi={fr >= T.keep ? [7] : fr >= T.how ? [5, 6, 7] : []} tok={fr >= T.keep ? {line: 7, text: '[Category]', color: '#86EFAC'} : undefined} op={pop(fr, T.how, 12)} />
        <Callout fr={fr} at={S0 + 8} out={T.how} x={1060} y={640} w={500} color={C.green} title={<span><Ltr>ALLEXCEPT</Ltr> بتعمل العكس بشكل انتقائي</span>} titleSize={30} />
        <Callout fr={fr} at={T.how} out={T.ex} x={1060} y={640} w={500} color={C.green} title="جدول، وبعده الأعمدة اللي نحافظ على فلاترها" body="وبتزيل الفلاتر عن باقي أعمدة الجدول" titleSize={28} bodySize={24} />
        <Callout fr={fr} at={T.ex} out={T.keep} x={1060} y={640} w={500} color={C.blue} title="نسبة مبيعات كل منتج من إجمالي فئته" titleSize={28} />
        <Callout fr={fr} at={T.keep} out={T.lap} x={1060} y={640} w={500} color={C.green} title={<span>نحافظ على فلتر <Ltr>Category</Ltr> ونزيل فلتر <Ltr>Product</Ltr></span>} titleSize={28} />
        <Callout fr={fr} at={T.lap} out={T.mouse} x={1060} y={640} w={500} color={C.green} title={<span><Ltr>Laptop</Ltr> ÷ إجمالي <Ltr>Hardware</Ltr></span>} body={<span><Ltr>{fmt(total({prods: [1], cats: null}))} ÷ {fmt(hwTot)} = {lapShare}</Ltr></span>} titleSize={28} bodySize={26} />
        <Callout fr={fr} at={T.mouse} out={cHw} x={1060} y={640} w={500} color={C.green} title={<span><Ltr>Mouse</Ltr> ÷ إجمالي <Ltr>Accessories</Ltr></span>} body={<span><Ltr>{fmt(total({prods: [2], cats: null}))} ÷ {fmt(acTot)} = {mouseShare}</Ltr></span>} titleSize={28} bodySize={26} />
        <Callout fr={fr} at={cHw + 20} x={1060} y={640} w={500} color={C.blue} title="فلتر الفئة اتحافظ عليه" body="النسب ثابتة، والفئة التانية اختفت من الجدول" titleSize={28} bodySize={24} />
        <Cursor fr={fr} pts={PTS} clicks={CUES5.click} />
      </Desk>
    </div>
  );
};
