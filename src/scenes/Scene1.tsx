import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT, H, W} from '../theme';
import {Fade, Kinetic, L, lerp, prog, rnd, sec} from '../kit';

// Scene 1 (frames 0-1050, global 0-35s): views stream down a vertical channel; 98% leak out with no revenue.
const CX = 540;
const CH = 130; // channel half-width
const TOP = 500;
const BOT = 1290;
const EXITS = [690, 850, 1010];
const COUNT = 260;
const GAP = 4;

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();

  const dots: React.ReactNode[] = [];
  for (let i = 0; i < COUNT; i++) {
    const spawn = sec(0.5) + i * GAP;
    const life = 210 + rnd(i, 3) * 50;
    const t = (f - spawn) / life;
    if (t < 0 || t > 1) continue;
    let y = lerp(TOP, BOT, t);
    const u = (rnd(i, 1) - 0.5) * 1.8;
    let x = CX + u * CH;
    const leaks = rnd(i, 2) < 0.98;
    let fill = C.slate400;
    let op = Math.min(1, t * 20);
    if (leaks) {
      const exit = EXITS[Math.floor(rnd(i, 4) * 3)];
      if (y > exit) {
        const k = (y - exit) / 150;
        const side = u >= 0 ? 1 : -1;
        x += side * Math.pow(k, 1.2) * 330;
        fill = C.crimson;
        op *= Math.max(0, 1 - k * 0.8);
        y = exit + (y - exit) * 0.6;
      }
    } else if (y > BOT - 120) {
      fill = C.emerald;
    }
    dots.push(<circle key={i} cx={x} cy={y} r={7} fill={fill} opacity={op} />);
  }

  // scrolling ticks on the left edge = vertical scroll feel
  const ticks: React.ReactNode[] = [];
  const off = (f * 4) % 70;
  for (let y = TOP - 70 + 70 - off; y < BOT + 40; y += 70) {
    if (y < TOP || y > BOT) continue;
    ticks.push(<line key={y} x1={70} x2={y % 140 < 70 ? 120 : 100} y1={y} y2={y} stroke={C.slate600} strokeOpacity={0.6} strokeWidth={2} />);
  }

  // channel walls with gaps at the leak exits
  const wallYs: [number, number][] = [];
  let prev = TOP;
  EXITS.forEach((e) => {
    wallYs.push([prev, e - 30]);
    prev = e + 30;
  });
  wallYs.push([prev, BOT]);

  const big = prog(f, sec(6.3), 25);
  const gate = prog(f, sec(3), 25);

  return (
    <Fade dur={1050} inF={1}>
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
        {ticks}
        {wallYs.map(([a, b], i) => (
          <g key={i}>
            <line x1={CX - CH} x2={CX - CH} y1={a} y2={b} stroke={C.slate500} strokeWidth={3} />
            <line x1={CX + CH} x2={CX + CH} y1={a} y2={b} stroke={C.slate500} strokeWidth={3} />
          </g>
        ))}
        {EXITS.map((e) => (
          <g key={e} opacity={prog(f, sec(6.3), 30)}>
            <line x1={CX - CH - 14} x2={CX - CH + 14} y1={e} y2={e} stroke={C.crimson} strokeWidth={4} />
            <line x1={CX + CH - 14} x2={CX + CH + 14} y1={e} y2={e} stroke={C.crimson} strokeWidth={4} />
          </g>
        ))}
        <line x1={CX - CH} x2={CX + CH} y1={BOT} y2={BOT} stroke={C.emerald} strokeWidth={5} opacity={gate} />
        {dots}
        <text x={CX} y={TOP - 30} textAnchor="middle" fontFamily={FONT} fontSize={38} fill={C.slate400} opacity={gate}>
          آلاف المشاهدات
        </text>
        <text x={CX} y={BOT + 62} textAnchor="middle" fontFamily={FONT} fontSize={40} fontWeight={600} fill={C.emerald} opacity={gate}>
          عائد مالي
        </text>
      </svg>

      <div style={{position: 'absolute', left: 80, right: 80, top: 130, textAlign: 'center', opacity: big, transform: `scale(${0.9 + 0.1 * big})`}}>
        <div style={{fontFamily: FONT, fontSize: 190, fontWeight: 700, lineHeight: 1, color: C.crimson}}>
          <L>98%</L>
        </div>
        <div style={{fontFamily: FONT, fontSize: 40, color: C.slate400, marginTop: 10, direction: 'rtl'}}>من الزيارات تتسرب بلا أي عائد</div>
      </div>

      <div style={{position: 'absolute', left: 80, right: 80, top: 1440}}>
        <Kinetic text="الزيارات الكثيرة ≠ مبيعات مرتفعة" start={sec(13.4)} size={74} />
      </div>
      <div style={{position: 'absolute', left: 80, right: 80, top: 1650}}>
        <Kinetic text="أنت تحرق الميزانية في {{انتباه مزيف}}" start={sec(27.1)} size={62} color={C.slate400} weight={600} />
      </div>
      <div style={{position: 'absolute', left: 80, top: 1860, fontFamily: FONT, fontSize: 22, color: C.slate600, direction: 'rtl', opacity: big}}>بيانات توضيحية</div>
    </Fade>
  );
};
