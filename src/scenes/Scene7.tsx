import React from 'react';
import {staticFile} from 'remotion';
import {useT, ramp} from '../lib/anim';
import {Card, AR, Rich} from '../lib/ui';
import {Ico} from '../lib/Icons';
import {a, BOUNDS} from '../sync';
import {COL, LESSON, FONT_AR, FONT_MONO} from '../theme';
import {Sfx} from '../lib/scene41';

export const S7_SFX: Sfx[] = [a(7, 1), a(7, 2), a(7, 3), a(7, 4), a(7, 5)].map((t): Sfx => ({t, n: 'pop'}));

const Col: React.FC<{x: number; title: string; sub: string; at: number; T: number; children: React.ReactNode}> = ({x, title, sub, at, T, children}) => (
  <Card x={x} y={250} w={520} h={400} o={ramp(T, at, 0.5)} border={COL.blue}>
    <div style={{height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 20}}>{children}</div>
    <div style={{textAlign: 'center', fontSize: 34, fontWeight: 700, fontFamily: FONT_MONO, color: COL.ink, padding: '10px 10px 0'}}>{title}</div>
    <div style={{...AR, textAlign: 'center', fontSize: 34, color: COL.text, padding: '14px 20px'}}>{sub}</div>
  </Card>
);

export const End: React.FC<{final?: boolean}> = ({final}) => {
  const Tr = useT();
  const T = final ? 1e9 : Tr;
  const o = final ? 1 : ramp(Tr, BOUNDS[6], 0.5);
  return (
    <div style={{position: 'absolute', inset: 0, background: COL.bg, opacity: o, fontFamily: FONT_AR}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 14, background: COL.yellow}} />
      <img src={staticFile('logo.svg')} width={120} height={120} style={{position: 'absolute', left: 900, top: 36}} />
      <div style={{...AR, textAlign: 'center', position: 'absolute', left: 0, width: 1920, top: 160, fontSize: 52, fontWeight: 700, color: COL.ink, opacity: ramp(T, a(7, 0), 0.4)}}>افتكروا الفرق</div>
      <Col x={100} T={T} at={a(7, 1)} title="VALUES · DISTINCT" sub="جدول بالقيم الفريدة">
        <div style={{border: `2px solid ${COL.line}`, width: 200, fontSize: 24, background: '#fff', fontFamily: FONT_MONO}}>
          {['Laptop', 'Mouse', 'Keyboard'].map((n) => <div key={n} style={{padding: '2px 12px', borderTop: `1px solid ${COL.line}`}}>{n}</div>)}
        </div>
      </Col>
      <Col x={700} T={T} at={a(7, 2)} title="SELECTEDVALUE" sub="قيمة واحدة أو نتيجة بديلة">
        <div style={{fontSize: 56, fontWeight: 700, color: COL.green, fontFamily: FONT_MONO}}>Laptop</div>
      </Col>
      <Col x={1300} T={T} at={a(7, 3)} title="HASONEVALUE" sub="بتختبر: قيمة فريدة واحدة ولا لأ">
        <div style={{fontSize: 56, fontWeight: 700, fontFamily: FONT_MONO}}><span style={{color: COL.green}}>TRUE</span> <span style={{color: COL.sub}}>/</span> <span style={{color: COL.red}}>FALSE</span></div>
      </Col>
      <div style={{...AR, textAlign: 'center', position: 'absolute', left: 0, width: 1920, top: 710, fontSize: 40, color: COL.sub, opacity: ramp(T, a(7, 4), 0.4)}}><Rich t="الدرس القادم: التحكم في الفلاتر" /></div>
      <div style={{position: 'absolute', left: 0, width: 1920, top: 790, display: 'flex', justifyContent: 'center', gap: 24, direction: 'ltr'}}>
        {LESSON.next.map((n, i) => (
          <div key={n} style={{opacity: ramp(T, a(7, 4, 1.2 + i * 0.9), 0.4), fontSize: 38, fontWeight: 700, fontFamily: FONT_MONO, padding: '12px 30px', background: COL.yellowSoft, border: `2px solid ${COL.line}`, color: COL.ink}}>{n}</div>
        ))}
      </div>
      <Card x={410} y={910} w={1100} h={100} o={ramp(T, a(7, 5), 0.5)} bg={COL.blueSoft} border={COL.blue}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, padding: '20px 20px 0', direction: 'rtl'}}>
          <Ico n="table" s={46} />
          <div style={{...AR, fontSize: 36, color: COL.ink}}>طبّق الأمثلة في شيت التمارين</div>
        </div>
      </Card>
    </div>
  );
};
