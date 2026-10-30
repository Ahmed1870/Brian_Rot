import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, S, S3_BALANCE} from '../theme';
import {KText, Scene, fmt, prog} from '../components/common';

const FIXED = 50_000;
const PIVOT = {x: 540, y: 150};
const ARM = 380;

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const units = interpolate(f, [200, S3_BALANCE], [0, 500], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const after = interpolate(f, [S3_BALANCE + 60, S3_BALANCE + 200], [0, 40], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const totalUnits = units + after;
  const margin = totalUnits * 100;
  const balanced = f >= S3_BALANCE;
  const tilt = 14 * Math.max(-0.4, 1 - margin / FIXED); // + => right (fixed) heavier
  const rad = (tilt * Math.PI) / 180;
  // beam ends (left = contribution, right = fixed)
  const L = {x: PIVOT.x - ARM * Math.cos(rad), y: PIVOT.y - ARM * Math.sin(rad)};
  const R = {x: PIVOT.x + ARM * Math.cos(rad), y: PIVOT.y + ARM * Math.sin(rad)};
  const col = balanced ? C.green : C.white;
  const beamOp = prog(f, 10, 40);

  // breakeven chart
  const cx0 = 110, cx1 = 970, cyBase = 1600, cyTop = 1230;
  const maxU = 700;
  const ux = (u: number) => cx0 + ((cx1 - cx0) * u) / maxU;
  const uy = (v: number) => cyBase - ((cyBase - cyTop) * v) / 70_000;
  const lineU = Math.min(totalUnits, maxU);

  return (
    <Scene dur={S.s3.dur}>
      <KText at={5} top={90} size={62}>
        الربحية الحقيقية
      </KText>
      <KText at={25} top={180} size={42} color={C.dim} weight={700}>
        هامش المساهمة vs التكاليف الثابتة
      </KText>

      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, top: 260}} opacity={beamOp}>
        {/* stand */}
        <line x1={PIVOT.x} y1={PIVOT.y} x2={PIVOT.x} y2={650} stroke={C.slate} strokeWidth={10} />
        <line x1={400} y1={650} x2={680} y2={650} stroke={C.slate} strokeWidth={12} strokeLinecap="round" />
        {/* beam */}
        <line x1={L.x} y1={L.y} x2={R.x} y2={R.y} stroke={col} strokeWidth={14} strokeLinecap="round" />
        <circle cx={PIVOT.x} cy={PIVOT.y} r={18} fill={col} />
        {/* pans */}
        {[{p: L, c: balanced ? C.green : C.green}, {p: R, c: C.red}].map((o, i) => (
          <g key={i}>
            <line x1={o.p.x} y1={o.p.y} x2={o.p.x - 110} y2={o.p.y + 250} stroke={C.slate} strokeWidth={4} />
            <line x1={o.p.x} y1={o.p.y} x2={o.p.x + 110} y2={o.p.y + 250} stroke={C.slate} strokeWidth={4} />
            <path d={`M ${o.p.x - 140} ${o.p.y + 250} L ${o.p.x + 140} ${o.p.y + 250} Q ${o.p.x} ${o.p.y + 320} ${o.p.x - 140} ${o.p.y + 250}`} fill={o.c} />
          </g>
        ))}
        {/* pan labels */}
        <text x={L.x} y={L.y + 380} textAnchor="middle" fontSize={34} fontWeight={700} fill={C.dim}>مجموع هامش المساهمة</text>
        <text x={L.x} y={L.y + 435} textAnchor="middle" fontSize={50} fontWeight={900} fill={C.green} style={{fontVariantNumeric: 'tabular-nums'}}>{fmt(margin)}</text>
        <text x={R.x} y={R.y + 380} textAnchor="middle" fontSize={34} fontWeight={700} fill={C.dim}>التكاليف الثابتة</text>
        <text x={R.x} y={R.y + 435} textAnchor="middle" fontSize={50} fontWeight={900} fill={C.red}>50,000</text>
        <text x={R.x} y={R.y + 480} textAnchor="middle" fontSize={28} fontWeight={700} fill={C.dim}>إيجار + مرتبات + اشتراكات</text>
      </svg>

      {/* units counter */}
      <div className="absolute w-full text-center" style={{top: 1000, direction: 'rtl', opacity: prog(f, 120, 150)}}>
        <span style={{fontSize: 38, color: C.dim, fontWeight: 700}}>عدد القطع المباعة: </span>
        <span style={{fontSize: 100, fontWeight: 900, color: col, fontVariantNumeric: 'tabular-nums'}}>{Math.round(totalUnits)}</span>
      </div>

      {balanced ? (
        <KText at={S3_BALANCE} top={1130} size={64} color={C.green}>
          نقطة التعادل = 500 قطعة بالضبط
        </KText>
      ) : (
        <KText at={150} top={1130} size={44} color={C.dim} weight={700}>
          50,000 ÷ 100 = كم قطعة تغطي المصاريف؟
        </KText>
      )}

      {/* breakeven chart */}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <line x1={cx0} y1={cyBase} x2={cx1} y2={cyBase} stroke={C.slate} strokeWidth={3} />
        <line x1={cx0} y1={cyTop - 20} x2={cx0} y2={cyBase} stroke={C.slate} strokeWidth={3} />
        <line x1={cx0} y1={uy(FIXED)} x2={cx1} y2={uy(FIXED)} stroke={C.red} strokeWidth={6} strokeDasharray="14 10" opacity={prog(f, 140, 170)} />
        <line x1={cx0} y1={uy(0)} x2={ux(lineU)} y2={uy(lineU * 100)} stroke={C.green} strokeWidth={10} strokeLinecap="round" opacity={prog(f, 190, 210)} />
        {balanced && (
          <>
            <circle cx={ux(500)} cy={uy(FIXED)} r={22} fill={C.white} />
            <line x1={ux(500)} y1={uy(FIXED)} x2={ux(500)} y2={cyBase} stroke={C.white} strokeWidth={3} strokeDasharray="6 6" />
            <text x={ux(500)} y={cyBase + 48} textAnchor="middle" fontSize={36} fontWeight={900} fill={C.white}>500</text>
          </>
        )}
        <text x={cx1} y={uy(FIXED) - 16} textAnchor="end" fontSize={30} fontWeight={700} fill={C.red}>التكاليف الثابتة</text>
      </svg>

      <KText at={S3_BALANCE + 120} top={1700} size={52} color={C.green}>
        البيعة رقم 501 = أول ربح صافي حقيقي
      </KText>
      <KText at={S3_BALANCE + 300} top={1790} size={38} color={C.red} weight={700}>
        الإنفاق على التوسع قبل التعادل = انتحار مالي
      </KText>
    </Scene>
  );
};
