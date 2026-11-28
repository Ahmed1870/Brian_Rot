import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_MONO, FONT_UI, FPS } from '../theme';
import { L } from '../lib/layout';
import { EditorView, TerminalView } from '../lib/code';
import { Appear, Caption, En, Mouse, RP, VSChrome } from '../lib/ui';
import { buildDoc, buildTerm } from '../lib/session';
import { RUN_BTN } from '../lib/scene';
import { ev, sent } from '../data/cues';
import { Note } from '../lib/cards';
import out from '../data/outputs.json';

const FS = 34;
const EDH = 490;
const rows = [
  { v: 'orders', ty: 'int', c: C.green },
  { v: 'unit_price', ty: 'float', c: C.amber },
  { v: 'product', ty: 'str', c: C.str },
  { v: 'is_available', ty: 'bool', c: C.kw },
];
export const S07: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const e = (n: string) => ev(7, n);
  const doc = buildDoc('', [
    { text: 'orders = 120\nunit_price = 125.5\nproduct = "Laptop"\nis_available = True', t0: e('t0').t, dur: e('t0').dur },
    { text: '\n\nprint(type(orders))', t0: e('t1').t, dur: e('t1').dur },
    { text: '\nprint(type(unit_price))\nprint(type(product))\nprint(type(is_available))', t0: e('t2').t, dur: e('t2').dur },
  ], t);
  const lines5 = out.items.ex5.stdout.trim().split('\n');
  const r1 = e('run1').t, r2 = e('run2').t;
  const run1 = { at: r1, cmd: 'python lesson05.py', lines: [{ at: e('out1').t, text: lines5[0] }] };
  const run2 = { at: r2, cmd: 'python lesson05.py', lines: lines5.map((text) => ({ at: e('out2').t, text })) };
  const term = buildTerm(t >= r2 ? [run2] : [run1], t); // terminal cleared before the second run
  const chipAt = [e('out1').t + 0.2, e('r2').t, e('r3').t, e('r4').t];
  const showFormula = t >= sent(7, 1) && t < chipAt[0];
  return (
    <div style={{ display: 'contents' }}>
      <VSChrome tabs={[{ name: 'lesson05.py', active: true, dirty: true }]} ln={doc.cursor.line + 1} col={doc.cursor.col + 1} pyVersion={out.python} runHot={(t >= r1 - 0.1 && t < r1 + 0.3) || (t >= r2 - 0.1 && t < r2 + 0.3)} />
      <EditorView x={L.edX} y={L.contentY} w={L.edW} h={EDH} lines={doc.lines} fontSize={FS} frame={frame} cursor={doc.cursor} />
      <TerminalView x={L.edX} y={L.contentY + EDH} w={L.edW} h={766 - EDH} lines={term} frame={frame} />
      <RP>
        {showFormula && (
          <Appear t={t} at={sent(7, 1)} style={{ width: '100%', height: 250, borderRadius: 26, background: C.panel, border: `4px solid ${C.fn}`, textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 60, fontWeight: 700, marginTop: 50, direction: 'ltr' }}>
              <span style={{ color: C.fn }}>type</span><span style={{ color: C.op }}>(</span><span style={{ color: C.id }}>variable</span><span style={{ color: C.op }}>)</span>
            </div>
            <div style={{ fontFamily: FONT_UI, fontSize: 34, color: C.text, marginTop: 30, direction: 'rtl' }}>نمرّر اسم المتغير بين القوسين</div>
          </Appear>
        )}
        {!showFormula && t >= chipAt[0] && rows.map((r, i) => (
          <Appear key={r.v} t={t} at={chipAt[i]} dy={12} style={{ width: '100%', height: 96, borderRadius: 18, background: C.panel, border: `3px solid ${r.c}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', direction: 'ltr', fontFamily: FONT_MONO, fontSize: 28, flexShrink: 0 }}>
            <span style={{ color: C.id }}>type({r.v})</span>
            <span style={{ color: C.dim }}>→</span>
            <span style={{ color: r.c, fontWeight: 700 }}>&lt;class '{r.ty}'&gt;</span>
          </Appear>
        ))}
        <Note t={t} at={e('keep').t} c={C.teal} size={34}><En mono>type()</En> بتعرض النوع ومش بتغيّره</Note>
      </RP>
      <Mouse t={t} clicks={[r1, r2]} path={[
        { t: 0, x: 1500, y: 700 }, { t: r1 - 0.9, x: 1500, y: 700 }, { t: r1, x: RUN_BTN.x, y: RUN_BTN.y },
        { t: r2 - 1.0, x: 700, y: 500 }, { t: r2, x: RUN_BTN.x, y: RUN_BTN.y },
      ]} />
      <Caption t={t} items={[
        { at: sent(7, 0), text: 'إزاي نعرف نوع القيمة؟' },
        { at: sent(7, 1), text: <>الدالة <En mono>type()</En></> },
        { at: sent(7, 2), text: <><En mono>type(orders)</En> ← <En mono>int</En></> },
        { at: sent(7, 3), text: <><En mono>float</En> · <En mono>str</En> · <En mono>bool</En></> },
        { at: sent(7, 4), text: 'مفيدة لفحص أعمدة الملفات' },
        { at: sent(7, 5), text: 'بتعرض النوع… ومش بتغيّر القيمة' },
      ]} />
    </div>
  );
};
