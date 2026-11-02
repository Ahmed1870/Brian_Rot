import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Defs, Scene, Tag, Title, ease, lerp, prog} from '../common';

const STAGES = [
  {k: 'FROM', n: 1, ar: 'قراءة الجدول من القرص', short: 'قراءة الجدول', color: C.blue},
  {k: 'WHERE', n: 2, ar: 'تصفية الصفوف', short: 'تصفية الصفوف', color: C.amber},
  {k: 'SELECT', n: 3, ar: 'اقتطاع الأعمدة في الذاكرة', short: 'اقتطاع الأعمدة', color: C.green},
];
// written order -> execution number
const CODE = [
  {t: 'SELECT first_name, city', stage: 2},
  {t: 'FROM customers', stage: 0},
  {t: "WHERE city = 'Cairo';", stage: 1},
];

export const Scene01: React.FC = () => {
  const f = useCurrentFrame();
  const idx = f < 180 ? -1 : Math.floor((f - 180) / 180) % 3; // active stage in execution order
  const P = B.s1.pipe;
  // stations (absolute coords inside the pipe box)
  const sx = [P.x + 50, P.x + 440, P.x + 830];
  const SW = 280, SY = P.y + 80, SH = 280;
  const laneY = SY + SH / 2;

  return (
    <Scene dur={S.s1.dur} accent={C.blue}>
      <Title ar="لغة استرجاع البيانات | DQL" en="Data Query Language" chip="SC 01 · DQL" accent={C.blue} />

      {/* written code with execution-order badges */}
      <Card box={B.s1.code} accent={C.line} at={6}>
        <div style={{padding: '22px 30px 0'}}><Tag color={C.dim}>manzooma_store_db</Tag></div>
        {CODE.map((l, i) => {
          const active = idx === l.stage;
          return (
            <div key={i} style={{position: 'absolute', left: 24, right: 24, top: 76 + i * 84, height: 72, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', background: active ? 'rgba(56,189,248,0.14)' : 'transparent', border: active ? `2px solid ${STAGES[l.stage].color}` : '2px solid transparent', direction: 'ltr'}}>
              <span style={{fontFamily: mono, fontSize: 31, fontWeight: 700, color: C.text}}>
                <span style={{color: i === 0 ? C.green : i === 1 ? C.blue : C.amber}}>{l.t.split(' ')[0]}</span>{' ' + l.t.split(' ').slice(1).join(' ')}
              </span>
              <span style={{width: 46, height: 46, borderRadius: 23, background: STAGES[l.stage].color, color: C.bg, fontFamily: mono, fontWeight: 700, fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: prog(f, 120 + l.stage * 20, 150 + l.stage * 20)}}>{STAGES[l.stage].n}</span>
            </div>
          );
        })}
        <div style={{position: 'absolute', bottom: 24, left: 30, right: 30, fontFamily: cairo, fontSize: 26, fontWeight: 700, color: C.dim, direction: 'rtl', opacity: prog(f, 100, 130)}}>الرقم = ترتيب التنفيذ الفعلي، مش ترتيب الكتابة</div>
      </Card>

      {/* execution order legend */}
      <Card box={B.s1.legend} accent={C.line} at={30}>
        {STAGES.map((s, i) => {
          const active = idx === i;
          return (
            <div key={s.k} style={{position: 'absolute', left: 24, right: 24, top: 24 + i * 78, height: 66, borderRadius: 14, display: 'flex', alignItems: 'center', gap: 18, padding: '0 18px', direction: 'rtl', background: active ? 'rgba(148,163,184,0.12)' : 'transparent', opacity: active || idx < 0 ? 1 : 0.6}}>
              <span style={{width: 40, height: 40, borderRadius: 20, background: s.color, color: C.bg, fontFamily: mono, fontWeight: 700, fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{s.n}</span>
              <span style={{fontFamily: mono, fontSize: 28, fontWeight: 700, color: s.color, direction: 'ltr', width: 120}}>{s.k}</span>
              <span style={{fontFamily: cairo, fontSize: 28, fontWeight: 700, color: C.text, whiteSpace: 'nowrap'}}>{s.short}</span>
            </div>
          );
        })}
      </Card>

      {/* pipeline */}
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Defs />
        <rect x={P.x} y={P.y} width={P.w} height={P.h} rx={26} fill="url(#cardg)" stroke={C.line} strokeWidth={2} opacity={prog(f, 10, 40)} />
        {/* conveyor */}
        <line x1={P.x + 30} y1={laneY} x2={P.x + P.w - 30} y2={laneY} stroke={C.line} strokeWidth={10} strokeLinecap="round" opacity={prog(f, 20, 50)} />

        {STAGES.map((s, i) => {
          const a = idx === i;
          const x = sx[i];
          const o = prog(f, 30 + i * 18, 60 + i * 18);
          return (
            <g key={s.k} opacity={o} filter={a ? 'url(#glow)' : undefined}>
              <rect x={x} y={SY} width={SW} height={SH} rx={22} fill={C.bg2} stroke={s.color} strokeWidth={a ? 6 : 3} />
              {i === 0 && (
                <g>
                  {[0, 1, 2].map((r) => (
                    <g key={r}>
                      <ellipse cx={x + SW / 2} cy={SY + 90 + r * 60} rx={92} ry={26} fill={C.panel} stroke={C.blue} strokeWidth={4} />
                      <rect x={x + SW / 2 - 92} y={SY + 90 + r * 60} width={184} height={34} fill={C.panel} />
                      <ellipse cx={x + SW / 2} cy={SY + 124 + r * 60} rx={92} ry={26} fill={C.panel} stroke={C.blue} strokeWidth={4} />
                    </g>
                  ))}
                  <ellipse cx={x + SW / 2} cy={SY + 90} rx={92} ry={26} fill="#2B3C57" stroke={C.blue} strokeWidth={4} />
                </g>
              )}
              {i === 1 && (
                <g>
                  {[0, 1, 2, 3].map((r) => (<rect key={r} x={x + 52 + r * 56} y={SY + 50} width={14} height={180} rx={7} fill={C.amber} opacity={0.35 + 0.65 * (0.5 + 0.5 * Math.sin(f * 0.25 - r))} />))}
                  <rect x={x + 30} y={SY + 38} width={SW - 60} height={10} rx={5} fill={C.amber} />
                  <rect x={x + 30} y={SY + 232} width={SW - 60} height={10} rx={5} fill={C.amber} />
                  {a && <rect x={x + 22} y={SY + 20 + ((f * 5) % 220)} width={SW - 44} height={8} rx={4} fill={C.text} opacity={0.9} />}
                </g>
              )}
              {i === 2 && (
                <g>
                  {[0, 1, 2, 3, 4].map((c) => {
                    const keep = c === 0 || c === 2;
                    return (
                      <g key={c}>
                        <rect x={x + 26 + c * 46} y={SY + 40} width={38} height={200} rx={8} fill={keep ? C.green : C.line} opacity={keep ? 0.95 : 0.4} />
                        <rect x={x + 26 + c * 46} y={SY + 40} width={38} height={34} rx={8} fill={keep ? '#0E9F70' : '#475569'} />
                      </g>
                    );
                  })}
                </g>
              )}
              <text x={x + SW / 2} y={SY + SH + 56} textAnchor="middle" fontFamily={mono} fontSize={34} fontWeight={700} fill={s.color}>{s.k}</text>
              <text x={x + SW / 2} y={SY + SH + 100} textAnchor="middle" fontFamily={cairo} fontSize={26} fontWeight={700} fill={C.dim}>{s.ar}</text>
            </g>
          );
        })}

        {/* data packets flowing along the lane (start at frame 180) */}
        {f > 180 && Array.from({length: 7}, (_, k) => {
          const u = (((f - 180) * 0.0042 + k / 7) % 1);
          const x = lerp(P.x + 40, P.x + P.w - 40, u);
          const gateX = sx[1] + SW / 2;
          const killed = k % 2 === 0 && x > gateX;
          const col = x < sx[1] ? C.blue : x < sx[2] ? C.amber : C.green;
          const y = laneY + (killed ? Math.min(60, (x - gateX) * 0.9) : 0);
          return <rect key={k} x={x - 16} y={y - 11} width={32} height={22} rx={5} fill={col} opacity={killed ? Math.max(0, 1 - (x - gateX) / 70) : 1} />;
        })}
      </svg>

      {/* result preview in memory (after SELECT lights up at 540) */}
      <div style={{position: 'absolute', left: P.x + 50, top: P.y + 520, width: P.w - 100, height: 150, opacity: prog(f, 540, 580), transform: `translateY(${(1 - ease(prog(f, 540, 580))) * 30}px)`}}>
        <div style={{display: 'flex', gap: 24, alignItems: 'stretch', height: '100%', direction: 'ltr'}}>
          <div style={{flex: 1, background: C.bg2, border: `2px solid ${C.green}`, borderRadius: 16, padding: '12px 22px', fontFamily: mono, color: C.text}}>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 24, color: C.green, fontWeight: 700}}><span>first_name</span><span>city</span></div>
            {[['أحمد', 'Cairo'], ['سارة', 'Cairo'], ['منى', 'Cairo']].map((r, i) => (
              <div key={i} style={{display: 'flex', justifyContent: 'space-between', fontSize: 26, marginTop: 8}}><span style={{fontFamily: cairo, fontWeight: 700}}>{r[0]}</span><span>{r[1]}</span></div>
            ))}
          </div>
          <div style={{width: 250, background: 'rgba(56,189,248,0.12)', border: `2px solid ${C.blue}`, borderRadius: 16, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 6}}>
            <Tag color={C.blue}>IN MEMORY</Tag>
            <span style={{fontFamily: cairo, fontSize: 28, fontWeight: 900, color: C.text}}>Projection</span>
          </div>
        </div>
      </div>

      <Caption from={60} to={540} ltr={false} color={C.blue}>لغة استرجاع البيانات | DQL (Data Query Language)</Caption>
      <Caption from={660} to={1140} color={C.green}>Execution Order: FROM ──► WHERE ──► SELECT (Projection)</Caption>
    </Scene>
  );
};
