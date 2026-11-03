import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {ORDERS, statusColor} from '../data';
import {Caption, Chip, Editor, Mix, Stage, TopBadge, Warn, Win, clamp, pop, prog, sec} from '../kit';

// SC02 (global 40.5-86.5s): CASE WHEN inside SUM, then the COUNT + ELSE 0 trap and its fix.
// Anchors (s): 44.7 nest CASE WHEN in aggregate | 49.3 SUM(CASE...) typed | 55.5 "watch out" | 62.3 COUNT(CASE...) | 64.5 "never ELSE 0"
// 66.0 COUNT counts the zeros -> wrong | 70.6 correct form | 74.0 THEN 1 only | 77.4 engine returns NULL | 80.8 COUNT ignores NULL
const S = START.s2;
const t = (g: number) => sec(g - S);
const DLY = sec(0.24);
const SUM_EVAL = 52.6;
const BAD_EVAL = 66.0;
const FIX_EVAL = 77.4;

const LINES_SUM = ["SUM(CASE WHEN status = 'Completed'", '    THEN total_amount', '    ELSE 0 END)'];
const LINES_BAD = ["COUNT(CASE WHEN status = 'Completed'", '      THEN 1', '      ELSE 0 END)'];
const LINES_FIX = ["COUNT(CASE WHEN status = 'Completed'", '      THEN 1 END)'];

type Cell = {txt: string; color: string; glow: boolean; italic: boolean};
const PENDING: Cell = {txt: '·', color: C.border, glow: false, italic: false};

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const mode: 'sum' | 'bad' | 'fix' = f >= t(74.0) ? 'fix' : f >= t(62.2) ? 'bad' : 'sum';
  const swept = (ts: number, i: number) => f >= t(ts) + i * DLY;

  const cellFor = (status: string, amount: number, i: number): Cell => {
    const comp = status === 'Completed';
    if (mode === 'sum') {
      return swept(SUM_EVAL, i) ? {txt: comp ? String(amount) : '0', color: comp ? C.green : C.muted, glow: comp, italic: false} : PENDING;
    }
    if (mode === 'fix' && swept(FIX_EVAL, i)) {
      return {txt: comp ? '1' : 'NULL', color: comp ? C.green : C.muted, glow: false, italic: !comp};
    }
    return swept(BAD_EVAL, i) || mode === 'fix' ? {txt: comp ? '1' : '0', color: comp ? C.green : C.red, glow: !comp, italic: false} : PENDING;
  };

  // running result
  let resLabel = "SUM(CASE ... ELSE 0)";
  let resVal = '—';
  let resCol: string = C.green;
  if (mode === 'sum') {
    const n = ORDERS.filter((o, i) => swept(SUM_EVAL, i) && o.status === 'Completed').reduce((a, o) => a + o.amount, 0);
    resVal = f >= t(SUM_EVAL) ? String(n) : '—';
  } else if (mode === 'bad') {
    resLabel = 'COUNT(CASE ... ELSE 0)';
    const n = ORDERS.filter((_o, i) => swept(BAD_EVAL, i)).length;
    resVal = f >= t(BAD_EVAL) ? String(n) : '—';
    resCol = C.red;
  } else {
    resLabel = 'COUNT(CASE ... no ELSE)';
    const n = ORDERS.filter((o, i) => (swept(FIX_EVAL, i) ? o.status === 'Completed' : true)).length;
    resVal = String(n);
    resCol = n === 6 ? C.green : C.red;
  }
  const fixedDone = mode === 'fix' && f >= t(80.8);

  const nest = pop(f, t(44.7));
  const inner = prog(f, t(45.2), 22);
  const edOp = f >= t(62.2) ? 0.25 + 0.75 * prog(f, t(62.2), 8) : 1;
  const warn = pop(f, t(65.98));
  const rule = prog(f, t(70.6), 24);
  const shake = f >= t(66.0) && f < t(70.0) ? Math.sin(f * 2.6) * 4 * (1 - prog(f, t(66.0), sec(4))) : 0;

  const lines = mode === 'sum' ? LINES_SUM : mode === 'bad' ? LINES_BAD : LINES_FIX;
  const edStart = mode === 'sum' ? t(49.0) : t(62.4);
  const strike = mode === 'bad' && f >= t(70.6) ? 2 : -1;
  const hl = mode === 'bad' && f >= t(64.4) ? 2 : -1;

  return (
    <Stage dur={1380} inFx="left" outFx="up">
      <TopBadge text="CASE WHEN داخل الدوال التجميعية" from={t(42.6)} to={t(55.5)} color={C.green} />

      {/* aggregate( CASE WHEN ... ) nesting graphic */}
      <div dir="ltr" style={{position: 'absolute', left: 90, top: 185, width: 880, height: 96, display: 'flex', alignItems: 'center', gap: 14, fontFamily: MONO, fontSize: 44, fontWeight: 700, whiteSpace: 'nowrap', opacity: clamp(nest)}}>
        <span style={{color: mode === 'sum' ? C.green : C.text}}>{mode === 'sum' ? 'SUM(' : 'COUNT('}</span>
        <div style={{flexShrink: 0, transform: `translateY(${(1 - inner) * -46}px)`, opacity: inner}}>
          <Chip color={C.blue} style={{fontSize: 30, padding: '8px 24px'}}>CASE WHEN … END</Chip>
        </div>
        <span style={{color: mode === 'sum' ? C.green : C.text}}>)</span>
        <Mix style={{fontSize: 26, fontWeight: 400, color: C.muted, marginLeft: 12, flex: 1, textAlign: 'right', whiteSpace: 'normal'}}>تعبير شرطي داخل دالة تجميعية</Mix>
      </div>

      <Editor x={90} y={300} w={880} h={250} title="conditional_aggregate.sql" lines={lines} start={edStart} cps={mode === 'sum' ? 1.1 : 1.3} size={25} accent={mode === 'sum' ? C.green : C.blue} opacity={edOp * clamp(nest)} hl={hl} hlColor={C.red} strikeLine={strike} />

      {/* result tile */}
      <div style={{position: 'absolute', left: 90, top: 575, width: 880, height: 190, borderRadius: 22, background: C.card, border: `2px solid ${resCol}`, boxShadow: `0 0 36px ${resCol}33`, opacity: clamp(nest), transform: `translateX(${shake}px)`}}>
        <div dir="ltr" style={{position: 'absolute', left: 34, top: 24}}>
          <div style={{fontFamily: MONO, fontSize: 22, color: C.muted}}>{resLabel}</div>
          <div style={{fontFamily: MONO, fontSize: 84, fontWeight: 700, lineHeight: 1.15, color: resCol}}>{resVal}</div>
        </div>
        {mode === 'bad' ? (
          <div style={{position: 'absolute', right: 30, top: 28, display: 'flex', alignItems: 'center', gap: 18, opacity: clamp(warn), transform: `scale(${0.8 + 0.2 * clamp(warn)})`, transformOrigin: 'right center'}}>
            <Warn size={74} />
            <div dir="ltr" style={{textAlign: 'left'}}>
              <div style={{fontFamily: MONO, fontSize: 26, fontWeight: 700, color: C.red}}>WRONG · expected 6</div>
              <Mix style={{display: 'block', fontSize: 28, color: C.text, marginTop: 6}}>COUNT بتحسب الصفر كقيمة!</Mix>
            </div>
          </div>
        ) : null}
        {fixedDone ? (
          <div style={{position: 'absolute', right: 30, top: 104, opacity: prog(f, t(80.8), 14)}}>
            <Chip color={C.green} style={{fontSize: 30, padding: '10px 28px'}}>✓ CORRECT · NULL is ignored</Chip>
          </div>
        ) : null}
      </div>

      {/* rule card */}
      <div style={{position: 'absolute', left: 90, top: 790, width: 880, opacity: rule, transform: `translateY(${(1 - rule) * 24}px)`}}>
        <div dir="ltr" style={{display: 'flex', gap: 18}}>
          <Chip color={C.red} style={{fontSize: 24, flex: 1, justifyContent: 'center'}}>ELSE 0 → counted ✗</Chip>
          <Chip color={mode === 'fix' ? C.green : C.muted} style={{fontSize: 24, flex: 1, justifyContent: 'center'}}>no ELSE → NULL → ignored ✓</Chip>
        </div>
        <Mix style={{display: 'block', marginTop: 14, fontSize: 28, color: C.text, textAlign: 'center'}}>مع SUM استخدم ELSE 0 · ومع COUNT احذف الـ ELSE</Mix>
      </div>

      {/* orders table with live CASE evaluation */}
      <Win x={1010} y={185} w={820} h={690} title="orders · CASE WHEN evaluation" accent={mode === 'bad' ? C.red : C.border} opacity={clamp(nest)}>
        <div dir="ltr" style={{padding: '12px 14px 0 14px', transform: `translateX(${shake}px)`}}>
          <div style={{display: 'flex', height: 46, alignItems: 'center', fontFamily: MONO, fontSize: 20, color: C.muted, borderBottom: `2px solid ${C.border}`}}>
            <div style={{width: 70, paddingLeft: 10}}>id</div>
            <div style={{width: 190}}>status</div>
            <div style={{width: 170}}>total_amount</div>
            <div style={{flex: 1}}>CASE result</div>
          </div>
          {ORDERS.map((o, i) => {
            const c = cellFor(o.status, o.amount, i);
            const fresh = c.txt !== '·' && f - (t(mode === 'sum' ? SUM_EVAL : mode === 'bad' ? BAD_EVAL : FIX_EVAL) + i * DLY) < sec(0.5) && f >= t(mode === 'sum' ? SUM_EVAL : mode === 'bad' ? BAD_EVAL : FIX_EVAL) + i * DLY;
            return (
              <div key={o.id} style={{display: 'flex', alignItems: 'center', height: 54, fontFamily: MONO, fontSize: 24, color: C.text, borderBottom: `1px solid ${C.border}`, background: fresh ? `${c.color}22` : 'transparent', borderRadius: 6}}>
                <div style={{width: 70, paddingLeft: 10, color: C.muted}}>{o.id}</div>
                <div style={{width: 190, color: statusColor(o.status), fontWeight: 700}}>{o.status}</div>
                <div style={{width: 170}}>{o.amount}</div>
                <div style={{flex: 1, color: c.color, fontWeight: 700, fontStyle: c.italic ? 'italic' : 'normal', textShadow: c.glow ? `0 0 14px ${c.color}` : 'none'}}>
                  {c.txt === '·' ? c.txt : `→ ${c.txt}`}
                </div>
              </div>
            );
          })}
        </div>
      </Win>

      <Caption text="SUM(CASE WHEN status = 'Completed' THEN amount ELSE 0 END)" from={t(49.2)} to={t(61)} />
      <Caption text="COUNT Trap: ELSE 0 is COUNTED! Use NULL or Omit ELSE for COUNT" from={t(64.4)} to={t(83.5)} tone="danger" />
    </Stage>
  );
};
