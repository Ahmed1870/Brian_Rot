import React from 'react';
import {useT, ramp, win} from '../lib/anim';
import {Shell, ListTable} from '../lib/PBI';
import {DaxCode} from '../lib/Dax';
import {Annot, Card, AR, Cursor} from '../lib/ui';
import {ILLUSTRATIVE_PIDS, TEST_SALES_PIDS, NAMES, uniq} from '../lib/data41';
import {a, BOUNDS} from '../sync';
import {COL} from '../theme';
import {Sfx} from '../lib/scene41';

export const S2_SFX: Sfx[] = [{t: BOUNDS[1], n: 'whoosh'}, {t: a(2, 3), n: 'pop'}, {t: a(2, 4), n: 'pop'}, {t: a(2, 5), n: 'pop'}, {t: a(2, 6), n: 'pop'}, {t: a(2, 8), n: 'pop'}, {t: a(2, 9), n: 'pop'}];

const rep = (v: number) => ILLUSTRATIVE_PIDS.filter((x) => x === v).length > 1;
const Code: React.FC<{x: number; y: number; w: number; code: string; o: number; border?: string}> = ({x, y, w, code, o, border = COL.line}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, opacity: o, border: `2px solid ${border}`, background: '#fff', padding: '10px 16px', boxSizing: 'border-box'}}>
    <DaxCode code={code} size={24} />
  </div>
);

export const Scene2: React.FC = () => {
  const T = useT();
  const o0 = ramp(T, BOUNDS[1], 0.5);
  const phase2 = T >= a(2, 5, -0.3);
  const o1 = win(T, a(2, 0), a(2, 3, -0.2));
  const oA = win(T, a(2, 3), a(2, 5, -0.4));
  const oB = ramp(T, a(2, 5, -0.1), 0.4);
  const unknown = T >= a(2, 6);
  const normal = T >= a(2, 9);
  const testPids = normal ? [1, 2, 3, 4] : TEST_SALES_PIDS;
  const valsRows = normal ? NAMES : [...NAMES, ''];
  return (
    <div style={{position: 'absolute', inset: 0, opacity: o0}}>
      <Shell T={T} cur={{x: 1000, y: 600, press: 0}} tab="Modeling">
        {/* مفهوم عام */}
        <Card x={330} y={300} w={960} h={300} o={o1}>
          <div style={{...AR, textAlign: 'center', padding: '40px 20px 0', fontSize: 52, fontWeight: 700, color: COL.ink, direction: 'ltr', fontFamily: 'inherit'}}>VALUES · DISTINCT</div>
          <div style={{...AR, textAlign: 'center', padding: '20px 40px 0', fontSize: 42, color: COL.text}}>جدول بعمود واحد: القيم الفريدة، من غير تكرار</div>
        </Card>
        {/* مثال توضيحي: ProductID متكرر */}
        <ListTable x={150} y={260} w={420} head="Sales[ProductID]" foot="مثال توضيحي (مش من بيانات النموذج)" rows={ILLUSTRATIVE_PIDS} hlRow={(i) => (T >= a(2, 3, 0.4) && rep(ILLUSTRATIVE_PIDS[i]) ? COL.amberSoft : undefined)} o={oA} rowH={44} />
        <div style={{position: 'absolute', left: 620, top: 450, opacity: ramp(T, a(2, 4), 0.4) * (1 - ramp(T, a(2, 5, -0.4), 0.3)), fontSize: 70, color: COL.blue}}>→</div>
        <Code x={720} y={260} w={560} code={'VALUES ( Sales[ProductID] )'} o={ramp(T, a(2, 4), 0.4) * (1 - ramp(T, a(2, 5, -0.4), 0.3))} />
        <ListTable x={720} y={350} w={300} head="القيم الفريدة" rows={uniq(ILLUSTRATIVE_PIDS)} o={ramp(T, a(2, 4, 1.2), 0.4) * (1 - ramp(T, a(2, 5, -0.4), 0.3))} rowH={44} />
        {/* المقارنة + نسخة الاختبار */}
        {phase2 ? (
          <>
            <ListTable x={130} y={290} w={330} head="Sales[ProductID]" rows={testPids} hlRow={(i) => (!normal && testPids[i] === 99 ? COL.redSoft : undefined)} o={oB} rowH={44} foot={normal ? 'النموذج الأساسي' : 'نسخة اختبار منفصلة: 99 مش موجود في Products'} />
            <Code x={510} y={230} w={520} code={'VALUES ( Products[Product] )'} o={oB} border={unknown && !normal ? COL.amber : COL.line} />
            <ListTable x={510} y={310} w={520} head="Product" rows={valsRows} hlRow={(i) => (valsRows[i] === '' ? COL.redSoft : undefined)} o={oB} rowH={44} foot={unknown && !normal ? 'صف Blank = العضو المجهول (Unknown member)' : undefined} />
            <Code x={1070} y={230} w={500} code={'DISTINCT ( Products[Product] )'} o={ramp(T, a(2, 8), 0.4)} border={COL.green} />
            <ListTable x={1070} y={310} w={500} head="Product" rows={NAMES} o={ramp(T, a(2, 8), 0.4)} rowH={44} foot={normal ? 'نفس نتيجة VALUES' : 'من غير العضو المجهول'} />
          </>
        ) : null}
        <Annot T={T} a={a(2, 3, 0.3)} b={a(2, 5, -0.3)} text="لو عمود {{ProductID}} بيتكرر، {{VALUES}} بترجع كل قيمة مرة واحدة" />
        <Annot T={T} a={a(2, 5)} b={a(2, 7)} tone="warn" text="{{VALUES}} ممكن تضيف صف {{Blank}} لو فيه {{ProductID}} مالوش مقابل في Products" />
        <Annot T={T} a={a(2, 7)} b={a(2, 8, 2.5)} text="الـ {{Blank}} ده هو العضو المجهول في النموذج" />
        <Annot T={T} a={a(2, 8, 2.6)} b={a(2, 9)} tone="ok" text="{{DISTINCT}} مش بتضيف العضو المجهول الخاص بمشكلة العلاقة" />
        <Annot T={T} a={a(2, 9)} b={BOUNDS[2] + 0.5} text="في النموذج السليم: نفس النتيجة غالبًا" />
      </Shell>
      <Cursor c={{x: 1000, y: 600, press: 0}} show={0} />
    </div>
  );
};
