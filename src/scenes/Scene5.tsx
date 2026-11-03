import React from 'react';
import TL from '../timeline.json';
import {C, D, FONT_AR, FONT_MONO} from '../theme';
import {Bg} from '../components/Glass';
import {Code, CodeLine, highlight} from '../components/Code';
import {appear, pop} from '../components/Text';
import {back, eo, prog, pulse, seg} from '../lib/anim';

const S = TL.cues.sc05;
const LEFT: CodeLine[] = [
  {text: 'CREATE DATABASE', at: S.log, dt: 0.03},
  {text: 'CREATE TABLE', at: S.log + 0.9, dt: 0.03},
  {text: 'CREATE TABLE', at: S.log + 1.8, dt: 0.03},
  {text: 'SELECT table_name', at: S.q},
  {text: 'FROM information_schema.tables', at: S.q + 1.1},
  {text: "WHERE table_schema = 'public';", at: S.q + 2.6},
];
const DDL = [
  '-- Table: public.orders',
  'CREATE TABLE IF NOT EXISTS public.orders',
  '(',
  '    order_id integer NOT NULL GENERATED ALWAYS AS IDENTITY,',
  '    customer_id integer NOT NULL,',
  '    order_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,',
  '    total_amount numeric(10,2),',
  '    CONSTRAINT orders_pkey PRIMARY KEY (order_id),',
  '    CONSTRAINT fk_customer FOREIGN KEY (customer_id)',
  '        REFERENCES public.customers (customer_id)',
  '        ON UPDATE NO ACTION',
  '        ON DELETE RESTRICT,',
  '    CONSTRAINT orders_total_amount_check CHECK (total_amount >= 0::numeric)',
  ')',
];
const DDL_LINES: CodeLine[] = DDL.map((text, i) => ({text, at: S.ddlTab + 0.5 + i * 0.4, dt: 0.01}));
const TREE = ['Servers', 'PostgreSQL 16', 'Databases', 'manzooma_store_db', 'Schemas', 'public', 'Tables'];

export const Scene5: React.FC<{t: number}> = ({t}) => {
  const enter = appear(t, 173.7, 174.7);
  const resP = prog(t, S.scan, S.scan + 1.2);
  const scanY = prog(t, S.scan - 0.2, S.scan + 1.6);
  const winP = back(prog(t, 175.3, 176.3));
  const selOrders = t >= S.ddlTab - 1.4;
  const clickTab = Math.sin(prog(t, S.ddlTab - 0.3, S.ddlTab + 0.3) * Math.PI);
  const sqlActive = t >= S.ddlTab;
  const stamp = prog(t, S.stamp, S.stamp + 0.55);
  const stampP = stamp <= 0 ? 0 : stamp < 1 ? 1.8 - 0.8 * eo(stamp) : 1;
  const warm = 0.5 + 0.5 * pulse(t, 1.2);

  const tag = (range: number[], head: string, body: string, color: string) => {
    const p = pop(t, range[0], range[0] + 0.8) * (1 - seg(t, range[1] - 0.4, range[1]));
    if (p <= 0.01) return null;
    return (
      <div style={{display: 'inline-flex', alignItems: 'center', gap: 14, padding: '12px 28px', borderRadius: 16, background: `${color}22`, border: `2px solid ${color}`, fontFamily: FONT_MONO, fontWeight: 700, fontSize: 26, color: C.text, whiteSpace: 'nowrap', opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * -40}px)`, boxShadow: `0 0 30px ${color}44`}}>
        <span style={{color}}>{head}</span>
        <span>{body}</span>
      </div>
    );
  };

  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden'}}>
      <Bg t={t} />
      <div style={{position: 'absolute', left: 60, top: 92, height: 60}}>{tag(S.tag1, 'SELECT * FROM information_schema.tables;', '──► Schema Verification', D.code)}</div>
      <div style={{position: 'absolute', left: 60, top: 92, height: 60}}>{tag(S.tag2, 'pgAdmin DDL Tab', '──► Auto-Generated Reverse Engineering DDL', D.cat)}</div>

      {/* LEFT: query + result grid */}
      <div style={{opacity: enter, transform: `translateX(${(1 - enter) * -80}px)`}}>
        <Code lines={LEFT} t={t} x={60} y={190} w={860} h={350} title="psql — manzooma_store_db" fontSize={25} lineH={48} />
      </div>
      {resP > 0 ? (
        <div style={{position: 'absolute', left: 60, top: 570, width: 860, opacity: Math.min(1, resP * 2), transform: `translateY(${(1 - eo(resP)) * 60}px)`}}>
          <div style={{borderRadius: 22, background: '#0B1222', border: `2px solid ${D.cat}`, boxShadow: `0 0 34px ${D.cat}44`, overflow: 'hidden', position: 'relative'}}>
            <div style={{display: 'flex', height: 54, alignItems: 'center', padding: '0 28px', background: `${D.cat}26`, fontFamily: FONT_MONO, fontWeight: 800, fontSize: 24, color: D.cat}}>table_name</div>
            {['customers', 'orders'].map((n, i) => {
              const rp = back(prog(t, S.scan + 0.3 + i * 0.35, S.scan + 0.9 + i * 0.35));
              return (
                <div key={n} style={{display: 'flex', alignItems: 'center', gap: 18, height: 76, padding: '0 28px', borderTop: '1px solid rgba(71,85,105,0.5)', opacity: Math.min(1, rp * 2), transform: `translateX(${(1 - rp) * 60}px)`, background: `rgba(16,185,129,${0.08 + 0.08 * warm})`}}>
                  <svg width="34" height="30" viewBox="0 0 34 30" fill="none" stroke={D.cat} strokeWidth="3" strokeLinecap="round"><rect x="2" y="3" width="30" height="24" rx="4" /><path d="M2 11h30M13 11v16" /></svg>
                  <span style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 32, color: C.text}}>{n}</span>
                  <span style={{marginLeft: 'auto', padding: '4px 16px', borderRadius: 999, background: `${D.cat}26`, border: `1.5px solid ${D.cat}`, fontFamily: FONT_MONO, fontWeight: 700, fontSize: 18, color: D.cat}}>public</span>
                </div>
              );
            })}
            <div style={{height: 52, display: 'flex', alignItems: 'center', padding: '0 28px', fontFamily: FONT_MONO, fontSize: 22, color: C.dim, borderTop: '1px solid rgba(71,85,105,0.5)'}}>(2 rows)</div>
            {scanY > 0 && scanY < 1 ? <div style={{position: 'absolute', left: 0, right: 0, top: scanY * 280, height: 8, background: `linear-gradient(180deg, transparent, ${D.code}, transparent)`, opacity: 0.9}} /> : null}
          </div>
        </div>
      ) : null}

      {/* RIGHT: pgAdmin window */}
      <div style={{position: 'absolute', left: 960, top: 190, width: 900, height: 720, opacity: Math.min(1, winP * 1.5), transform: `translateX(${(1 - winP) * 140}px)`}}>
        <div style={{width: 900, height: 720, borderRadius: 22, background: '#0B1222', border: `2px solid ${sqlActive ? D.cat : C.line}`, boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 ${sqlActive ? 44 : 10}px ${D.cat}55`, overflow: 'hidden', position: 'relative'}}>
          <div style={{height: 52, background: '#111B31', borderBottom: `1.5px solid ${C.line}`, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12, fontFamily: FONT_MONO, fontSize: 21, color: C.dim}}>
            <svg width="26" height="26" viewBox="0 0 26 26"><circle cx="13" cy="13" r="12" fill="#336791" /><path d="M8 17c0-6 2-9 6-9s4 3 4 6-2 4-4 4" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" /></svg>
            pgAdmin 4
          </div>
          {/* tree */}
          <div style={{position: 'absolute', left: 0, top: 52, width: 250, bottom: 0, background: '#0E172B', borderRight: `1.5px solid ${C.line}`, padding: '16px 0'}}>
            {TREE.map((n, i) => (
              <div key={n} style={{padding: '5px 12px 5px ' + (14 + i * 12) + 'px', fontFamily: FONT_MONO, fontSize: 17, color: n === 'manzooma_store_db' ? D.code : C.dim, opacity: appear(t, 176 + i * 0.15, 176.6 + i * 0.15)}}>▸ {n}</div>
            ))}
            {['customers', 'orders'].map((n, i) => {
              const sel = n === 'orders' && selOrders;
              return (
                <div key={n} style={{margin: '2px 8px 2px ' + (14 + 7 * 12 + 4) + 'px', padding: '6px 12px', borderRadius: 8, fontFamily: FONT_MONO, fontWeight: sel ? 800 : 500, fontSize: 18, color: sel ? C.bg : C.dim, background: sel ? D.cat : 'transparent', opacity: appear(t, 177.8 + i * 0.2, 178.4 + i * 0.2), boxShadow: sel ? `0 0 18px ${D.cat}` : undefined}}>▦ {n}</div>
              );
            })}
          </div>
          {/* tabs */}
          <div style={{position: 'absolute', left: 250, right: 0, top: 52, height: 56, display: 'flex', background: '#111B31', borderBottom: `1.5px solid ${C.line}`}}>
            {['Dashboard', 'Properties', 'SQL'].map((n) => {
              const act = n === 'SQL' && sqlActive;
              return (
                <div key={n} style={{padding: '0 26px', display: 'flex', alignItems: 'center', gap: 10, fontFamily: FONT_MONO, fontWeight: act ? 800 : 500, fontSize: 21, color: act ? D.cat : C.mute, borderBottom: act ? `4px solid ${D.cat}` : '4px solid transparent', background: n === 'SQL' && clickTab > 0 ? `${D.cat}${Math.round(clickTab * 60 + 20).toString(16)}` : undefined}}>
                  {n}
                  {n === 'SQL' ? <span style={{fontSize: 15, padding: '2px 8px', borderRadius: 6, background: `${D.cat}33`, color: D.cat}}>DDL</span> : null}
                </div>
              );
            })}
          </div>
          {/* DDL pane */}
          {sqlActive ? (
            <div style={{position: 'absolute', left: 250, right: 0, top: 108, bottom: 0, padding: '14px 0 0 0'}}>
              {DDL_LINES.map((l, i) => {
                const n = Math.max(0, Math.min(l.text.length, Math.floor((t - l.at) / (l.dt || 0.01))));
                return (
                  <div key={i} style={{height: 36, display: 'flex', alignItems: 'center', fontFamily: FONT_MONO, fontSize: 16.5, whiteSpace: 'pre'}}>
                    <span style={{width: 46, textAlign: 'right', paddingRight: 14, color: '#334155', fontSize: 15, flexShrink: 0}}>{i + 1}</span>
                    <span>{highlight(l.text.slice(0, n))}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{position: 'absolute', left: 250, right: 0, top: 108, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_AR, fontWeight: 700, fontSize: 28, color: C.mute}}>{selOrders ? 'orders' : 'اختر جدولًا من الشجرة'}</div>
          )}
          {/* verified stamp */}
          {stampP > 0 ? (
            <div style={{position: 'absolute', right: 36, bottom: 34, opacity: Math.min(1, stamp * 4), transform: `rotate(-8deg) scale(${stampP})`, transformOrigin: '50% 50%'}}>
              <div style={{padding: '14px 30px', borderRadius: 18, border: `5px double ${D.cat}`, background: 'rgba(11,18,34,0.92)', boxShadow: `0 0 ${34 + 20 * warm}px ${D.cat}`, textAlign: 'center'}}>
                <div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 52, color: D.cat, lineHeight: 1}}>100% ✓</div>
                <div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 22, color: C.text, letterSpacing: 3, marginTop: 6}}>SCHEMA VERIFIED</div>
                <div style={{fontFamily: FONT_AR, fontWeight: 700, fontSize: 22, color: D.cat, marginTop: 2, direction: 'rtl'}}>البنية الهندسية سليمة</div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
