import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Caption, Check, Chip, Mix, Stage, TopBadge, Win, clamp, lerp, pop, prog, sec, typed} from '../kit';

// SC04 (frames 3900-5100, global 130-170s): first server connection and the two audit queries.
const S = 130;
const t = (g: number) => sec(g - S);
const TREE = [
  {n: 'Servers', d: 0},
  {n: 'PostgreSQL 16', d: 1, live: true},
  {n: 'Databases (1)', d: 2},
  {n: 'postgres', d: 3},
  {n: 'Schemas', d: 4},
  {n: 'public', d: 5},
  {n: 'Tables', d: 5},
];

const Field: React.FC<{label: string; value: string; secret?: boolean; hot?: boolean}> = ({label, value, secret, hot}) => (
  <div dir="ltr" style={{marginBottom: 22}}>
    <div style={{fontFamily: MONO, fontSize: 20, color: C.muted, marginBottom: 6}}>{label}</div>
    <div style={{fontFamily: MONO, fontSize: 32, color: C.text, background: C.bg, border: `2px solid ${hot ? C.blue : C.border}`, borderRadius: 12, padding: '10px 18px', minHeight: 30, letterSpacing: secret ? 4 : 0}}>{secret ? '•'.repeat(value.length) : value}{hot ? <span style={{color: C.blue}}>▌</span> : ''}</div>
  </div>
);

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const win = prog(f, 0, 26);
  const dlg = prog(f, t(131.6), 24) * (1 - prog(f, t(143.9), 14));
  const treeIn = t(144.4);
  const qt = prog(f, t(148.5), 22);
  const q1 = typed('SELECT version();', f, t(151.6), 0.62);
  const q2 = typed('SHOW data_directory;', f, t(154.9), 0.8);
  const run1 = f >= t(157.1) && f < t(160.4);
  const run2 = f >= t(160.4);
  const r1 = pop(f, t(157.6));
  const r2 = pop(f, t(160.8));
  const ok = pop(f, t(165.1));
  const press1 = prog(f, t(157.1), 6) * (1 - prog(f, t(157.5), 8));
  const press2 = prog(f, t(160.4), 6) * (1 - prog(f, t(160.8), 8));

  const host = typed('localhost', f, t(137.9), 0.2);
  const port = typed('5432', f, t(139.8), 0.2);
  const pass = typed('••••••••', f, t(141.7), 0.15);

  return (
    <Stage dur={1200} inFx="morph" outFx="up">
      <TopBadge text="الربط الأول | Server Connection" from={t(131.8)} to={t(150)} color={C.blue} />

      <Win x={120} y={140} w={1680} h={780} title="pgAdmin 4 — Query Tool" accent={C.blue} opacity={win}>
        {/* Object Explorer */}
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 420, background: C.deep, borderRight: `1px solid ${C.border}`, padding: '22px 20px'}}>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.muted, marginBottom: 18}}>OBJECT EXPLORER</div>
          {TREE.map((r, i) => {
            const p = prog(f, treeIn + i * 9, 16);
            return (
              <div key={r.n} dir="ltr" style={{display: 'flex', alignItems: 'center', gap: 12, height: 58, paddingLeft: r.d * 24, opacity: p, transform: `translateX(${(1 - p) * -30}px)`, fontFamily: MONO, fontSize: 25, color: r.live ? C.text : C.muted}}>
                <span style={{color: C.blue}}>{i < 5 ? '▾' : '▸'}</span>
                <div style={{width: 14, height: 14, borderRadius: 4, background: r.live ? C.green : C.border}} />
                {r.n}
              </div>
            );
          })}
        </div>

        {/* Query Tool */}
        <div style={{position: 'absolute', left: 420, right: 0, top: 0, bottom: 0, opacity: qt}}>
          <div dir="ltr" style={{display: 'flex', alignItems: 'center', gap: 16, height: 66, padding: '0 22px', borderBottom: `1px solid ${C.border}`}}>
            <div style={{fontFamily: MONO, fontSize: 22, color: C.blue, borderBottom: `3px solid ${C.blue}`, padding: '0 6px', lineHeight: '62px'}}>Query Tool</div>
            <div style={{marginLeft: 'auto', fontFamily: MONO, fontSize: 22, fontWeight: 700, color: '#0F172A', background: C.green, borderRadius: 10, padding: '8px 22px', transform: `scale(${1 + 0.12 * (press1 + press2)})`}}>▶ Run</div>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 66, height: 250, background: C.deep, padding: '20px 26px'}}>
            {[q1, '', q2].map((l, i) => {
              const hl = (i === 0 && run1) || (i === 2 && run2);
              return (
                <div key={i} dir="ltr" style={{display: 'flex', height: 62, alignItems: 'center', fontFamily: MONO, fontSize: 32, background: hl ? `${C.blue}22` : 'transparent', borderRadius: 8}}>
                  <span style={{color: '#475569', width: 50, paddingLeft: 8}}>{i + 1}</span>
                  <span style={{color: C.text}}>
                    {l.split(/(SELECT|SHOW)/).map((p, k) => (
                      <span key={k} style={{color: p === 'SELECT' || p === 'SHOW' ? C.blue : C.text, fontWeight: p === 'SELECT' || p === 'SHOW' ? 700 : 400}}>{p}</span>
                    ))}
                    {(i === 0 && l.length < 17 && l.length > 0) || (i === 2 && l.length < 20 && l.length > 0) ? <span style={{color: C.green}}>▌</span> : null}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Data Output */}
          <div style={{position: 'absolute', left: 0, right: 0, top: 316, bottom: 0, borderTop: `1px solid ${C.border}`, padding: '16px 26px'}}>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 19, color: C.muted, marginBottom: 12}}>Data Output</div>
            {run1 && (
              <div dir="ltr" style={{transform: `scale(${0.94 + 0.06 * r1})`, opacity: clamp(r1), transformOrigin: 'left top'}}>
                <div style={{display: 'flex', background: C.deep, fontFamily: MONO, fontSize: 22, color: C.muted, padding: '10px 18px', borderRadius: '10px 10px 0 0'}}>version</div>
                <div style={{fontFamily: MONO, fontSize: 28, color: C.green, padding: '16px 18px', border: `2px solid ${C.green}`, borderRadius: '0 0 10px 10px'}}>PostgreSQL 16.x, compiled by Visual C++, 64-bit</div>
              </div>
            )}
            {run2 && (
              <div dir="ltr" style={{transform: `scale(${0.94 + 0.06 * r2})`, opacity: clamp(r2), transformOrigin: 'left top'}}>
                <div style={{display: 'flex', background: C.deep, fontFamily: MONO, fontSize: 22, color: C.muted, padding: '10px 18px', borderRadius: '10px 10px 0 0'}}>data_directory</div>
                <div style={{fontFamily: MONO, fontSize: 28, color: C.amber, padding: '16px 18px', border: `2px solid ${C.amber}`, borderRadius: '0 0 10px 10px'}}>C:/Program Files/PostgreSQL/16/data</div>
              </div>
            )}
            <div style={{position: 'absolute', right: 26, bottom: 22, display: 'flex', alignItems: 'center', gap: 14, opacity: clamp(ok), transform: `translateY(${(1 - clamp(ok)) * 20}px)`}}>
              <Check p={ok} size={46} />
              <span dir="ltr" style={{fontFamily: MONO, fontSize: 24, color: C.green, fontWeight: 700}}>Query returned successfully</span>
            </div>
          </div>
        </div>

        {/* Register Server dialog */}
        <div style={{position: 'absolute', left: 520, top: 40, width: 720, borderRadius: 22, background: C.card, border: `2px solid ${C.blue}`, boxShadow: '0 30px 80px rgba(2,6,23,.7)', padding: '26px 34px', opacity: dlg, transform: `scale(${0.92 + 0.08 * dlg}) translateY(${(1 - dlg) * 30}px)`}}>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 28, fontWeight: 700, color: C.text, marginBottom: 22}}>Register — Server</div>
          <Field label="Host name/address" value={host} hot={f >= t(137.9) && f < t(139.8)} />
          <Field label="Port" value={port} hot={f >= t(139.8) && f < t(141.7)} />
          <Field label="Username" value="postgres" />
          <Field label="Password" value={pass} secret hot={f >= t(141.7) && f < t(143.7)} />
          <div dir="ltr" style={{display: 'inline-block', fontFamily: MONO, fontSize: 24, fontWeight: 700, color: '#0F172A', background: C.blue, borderRadius: 10, padding: '10px 28px'}}>Save</div>
        </div>
      </Win>

      <Caption text="SELECT version(); ──► Engine Build & System Audit" from={t(132)} to={t(148)} />
      <Caption text="SHOW data_directory; ──► Physical Data Location Verification" from={t(152)} to={t(166)} />
    </Stage>
  );
};
