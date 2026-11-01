import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S, S2_ROWA, S2_ROWB} from '../theme';
import {KText, Scene, Stack, fmt, prog} from '../components/common';

const BAR_W = 920;

const Row: React.FC<{
  top: number;
  at: number;
  color: string;
  header: string;
  barLabel: string;
  value: number; // 0..1
  big: string;
  bigColor: string;
  sub: string;
  result: string;
  resultAt: number;
}> = ({top, at, color, header, barLabel, value, big, bigColor, sub, result, resultAt}) => {
  const f = useCurrentFrame();
  return (
    <div className="absolute w-full flex flex-col items-center" style={{top, gap: 14, direction: 'rtl'}}>
      <KText at={at} size={50}>{header}</KText>
      <div style={{opacity: prog(f, at + 20, at + 40), width: BAR_W, height: 30, background: 'rgba(100,116,139,0.35)', borderRadius: 15, direction: 'ltr'}}>
        <div style={{width: BAR_W * value, height: 30, background: color, borderRadius: 15}} />
      </div>
      <div style={{opacity: prog(f, at + 20, at + 40), fontSize: 34, fontWeight: 700, color: C.dim}}>{barLabel}</div>
      <KText at={at + 40} size={80} color={bigColor} style={{lineHeight: 1.1}}>{big}</KText>
      <KText at={at + 40} size={38} color={C.dim} weight={700}>{sub}</KText>
      <KText at={resultAt} size={50} color={color}>{result}</KText>
    </div>
  );
};

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const calls = prog(f, S2_ROWA + 60, S2_ROWA + 360);
  const deals = prog(f, S2_ROWB + 60, S2_ROWB + 330);

  return (
    <Scene dur={S.s2.dur}>
      <Stack top={90} gap={8}>
        <KText at={5} size={68}>فخ الحوافز المنحرفة</KText>
        <KText at={25} size={36} color={C.dim} weight={700} ltr>Perverse Incentives Hazard</KText>
      </Stack>

      {/* Row A: y 300 - ~690 */}
      <Row
        top={310}
        at={S2_ROWA}
        color={C.red}
        header="مكافأة على عدد المكالمات"
        barLabel="المكالمات"
        value={calls}
        big={`${fmt(calls * 100)} مكالمة | 0 صفقة`}
        bigColor={C.red}
        sub="نشاط كتير... ونتيجة صفر"
        result="الحافز بيخلق ضوضاء مش أرباح"
        resultAt={S2_ROWA + 400}
      />

      {/* Row B: y 790 - ~1180 */}
      <Row
        top={790}
        at={S2_ROWB}
        color={C.green}
        header="مكافأة على إغلاق الصفقات"
        barLabel="الصفقات المقفولة"
        value={deals}
        big={`${fmt(deals * 30)} صفقة`}
        bigColor={C.green}
        sub="سلوك موجّه للنتيجة النهائية"
        result="أرباح حقيقية داخلة"
        resultAt={S2_ROWB + 340}
      />

      {/* Examples zone: y 1290+ */}
      <Stack top={1290} gap={16}>
        <KText at={1050} size={40} color={C.dim} weight={700}>نفس الفخ في كل مكان</KText>
        <KText at={1100} size={46} color={C.white} weight={700}>مكافأة على أسطر الكود ← كود معقد ومليان أخطاء</KText>
        <KText at={1250} size={52} color={C.green}>الحافز بيحدد السلوك... مش طلبك في الاجتماع</KText>
      </Stack>
    </Scene>
  );
};
