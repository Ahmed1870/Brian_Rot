import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_MONO, FONT_UI, FPS } from '../theme';
import { L } from '../lib/layout';
import { EditorView, Mark, TerminalView } from '../lib/code';
import { Appear, Caption, En, Mouse, Pill, RP, VSChrome } from '../lib/ui';
import { buildDoc, buildTerm } from '../lib/session';
import { RUN_BTN } from '../lib/scene';
import { ev, sent } from '../data/cues';
import { easeInOut, fade, prog } from '../lib/util';
import out from '../data/outputs.json';

type Pt = { x: number; label: string; c: string; dot?: boolean };
const Axis: React.FC<{ t: number; at: number; zeroX: number; pts: Pt[]; from: number; to: number; crossAt: number; crossX: number; crossLabel: string }> = ({ t, at, zeroX, pts, from, to, crossAt, crossX, crossLabel }) => {
  const k = easeInOut(prog(t, at + 0.5, at + 1.6));
  const ax = from + (to - from) * k;
  const dir = to < from ? 18 : -18;
  return (
    <Appear t={t} at={at} style={{ width: '100%', flexShrink: 0 }}>
      <svg width="100%" viewBox="0 0 920 250" style={{ direction: 'ltr', display: 'block' }}>
        <line x1={30} y1={130} x2={890} y2={130} stroke={C.dim} strokeWidth={4} />
        <circle cx={zeroX} cy={130} r={12} fill={C.teal} />
        <text x={zeroX} y={200} fill={C.teal} fontSize={34} fontFamily={FONT_UI} textAnchor="middle">0 الصفر</text>
        {pts.map((p) => (
          <g key={p.label}>
            <line x1={p.x} y1={112} x2={p.x} y2={148} stroke={p.c} strokeWidth={5} />
            <text x={p.x} y={p.dot ? 82 : 200} fill={p.c} fontSize={40} fontFamily={FONT_MONO} fontWeight={700} textAnchor="middle">{p.label}</text>
            {p.dot && <circle cx={p.x} cy={130} r={13} fill={p.c} />}
          </g>
        ))}
        <line x1={from} y1={130} x2={ax} y2={130} stroke={C.green} strokeWidth={9} strokeLinecap="round" />
        {k > 0.02 && <path d={`M${ax + dir} 108 L${ax} 130 L${ax + dir} 152`} stroke={C.green} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
        {t >= crossAt && (
          <g opacity={fade(t, crossAt, 0.3)}>
            <line x1={crossX - 24} y1={96} x2={crossX + 24} y2={150} stroke={C.red} strokeWidth={8} strokeLinecap="round" />
            <line x1={crossX + 24} y1={96} x2={crossX - 24} y2={150} stroke={C.red} strokeWidth={8} strokeLinecap="round" />
            <text x={crossX} y={236} fill={C.red} fontSize={34} fontFamily={FONT_UI} textAnchor="middle">{crossLabel}</text>
          </g>
        )}
      </svg>
    </Appear>
  );
};

export const S09: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const e = (n: string) => ev(9, n);
  const doc = buildDoc('', [
    { text: 'print(int(25.9))', t0: e('t1').t, dur: e('t1').dur },
    { text: '\nprint(int(-5.9))', t0: e('t2').t, dur: e('t2').dur },
  ], t);
  const runT = e('run').t;
  const lines = out.items.ex8.stdout.trim().split('\n');
  const term = buildTerm([{ at: runT, cmd: 'python lesson05.py', lines: lines.map((text) => ({ at: e('out').t, text, color: C.green })) }], t);
  const marks: Mark[] = [];
  const a1 = e('ax1').t, a2 = e('ax2').t;
  if (t >= a1) marks.push({ line: 0, from: 6, to: 15, kind: 'glow', color: C.green, a: 1 });
  if (t >= a2) marks.push({ line: 1, from: 6, to: 16, kind: 'glow', color: C.green, a: 1 });
  return (
    <div style={{ display: 'contents' }}>
      <VSChrome tabs={[{ name: 'lesson05.py', active: true, dirty: t < runT }]} ln={doc.cursor.line + 1} col={doc.cursor.col + 1} pyVersion={out.python} runHot={t >= runT - 0.1 && t < runT + 0.3} />
      <EditorView x={L.edX} y={L.contentY} w={L.edW} h={150} lines={doc.lines} fontSize={38} frame={frame} cursor={doc.cursor} marks={marks} />
      <TerminalView x={L.edX} y={L.contentY + 150} w={L.edW} h={230} lines={term} frame={frame} />
      <Appear t={t} at={e('rd').t} style={{ position: 'absolute', left: 90, top: 600, width: 960, height: 130, borderRadius: 26, background: `${C.red}14`, border: `4px solid ${C.red}`, display: 'flex', alignItems: 'center', justifyContent: 'center', direction: 'rtl', fontFamily: FONT_UI, fontWeight: 700, fontSize: 46, color: C.text }}>
        <En mono color={C.fn}>int()</En>&nbsp;مش تقريب لأقرب عدد صحيح
      </Appear>
      <Appear t={t} at={e('warn').t} style={{ position: 'absolute', left: 90, top: 790, width: 960, display: 'flex', justifyContent: 'center', direction: 'rtl' }}>
        <Pill text="افهم نتيجة التحويل قبل استخدامها" color={C.amber} size={38} />
      </Appear>
      <RP>
        <div style={{ textAlign: 'center', fontFamily: FONT_UI, fontSize: 26, color: C.dim, direction: 'rtl', opacity: fade(t, a1, 0.3) }}>رسم توضيحي (مش بمقياس رسم)</div>
        <Axis t={t} at={a1} zeroX={100} from={640} to={500} crossAt={e('x26').t} crossX={780}
          pts={[{ x: 500, label: '25', c: C.green }, { x: 640, label: '25.9', c: C.amber, dot: true }, { x: 780, label: '26', c: C.red }]} crossLabel="مش 26" />
        <Axis t={t} at={a2} zeroX={800} from={280} to={520} crossAt={e('x6').t} crossX={170}
          pts={[{ x: 170, label: '-6', c: C.red }, { x: 280, label: '-5.9', c: C.amber, dot: true }, { x: 520, label: '-5', c: C.green }]} crossLabel="مش -6" />
      </RP>
      <Mouse t={t} clicks={[runT]} path={[{ t: 0, x: 1500, y: 500 }, { t: runT - 0.8, x: 1500, y: 500 }, { t: runT, x: RUN_BTN.x, y: RUN_BTN.y }, { t: runT + 2, x: 1450, y: 800 }]} />
      <Caption t={t} items={[
        { at: sent(9, 0), text: 'خد بالك!' },
        { at: sent(9, 1), text: <><En mono>int()</En> مش تقريب لأقرب عدد صحيح</> },
        { at: sent(9, 2), text: 'بتزيل الجزء العشري ناحية الصفر' },
        { at: sent(9, 3), text: <><En mono>int(25.9)</En> ← <En mono>25</En> مش <En mono>26</En></> },
        { at: sent(9, 4), text: <><En mono>int(-5.9)</En> ← <En mono>-5</En></> },
        { at: sent(9, 5), text: 'ما تفترضش إن بايثون هتقرّب الرقم' },
      ]} />
    </div>
  );
};
