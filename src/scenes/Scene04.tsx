import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Defs, Scene, Tag, Title, ease, fs, lerp, prog} from '../common';

const B2 = 450; // 4351: the non-matching query arrives

export const Scene04: React.FC = () => {
  const f = useCurrentFrame();
  const A = B.s4.qa, Bq = B.s4.qb, O = B.s4.opt, P = B.s4.pis, Q = B.s4.seq;
  const cx = O.x + O.w / 2, cy = O.y + O.h / 2;
  const matchA = ease(prog(f, 60, 200));
  const lineB = ease(prog(f, B2 + 40, B2 + 120));
  const outA = prog(f, 200, 260), outB = prog(f, B2 + 130, B2 + 190);

  return (
    <Scene dur={S.s4.dur} accent={C.green}>
      <Title ar="مطابقة شروط الـ Optimizer" en="Predicate Matching · PostgreSQL 16" chip="SC 04 · OPTIMIZER" accent={C.green} />

      <Card box={A} accent={C.green} at={6}>
        <div style={{position: 'absolute', left: 24, top: 18, direction: 'ltr'}}><Tag color={C.green}>QUERY A · MATCH</Tag></div>
        <div style={{position: 'absolute', left: 24, right: 24, top: 80, direction: 'ltr', fontFamily: mono, fontWeight: 700, color: C.text, whiteSpace: 'nowrap', fontSize: fs("SELECT * FROM orders WHERE status = 'active';", A.w - 48, 28, mono), opacity: prog(f, 20, 60)}}>
          <span style={{color: C.pink}}>SELECT</span> * <span style={{color: C.pink}}>FROM</span> orders <span style={{color: C.green}}>WHERE status = 'active'</span>;
        </div>
        <div style={{position: 'absolute', left: 24, right: 24, bottom: 28, direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 30, color: C.green, opacity: matchA}}>الشرط مطابق لتعريف الفهرس ✓</div>
      </Card>
      <Card box={Bq} accent={C.red} at={B2 - 20}>
        <div style={{position: 'absolute', left: 24, top: 18, direction: 'ltr'}}><Tag color={C.red}>QUERY B · MISMATCH</Tag></div>
        <div style={{position: 'absolute', left: 24, right: 24, top: 80, direction: 'ltr', fontFamily: mono, fontWeight: 700, fontSize: 28, color: C.text, opacity: prog(f, B2, B2 + 40)}}>
          <span style={{color: C.pink}}>SELECT</span> * <span style={{color: C.pink}}>FROM</span> orders;
        </div>
        <div style={{position: 'absolute', left: 24, right: 24, bottom: 28, direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 30, color: C.red, opacity: lineB}}>مفيش WHERE ← الشرط مش متطابق ✗</div>
      </Card>

      <Card box={O} accent={C.blue} at={20}>
        <div style={{position: 'absolute', left: 24, top: 18, direction: 'ltr'}}><Tag color={C.blue}>OPTIMIZER</Tag></div>
        <div style={{position: 'absolute', left: 20, right: 20, top: 66, direction: 'ltr', borderRadius: 14, border: `3px solid ${C.blue}`, background: C.panel2, padding: '10px 14px', fontFamily: mono, fontWeight: 700, fontSize: fs("WHERE status = 'active'", O.w - 80, 26, mono), color: C.text}}>
          <div style={{fontSize: 18, color: C.dim}}>index predicate</div>
          <div>WHERE status = 'active'</div>
        </div>
        <div style={{position: 'absolute', left: 24, right: 24, bottom: 24, textAlign: 'center', direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 28, color: C.text, opacity: prog(f, 560, 620)}}>لازم الشرطين يتطابقوا</div>
      </Card>

      <Card box={P} accent={outA > 0.5 ? C.green : C.line} at={40}>
        <div style={{position: 'absolute', left: 24, top: 18, direction: 'ltr'}}><Tag color={C.green}>PARTIAL INDEX SCAN</Tag></div>
        <div style={{position: 'absolute', left: 24, right: 24, top: 90, textAlign: 'center', direction: 'ltr', fontFamily: mono, fontWeight: 700, fontSize: 44, color: C.green, opacity: outA}}>Partial Index Scan ✓</div>
        <div style={{position: 'absolute', left: 24, right: 24, bottom: 28, textAlign: 'center', direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 28, color: C.text, opacity: outA}}>بيقرا صفحات الفهرس الصغير بس</div>
      </Card>
      <Card box={Q} accent={outB > 0.5 ? C.red : C.line} at={B2}>
        <div style={{position: 'absolute', left: 24, top: 18, direction: 'ltr'}}><Tag color={C.red}>FALLBACK</Tag></div>
        <div style={{position: 'absolute', left: 24, right: 24, top: 90, textAlign: 'center', direction: 'ltr', fontFamily: mono, fontWeight: 700, fontSize: 44, color: C.red, opacity: outB}}>Sequential Scan ✗</div>
        <div style={{position: 'absolute', left: 24, right: 24, bottom: 28, textAlign: 'center', direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 28, color: C.text, opacity: outB}}>رجوع للمسح الشامل</div>
      </Card>

      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Defs />
        {/* A -> optimizer -> partial scan (solid green) */}
        <path d={`M ${A.x + A.w} ${A.y + A.h / 2} L ${lerp(A.x + A.w, cx - 90, matchA)} ${lerp(A.y + A.h / 2, cy - 30, matchA)}`} stroke={C.green} strokeWidth={7} fill="none" strokeLinecap="round" filter="url(#glow)" />
        <path d={`M ${cx + 90} ${cy - 30} L ${lerp(cx + 90, P.x, outA)} ${lerp(cy - 30, P.y + P.h / 2, outA)}`} stroke={C.green} strokeWidth={7} fill="none" strokeLinecap="round" filter="url(#glow)" />
        {/* B -> optimizer: broken, then red fallback */}
        <path d={`M ${Bq.x + Bq.w} ${Bq.y + Bq.h / 2} L ${lerp(Bq.x + Bq.w, cx - 230, lineB)} ${lerp(Bq.y + Bq.h / 2, cy + 120, lineB)}`} stroke={C.red} strokeWidth={6} strokeDasharray="12 10" fill="none" strokeLinecap="round" />
        {lineB > 0.9 && <text x={cx - 215} y={cy + 150} fontFamily={mono} fontSize={40} fontWeight={700} fill={C.red}>✗</text>}
        <path d={`M ${cx + 90} ${cy + 40} L ${lerp(cx + 90, Q.x, outB)} ${lerp(cy + 40, Q.y + Q.h / 2, outB)}`} stroke={C.red} strokeWidth={6} fill="none" strokeLinecap="round" opacity={outB > 0 ? 1 : 0} />
        <circle cx={cx} cy={cy} r={86} fill={C.bg2} stroke={C.blue} strokeWidth={8} filter="url(#glow)" opacity={prog(f, 30, 70)} />
        <text x={cx} y={cy + 8} textAnchor="middle" fontFamily={mono} fontSize={26} fontWeight={700} fill={C.blue} opacity={prog(f, 30, 70)}>match?</text>
      </svg>

      <Caption from={60} to={540} color={C.green}>Query WHERE Clause Must Match Partial Index Predicate</Caption>
      <Caption from={660} to={1080} color={C.red}>Optimizer Decision ──► Partial Index Scan (Match) vs Seq Scan (Mismatch)</Caption>
    </Scene>
  );
};
