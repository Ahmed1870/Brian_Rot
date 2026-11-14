// SC02 — Stage 1: Power Query ETL & Star Schema Data Model (00:40-01:25).
import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Stage, TopBadge, Caption, Check, Mix} from '../kit';
import {STAR_SCHEMA} from '../data';

const SC = {from: 1200, dur: 1350};

export const Scene2: React.FC = () => {
  const local = useCurrentFrame();

  // Power Query ETL (0-540)
  const etlP = interpolate(local, [0, 360], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const stepP = (i: number) => interpolate(local, [60 + i * 80, 120 + i * 80], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Star Schema reveal (540-900)
  const starP = interpolate(local, [540, 720], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const linkP = (i: number) => interpolate(local, [720 + i * 80, 800 + i * 80], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Final seal
  const sealP = interpolate(local, [1080, 1200], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const etlSteps = [
    {n: '01', l: 'From Folder', sub: 'سحب ملفات المبيعات الخام'},
    {n: '02', l: 'Cleanse Text', sub: 'تنظيف النصوص والمسافات'},
    {n: '03', l: 'Standardize Types', sub: 'توحيد أنواع البيانات'},
    {n: '04', l: 'Load to Model', sub: 'تحميل لنموذج البيانات'},
  ];

  return (
    <Stage dur={SC.dur} inFx="left" outFx="left">
      <TopBadge text="Stage 1: Automated ETL Pipeline ──► Power Query Folder Ingestion & Cleansing" from={60} to={720} color={C.green} />

      {/* LEFT: Power Query ETL steps */}
      <div style={{position: 'absolute', left: 80, top: 180, width: 720, height: 680, opacity: etlP}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14}}>
          <div style={{width: 44, height: 44, borderRadius: 8, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width="22" height="22" viewBox="0 0 22 22"><path d="M3 11 H8 M11 6 V16 M14 11 H19" fill="none" stroke="#0B1222" strokeWidth="2" strokeLinecap="round" /><circle cx="11" cy="11" r="3" fill="none" stroke="#0B1222" strokeWidth="1.5" /></svg>
          </div>
          <div style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.green}}>{'Power Query ETL'}</div>
        </div>

        <div style={{background: C.card, border: `2px solid ${C.green}`, borderRadius: 12, padding: 18, height: 580, boxShadow: `0 0 30px ${C.green}33`}}>
          {/* Editor header */}
          <div style={{display: 'flex', alignItems: 'center', padding: '8px 12px', background: C.deep, borderRadius: 6, marginBottom: 16, fontFamily: MONO, fontSize: 13, color: C.muted}}>
            {'Power Query Editor — manzooma_sales'}
          </div>

          {/* ETL steps */}
          {etlSteps.map((s, i) => {
            const p = stepP(i);
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', opacity: p, transform: `translateY(${(1 - p) * 16}px)`, borderBottom: i < etlSteps.length - 1 ? `1px solid ${C.border}` : 'none'}}>
                <div style={{width: 40, height: 40, borderRadius: 6, background: p > 0.5 ? C.green : C.deep, border: `1px solid ${C.green}`, color: p > 0.5 ? '#0B1222' : C.green, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 12, fontWeight: 700}}>
                  {s.n}
                </div>
                <div style={{flex: 1}}>
                  <div style={{fontFamily: FONT, fontSize: 16, fontWeight: 700, color: C.text}}>{s.l}</div>
                  <div style={{fontFamily: FONT, fontSize: 12, color: C.muted, marginTop: 2}}>{s.sub}</div>
                </div>
                {p > 0.5 && <Check size={24} p={1} />}
              </div>
            );
          })}

          {/* Refresh All button */}
          <div style={{marginTop: 20, padding: 14, background: `${C.green}22`, border: `1px solid ${C.green}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10}}>
            <svg width="20" height="20" viewBox="0 0 20 20"><path d="M3 10 a7 7 0 1 1 14 0 a7 7 0 0 1 -10 5 M7 13 L7 9 L4 12" fill="none" stroke={C.green} strokeWidth="1.5" strokeLinecap="round" /></svg>
            <span style={{fontFamily: FONT, fontSize: 16, fontWeight: 700, color: C.green}}>{'Refresh All — تحديث كامل بضغطة'}</span>
          </div>
        </div>
      </div>

      {/* RIGHT: Star Schema Diagram */}
      <div style={{position: 'absolute', right: 80, top: 180, width: 1000, height: 680, opacity: starP}}>
        <div style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 14}}>{'Star Schema · Power Pivot Diagram View'}</div>

        <div style={{position: 'relative', width: '100%', height: 580, background: C.card, border: `2px solid ${C.green}`, borderRadius: 12, overflow: 'hidden', boxShadow: `0 0 30px ${C.green}33`}}>
          {/* SVG for connection lines */}
          <svg width="1000" height="580" style={{position: 'absolute', left: 0, top: 0}}>
            {STAR_SCHEMA.dims.map((dim, i) => {
              const p = linkP(i);
              const fx = STAR_SCHEMA.fact.x + STAR_SCHEMA.fact.w / 2;
              const fy = STAR_SCHEMA.fact.y + STAR_SCHEMA.fact.h / 2;
              const dx = dim.x + dim.w / 2;
              const dy = dim.y + dim.h / 2;
              return (
                <g key={i} opacity={p}>
                  <line x1={fx} y1={fy} x2={dx} y2={dy} stroke={C.green} strokeWidth="2" strokeDasharray="5 3" />
                  {/* 1-to-Many indicator */}
                  <circle cx={fx + (dx - fx) * 0.2} cy={fy + (dy - fy) * 0.2} r="8" fill={C.green} />
                  <text x={fx + (dx - fx) * 0.2} y={fy + (dy - fy) * 0.2 + 3} textAnchor="middle" fontSize="10" fontWeight="700" fill="#0B1222" fontFamily="monospace">1</text>
                  <circle cx={fx + (dx - fx) * 0.8} cy={fy + (dy - fy) * 0.8} r="8" fill="C.deep" stroke={C.green} strokeWidth="1.5" />
                  <text x={fx + (dx - fx) * 0.8} y={fy + (dy - fy) * 0.8 + 3} textAnchor="middle" fontSize="10" fontWeight="700" fill={C.green} fontFamily="monospace">*</text>
                </g>
              );
            })}
          </svg>

          {/* Fact table (center) */}
          <div style={{position: 'absolute', left: STAR_SCHEMA.fact.x, top: STAR_SCHEMA.fact.y, width: STAR_SCHEMA.fact.w, height: STAR_SCHEMA.fact.h, background: `linear-gradient(135deg, ${C.green}, ${C.blue})`, border: `2px solid ${C.green}`, borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: `0 0 30px ${C.green}88`}}>
            <div style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: '#fff'}}>{STAR_SCHEMA.fact.name}</div>
            <div style={{fontFamily: FONT, fontSize: 12, color: '#fff', opacity: 0.85, marginTop: 4}}>{'50,000 rows'}</div>
          </div>

          {/* Dimension tables */}
          {STAR_SCHEMA.dims.map((dim, i) => {
            const p = linkP(i);
            return (
              <div key={i} style={{position: 'absolute', left: dim.x, top: dim.y, width: dim.w, height: dim.h, opacity: p, background: C.deep, border: `2px solid ${C.green}`, borderRadius: 8, padding: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                <div style={{fontFamily: MONO, fontSize: 14, fontWeight: 700, color: C.green}}>{dim.name}</div>
                <div style={{fontFamily: MONO, fontSize: 11, color: C.muted, marginTop: 2}}>{dim.field}</div>
              </div>
            );
          })}

          {/* Legend */}
          <div style={{position: 'absolute', bottom: 16, left: 16, right: 16, display: 'flex', justifyContent: 'center', gap: 16, fontFamily: MONO, fontSize: 12}}>
            <span style={{color: C.green}}>{'● 1-to-Many relations'}</span>
            <span style={{color: C.blue}}>{'● Single-direction filter flow'}</span>
          </div>
        </div>
      </div>

      {/* Final seal */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 880, display: 'flex', justifyContent: 'center', opacity: sealP}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, background: C.card, border: `2px solid ${C.green}`, borderRadius: 999, padding: '12px 30px', boxShadow: `0 0 30px ${C.green}33`}}>
          <Check size={40} p={sealP} color={C.green} />
          <Mix style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.green}}>{'Star Schema Data Model ──► Fact_Sales Linked (1-to-Many) to 4 Dimensions'}</Mix>
        </div>
      </div>

      <Caption text="Stage 1: Automated ETL Pipeline ──► Power Query Folder Ingestion & Cleansing" from={60} to={720} tone="ok" />
      <Caption text="Star Schema Data Model ──► Fact_Sales Linked (1-to-Many) to Products, Customers, Branches & Date" from={840} to={1320} tone="ok" />
    </Stage>
  );
};
