import React from 'react';
import TL from '../timeline.json';
import {C, D, FONT_AR, FONT_MONO} from '../theme';
import {Bg} from '../components/Glass';
import {Code, CodeLine} from '../components/Code';
import {appear, pop} from '../components/Text';
import {back, ei, eo, hash, mix, prog, pulse, seg, typed} from '../lib/anim';

const S = TL.cues.sc02;
const CMD = "CREATE DATABASE manzooma_store_db ENCODING 'UTF8';";
const LINES: CodeLine[] = [{text: CMD, at: S.typeT, dt: 0.075}];

const Folder: React.FC<{w: number; h: number; color: string; title: string; sub?: string; glow?: number; ghost?: boolean}> = ({w, h, color, title, sub, glow = 20, ghost}) => (
  <div style={{position: 'relative', width: w, height: h}}>
    <svg width={w} height={h} viewBox="0 0 400 300" preserveAspectRatio="none" style={{overflow: 'visible', filter: `drop-shadow(0 0 ${glow}px ${color}88)`}}>
      <path d="M20 40 Q20 20 40 20 H150 L185 55 H360 Q380 55 380 75 V260 Q380 280 360 280 H40 Q20 280 20 260 Z" fill={ghost ? 'rgba(255,255,255,0.03)' : `${color}22`} stroke={color} strokeWidth="7" strokeDasharray={ghost ? '16 14' : undefined} strokeLinejoin="round" />
    </svg>
    <div style={{position: 'absolute', left: 0, top: h * 0.3, width: w, textAlign: 'center'}}>
      <div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: w > 400 ? 36 : 40, color: C.text}}>{title}</div>
      {sub ? <div style={{fontFamily: FONT_AR, fontWeight: 700, fontSize: 26, color, marginTop: 8}}>{sub}</div> : null}
    </div>
  </div>
);

export const Scene2: React.FC<{t: number}> = ({t}) => {
  const enter = appear(t, 40.3, 41.3);
  const clone = prog(t, S.clone, S.clone + 2.6);
  const split = eo(prog(t, S.clone, S.clone + 1.4));
  const settle = eo(prog(t, S.clone + 1.4, S.clone + 2.6));
  const rename = typed('manzooma_store_db', t, S.clone + 2.6, 0.07);
  const oidP = back(prog(t, S.oid, S.oid + 0.8));
  const drop = ei(prog(t, S.oid + 1.2, S.disk));
  const snapped = t >= S.disk;
  const snapGlow = Math.sin(prog(t, S.disk, S.disk + 0.8) * Math.PI);
  const utfP = pop(t, S.utf, S.utf + 0.8);
  const warm = 0.5 + 0.5 * pulse(t, 1.4);
  const finalGlow = seg(t, 76, 78) * warm;

  const tag = (range: number[], head: string, body: string, color: string) => {
    const p = pop(t, range[0], range[0] + 0.8) * (1 - seg(t, range[1] - 0.4, range[1]));
    if (p <= 0.01) return null;
    return (
      <div style={{display: 'inline-flex', alignItems: 'center', gap: 16, padding: '12px 30px', borderRadius: 16, background: `${color}22`, border: `2px solid ${color}`, fontFamily: FONT_MONO, fontWeight: 700, fontSize: 28, color: C.text, whiteSpace: 'nowrap', opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * -40}px)`, boxShadow: `0 0 30px ${color}44`}}>
        <span style={{color}}>{head}</span>
        {body ? <span>{body}</span> : null}
      </div>
    );
  };

  // clone particles
  const bits: React.ReactNode[] = [];
  if (clone > 0 && clone < 1) {
    for (let i = 0; i < 26; i++) {
      const u = prog(t, S.clone + 0.2 + (i % 13) * 0.08, S.clone + 1.8 + (i % 13) * 0.08);
      if (u <= 0 || u >= 1) continue;
      const x = mix(560, 1080, u);
      const y = 560 + Math.sin(u * Math.PI) * -90 * (hash(i) + 0.3) + (hash(i * 3) - 0.5) * 60;
      bits.push(<rect key={i} x={x} y={y} width={10} height={10} rx={2} fill={D.code} opacity={1 - u * 0.4} />);
    }
  }
  const copyX = mix(180, 1080, split);
  const copyScale = mix(0.55, 1, settle);

  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden'}}>
      <Bg t={t} />
      <div style={{position: 'absolute', left: 60, top: 92, height: 60}}>{tag(S.tag1, 'CREATE DATABASE', ' manzooma_store_db;', D.code)}</div>
      <div style={{position: 'absolute', left: 0, top: 92, width: 1920, display: 'flex', justifyContent: 'center', height: 60}}>{tag(S.tag2, 'Clones template1', ' ──► Allocates Physical Storage Directory (OID)', D.cat)}</div>

      <div style={{opacity: enter, transform: `translateY(${(1 - enter) * 40}px)`}}>
        <Code lines={LINES} t={t} x={60} y={190} w={1800} h={140} title="psql — postgres" fontSize={34} lineH={58} />
      </div>

      {/* template1 -> clone -> new database container */}
      <div style={{position: 'absolute', left: 180, top: 400, opacity: enter}}>
        <Folder w={380} h={280} color={D.cat} title="template1" sub="القاعدة المرجعية" glow={14 + 14 * Math.sin(clone * Math.PI)} />
      </div>
      <svg width="1920" height="1080" style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
        <line x1="580" y1="540" x2={580 + 480 * split} y2="540" stroke={D.code} strokeWidth="5" strokeDasharray="4 14" strokeLinecap="round" strokeDashoffset={-t * 80} opacity={clone > 0 && clone < 1 ? 0.8 : 0} />
        {bits}
      </svg>
      {clone > 0 ? (
        <div style={{position: 'absolute', left: copyX, top: 400, opacity: Math.min(1, clone * 6), transform: `scale(${copyScale})`, transformOrigin: '0 50%'}}>
          <Folder w={440} h={280} color={D.code} title={settle > 0.99 ? rename || 'manzooma_store_db' : 'template1'} sub={settle > 0.99 ? 'قاعدة منظومة ستور' : undefined} glow={22 + 22 * snapGlow + 26 * finalGlow} />
        </div>
      ) : null}

      {/* UTF8 badge */}
      {utfP > 0.01 ? (
        <div style={{position: 'absolute', left: 1560, top: 420, width: 300, opacity: Math.min(1, utfP * 1.5), transform: `scale(${0.7 + 0.3 * utfP})`, transformOrigin: '0 0'}}>
          <div style={{padding: '16px 22px', borderRadius: 20, background: `${D.cat}1F`, border: `2px solid ${D.cat}`, boxShadow: `0 0 30px ${D.cat}55`}}>
            <div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 30, color: D.cat}}>ENCODING 'UTF8'</div>
            <div style={{display: 'flex', gap: 14, marginTop: 10, fontFamily: FONT_AR, fontWeight: 800, fontSize: 40, color: C.text}}>
              <span>ع</span><span>ä</span><span>日</span><span>€</span>
            </div>
            <div style={{fontFamily: FONT_AR, fontWeight: 600, fontSize: 21, color: C.dim, direction: 'rtl', marginTop: 6}}>العربية والرموز الدولية ✓</div>
          </div>
        </div>
      ) : null}

      {/* OID card dropping into PGDATA/base/16384 */}
      {oidP > 0.01 && !snapped ? (
        <div style={{position: 'absolute', left: mix(1170, 1000, drop), top: mix(300 + 520 * 0, 790, drop) + mix(180, 0, 1 - drop) * 0, opacity: Math.min(1, oidP * 1.5), transform: `scale(${0.6 + 0.4 * oidP})`}}>
          <div style={{padding: '10px 26px', borderRadius: 16, background: D.code, color: C.bg, fontFamily: FONT_MONO, fontWeight: 800, fontSize: 36, boxShadow: `0 0 34px ${D.code}`}}>OID: 16384</div>
        </div>
      ) : null}

      {/* physical path + directory listing */}
      <div style={{position: 'absolute', left: 180, top: 760, width: 1500, opacity: appear(t, 62, 63)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, fontFamily: FONT_MONO, fontWeight: 700, fontSize: 32}}>
          <svg width="46" height="46" viewBox="0 0 46 46" fill="none" stroke={C.dim} strokeWidth="3.5" strokeLinecap="round"><rect x="4" y="8" width="38" height="30" rx="6" /><circle cx="33" cy="26" r="3" fill={C.dim} /><path d="M10 26h14" /></svg>
          {['PGDATA', 'base'].map((p) => (
            <React.Fragment key={p}>
              <span style={{padding: '6px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.07)', color: C.text}}>{p}</span>
              <span style={{color: C.mute}}>/</span>
            </React.Fragment>
          ))}
          <span style={{padding: '6px 20px', borderRadius: 12, background: snapped ? `${D.code}33` : 'transparent', border: `2.5px ${snapped ? 'solid' : 'dashed'} ${D.code}`, color: snapped ? D.code : C.mute, minWidth: 130, textAlign: 'center', boxShadow: snapped ? `0 0 ${24 + 26 * snapGlow}px ${D.code}` : undefined, transform: `scale(${1 + 0.12 * snapGlow})`}}>{snapped ? '16384' : '????'}</span>
        </div>
        <div style={{display: 'flex', gap: 18, marginTop: 26}}>
          {[{n: '1', l: 'template1'}, {n: '4', l: 'template0'}, {n: '5', l: 'postgres'}, {n: '16384', l: 'manzooma_store_db'}].map((f, i) => {
            const mine = i === 3;
            const op = mine ? (snapped ? 1 : 0.0) : 0.55;
            return (
              <div key={f.n} style={{display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', borderRadius: 14, background: mine ? `${D.code}22` : 'rgba(255,255,255,0.05)', border: `2px solid ${mine ? D.code : 'rgba(255,255,255,0.12)'}`, opacity: op, transform: mine ? `scale(${0.7 + 0.3 * back(prog(t, S.disk, S.disk + 0.6))})` : undefined, boxShadow: mine ? `0 0 26px ${D.code}66` : undefined}}>
                <svg width="34" height="28" viewBox="0 0 34 28"><path d="M2 5q0-3 3-3h8l4 4h12q3 0 3 3v14q0 3-3 3H5q-3 0-3-3z" fill={mine ? D.code : C.mute} opacity="0.85" /></svg>
                <span style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 28, color: mine ? D.code : C.dim}}>{f.n}</span>
                <span style={{fontFamily: FONT_MONO, fontSize: 18, color: C.mute}}>{f.l}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
