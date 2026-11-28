import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_UI, FPS } from '../theme';
import { L } from '../lib/layout';
import { EditorView, Mark } from '../lib/code';
import { Appear, Caption, En, RP, VSChrome } from '../lib/ui';
import { buildDoc } from '../lib/session';
import { ev, sent } from '../data/cues';
import { fade } from '../lib/util';
import { BigType, Note } from '../lib/cards';
import out from '../data/outputs.json';

export const S04: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const e = (n: string) => ev(4, n);
  const doc = buildDoc('', [
    { text: 'orders = 120', t0: e('e1').t, dur: e('e1').dur },
    { text: '\nunit_price = 125.5', t0: e('e2').t, dur: e('e2').dur },
  ], t);
  const marks: Mark[] = [];
  if (t >= e('h1').t) marks.push({ line: 0, from: 9, to: 12, kind: 'box', color: C.green, a: fade(t, e('h1').t, 0.25) });
  if (t >= e('h2').t) marks.push({ line: 1, from: 13, to: 18, kind: 'box', color: C.amber, a: fade(t, e('h2').t, 0.25) });
  return (
    <div style={{ display: 'contents' }}>
      <VSChrome tabs={[{ name: 'lesson05.py', active: true, dirty: true }]} ln={doc.cursor.line + 1} col={doc.cursor.col + 1} pyVersion={out.python} />
      <EditorView x={L.edX} y={L.contentY} w={L.edW} h={766} lines={doc.lines} fontSize={38} frame={frame} cursor={doc.cursor} marks={marks} />
      <Appear t={t} at={0.2} style={{ position: 'absolute', left: L.edX, top: 480, width: L.edW, textAlign: 'center', color: C.text, fontFamily: FONT_UI, fontWeight: 700, fontSize: 56, direction: 'rtl' }}>
        أنواع البيانات <En>Data Types</En>
      </Appear>
      <Appear t={t} at={e('t1').t} style={{ position: 'absolute', left: L.edX + 60, top: 570, width: L.edW - 120, textAlign: 'center', color: C.dim, fontFamily: FONT_UI, fontSize: 36, direction: 'rtl' }}>
        النوع يحدد طبيعة القيمة والعمليات المناسبة لها
      </Appear>
      <Appear t={t} at={e('end').t} style={{ position: 'absolute', left: L.edX + 60, top: 700, width: L.edW - 120, textAlign: 'center', color: C.teal, fontFamily: FONT_UI, fontWeight: 700, fontSize: 40, direction: 'rtl' }}>
        اختيار النوع المناسب = فهم أدق للبيانات
      </Appear>
      <RP>
        <BigType t={t} at={e('cInt').t} name="int" ar="أعداد صحيحة" note="من غير كسور — مثل عدد الطلبات" ex="orders = 120" c={C.green} h={300} />
        <BigType t={t} at={e('cFloat').t} name="float" ar="أعداد عشرية" note="فيها جزء عشري — مثل سعر الوحدة" ex="unit_price = 125.5" c={C.amber} h={300} />
      </RP>
      <Caption t={t} items={[
        { at: sent(4, 0), text: 'ننتقل لأنواع البيانات' },
        { at: sent(4, 2), text: <><En mono>int</En> للأعداد الصحيحة</> },
        { at: sent(4, 3), text: <><En mono>float</En> للأعداد العشرية</> },
        { at: sent(4, 4), text: <><En mono>120</En> صحيح · <En mono>125.5</En> عشري</> },
        { at: sent(4, 5), text: 'النوع المناسب = تعامل صح مع البيانات' },
      ]} />
    </div>
  );
};
