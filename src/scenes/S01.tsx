import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_MONO, FONT_UI, FPS } from '../theme';
import { L } from '../lib/layout';
import { EditorView } from '../lib/code';
import { Appear, Caption, En, RP, VSChrome } from '../lib/ui';
import { ev, sent } from '../data/cues';
import { easeOut, fade, prog } from '../lib/util';
import out from '../data/outputs.json';

const CSV = ['revenue,orders,branch', '5000,120,Cairo'];

export const S01: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const f = [ev(1, 'f1').t, ev(1, 'f2').t, ev(1, 'f3').t];
  const m = [ev(1, 'm1').t, ev(1, 'm2').t, ev(1, 'm3').t];
  const showFile = fade(t, ev(1, 'file').t, 0.5);
  const marks = [
    { line: 1, from: 0, to: 4, kind: 'box' as const, color: C.green, a: fade(t, f[0], 0.3) },
    { line: 1, from: 5, to: 8, kind: 'box' as const, color: C.amber, a: fade(t, f[1], 0.3) },
    { line: 1, from: 9, to: 14, kind: 'box' as const, color: C.purple, a: fade(t, f[2], 0.3) },
  ];
  const rows = [
    { v: '5000', n: 'sales', c: C.green, at: m[0], l: 'الإيرادات' },
    { v: '120', n: 'orders', c: C.amber, at: m[1], l: 'عدد الطلبات' },
    { v: '"Cairo"', n: 'branch', c: C.purple, at: m[2], l: 'اسم الفرع' },
  ];
  const q = fade(t, sent(1, 0, 0.5), 0.5) * (1 - fade(t, m[0], 0.3));
  const chips = [
    { at: ev(1, 'c1').t, n: '١', text: 'معنى المتغير' },
    { at: ev(1, 'c2').t, n: '٢', text: 'أنواع البيانات الأساسية' },
    { at: ev(1, 'c3').t, n: '٣', text: 'تحويل القيمة من نوع لنوع' },
  ];
  return (
    <div style={{ display: 'contents' }}>
      <VSChrome tabs={[{ name: 'sales_report.csv', active: true }]} ln={2} col={15} pyVersion={out.python} />
      <div style={{ opacity: showFile }}>
        <EditorView x={L.edX} y={L.contentY} w={L.edW} h={170} lines={showFile > 0.05 ? CSV : ['']} fontSize={38} frame={frame} marks={marks} cursor={null} />
      </div>
      <div style={{ position: 'absolute', left: L.edX, top: 400, width: L.edW, textAlign: 'center', opacity: q, color: C.text, fontFamily: FONT_UI, fontWeight: 700, fontSize: 50, lineHeight: 1.6, direction: 'rtl' }}>
        إزاي نخزّن المعلومة<br />ونستخدمها وقت ما نحتاج؟
      </div>
      {rows.map((r, i) => {
        const k = easeOut(prog(t, r.at, r.at + 0.6));
        return (
          <div key={r.n} style={{ position: 'absolute', left: 100, top: 420 + i * 150, width: 940, height: 110, display: 'flex', alignItems: 'center', justifyContent: 'space-between', direction: 'ltr', opacity: k, transform: `translateX(${(1 - k) * -50}px)` }}>
            <div style={{ width: 260, height: 100, borderRadius: 20, background: `${r.c}22`, border: `4px solid ${r.c}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_MONO, fontSize: 46, color: r.c, fontWeight: 700 }}>{r.v}</div>
            <svg width={110} height={50} viewBox="0 0 140 60"><path d="M10 30 H110 M90 10 L120 30 L90 50" stroke={C.dim} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div style={{ width: 280, height: 100, borderRadius: 20, background: '#1F1F1F', border: `3px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_MONO, fontSize: 48, color: C.id, fontWeight: 700 }}>{r.n}</div>
            <div style={{ width: 200, textAlign: 'right', fontFamily: FONT_UI, fontSize: 32, color: r.c, direction: 'rtl' }}>{r.l}</div>
          </div>
        );
      })}
      <RP>
        <Appear t={t} at={ev(1, 'badge').t} style={{ width: '100%', height: 170, borderRadius: 26, background: `${C.accent}26`, border: `4px solid ${C.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.text, fontFamily: FONT_UI, fontWeight: 700, fontSize: 48, direction: 'rtl', flexShrink: 0 }}>
          اسم + قيمة = متغير&nbsp;<En>Variable</En>
        </Appear>
        {chips.map((c) => (
          <Appear key={c.n} t={t} at={c.at} style={{ width: '100%', height: 90, borderRadius: 18, background: C.panel, border: `2px solid ${C.line}`, display: 'flex', alignItems: 'center', gap: 22, padding: '0 28px', direction: 'rtl', color: C.text, fontFamily: FONT_UI, fontSize: 34, flexShrink: 0 }}>
            <span style={{ color: C.teal, fontWeight: 700, fontSize: 40 }}>{c.n}</span>{c.text}
          </Appear>
        ))}
      </RP>
      <Caption t={t} items={[{ at: sent(1, 0), text: 'نخزّن القيمة باسم واضح' }, { at: sent(1, 2), text: 'بدل تكرار القيم: اسم لكل قيمة' }, { at: sent(1, 4), text: 'متغيرات · أنواع · تحويل' }, { at: sent(1, 5), text: 'أساس تنظيم الكود بشكل واضح' }]} />
    </div>
  );
};
