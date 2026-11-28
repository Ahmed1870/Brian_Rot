import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_MONO, FONT_UI, FPS } from '../theme';
import { L } from '../lib/layout';
import { EditorView, Mark } from '../lib/code';
import { Appear, Caption, En, Pill, RP, VSChrome } from '../lib/ui';
import { buildDoc } from '../lib/session';
import { ev, sent } from '../data/cues';
import { fade } from '../lib/util';
import { BigType, Note } from '../lib/cards';
import out from '../data/outputs.json';

export const S05: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const e = (n: string) => ev(5, n);
  const doc = buildDoc('', [
    { text: "product = 'Laptop'", t0: e('t1').t, dur: e('t1').dur },
    { text: '\ncity = "Alexandria"', t0: e('t2').t, dur: e('t2').dur },
    { text: '\ncustomer_code = "4501"', t0: e('t3').t, dur: e('t3').dur },
  ], t);
  const marks: Mark[] = [];
  const done1 = e('t1').t + e('t1').dur;
  if (t >= done1) marks.push({ line: 0, from: 10, to: 11, kind: 'box', color: C.amber, a: fade(t, done1, 0.3) }, { line: 0, from: 17, to: 18, kind: 'box', color: C.amber, a: fade(t, done1, 0.3) });
  if (t >= e('idl').t) marks.push({ line: 2, from: 16, to: 22, kind: 'box', color: C.teal, a: fade(t, e('idl').t, 0.3) });
  const values = [
    { v: "'Laptop'", l: 'اسم منتج', at: done1 },
    { v: '"Alexandria"', l: 'مدينة', at: e('t2').t + e('t2').dur },
    { v: '"4501"', l: 'كود عميل', at: e('t3').t + e('t3').dur },
  ];
  return (
    <div style={{ display: 'contents' }}>
      <VSChrome tabs={[{ name: 'lesson05.py', active: true, dirty: true }]} ln={doc.cursor.line + 1} col={doc.cursor.col + 1} pyVersion={out.python} />
      <EditorView x={L.edX} y={L.contentY} w={L.edW} h={766} lines={doc.lines} fontSize={38} frame={frame} cursor={doc.cursor} marks={marks} />
      {values.map((v, i) => (
        <Appear key={v.l} t={t} at={v.at + 0.2} style={{ position: 'absolute', left: 90 + i * 330, top: 440, width: 310, height: 150, borderRadius: 22, background: C.panel, border: `3px solid ${C.str}`, textAlign: 'center' }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: i === 1 ? 30 : 40, color: C.str, paddingTop: 30, direction: 'ltr' }}>{v.v}</div>
          <div style={{ fontFamily: FONT_UI, fontSize: 32, color: C.text, marginTop: 14, direction: 'rtl' }}>{v.l}</div>
        </Appear>
      ))}
      <Appear t={t} at={e('idl').t} style={{ position: 'absolute', left: L.edX + 40, top: 630, width: L.edW - 80, textAlign: 'center', color: C.teal, fontFamily: FONT_UI, fontWeight: 700, fontSize: 40, direction: 'rtl' }}>
        شكله رقم، لكنه معرّف مش كمية
      </Appear>
      <Appear t={t} at={e('ph').t} style={{ position: 'absolute', left: L.edX + 40, top: 710, width: L.edW - 80, display: 'flex', justifyContent: 'center', gap: 24, direction: 'rtl' }}>
        <Pill text="رقم تليفون" color={C.teal} size={32} />
        <Pill text="كود عميل" color={C.teal} size={32} />
        <Pill text="رقم الهوية" color={C.teal} size={32} />
      </Appear>
      <RP>
        <Appear t={t} at={e('card').t} style={{ position: 'relative', width: '100%', height: 200, borderRadius: 26, background: C.panel, border: `4px solid ${C.str}`, flexShrink: 0 }}>
          <div style={{ position: 'absolute', right: 26, top: 40, width: 170, height: 100, borderRadius: 20, background: C.str, color: '#0D1117', fontFamily: FONT_MONO, fontWeight: 700, fontSize: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', direction: 'ltr' }}>str</div>
          <div style={{ position: 'absolute', right: 214, top: 34, color: C.text, fontFamily: FONT_UI, fontWeight: 700, fontSize: 42 }}>نصوص <En>string</En></div>
          <div style={{ position: 'absolute', right: 214, top: 100, color: C.dim, fontFamily: FONT_UI, fontSize: 30 }}>بين علامتي اقتباس</div>
        </Appear>
        <Appear t={t} at={e('q').t} style={{ display: 'flex', justifyContent: 'center', gap: 28, direction: 'ltr', flexShrink: 0 }}>
          <Pill text={<>' ' &nbsp;مفردة</>} color={C.amber} size={34} />
          <Pill text={<>" " &nbsp;مزدوجة</>} color={C.amber} size={34} />
        </Appear>
        <Appear t={t} at={e('n1').t} style={{ width: '100%', height: 290, borderRadius: 26, background: C.panel, border: `3px solid ${C.line}`, textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 52, color: C.str, marginTop: 22, direction: 'ltr' }}>"4501"</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 24, flexWrap: 'wrap' }}>
            <span style={{ opacity: fade(t, e('n1').t, 0.3) }}><Pill text="✗ مش بنجمعه" color={C.red} size={32} /></span>
            <span style={{ opacity: fade(t, e('n2').t, 0.3) }}><Pill text="✗ مش بنحسب متوسطه" color={C.red} size={32} /></span>
          </div>
          <div style={{ opacity: fade(t, e('nc').t, 0.3), fontFamily: FONT_UI, fontSize: 36, color: C.text, marginTop: 26, fontWeight: 700 }}>مش كمية قابلة للحساب</div>
        </Appear>
      </RP>
      <Caption t={t} items={[
        { at: sent(5, 0), text: <>النوع التالت <En mono>str</En> — للنصوص</> },
        { at: sent(5, 1), text: 'النص بين علامتي اقتباس: مفردة أو مزدوجة' },
        { at: sent(5, 2), text: <>مثلًا: <En mono>Laptop</En> و<En mono>Alexandria</En></> },
        { at: sent(5, 3), text: 'الرقم اللي هو معرّف يتخزن كنص' },
        { at: sent(5, 4), text: 'رقم الطلب أرقام… بس مش بنجمعها' },
        { at: sent(5, 6), text: 'زي رقم الهوية' },
      ]} />
    </div>
  );
};
