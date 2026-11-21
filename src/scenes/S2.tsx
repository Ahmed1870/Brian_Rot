import {useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {A, SCENES} from '../cues';
import type {Cues} from '../cues';
import {pop} from '../lib/anim';
import {Callout, Ltr} from '../lib/ui';
import {MiniTable, BG} from '../lib/pres';
import {CodeBlock} from '../lib/rep';
import {SALES, fmt, above} from '../lib/calc';

const T = {in: A('a2_in'), scan: A('a2_scan'), ret: A('a2_ret'), ex: A('a2_ex'), cond: A('a2_cond'), calc: A('a2_calc'), note: A('a2_note')};
const S0 = SCENES[1].from;
export const CUES2: Cues = {click: [], pop: [S0 + 8, T.in, T.ret, T.cond, T.cond + 30, T.calc, T.note], key: []};

const CODE = 'Sales Above 2000 =\nCALCULATE (\n    [Total Sales],\n    FILTER (\n        Sales,\n        Sales[Line Amount] > 2000\n    )\n)';
const COLS = [{h: 'OrderID', w: 150}, {h: 'ProductID', w: 170, num: true}, {h: 'Line Amount', w: 230, num: true}];
const TX = 100;
const TY = 230;

export const Scene2 = ({from}: {from: number}) => {
  const fr = useCurrentFrame() + from;
  const rows = SALES.map((s) => [String(s.order), String(s.pid), fmt(s.amt)]);
  // scanning: one row every 16 frames starting at a2_scan
  const scanRow = fr >= T.scan && fr < T.ret ? Math.min(3, Math.floor((fr - T.scan) / 16)) : -1;
  const matched = SALES.map((s) => s.amt > 2000);
  const showCond = fr >= T.cond;
  const hiRows = showCond ? matched.map((m, i) => (m ? i : -1)).filter((i) => i >= 0) : scanRow >= 0 ? [scanRow] : [];
  let hiLines: number[] = [];
  if (fr >= T.in) hiLines = [3, 4];
  if (fr >= T.ex) hiLines = [0, 1, 2];
  if (fr >= T.cond) hiLines = [5];
  if (fr >= T.calc) hiLines = [1, 3];
  const resRows = rows.filter((_, i) => matched[i]);
  const resOp = pop(fr, T.cond + 30, 14);
  const calcP = pop(fr, T.calc, 12);
  const sum = above(2000);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, background: BG, fontFamily: FONT}}>
      <MiniTable x={TX} y={TY} title="Sales" cols={COLS} rows={rows} hi={hiRows} hiColor={showCond ? '#BBF7D0' : '#FDE68A'} op={pop(fr, S0 + 6, 12)} />
      {showCond
        ? SALES.map((s, i) => (
            <div key={i} style={{position: 'absolute', left: TX + 575, top: TY + 44 + 64 + i * 64 + 8, fontSize: 40, fontWeight: 700, color: matched[i] ? '#4ADE80' : '#F87171', opacity: pop(fr, T.cond + i * 6, 8)}}>{matched[i] ? '✓' : '✗'}</div>
          ))
        : null}
      <div style={{position: 'absolute', left: TX, top: 640, width: 550, textAlign: 'center', direction: 'rtl', fontSize: 34, fontWeight: 700, color: C.yellow, opacity: pop(fr, T.ret, 12)}}>الجدول اللي <Ltr>FILTER</Ltr> بترجعه</div>
      <div style={{position: 'absolute', left: TX, top: 700, width: 550, height: 200, border: '3px dashed #64748B', opacity: pop(fr, T.ret, 12) * (1 - resOp)}} />
      {resOp > 0.01 ? <MiniTable x={TX} y={690} title="" cols={COLS} rows={resRows} hi={[]} op={resOp} /> : null}
      <CodeBlock x={720} y={230} w={1100} text={CODE} size={34} hi={hiLines} dark op={pop(fr, T.in - 20, 12)} />
      <div style={{position: 'absolute', left: 720, top: 640 + (1 - calcP) * 14, width: 1100, opacity: calcP, background: 'rgba(255,255,255,0.1)', border: '3px solid ' + C.yellow, padding: '16px 24px', boxSizing: 'border-box', direction: 'ltr', textAlign: 'center', color: C.white, fontSize: 44, fontWeight: 700}}>
        Sales Above 2000 = {SALES.filter((x) => x.amt > 2000).map((x) => fmt(x.amt)).join(' + ')} = <span style={{color: C.yellow}}>{fmt(sum)}</span>
      </div>
      <Callout fr={fr} at={T.note} x={720} y={820} w={1100} color={C.red} title={<span><Ltr>FILTER</Ltr> بترجع جدول، مش رقم إجمالي المبيعات مباشرة</span>} dark />
    </div>
  );
};
