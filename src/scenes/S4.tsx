import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {A, SCENES} from '../cues';
import type {Cues} from '../cues';
import type {Pt} from '../lib/anim';
import {pop} from '../lib/anim';
import {Desk} from '../lib/desk';
import {Slicer, slicerItemC, CardVis, CodeBlock} from '../lib/rep';
import {Callout, Cursor, Ltr} from '../lib/ui';
import {PRODUCTS, total, denomAll, fmt} from '../lib/calc';
import type {Ctx} from '../lib/calc';

const T = {job: A('a4_job'), ex: A('a4_ex'), use: A('a4_use'), diff: A('a4_diff')};
const S0 = SCENES[3].from;
const cLap = T.use + 30;
const cMouse = T.use + 120;
export const CUES4: Cues = {click: [cLap, cMouse], pop: [S0 + 8, T.job, T.ex, T.use, T.diff], key: []};
const CODE = 'Sales All Products =\nCALCULATE (\n    [Total Sales],\n    REMOVEFILTERS ( Products[Product] )\n)';
const SL = {x: 110, y: 260, w: 250};
const lap = slicerItemC(SL.x, SL.y, 0);
const mouse = slicerItemC(SL.x, SL.y, 1);
const PTS: Pt[] = [
  [S0, 1000, 700], [T.ex + 10, 1000, 700], [cLap - 20, lap.x, lap.y], [cLap + 6, lap.x, lap.y],
  [cMouse - 20, mouse.x, mouse.y], [cMouse + 6, mouse.x, mouse.y], [cMouse + 70, 700, 860],
];

export const Scene4 = ({from}: {from: number}) => {
  const fr = useCurrentFrame() + from;
  const sel = fr >= cMouse ? 1 : fr >= cLap ? 0 : -1;
  const ctx: Ctx = {prods: sel >= 0 ? [PRODUCTS[sel].id] : null, cats: null};
  const flash = (fr >= cLap && fr < cLap + 24) || (fr >= cMouse && fr < cMouse + 24);
  const vis = pop(fr, T.ex, 12);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, background: C.white}}>
      <Desk view="report" tab="Home" selTable="Products" showPS={false} measures={['Total Sales', 'Sales All Products']}>
        <div style={{position: 'absolute', left: 90, top: 230, width: 1470, height: 790, background: C.white, border: '1px solid #D2D0CE'}} />
        <Slicer x={SL.x} y={SL.y} w={SL.w} title="Product" items={PRODUCTS.map((p) => p.name)} sel={PRODUCTS.map((_, i) => i === sel)} op={vis} />
        <CardVis x={400} y={260} w={420} h={200} label="Total Sales" value={fmt(total(ctx))} color={flash ? C.blue : '#C8C6C4'} op={vis} />
        <CardVis x={400} y={490} w={420} h={200} label="Sales All Products" value={fmt(denomAll(ctx))} color={C.green} op={vis} note="ثابت" />
        <CodeBlock x={860} y={260} w={700} text={CODE} size={26} hi={fr >= T.use ? [3] : []} tok={fr >= T.use ? {line: 3, text: '[Product]', color: '#FCA5A5'} : undefined} op={pop(fr, T.job, 12)} />
        <Callout fr={fr} at={S0 + 8} out={T.job} x={860} y={520} w={700} color={C.orange} title={<span>الدالة <Ltr>REMOVEFILTERS</Ltr></span>} />
        <Callout fr={fr} at={T.job} out={T.ex} x={860} y={520} w={700} color={C.orange} title="إزالة الفلاتر عن جدول أو عمود محدد" body="لما يكون هدفنا إزالة الفلتر فقط" />
        <Callout fr={fr} at={T.ex} out={T.diff} x={860} y={520} w={700} color={C.blue} title={<span><Ltr>Slicer</Ltr> للمنتج</span>} body="إجمالي المبيعات لكل المنتجات مهما كان الاختيار" />
        <Callout fr={fr} at={T.diff} x={860} y={520} w={700} color={C.red} title={<span><Ltr>REMOVEFILTERS</Ltr> هدفها إزالة الفلاتر</span>} body="لكنها مش بترجع جدول نقدر نستخدمه كقيمة جدولية في تعبيرات تانية" />
        <Cursor fr={fr} pts={PTS} clicks={CUES4.click} />
      </Desk>
    </div>
  );
};
