import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_MONO, FONT_UI, FPS } from '../theme';
import { L } from '../lib/layout';
import { EditorView, Mark, TerminalView } from '../lib/code';
import { Appear, Caption, En, Mouse, Pill, RP, VSChrome } from '../lib/ui';
import { buildDoc, buildTerm, errLines, outLines } from '../lib/session';
import { RUN_BTN } from '../lib/scene';
import { ev, sent } from '../data/cues';
import { fade } from '../lib/util';
import { Note } from '../lib/cards';
import out from '../data/outputs.json';

const FS = 34;
export const S08: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const e = (n: string) => ev(8, n);
  const B = t >= e('sw').t;
  const docA = buildDoc('', [
    { text: 'quantity_text = "250"', t0: e('t1').t, dur: e('t1').dur },
    { text: '\n\nquantity_int = int(quantity_text)\nquantity_float = float(quantity_text)\nquantity_string = str(quantity_int)', t0: e('t2').t, dur: e('t2').dur },
    { text: '\n\nprint(quantity_int)\nprint(quantity_float)\nprint(quantity_string)', t0: e('t3').t, dur: e('t3').dur },
  ], t);
  const docB = buildDoc('', [{ text: 'city = "Cairo"\nnumber = int(city)', t0: e('t4').t, dur: e('t4').dur }], t);
  const doc = B ? docB : docA;
  const runA = e('run').t, runB = e('run2').t;
  const termA = buildTerm([{ at: runA, cmd: 'python lesson05.py', lines: outLines(out.items.ex6.stdout, e('out').t) }], t);
  const termB = buildTerm([{ at: runB, cmd: 'python lesson05.py', lines: errLines(out.items.ex7.stderr, e('err').t) }], t);
  const marks: Mark[] = [];
  if (B && t >= e('ve').t) marks.push({ line: 1, from: 9, to: 18, kind: 'squiggle', color: C.red });
  const outs = out.items.ex6.stdout.trim().split('\n');
  const tiles = [
    { fn: 'int()', val: outs[0], ty: 'int', c: C.green },
    { fn: 'float()', val: outs[1], ty: 'float', c: C.amber },
    { fn: 'str()', val: `"${outs[2]}"`, ty: 'str', c: C.str },
  ];
  const showTiles = t >= e('out').t;
  const edH = B ? 200 : 490;
  return (
    <div style={{ display: 'contents' }}>
      <VSChrome tabs={[{ name: 'lesson05.py', active: true, dirty: true }]} ln={doc.cursor.line + 1} col={doc.cursor.col + 1} errors={B && t >= e('err').t ? 1 : 0} pyVersion={out.python} runHot={(t >= runA - 0.1 && t < runA + 0.3) || (t >= runB - 0.1 && t < runB + 0.3)} />
      <EditorView x={L.edX} y={L.contentY} w={L.edW} h={edH} lines={doc.lines} fontSize={FS} frame={frame} cursor={doc.cursor} marks={marks} />
      <TerminalView x={L.edX} y={L.contentY + edH} w={L.edW} h={766 - edH} lines={B ? termB : termA} frame={frame} />
      <RP>
        {!B && (
          <>
            <Note t={t} at={e('map').t} size={44}>تحويل الأنواع <En>Type Conversion</En></Note>
            {!showTiles && (
              <Appear t={t} at={e('ex').t} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26, direction: 'ltr', flexShrink: 0 }}>
                <div style={{ padding: '12px 28px', borderRadius: 20, border: `4px solid ${C.str}`, background: `${C.str}1f`, fontFamily: FONT_MONO, fontSize: 60, color: C.str, fontWeight: 700 }}>"250"</div>
                <svg width={100} height={44} viewBox="0 0 120 50"><path d="M8 25 H98 M78 8 L104 25 L78 42" stroke={C.dim} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <div style={{ padding: '12px 28px', borderRadius: 20, border: `4px solid ${C.green}`, background: `${C.green}1f`, fontFamily: FONT_MONO, fontSize: 60, color: C.green, fontWeight: 700 }}>250</div>
              </Appear>
            )}
            {showTiles && tiles.map((x, i) => (
              <Appear key={x.fn} t={t} at={e('out').t + i * 0.25} style={{ width: '100%', height: 130, borderRadius: 20, background: C.panel, border: `4px solid ${x.c}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px', direction: 'ltr', flexShrink: 0 }}>
                <span style={{ fontFamily: FONT_MONO, fontSize: 40, color: C.fn }}>{x.fn}</span>
                <span style={{ fontFamily: FONT_MONO, fontSize: 52, color: x.c, fontWeight: 700 }}>{x.val}</span>
                <Pill text={x.ty} color={x.c} mono size={28} />
              </Appear>
            ))}
          </>
        )}
        {B && (
          <Appear t={t} at={e('err').t + 0.3} style={{ width: '100%', height: 360, borderRadius: 26, background: `${C.red}14`, border: `4px solid ${C.red}`, textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 70, fontWeight: 700, color: C.red, marginTop: 56 }}>ValueError</div>
            <div style={{ opacity: fade(t, e('ve').t, 0.4), fontFamily: FONT_UI, fontSize: 40, color: C.text, marginTop: 36, direction: 'rtl', lineHeight: 1.6 }}>
              <En mono color={C.str}>"Cairo"</En> مش تمثيل صالح<br />لعدد صحيح
            </div>
          </Appear>
        )}
      </RP>
      <Mouse t={t} clicks={[runA, runB]} path={[
        { t: 0, x: 1500, y: 600 }, { t: runA - 1.0, x: 1500, y: 600 }, { t: runA, x: RUN_BTN.x, y: RUN_BTN.y },
        { t: runB - 1.0, x: 700, y: 330 }, { t: runB, x: RUN_BTN.x, y: RUN_BTN.y },
      ]} />
      <Caption t={t} items={[
        { at: sent(8, 0), text: 'تحويل أنواع البيانات' },
        { at: sent(8, 1), text: 'نحوّل النص الرقمي إلى رقم للحساب' },
        { at: sent(8, 2), text: <><En mono>int()</En> · <En mono>float()</En> · <En mono>str()</En></> },
        { at: sent(8, 3), text: <><En mono>"250"</En> نص ← <En mono>float</En> ينتج <En mono>250.0</En></> },
        { at: sent(8, 4), text: 'لازم القيمة تكون قابلة للتحويل' },
        { at: sent(8, 5), text: <><En mono>int("Cairo")</En> ← <En mono>ValueError</En></> },
        { at: sent(8, 6), text: 'قبل الحساب: اتأكد من التحويل' },
      ]} />
    </div>
  );
};
