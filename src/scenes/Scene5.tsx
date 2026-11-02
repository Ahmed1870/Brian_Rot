import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lerp, pop, prog, sec} from '../kit';

// SC05 (frames 4930-6070, global 164.3-202.3s): RETURNING removes the extra SELECT roundtrip.
const S = 164.33;
const t = (g: number) => sec(g - S);

const OLD = ['INSERT INTO orders (customer_id, total_amount)', 'VALUES (5, 450.00);', 'SELECT order_id FROM orders', 'ORDER BY order_id DESC LIMIT 1;'];
const NEW = ['INSERT INTO orders (customer_id, total_amount)', 'VALUES (5, 450.00)', 'RETURNING order_id, order_date;'];

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const oldIn = prog(f, t(169.6), 22) * (1 - prog(f, t(179.6), 12));
  const newIn = prog(f, t(179.9), 20);
  const trip1 = prog(f, t(170.0), sec(2.2));
  const trip2 = prog(f, t(173.6), sec(2.4));
  const idBack = pop(f, t(176.6));
  const chipI = pop(f, t(183.2));
  const chipU = pop(f, t(184.8));
  const chipD = pop(f, t(186.9));
  const beamOut = prog(f, t(188.9), sec(1.1));
  const beamBack = prog(f, t(190.0), sec(1.4));
  const card = pop(f, t(191.2));
  const zero = pop(f, t(193.8));
  const speed = prog(f, t(196.9), sec(2.5));
  const pulse = 0.5 + 0.5 * Math.sin(f / 8);

  // bottom diagram: App <-> PostgreSQL
  const AX = 360;
  const DX = 1560;
  const AY = 740;

  const arrow = (y: number, p: number, dir: 1 | -1, color: string) => {
    const x1 = dir === 1 ? AX + 120 : DX - 120;
    const x2 = dir === 1 ? DX - 120 : AX + 120;
    const cx = lerp(x1, x2, p);
    return (
      <g opacity={p > 0 ? 1 : 0}>
        <line x1={x1} y1={y} x2={cx} y2={y} stroke={color} strokeWidth={6} strokeLinecap="round" />
        <circle cx={cx} cy={y} r={11} fill={color} />
      </g>
    );
  };

  return (
    <Stage dur={1140} inFx="zoom" outFx="down">
      <TopBadge text="السلاح السري | RETURNING" from={t(165.8)} to={t(180)} color={C.green} />

      {/* old way editor */}
      <div style={{opacity: oldIn}}>
        <Editor x={90} y={170} w={940} h={300} title="old_way.sql" lines={OLD} start={t(169.6)} cps={1.1} size={26} accent={C.amber} />
      </div>
      {/* new way editor */}
      <div style={{opacity: newIn}}>
        <Editor x={90} y={170} w={940} h={300} title="returning.sql" lines={NEW} start={t(179.9)} cps={0.68} size={28} accent={C.green} />
      </div>

      {/* statement chips */}
      <div dir="ltr" style={{position: 'absolute', left: 90, top: 500, display: 'flex', gap: 16}}>
        {[
          {n: 'INSERT', c: C.blue, p: chipI},
          {n: 'UPDATE', c: C.amber, p: chipU},
          {n: 'DELETE', c: C.red, p: chipD},
        ].map((x) => (
          <div key={x.n} style={{transform: `scale(${clamp(x.p)})`, opacity: clamp(x.p), transformOrigin: 'left center'}}>
            <Chip color={x.c} style={{fontSize: 26}}>{x.n} … RETURNING</Chip>
          </div>
        ))}
      </div>

      {/* result card */}
      <div style={{position: 'absolute', left: 1090, top: 170, width: 740, height: 330, borderRadius: 26, background: C.card, border: `3px solid ${C.green}`, boxShadow: `0 30px 90px rgba(2,6,23,.65), 0 0 ${60 * clamp(card) * pulse}px ${C.green}44`, opacity: clamp(card), transform: `scale(${0.8 + 0.2 * clamp(card)})`}}>
        <div dir="ltr" style={{padding: '28px 38px'}}>
          <div style={{fontFamily: MONO, fontSize: 22, color: C.muted}}>RETURNING → result</div>
          <div style={{display: 'flex', gap: 30, marginTop: 16}}>
            <div style={{flex: 1, background: C.deep, borderRadius: 16, padding: '16px 20px', border: `2px solid ${C.green}`}}>
              <div style={{fontFamily: MONO, fontSize: 20, color: C.muted}}>order_id</div>
              <div style={{fontFamily: MONO, fontSize: 76, fontWeight: 700, color: C.green, lineHeight: 1.1}}>101</div>
            </div>
            <div style={{flex: 1.5, background: C.deep, borderRadius: 16, padding: '16px 20px', border: `2px solid ${C.border}`}}>
              <div style={{fontFamily: MONO, fontSize: 20, color: C.muted}}>order_date</div>
              <div style={{fontFamily: MONO, fontSize: 30, fontWeight: 700, color: C.text, marginTop: 18}}>2025-06-01<br />10:42:07</div>
            </div>
          </div>
        </div>
      </div>

      {/* app <-> db diagram */}
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <rect x={AX - 120} y={AY - 110} width={240} height={220} rx={24} fill={C.card} stroke={C.blue} strokeWidth={3} />
        <text x={AX} y={AY + 10} textAnchor="middle" fontFamily={MONO} fontSize={34} fontWeight={700} fill={C.blue}>App</text>
        <text x={AX} y={AY + 50} textAnchor="middle" fontFamily={MONO} fontSize={19} fill={C.muted}>your code</text>
        <rect x={DX - 120} y={AY - 110} width={240} height={220} rx={24} fill={C.card} stroke={C.green} strokeWidth={3} />
        <text x={DX} y={AY + 10} textAnchor="middle" fontFamily={MONO} fontSize={30} fontWeight={700} fill={C.green}>PostgreSQL</text>
        <text x={DX} y={AY + 50} textAnchor="middle" fontFamily={MONO} fontSize={19} fill={C.muted}>engine</text>

        {/* old way: 2 roundtrips */}
        <g opacity={oldIn}>
          {arrow(AY - 56, trip1, 1, C.amber)}
          <text x={(AX + DX) / 2} y={AY - 74} textAnchor="middle" fontFamily={MONO} fontSize={22} fill={C.amber} opacity={trip1}>① INSERT</text>
          {arrow(AY + 4, trip2, 1, C.red)}
          <text x={(AX + DX) / 2} y={AY - 14} textAnchor="middle" fontFamily={MONO} fontSize={22} fill={C.red} opacity={trip2}>② extra SELECT</text>
          {arrow(AY + 64, clamp(idBack), -1, C.muted)}
          <text x={(AX + DX) / 2} y={AY + 108} textAnchor="middle" fontFamily={MONO} fontSize={22} fill={C.muted} opacity={clamp(idBack)}>id ← only now</text>
        </g>
        <g opacity={oldIn}>
          <text x={(AX + DX) / 2} y={AY + 172} textAnchor="middle" fontFamily={MONO} fontSize={30} fontWeight={700} fill={C.red} opacity={trip2}>2 roundtrips</text>
        </g>

        {/* new way: 1 roundtrip with return beam */}
        <g opacity={newIn}>
          {arrow(AY - 30, beamOut, 1, C.blue)}
          {arrow(AY + 30, beamBack, -1, C.green)}
          {beamBack > 0 && beamBack < 1 && <circle cx={lerp(DX - 120, AX + 120, beamBack)} cy={AY + 30} r={26} fill={C.green} opacity={0.25} />}
          <text x={(AX + DX) / 2} y={AY - 56} textAnchor="middle" fontFamily={MONO} fontSize={22} fill={C.blue} opacity={beamOut}>INSERT … RETURNING</text>
          <text x={(AX + DX) / 2} y={AY + 74} textAnchor="middle" fontFamily={MONO} fontSize={22} fill={C.green} opacity={beamBack}>order_id, order_date</text>
        </g>
      </svg>

      <div dir="ltr" style={{position: 'absolute', left: 0, right: 0, top: 880, display: 'flex', justifyContent: 'center', gap: 28, alignItems: 'center', opacity: clamp(zero)}}>
        <div style={{transform: `scale(${clamp(zero)})`}}><Chip color={C.green} style={{fontSize: 30, padding: '8px 28px'}}><Check p={1} size={30} /> Zero Extra SELECT Roundtrip</Chip></div>
        <div style={{width: 280, height: 14, borderRadius: 7, background: C.deep, border: `2px solid ${C.border}`, overflow: 'hidden', opacity: speed}}>
          <div style={{width: `${speed * 100}%`, height: '100%', background: `linear-gradient(90deg, ${C.blue}, ${C.green})`}} />
        </div>
      </div>

      <Caption text="INSERT INTO orders ... RETURNING order_id, order_date;" from={t(180.5)} to={t(192)} />
      <Caption text="RETURNING Clause ──► Eliminates Extra SELECT Roundtrip" from={t(194)} to={t(201)} />
    </Stage>
  );
};
