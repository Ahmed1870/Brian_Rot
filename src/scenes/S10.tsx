import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_UI, FPS, LESSON } from '../theme';
import { L } from '../lib/layout';
import { EditorView, TerminalView, geom } from '../lib/code';
import { Appear, Caption, En, Mouse, Pill, RP, VSChrome } from '../lib/ui';
import { buildDoc, buildTerm, outLines } from '../lib/session';
import { edPoint, RUN_BTN } from '../lib/scene';
import { ev, sent } from '../data/cues';
import { Note } from '../lib/cards';
import out from '../data/outputs.json';

const FS = 34;
const EDH = 490;
const badges = [
  { ty: 'str', c: C.str, key: 'b1' }, { ty: 'int', c: C.green, key: 'b2' }, { ty: 'float', c: C.amber, key: 'b3' }, { ty: 'bool', c: C.kw, key: 'b4' },
];
export const S10: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const e = (n: string) => ev(10, n);
  const doc = buildDoc('', [
    { text: 'product = "Laptop"\nquantity = 120\nunit_price = 125.5\nis_available = True', t0: e('t1').t, dur: e('t1').dur },
    { text: '\n\nprint(type(product))\nprint(type(quantity))\nprint(type(unit_price))\nprint(type(is_available))', t0: e('t2').t, dur: e('t2').dur },
  ], t);
  const runT = e('run').t;
  const term = buildTerm([{ at: runT, cmd: 'python lesson05.py', lines: outLines(out.items.s10.stdout, e('out').t, 0.3) }], t);
  const g = geom(FS);
  const pEnd = edPoint(L.contentY, FS, 8, 12);
  const card = (c: string): React.CSSProperties => ({ width: '100%', height: 76, borderRadius: 16, background: C.panel, border: `2px solid ${c}`, display: 'flex', alignItems: 'center', gap: 18, padding: '0 26px', direction: 'rtl', fontFamily: FONT_UI, fontSize: 34, color: C.text, flexShrink: 0 });
  return (
    <div style={{ display: 'contents' }}>
      <VSChrome tabs={[{ name: 'lesson05.py', active: true, dirty: t < runT }]} ln={doc.cursor.line + 1} col={doc.cursor.col + 1} pyVersion={out.python} runHot={t >= runT - 0.1 && t < runT + 0.3} />
      <EditorView x={L.edX} y={L.contentY} w={L.edW} h={EDH} lines={doc.lines} fontSize={FS} frame={frame} cursor={doc.cursor} />
      {badges.map((b, i) => (
        <Appear key={b.key} t={t} at={e(b.key).t} dy={8} style={{ position: 'absolute', left: 640, top: L.contentY + g.padTop + i * g.lineH + 6, direction: 'ltr' }}>
          <Pill text={b.ty} color={b.c} mono size={28} solid />
        </Appear>
      ))}
      <TerminalView x={L.edX} y={L.contentY + EDH} w={L.edW} h={766 - EDH} lines={term} frame={frame} />
      <RP>
        <Note t={t} at={e('s1').t} c={C.teal} size={40}>الخلاصة</Note>
        <Appear t={t} at={e('s2').t} style={card(C.green)}><span style={{ color: C.green, fontWeight: 700 }}>✓</span> اختار اسم واضح للمتغير</Appear>
        <Appear t={t} at={e('s3').t} style={card(C.green)}><span style={{ color: C.green, fontWeight: 700 }}>✓</span> افهم نوع القيمة قبل استخدامها</Appear>
        <Appear t={t} at={e('next').t} style={{ position: 'relative', width: '100%', height: 150, borderRadius: 22, background: `${C.accent}22`, border: `4px solid ${C.accent}`, flexShrink: 0 }}>
          <div style={{ position: 'absolute', right: 28, top: 16, fontFamily: FONT_UI, fontSize: 28, color: C.dim }}>الدرس القادم · الدرس {LESSON.nextNum}</div>
          <div style={{ position: 'absolute', right: 28, top: 66, fontFamily: FONT_UI, fontWeight: 700, fontSize: 31, color: C.text, direction: 'ltr', unicodeBidi: 'isolate', whiteSpace: 'nowrap' }}>{LESSON.next}</div>
        </Appear>
        <Appear t={t} at={e('sheet').t} style={{ display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
          <Pill text="📄 راجع ورقة التمارين المرفقة" color={C.amber} size={32} />
        </Appear>
      </RP>
      <Mouse t={t} clicks={[runT]} path={[{ t: 0, x: 1500, y: 600 }, { t: runT - 1.0, x: pEnd.x + 250, y: pEnd.y + 80 }, { t: runT, x: RUN_BTN.x, y: RUN_BTN.y }, { t: runT + 2.0, x: 1450, y: 800 }]} />
      <Caption t={t} items={[
        { at: sent(10, 0), text: 'نربطها بمثال مبيعات' },
        { at: sent(10, 1), text: 'نص · صحيح · عشري · منطقي' },
        { at: sent(10, 2), text: <>نفحص بـ <En mono>type()</En> ونحوّل عند الحاجة</> },
        { at: sent(10, 4), text: 'اسم واضح + فهم النوع قبل الاستخدام' },
        { at: sent(10, 5), text: 'في الدرس القادم…' },
        { at: sent(10, 6), text: 'راجع ورقة التمارين المرفقة' },
      ]} />
    </div>
  );
};
