import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_MONO, FONT_UI, FPS } from '../theme';
import { L } from '../lib/layout';
import { EditorView, Mark } from '../lib/code';
import { Appear, Caption, En, Pill, RP, VSChrome } from '../lib/ui';
import { buildDoc } from '../lib/session';
import { ev, sent } from '../data/cues';
import { fade } from '../lib/util';
import out from '../data/outputs.json';

const Tile: React.FC<{ t: number; at: number; x: number; code: string; color: string; label: string; type: string }> = ({ t, at, x, code, color, label, type }) => (
  <Appear t={t} at={at} style={{ position: 'absolute', left: x, top: 480, width: 470, height: 300, borderRadius: 26, background: C.panel, border: `4px solid ${color}`, textAlign: 'center' }}>
    <div style={{ fontFamily: FONT_MONO, fontSize: 72, fontWeight: 700, color, marginTop: 40, direction: 'ltr' }}>{code}</div>
    <div style={{ marginTop: 22, display: 'flex', justifyContent: 'center' }}><Pill text={type} color={color} mono size={36} /></div>
    <div style={{ fontFamily: FONT_UI, fontSize: 32, color: C.text, marginTop: 20, direction: 'rtl' }}>{label}</div>
  </Appear>
);
const QRow: React.FC<{ t: number; at: number; q: string; v: string }> = ({ t, at, q, v }) => (
  <Appear t={t} at={at} style={{ width: '100%', height: 96, borderRadius: 20, background: C.panel, border: `3px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px', direction: 'rtl', fontFamily: FONT_UI, fontSize: 36, color: C.text, flexShrink: 0 }}>
    <span>{q}</span><span style={{ fontFamily: FONT_MONO, color: C.id, direction: 'ltr', fontSize: 34 }}>{v}</span>
  </Appear>
);

export const S06: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const e = (n: string) => ev(6, n);
  const doc = buildDoc('', [
    { text: 'is_available = True', t0: e('t1').t, dur: e('t1').dur },
    { text: '\nis_delivered = False', t0: e('t2').t, dur: e('t2').dur },
  ], t);
  const marks: Mark[] = [];
  if (t >= e('cap').t) {
    const a = fade(t, e('cap').t, 0.25);
    marks.push({ line: 0, from: 15, to: 16, kind: 'box', color: C.amber, a }, { line: 1, from: 15, to: 16, kind: 'box', color: C.amber, a });
  }
  return (
    <div style={{ display: 'contents' }}>
      <VSChrome tabs={[{ name: 'lesson05.py', active: true, dirty: true }]} ln={doc.cursor.line + 1} col={doc.cursor.col + 1} pyVersion={out.python} />
      <EditorView x={L.edX} y={L.contentY} w={L.edW} h={766} lines={doc.lines} fontSize={38} frame={frame} cursor={doc.cursor} marks={marks} />
      <Appear t={t} at={e('cap').t} style={{ position: 'absolute', left: L.edX + 40, top: 390, width: L.edW - 80, textAlign: 'center', color: C.amber, fontFamily: FONT_UI, fontWeight: 700, fontSize: 38, direction: 'rtl' }}>
        أول حرف في الكلمتين كبير: <En mono>T</En> و<En mono>F</En>
      </Appear>
      <Tile t={t} at={e('cmp1').t} x={90} code="True" color={C.kw} type="bool" label="قيمة منطقية — من غير اقتباس" />
      <Tile t={t} at={e('cmp2').t} x={590} code={'"True"'} color={C.str} type="str" label="نص — بين علامتي اقتباس" />
      <Appear t={t} at={e('cmp2').t + 0.8} style={{ position: 'absolute', left: L.edX, top: 820, width: L.edW, textAlign: 'center', fontFamily: FONT_MONO, fontSize: 60, color: C.red, fontWeight: 700 }}>True ≠ "True"</Appear>
      <RP>
        <Appear t={t} at={e('card').t} style={{ position: 'relative', width: '100%', height: 250, borderRadius: 26, background: C.panel, border: `4px solid ${C.kw}`, flexShrink: 0 }}>
          <div style={{ position: 'absolute', right: 26, top: 40, width: 180, height: 100, borderRadius: 20, background: C.kw, color: '#0D1117', fontFamily: FONT_MONO, fontWeight: 700, fontSize: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', direction: 'ltr' }}>bool</div>
          <div style={{ position: 'absolute', right: 224, top: 30, color: C.text, fontFamily: FONT_UI, fontWeight: 700, fontSize: 40 }}>قيم منطقية <En>Boolean</En></div>
          <div style={{ position: 'absolute', right: 224, top: 92, color: C.dim, fontFamily: FONT_UI, fontSize: 30 }}>مابتقبلش غير قيمتين</div>
          <div style={{ position: 'absolute', left: 26, bottom: 18, display: 'flex', gap: 14, direction: 'ltr' }}>
            <span style={{ opacity: fade(t, e('pT').t, 0.25) }}><Pill text="True" color={C.green} mono size={34} solid /></span>
            <span style={{ opacity: fade(t, e('pF').t, 0.25) }}><Pill text="False" color={C.red} mono size={34} solid /></span>
          </div>
        </Appear>
        <QRow t={t} at={e('q1').t} q="هل المنتج متاح؟" v="is_available" />
        <QRow t={t} at={e('q2').t} q="هل الطلب اتسلم؟" v="is_delivered" />
      </RP>
      <Caption t={t} items={[
        { at: sent(6, 0), text: <>النوع الرابع <En mono>bool</En> — <En mono>True</En> أو <En mono>False</En></> },
        { at: sent(6, 1), text: 'بنمثّل بيه الحالة: متاح؟ اتسلم؟' },
        { at: sent(6, 3), text: <><En mono>True</En> لو متاح · <En mono>False</En> لو مش متاح</> },
        { at: sent(6, 4), text: 'لازم أول حرف يكون كبير' },
        { at: sent(6, 5), text: <><En mono>True</En> غير <En mono>"True"</En></> },
        { at: sent(6, 6), text: 'تمثيل الحالة واضح وسهل' },
      ]} />
    </div>
  );
};
