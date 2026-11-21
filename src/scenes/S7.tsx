import {useCurrentFrame, Img, staticFile} from 'remotion';
import {C, FONT} from '../theme';
import {A, SCENES} from '../cues';
import type {Cues} from '../cues';
import {pop} from '../lib/anim';
import {Ltr} from '../lib/ui';
import {BG} from '../lib/pres';
import type {ReactNode} from 'react';

const S0 = SCENES[6].from;
const T = {q1: A('a7_q1'), q2: A('a7_q2'), q3: A('a7_q3'), next: A('a7_next'), ex: A('a7_ex')};
export const CUES7: Cues = {click: [], pop: [S0 + 8, T.q1, T.q2, T.q3, T.next, T.ex], key: []};

const Q = ({fr, at, y, n, color, children}: {fr: number; at: number; y: number; n: number; color: string; children: ReactNode}) => {
  const p = pop(fr, at, 12);
  return (
    <div style={{position: 'absolute', left: 260, top: y + (1 - p) * 18, width: 1400, height: 110, opacity: p, background: 'rgba(255,255,255,0.08)', borderRight: '12px solid ' + color, direction: 'rtl', boxSizing: 'border-box'}}>
      <div style={{position: 'absolute', right: 30, top: 15, width: 80, height: 80, borderRadius: 40, background: color, color: C.white, fontSize: 46, fontWeight: 700, textAlign: 'center', lineHeight: '80px'}}>{n}</div>
      <div style={{position: 'absolute', right: 140, left: 20, top: 0, height: 110, display: 'flex', alignItems: 'center', fontSize: 42, fontWeight: 700, color: C.white}}>{children}</div>
    </div>
  );
};

export const EndCard = ({fr}: {fr: number}) => {
  const next = pop(fr, T.next, 12);
  const ex = pop(fr, T.ex, 12);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, background: BG, fontFamily: FONT}}>
      <div style={{position: 'absolute', left: 60, top: 40, width: 100, height: 100, background: C.white, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Img src={staticFile('logo.svg')} style={{width: 76, height: 76}} />
      </div>
      <div style={{position: 'absolute', left: 0, top: 60, width: 1920, textAlign: 'center', direction: 'rtl', fontSize: 54, fontWeight: 700, color: C.yellow, opacity: pop(fr, S0 + 4, 12)}}>قبل ما تكتب أي <Ltr>Measure</Ltr> اسأل نفسك</div>
      <Q fr={fr} at={T.q1} y={190} n={1} color={C.blue}>محتاج أختار صفوف بشرط؟ ← <Ltr>FILTER</Ltr></Q>
      <Q fr={fr} at={T.q2} y={330} n={2} color={C.purple}>أتجاهل فلتر؟ ← <Ltr>ALL</Ltr> / <Ltr>REMOVEFILTERS</Ltr></Q>
      <Q fr={fr} at={T.q3} y={470} n={3} color={C.green}>أحافظ على فلتر وأزيل الباقي؟ ← <Ltr>ALLEXCEPT</Ltr></Q>
      <div style={{position: 'absolute', left: 200, top: 650, width: 1520, opacity: next, direction: 'rtl', textAlign: 'center'}}>
        <div style={{fontSize: 40, color: '#BFD3F2', marginBottom: 16}}>الدرس القادم: القيم الفريدة والاختيارات داخل التقرير</div>
        <div style={{display: 'flex', justifyContent: 'center', direction: 'ltr'}}>
          {['VALUES', 'DISTINCT', 'SELECTEDVALUE', 'HASONEVALUE'].map((n) => (
            <div key={n} style={{margin: '0 10px', padding: '12px 24px', background: C.white, color: C.navy, fontSize: 34, fontWeight: 700}}>{n}</div>
          ))}
        </div>
      </div>
      <div style={{position: 'absolute', left: 560, top: 880 + (1 - ex) * 20, width: 800, height: 100, opacity: ex, background: C.yellow, direction: 'rtl', textAlign: 'center', lineHeight: '100px', fontSize: 44, fontWeight: 700, color: C.navy}}>
        متنسوش شيت التمارين
      </div>
    </div>
  );
};
export const Scene7 = ({from}: {from: number}) => {
  const fr = useCurrentFrame() + from;
  return <EndCard fr={fr} />;
};
export const Scene8 = () => <EndCard fr={999999} />;
