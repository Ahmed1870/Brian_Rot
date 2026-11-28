import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_MONO, FONT_UI, FPS } from '../theme';
import { L } from '../lib/layout';
import { EditorView, Mark, TerminalView } from '../lib/code';
import { Appear, Caption, En, Mouse, RP, VSChrome } from '../lib/ui';
import { buildDoc, buildTerm, outLines } from '../lib/session';
import { RUN_BTN } from '../lib/scene';
import { ev, sent } from '../data/cues';
import { easeOut, fade, prog } from '../lib/util';
import { Note, Row } from '../lib/cards';
import out from '../data/outputs.json';

const FS = 38;
const lastLine = (s: string) => s.trim().split('\n').pop() ?? '';

export const S03: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const e = (n: string) => ev(3, n);
  const t3 = e('t3').t, cmp = e('cmp').t, t4 = e('t4').t;
  const docA = buildDoc('sales = 5000', [
    { text: '\nsales = 5500', t0: e('t1').t, dur: e('t1').dur },
    { text: '\n\nprint(sales)', t0: e('t2').t, dur: e('t2').dur },
  ], t);
  const docB = buildDoc('', [
    { text: 'total_sales = 5000\ncustomer_count = 120\nbranch_name = "Cairo"', t0: t3, dur: e('t3').dur },
    { text: '\n2sales = 5000\ntotal sales = 5000', t0: t4, dur: e('t4').dur },
  ], t);
  const inB = t >= t3;
  const doc = inB ? docB : docA;
  const marks: Mark[] = [];
  const typed1 = e('t1').t + e('t1').dur;
  if (!inB && t >= typed1) marks.push({ line: 1, from: 8, to: 12, kind: 'glow', color: C.green, a: fade(t, typed1, 0.3) });
  if (inB && docB.lines.length >= 5) {
    if (docB.lines[3].length >= 6) marks.push({ line: 3, from: 0, to: 6, kind: 'squiggle', color: C.red });
    if (docB.lines[4].length >= 11) marks.push({ line: 4, from: 6, to: 11, kind: 'squiggle', color: C.red });
  }
  const runT = e('run').t;
  const term = buildTerm([{ at: runT, cmd: 'python lesson05.py', lines: outLines(out.items.ex2.stdout, e('out').t) }], t);
  const e1 = lastLine(out.items.ex3_bad1.stderr);
  const e2 = lastLine(out.items.ex3_bad2.stderr);
  const swap = prog(t, typed1, typed1 + 0.6);
  const errs = inB && docB.lines.length >= 5 && docB.lines[4].length >= 11 ? 2 : 0;
  const box = (c: string): React.CSSProperties => ({ width: 300, height: 110, borderRadius: 22, border: `4px solid ${c}`, background: `${c}1c`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_MONO, fontSize: 52, color: C.text, fontWeight: 700 });
  return (
    <div style={{ display: 'contents' }}>
      <VSChrome tabs={inB ? [{ name: 'lesson05.py' }, { name: 'names.py', active: true, dirty: true }] : [{ name: 'lesson05.py', active: true, dirty: t < runT }]} ln={doc.cursor.line + 1} col={doc.cursor.col + 1} errors={errs} pyVersion={out.python} runHot={t >= runT - 0.1 && t < runT + 0.3} />
      <EditorView x={L.edX} y={L.contentY} w={L.edW} h={330} lines={doc.lines} fontSize={FS} frame={frame} cursor={doc.cursor} marks={marks} />
      <TerminalView x={L.edX} y={L.contentY + 330} w={L.edW} h={436} lines={term} frame={frame} tab="terminal" problems={errs} />
      <RP>
        {t < t3 && (
          <>
            <div style={{ textAlign: 'center', fontFamily: FONT_MONO, fontSize: 56, color: C.id, fontWeight: 700, direction: 'ltr' }}>sales</div>
            <div style={{ margin: '0 auto', width: 480, height: 180, borderRadius: 26, background: '#1F1F1F', border: `4px solid ${C.accent}`, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_MONO, fontSize: 92, fontWeight: 700, color: C.num, opacity: 1 - swap, transform: `translateY(${-swap * 60}px)`, textDecoration: 'line-through', textDecorationColor: C.red }}>5000</div>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_MONO, fontSize: 92, fontWeight: 700, color: C.green, opacity: swap, transform: `translateY(${(1 - easeOut(swap)) * 60}px)` }}>5500</div>
            </div>
            <Note t={t} at={typed1 + 0.3} size={38}>نسند القيمة الجديدة لنفس الاسم</Note>
          </>
        )}
        {t >= t3 && t < cmp && (
          <>
            <Note t={t} at={t3} c={C.green} size={40}>أسماء واضحة وصالحة</Note>
            <Row t={t} at={e('o1').t} c={C.green} mark="✓">total_sales</Row>
            <Row t={t} at={e('o2').t} c={C.green} mark="✓">customer_count</Row>
            <Row t={t} at={e('o3').t} c={C.green} mark="✓">branch_name</Row>
          </>
        )}
        {t >= cmp && t < t4 && (
          <>
            <Appear t={t} at={cmp} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', direction: 'ltr', width: '100%' }}>
              <div style={{ ...box(C.green), width: 290 }}>sales</div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 90, color: C.red, fontWeight: 700, opacity: fade(t, e('neq').t - 0.5, 0.3) }}>≠</div>
              <div style={{ ...box(C.purple), width: 290 }}>Sales</div>
            </Appear>
            <Note t={t} at={e('neq').t} c={C.amber} size={38}>اسمان مختلفان — الحروف الكبيرة والصغيرة بتفرق</Note>
          </>
        )}
        {t >= t4 && (
          <>
            <Note t={t} at={t4} c={C.red} size={40}>أسماء غير صالحة</Note>
            <Row t={t} at={e('b1').t} c={C.red} mark="✗" sub="يبدأ برقم">{`2sales = 5000`}<div style={{ fontSize: 22, color: C.red, fontWeight: 400 }}>{e1}</div></Row>
            <Row t={t} at={e('b2').t} c={C.red} mark="✗" sub="فيه مسافة">{`total sales = 5000`}<div style={{ fontSize: 22, color: C.red, fontWeight: 400 }}>{e2}</div></Row>
            <Appear t={t} at={e('b3').t} style={{ width: '100%', minHeight: 84, borderRadius: 18, border: `3px solid ${C.red}`, background: `${C.red}1c`, display: 'flex', alignItems: 'center', gap: 18, padding: '8px 24px', direction: 'rtl', flexShrink: 0 }}>
              <span style={{ fontSize: 44, color: C.red, fontWeight: 700 }}>✗</span>
              <span style={{ fontFamily: FONT_UI, fontSize: 34, color: C.text, fontWeight: 700 }}>كلمة محجوزة في بايثون</span>
            </Appear>
          </>
        )}
      </RP>
      <Mouse t={t} clicks={[runT]} path={[{ t: 0, x: 1500, y: 600 }, { t: runT - 1.2, x: 1500, y: 600 }, { t: runT, x: RUN_BTN.x, y: RUN_BTN.y }, { t: runT + 2.5, x: 1450, y: 700 }]} />
      <Caption t={t} items={[
        { at: sent(3, 0), text: 'نقدر نغيّر القيمة المرتبطة بالمتغير' },
        { at: sent(3, 2), text: <><En mono>sales</En> بقى يشير للقيمة الجديدة</> },
        { at: sent(3, 3), text: <>أسماء واضحة: <En mono>total_sales</En></> },
        { at: sent(3, 4), text: <><En mono>sales</En> و<En mono>Sales</En> اسمين مختلفين</> },
        { at: sent(3, 5), text: 'مايبدأش برقم · من غير مسافات · مش كلمة محجوزة' },
        { at: sent(3, 6), text: 'التسمية الواضحة تسهّل مراجعة الكود' },
      ]} />
    </div>
  );
};
