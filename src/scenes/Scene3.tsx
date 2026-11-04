import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Chip, Stage, TopBadge, Win, clamp, lin, pop, sec, typed} from '../kit';
import {NAMES} from '../data';

// SC03 (85-132s): || trap vs CONCAT_WS.
// Anchors (s): 89.3 on the contrary | 99.9 traditional operator | 105.3 instead | 110.3 CONCAT_WS | 116.4 separator | 120.9 ignores NULL | 125.1 build names
const S = START.s3;
const t = (g: number) => sec(g - S);

const Row: React.FC<{y: number; a: string; b: string | null; p: number}> = ({y, a, b, p}) => (
  <div dir="ltr" style={{position: 'absolute', left: 30, right: 30, top: y, height: 54, display: 'flex', alignItems: 'center', fontFamily: MONO, fontSize: 28, opacity: p}}>
    <span style={{width: 300, color: C.text}}>{a}</span>
    <span style={{color: b === null ? C.red : C.text, fontWeight: b === null ? 700 : 400}}>{b === null ? 'NULL' : b}</span>
  </div>
);

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const win = clamp(lin(f, t(89.3), 16));
  const crash = clamp(lin(f, t(99.9), 12));
  const fuse = clamp(lin(f, t(116.4), 20));
  const code2 = typed("CONCAT_WS(' ', first_name, last_name)", f, t(105.3), 0.9);
  const shake = crash > 0 && crash < 1 ? Math.sin(f * 2.2) * 10 * (1 - crash) : 0;
  const pin = clamp(lin(f, t(89.3), 16));

  return (
    <Stage dur={1410} inFx="left" outFx="down">
      <TopBadge text="الدمج النصي الآمن | CONCAT vs the || Operator" from={sec(2)} to={sec(40)} color={C.blue} />

      {/* LEFT: || operator */}
      <Win x={80} y={180} w={860} h={640} title="operator ||" accent={crash > 0.5 ? C.red : C.border} opacity={win}>
        <div dir="ltr" style={{position: 'absolute', left: 30, top: 20, fontFamily: MONO, fontSize: 28, color: C.text}}>first_name <span style={{color: C.blue}}>||</span> ' ' <span style={{color: C.blue}}>||</span> last_name</div>
        <div dir="ltr" style={{position: 'absolute', left: 30, top: 90, fontFamily: MONO, fontSize: 22, color: C.muted}}>first_name · last_name</div>
        {NAMES.map((n, i) => <Row key={i} y={124 + i * 54} a={n.first} b={n.last} p={pin} />)}
        <div dir="ltr" style={{position: 'absolute', left: 30, top: 270, fontFamily: MONO, fontSize: 22, color: C.muted}}>result</div>
        <div dir="ltr" style={{position: 'absolute', left: 30, right: 30, top: 306, height: 84, borderRadius: 16, border: `3px solid ${C.green}`, background: `${C.green}14`, display: 'flex', alignItems: 'center', padding: '0 26px', fontFamily: MONO, fontSize: 38, fontWeight: 700, color: C.text, opacity: clamp(lin(f, t(94), 14))}}>Ahmed Hassan</div>
        <div dir="ltr" style={{position: 'absolute', left: 30, right: 30, top: 410, height: 84, borderRadius: 16, border: `3px solid ${crash > 0.3 ? C.red : C.border}`, background: crash > 0.3 ? `${C.red}22` : C.deep, display: 'flex', alignItems: 'center', justifyContent: crash > 0.3 ? 'center' : 'flex-start', padding: '0 26px', fontFamily: MONO, fontSize: 38, fontWeight: 700, color: crash > 0.3 ? C.red : C.text, transform: `translateX(${shake}px)`, boxShadow: crash > 0.3 ? `0 0 30px ${C.red}77` : 'none', opacity: clamp(lin(f, t(94), 14))}}>
          {crash > 0.3 ? 'NULL  ✗' : 'Mona …'}
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 30, top: 520, fontFamily: MONO, fontSize: 24, color: C.red, opacity: crash}}>NULL + text = NULL</div>
      </Win>

      {/* RIGHT: CONCAT_WS */}
      <Win x={980} y={180} w={860} h={640} title="CONCAT_WS" accent={fuse > 0.5 ? C.green : C.border} opacity={clamp(lin(f, t(105.3), 16))}>
        <div dir="ltr" style={{position: 'absolute', left: 30, top: 20, fontFamily: MONO, fontSize: 28, color: C.text, whiteSpace: 'pre'}}>
          <span style={{color: C.blue, fontWeight: 700}}>{code2.slice(0, 9)}</span>{code2.slice(9)}
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 30, top: 90, fontFamily: MONO, fontSize: 22, color: C.muted}}>first_name · last_name</div>
        {NAMES.map((n, i) => <Row key={i} y={124 + i * 54} a={n.first} b={n.last} p={clamp(lin(f, t(106), 14))} />)}
        <div dir="ltr" style={{position: 'absolute', left: 30, top: 270, fontFamily: MONO, fontSize: 22, color: C.muted}}>result</div>
        <div dir="ltr" style={{position: 'absolute', left: 30, right: 30, top: 306, height: 84, borderRadius: 16, border: `3px solid ${C.green}`, background: `${C.green}14`, display: 'flex', alignItems: 'center', padding: '0 26px', fontFamily: MONO, fontSize: 38, fontWeight: 700, color: C.text, opacity: clamp(lin(f, t(110.3), 14)), transform: `translateX(${(1 - clamp(lin(f, t(110.3), 14))) * 30}px)`}}>
          Ahmed<span style={{display: 'inline-block', width: 26 + 10 * fuse, height: 40, margin: '0 6px', borderRadius: 8, background: C.green, boxShadow: `0 0 ${24 * fuse}px ${C.green}`, opacity: 0.35 + 0.65 * fuse}} />Hassan
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 30, right: 30, top: 410, height: 84, borderRadius: 16, border: `3px solid ${C.green}`, background: `${C.green}14`, display: 'flex', alignItems: 'center', padding: '0 26px', fontFamily: MONO, fontSize: 38, fontWeight: 700, color: C.text, opacity: clamp(lin(f, t(116.4), 14)), boxShadow: `0 0 ${26 * fuse}px ${C.green}66`}}>
          Mona
          <span style={{marginLeft: 'auto', fontSize: 24, color: C.green}}>NULL skipped ✓</span>
        </div>
        <div style={{position: 'absolute', left: 30, top: 520, display: 'flex', gap: 12, opacity: clamp(lin(f, t(110.3), 14))}}>
          <Chip color={C.amber} style={{fontSize: 22}}>WS = With Separator</Chip>
        </div>
      </Win>

      <div style={{position: 'absolute', left: 80, right: 80, top: 850, display: 'flex', justifyContent: 'center', opacity: clamp(lin(f, t(125.1), 16))}}>
        <Chip color={C.green} style={{fontSize: 28, padding: '10px 30px'}}>✓ Full names &amp; composite addresses — safely</Chip>
      </div>

      <Caption text="Operator || Trap ──► NULL + Text = NULL (Destructive Output)" from={t(98.5)} to={t(108)} tone="danger" />
      <Caption text="CONCAT_WS(' ', col1, col2) ──► Safe Null-Bypassing Text Fusion" from={t(115)} to={sec(44.5)} tone="ok" />
    </Stage>
  );
};
