import React from 'react';
import TL from '../timeline.json';
import {C, D, FONT_AR, FONT_MONO} from '../theme';
import {Bg} from '../components/Glass';
import {Code, CodeLine} from '../components/Code';
import {Bi, appear, pop} from '../components/Text';
import {back, eo, hash, mix, prog, pulse, seg} from '../lib/anim';

const S = TL.cues.sc01;
const ROWS_C = [['1259', 'pg_class', 'r', '11'], ['2619', 'pg_statistic', 'r', '11']];
const ROWS_A = [['1259', 'oid', '26', '1'], ['1259', 'relname', '19', '2']];
const NEW_C = ['16385', 'customers', 'r', '2200'];
const NEW_A = ['16385', 'customer_id', '23', '1'];
const CODE: CodeLine[] = [
  {text: '-- DDL: Data Definition Language', at: 3.4},
  {text: 'BEGIN;', at: 5.2},
  {text: 'CREATE TABLE customers (', at: 6.6},
  {text: '  customer_id INT', at: 8.4},
  {text: ');', at: 9.8},
  {text: '', at: 99},
  {text: 'ROLLBACK;', at: 35.0},
];
const CAT_X = 980;
const CAT_W = 880;
const COLS_C = ['oid', 'relname', 'relkind', 'relnamespace'];
const COLS_A = ['attrelid', 'attname', 'atttypid', 'attnum'];

const CatalogCard: React.FC<{t: number; y: number; name: string; ar: string; cols: string[]; rows: string[][]; fresh: string[]; reveal: number; undo: number; at: number; flashT: number}> = ({t, y, name, ar, cols, rows, fresh, reveal, undo, at, flashT}) => {
  const inP = back(prog(t, at, at + 0.8));
  const rowH = 52;
  const freshH = rowH * reveal * (1 - undo);
  return (
    <div style={{position: 'absolute', left: CAT_X, top: y, width: CAT_W, opacity: Math.min(1, inP * 1.5), transform: `translateX(${(1 - inP) * 120}px)`}}>
      <div style={{borderRadius: 24, background: 'linear-gradient(160deg, #1E293B, #172033)', border: `2.5px solid ${D.cat}`, boxShadow: `0 24px 60px rgba(0,0,0,0.5), 0 0 ${28 + 30 * flashT}px ${D.cat}${flashT > 0.1 ? 'AA' : '44'}`, overflow: 'hidden'}}>
        <div style={{height: 62, background: `linear-gradient(90deg, ${D.cat}44, ${D.cat}08)`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 26px'}}>
          <span style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 32, color: D.cat}}>{name}</span>
          <span style={{fontFamily: FONT_AR, fontWeight: 700, fontSize: 24, color: C.dim}}>{ar}</span>
        </div>
        <div style={{display: 'flex', height: 42, background: 'rgba(0,0,0,0.25)', fontFamily: FONT_MONO, fontWeight: 700, fontSize: 19, color: C.mute, alignItems: 'center'}}>
          {cols.map((c, i) => (
            <div key={c} style={{width: [150, 280, 160, 290][i], padding: '0 20px'}}>{c}</div>
          ))}
        </div>
        {rows.map((r, ri) => (
          <div key={ri} style={{display: 'flex', height: rowH, alignItems: 'center', fontFamily: FONT_MONO, fontSize: 23, color: C.dim, borderTop: '1px solid rgba(71,85,105,0.4)'}}>
            {r.map((c, i) => (
              <div key={i} style={{width: [150, 280, 160, 290][i], padding: '0 20px'}}>{c}</div>
            ))}
          </div>
        ))}
        <div style={{height: freshH, overflow: 'hidden', background: undo > 0 ? `rgba(239,68,68,${0.25 * (1 - undo)})` : 'rgba(56,189,248,0.14)', borderTop: freshH > 2 ? `1px solid ${D.code}` : undefined}}>
          <div style={{display: 'flex', height: rowH, alignItems: 'center', fontFamily: FONT_MONO, fontWeight: 800, fontSize: 23, color: undo > 0 ? '#FCA5A5' : D.code, boxShadow: reveal > 0.3 && undo === 0 ? `inset 0 0 28px ${D.code}55` : undefined}}>
            {fresh.map((c, i) => (
              <div key={i} style={{width: [150, 280, 160, 290][i], padding: '0 20px'}}>{c}</div>
            ))}
          </div>
        </div>
        <div style={{height: 14}} />
      </div>
    </div>
  );
};

export const Scene1: React.FC<{t: number}> = ({t}) => {
  const run = pop(t, S.particles[0] - 0.8, S.particles[0] - 0.1);
  const reveal = eo(prog(t, S.particles[0] + 0.8, S.particles[0] + 2.4));
  const undo = eo(prog(t, S.rollback, S.rollback + 1.4));
  const flashT = Math.sin(prog(t, S.particles[0] + 0.8, S.particles[0] + 2.4) * Math.PI);
  const shieldP = pop(t, S.shield, S.shield + 0.9);
  const warn = 0.5 + 0.5 * pulse(t, 1.2);
  const badgeP = pop(t, S.badge[0], S.badge[0] + 0.8) * (1 - seg(t, S.badge[1] - 0.4, S.badge[1]));
  const tagP = pop(t, S.tag[0], S.tag[0] + 0.8);
  const ddlPulse = Math.sin(prog(t, S.ddl - 0.3, S.ddl + 1.2) * Math.PI);

  // neon particles: code editor -> catalog rows
  const targets = [
    {x: CAT_X + 150, y: 190 + 64 + 42 + 2 * 52 + 26},
    {x: CAT_X + 150, y: 520 + 64 + 42 + 2 * 52 + 26},
  ];
  const parts: React.ReactNode[] = [];
  targets.forEach((tg, ti) => {
    for (let i = 0; i < 26; i++) {
      const t0 = S.particles[0] + i * 0.1 + ti * 0.05;
      const u = prog(t, t0, t0 + 0.9);
      if (u <= 0 || u >= 1) continue;
      const sx = 880 + hash(i + ti * 7) * 20;
      const sy = 330 + hash(i * 3 + ti) * 90;
      const cx = (sx + tg.x) / 2;
      const cy = Math.min(sy, tg.y) - 90 - hash(i) * 80;
      for (let k = 0; k < 4; k++) {
        const uu = Math.max(0, u - k * 0.045);
        const px = (1 - uu) * (1 - uu) * sx + 2 * (1 - uu) * uu * cx + uu * uu * tg.x;
        const py = (1 - uu) * (1 - uu) * sy + 2 * (1 - uu) * uu * cy + uu * uu * tg.y;
        parts.push(<circle key={`${ti}-${i}-${k}`} cx={px} cy={py} r={7 - k * 1.4} fill={D.code} opacity={(1 - k * 0.24) * (1 - u * 0.3)} style={{filter: k === 0 ? `drop-shadow(0 0 8px ${D.code})` : undefined}} />);
      }
    }
  });

  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden'}}>
      <Bg t={t} />

      <div style={{position: 'absolute', left: 0, top: 92, width: 1920, display: 'flex', justifyContent: 'center', opacity: Math.min(1, badgeP * 1.5), transform: `translateY(${(1 - badgeP) * -60}px)`}}>
        {badgeP > 0.01 ? (
          <div style={{padding: '16px 52px', borderRadius: 999, background: 'rgba(30,41,59,0.95)', border: `2px solid ${D.code}`, boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 ${30 + 18 * ddlPulse}px ${D.code}55`}}>
            <Bi ar="لغة تعريف البيانات" en="DDL (Data Definition Language)" size={52} t={t} start={S.badge[0] + 0.15} />
          </div>
        ) : null}
      </div>
      <div style={{position: 'absolute', left: 0, top: 96, width: 1920, display: 'flex', justifyContent: 'center', opacity: Math.min(1, tagP * 1.5), transform: `translateY(${(1 - tagP) * -60}px)`}}>
        {tagP > 0.01 ? (
          <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '14px 38px', borderRadius: 18, background: `${D.cat}1F`, border: `2px solid ${D.cat}`, fontFamily: FONT_MONO, fontWeight: 700, fontSize: 29, color: C.text, boxShadow: `0 0 34px ${D.cat}44`, whiteSpace: 'nowrap'}}>
            <span style={{color: D.code}}>DDL Execution</span>
            <svg width="64" height="20" viewBox="0 0 64 20"><line x1="0" y1="10" x2={50 * eo(prog(t, S.tag[0] + 0.3, S.tag[0] + 1))} y2="10" stroke={D.cat} strokeWidth="4" strokeLinecap="round" /><path d="M44 3 L58 10 L44 17" fill="none" stroke={D.cat} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity={prog(t, S.tag[0] + 0.8, S.tag[0] + 1.1)} /></svg>
            <span>Modifies System Catalogs <span style={{color: D.cat}}>(pg_class &amp; pg_attribute)</span></span>
          </div>
        ) : null}
      </div>

      {/* DDL editor */}
      <div style={{opacity: appear(t, 0.5, 1.4), transform: `translateX(${(1 - appear(t, 0.5, 1.4)) * -80}px)`}}>
        <Code lines={CODE} t={t} x={60} y={200} w={860} h={420} title="ddl_script.sql" />
      </div>
      {/* run button */}
      <div style={{position: 'absolute', left: 60, top: 640, opacity: Math.min(1, run * 1.5), transform: `scale(${0.8 + 0.2 * run})`, transformOrigin: '0 50%'}}>
        <div style={{display: 'inline-flex', alignItems: 'center', gap: 14, padding: '12px 32px', borderRadius: 14, background: D.code, color: C.bg, fontFamily: FONT_MONO, fontWeight: 800, fontSize: 28, boxShadow: `0 0 ${30 + 20 * Math.sin(prog(t, S.particles[0] - 0.2, S.particles[0] + 0.6) * Math.PI)}px ${D.code}`}}>
          <svg width="26" height="26" viewBox="0 0 26 26"><path d="M6 3 L22 13 L6 23 Z" fill={C.bg} /></svg>
          Execute DDL
        </div>
      </div>

      {/* catalog tables */}
      <CatalogCard t={t} y={200} name="pg_class" ar="كتالوج الجداول" cols={COLS_C} rows={ROWS_C} fresh={NEW_C} reveal={reveal} undo={undo} at={1.2} flashT={flashT} />
      <CatalogCard t={t} y={520} name="pg_attribute" ar="كتالوج الأعمدة" cols={COLS_A} rows={ROWS_A} fresh={NEW_A} reveal={reveal} undo={undo} at={1.7} flashT={flashT} />

      <svg width="1920" height="1080" style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>{parts}</svg>

      {/* transactional DDL shield */}
      {shieldP > 0.01 ? (
        <div style={{position: 'absolute', left: 60, top: 740, width: 860, opacity: Math.min(1, shieldP * 1.5), transform: `translateY(${(1 - shieldP) * 40}px) scale(${0.92 + 0.08 * shieldP})`, transformOrigin: '0 50%'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 26, padding: '18px 34px', borderRadius: 26, background: `${D.cat}1A`, border: `2.5px solid ${D.cat}`, boxShadow: `0 0 ${28 + 22 * warn}px ${D.cat}66`}}>
            <svg width="86" height="98" viewBox="0 0 86 98" fill="none">
              <path d="M43 4 L80 18 V48 C80 70 64 86 43 94 C22 86 6 70 6 48 V18 Z" fill={`${D.cat}33`} stroke={D.cat} strokeWidth="6" strokeLinejoin="round" />
              <path d="M27 48 L39 60 L61 34" stroke="#fff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
              <span style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 34, color: C.text}}>Transactional DDL</span>
              <span style={{fontFamily: FONT_AR, fontWeight: 700, fontSize: 28, color: D.cat, direction: 'rtl'}}>تراجع كامل بـ ROLLBACK قبل الاعتماد</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
