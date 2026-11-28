import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_MONO, FONT_UI, FPS } from '../theme';
import { L } from '../lib/layout';
import { EditorView, Mark, TerminalView } from '../lib/code';
import { Appear, Caption, En, Mouse, RP, VSChrome } from '../lib/ui';
import { buildDoc, buildTerm, outLines } from '../lib/session';
import { edPoint, RUN_BTN } from '../lib/scene';
import { ev, sent } from '../data/cues';
import { fade } from '../lib/util';
import { Note } from '../lib/cards';
import out from '../data/outputs.json';

const FS = 38;
export const S02: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const e = (n: string) => ev(2, n);
  const doc = buildDoc('', [
    { text: 'sales = 5000', t0: e('t1').t, dur: e('t1').dur },
    { text: '\norders = 120', t0: e('t2').t, dur: e('t2').dur },
    { text: '\nbranch = "Cairo"', t0: e('t3').t, dur: e('t3').dur },
    { text: '\n\nprint(sales)\nprint(orders)\nprint(branch)', t0: e('t4').t, dur: e('t4').dur },
  ], t);
  const eq = edPoint(L.contentY, FS, 0, 6.5);
  const runT = e('run').t;
  const term = buildTerm([{ at: runT, cmd: 'python lesson05.py', lines: outLines(out.items.ex1.stdout, e('out').t, 0.35) }], t);
  const marks: Mark[] = [];
  const eqK = fade(t, e('eq').t, 0.25);
  if (eqK > 0) marks.push({ line: 0, from: 6, to: 7, kind: 'box', color: C.amber, a: eqK });
  const t1 = e('t1').t;
  const anat = [
    { at: t1 + 0.2, txt: 'الاسم', sub: 'sales', c: C.id },
    { at: t1 + 1.1, txt: 'إسناد', sub: '=', c: C.amber },
    { at: t1 + 1.8, txt: 'القيمة', sub: '5000', c: C.num },
  ];
  return (
    <div style={{ display: 'contents' }}>
      <VSChrome tabs={[{ name: 'lesson05.py', active: true, dirty: t < runT }]} ln={doc.cursor.line + 1} col={doc.cursor.col + 1} pyVersion={out.python} runHot={t >= runT - 0.1 && t < runT + 0.3} />
      <EditorView x={L.edX} y={L.contentY} w={L.edW} h={440} lines={doc.lines} fontSize={FS} frame={frame} cursor={doc.cursor} marks={marks} />
      <TerminalView x={L.edX} y={L.contentY + 440} w={L.edW} h={326} lines={term} frame={frame} />
      <RP>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, direction: 'ltr' }}>
          {anat.map((a) => (
            <Appear key={a.sub} t={t} at={a.at} style={{ width: '100%', borderRadius: 20, border: `3px solid ${a.c}`, background: `${a.c}1f`, padding: '10px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 52, color: a.c, fontWeight: 700 }}>{a.sub}</div>
              <div style={{ fontFamily: FONT_UI, fontSize: 36, color: C.text, direction: 'rtl' }}>{a.txt}</div>
            </Appear>
          ))}
        </div>
        <Note t={t} at={e('eq').t} c={C.amber} size={38}><En mono>=</En> هنا معناها إسناد قيمة، مش مقارنة</Note>
      </RP>
      <Mouse t={t} clicks={[e('eq').t, runT]} path={[
        { t: 0, x: 1500, y: 700 }, { t: e('eq').t - 0.7, x: 1500, y: 700 }, { t: e('eq').t, x: eq.x, y: eq.y },
        { t: runT - 1.4, x: eq.x, y: eq.y }, { t: runT, x: RUN_BTN.x, y: RUN_BTN.y },
      ]} />
      <Caption t={t} items={[
        { at: sent(2, 0), text: 'المتغير = اسم مرتبط بقيمة' },
        { at: sent(2, 1), text: <>الاسم ثم <En mono>=</En> ثم القيمة</> },
        { at: sent(2, 3), text: <><En mono>=</En> إسناد وليست مقارنة</> },
        { at: sent(2, 4), text: 'نستخدم اسم المتغير في سطر تاني' },
        { at: sent(2, 6), text: 'كود أوضح بدل أرقام من غير معنى' },
      ]} />
    </div>
  );
};
