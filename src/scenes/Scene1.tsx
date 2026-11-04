import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Caption, Chip, Mix, Stage, TopBadge, clamp, lerp, pop, prog, sec} from '../kit';

// SC01 (frames 0-1200): a scalar subquery collapses into ONE cell ($45.50) that feeds the outer query.
const t = (g: number) => sec(g);
const PRICES = [12, 18, 25, 32, 40, 55, 68, 114];
const AVG = 45.5;
const BX = 620;
const BASE = 890;

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const q = prog(f, t(2.5), 24) * (1 - prog(f, t(19.4), 14));
  const float = prog(f, t(20.0), 22);
  const comp = prog(f, t(26.1), sec(2.6));
  const tag = pop(f, t(29.5));
  const slide = prog(f, t(33.3), sec(2.2));
  const line = prog(f, t(36.0), 24);
  const outer = prog(f, t(20.0), 24);
  const glow = 0.5 + 0.5 * Math.sin(f / 8);

  const innerW = lerp(560, 170, comp);
  const totalW = innerW + 110;
  const cx = lerp(960, 908 + 55 - 55, slide);
  const cy = lerp(380, 641, slide);
  const slotOpen = slide < 0.98;

  return (
    <Stage dur={1200} inFx="none" outFx="zoom">
      <TopBadge text="الاستعلامات الفرعية القياسية | Scalar Subqueries (1x1 Output)" from={t(2)} to={t(18)} color={C.blue} />

      {/* question */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 190, textAlign: 'center', opacity: q}}>
        <Mix style={{fontSize: 52, fontWeight: 700, color: C.text}}>المنتجات الأعلى من متوسط سعر المتجر؟</Mix>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 30, color: C.amber, marginTop: 14}}>AVG(unit_price) = ?</div>
      </div>

      {/* floating subquery -> single cell */}
      <div style={{position: 'absolute', left: cx - totalW / 2, top: cy - 60, width: totalW, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: float, transform: `scale(${0.9 + 0.1 * float})`}}>
        <span style={{fontFamily: MONO, fontSize: 130, color: C.blue, textShadow: `0 0 ${24 + 10 * glow}px ${C.blue}`, lineHeight: 1}}>(</span>
        <div dir="ltr" style={{position: 'relative', width: innerW, height: 70, overflow: 'hidden'}}>
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap', fontFamily: MONO, fontSize: 25, color: C.text, opacity: clamp(1 - comp * 2)}}>
            SELECT AVG(unit_price) FROM products
          </div>
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 14, background: `${C.green}26`, border: `3px solid ${C.green}`, boxShadow: `0 0 ${24 * glow}px ${C.green}66`, fontFamily: MONO, fontSize: 36, fontWeight: 700, color: C.green, opacity: clamp(comp * 2 - 1)}}>
            $45.50
          </div>
        </div>
        <span style={{fontFamily: MONO, fontSize: 130, color: C.blue, textShadow: `0 0 ${24 + 10 * glow}px ${C.blue}`, lineHeight: 1}}>)</span>
      </div>
      <div dir="ltr" style={{position: 'absolute', left: 0, right: 0, top: cy + 70, textAlign: 'center', opacity: clamp(tag) * (1 - slide), transform: `scale(${clamp(tag)})`}}>
        <Chip color={C.green} style={{fontSize: 26}}>1 row × 1 column = Scalar Value</Chip>
      </div>

      {/* outer query */}
      <div dir="ltr" style={{position: 'absolute', left: 470, top: 560, fontFamily: MONO, fontSize: 30, lineHeight: '54px', color: C.text, opacity: outer}}>
        <div><span style={{color: C.blue, fontWeight: 700}}>SELECT</span> product_name, unit_price <span style={{color: C.blue, fontWeight: 700}}>FROM</span> products</div>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <span><span style={{color: C.blue, fontWeight: 700}}>WHERE</span> unit_price &gt;&nbsp;</span>
          <div style={{width: 200, height: 52, borderRadius: 12, border: `2px dashed ${C.muted}`, opacity: slotOpen ? 1 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted}}>( ? )</div>
          {!slotOpen && <span style={{marginLeft: -200, width: 200, textAlign: 'center', color: C.green, fontWeight: 700}}>(45.50)</span>}
        </div>
      </div>

      {/* price bars + average line */}
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        {PRICES.map((p, i) => {
          const a = prog(f, t(6.9) + i * 8, 20);
          const above = p > AVG && line > 0.6;
          return (
            <g key={i} opacity={a}>
              <rect x={BX + i * 86} y={BASE - p * 1.0 * a} width={70} height={p * a} rx={6} fill={above ? C.green : '#475569'} />
              <text x={BX + i * 86 + 35} y={BASE - p * a - 8} textAnchor="middle" fontFamily={MONO} fontSize={18} fill={C.muted}>{p}</text>
            </g>
          );
        })}
        <g opacity={line}>
          <line x1={BX - 20} x2={BX + 8 * 86} y1={BASE - AVG} y2={BASE - AVG} stroke={C.green} strokeWidth={4} strokeDasharray="12 8" />
          <text x={BX + 8 * 86 + 10} y={BASE - AVG + 6} fontFamily={MONO} fontSize={24} fontWeight={700} fill={C.green}>$45.50</text>
        </g>
      </svg>

      <Caption text="Inner Subquery ──► Evaluates to a Single Scalar Value ($45.50)" from={t(22)} to={t(38)} />
    </Stage>
  );
};
