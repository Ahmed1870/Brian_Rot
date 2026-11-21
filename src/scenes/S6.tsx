import {useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {A, SCENES} from '../cues';
import type {Cues} from '../cues';
import {pop} from '../lib/anim';
import {Ltr} from '../lib/ui';
import {BG} from '../lib/pres';

const T = {f: A('a6_filter'), a: A('a6_all'), r: A('a6_rm'), e: A('a6_ae'), not: A('a6_not')};
const S0 = SCENES[5].from;
export const CUES6: Cues = {click: [], pop: [S0 + 8, T.f, T.a, T.r, T.e, T.not], key: []};

type Item = {name: string; color: string; badge: string; line: string; at: number; until: number};
const ITEMS: Item[] = [
  {name: 'FILTER', color: C.blue, badge: 'Table Result', line: 'بتختار صفوف بناءً على شرط وبتُرجع جدول', at: T.f, until: T.a},
  {name: 'ALL', color: C.purple, badge: 'Remove Filters / Return Table', line: 'بتزيل فلاتر، وممكن كمان ترجع جدول أو قيم', at: T.a, until: T.r},
  {name: 'REMOVEFILTERS', color: C.orange, badge: 'Filter Modifier', line: 'بتزيل الفلاتر فقط', at: T.r, until: T.e},
  {name: 'ALLEXCEPT', color: C.green, badge: 'Preserve Selected Columns', line: 'بتزيل فلاتر جدول معين مع الاحتفاظ بفلاتر الأعمدة اللي حددناها', at: T.e, until: T.not},
];

export const Scene6 = ({from}: {from: number}) => {
  const fr = useCurrentFrame() + from;
  const not = pop(fr, T.not, 12);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, background: BG, fontFamily: FONT}}>
      <div style={{position: 'absolute', left: 0, top: 60, width: 1920, textAlign: 'center', direction: 'rtl', fontSize: 54, fontWeight: 700, color: C.yellow, opacity: pop(fr, S0 + 6, 12)}}>خلونا نلخص الفرق</div>
      {ITEMS.map((it, i) => {
        const p = pop(fr, it.at, 12);
        const active = fr >= it.at && fr < it.until;
        return (
          <div key={it.name} style={{position: 'absolute', left: 60 + i * 450, top: 200 + (1 - p) * 20, width: 420, height: 560, opacity: p, background: 'rgba(255,255,255,0.07)', border: (active ? '6px' : '2px') + ' solid ' + it.color, boxSizing: 'border-box', direction: 'rtl', textAlign: 'center'}}>
            <div style={{height: 110, lineHeight: '110px', background: it.color, color: C.white, fontSize: it.name.length > 10 ? 36 : 50, fontWeight: 700, direction: 'ltr'}}>{it.name}</div>
            <div style={{margin: '28px 16px 0', padding: '10px 8px', border: '2px solid ' + it.color, color: C.white, fontSize: 28, fontWeight: 700, direction: 'ltr', lineHeight: 1.3}}>{it.badge}</div>
            <div style={{margin: '30px 20px 0', fontSize: 33, color: '#E2E8F0', lineHeight: 1.5}}>{it.line}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 160, top: 830, width: 1600, textAlign: 'center', direction: 'rtl', fontSize: 40, fontWeight: 700, color: C.yellow, opacity: not, transform: 'translateY(' + (1 - not) * 12 + 'px)'}}>
        الدوال دي مش بدائل متطابقة: اختيار الدالة حسب شكل الحساب المطلوب
      </div>
    </div>
  );
};
