import {useCurrentFrame} from "remotion";
import {LogoBadge, clamp, eo, lerp, prog, rgba} from "../kit";
import {C, F} from "../theme";
import {anchor} from "./common";

const a = (k: number) => anchor(5, k);
const SKILLS: [string, string][] = [
  ["4 data types: ", "Text · Number · Date · Boolean"],
  ["Dates are serial numbers: ", "46023 = 1/1/2026"],
  ["Custom format: ", "Positive ; Negative ; Zero ; Text"],
  ["Millions: ", '$#,##0.0,, "M"'],
  ["Color & arrows: ", "[Color10]▲ / [Red]▼"],
];
const glass = {background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.16)", borderRadius: 28, boxSizing: "border-box" as const};

export const Sc6 = () => {
  const f = useCurrentFrame();
  const pk = eo(prog(f, 0, 20));
  const badge = eo(prog(f, a(1), 18));
  const fill = eo(prog(f, a(1) + 20, 140)) * 14;
  const dl = eo(prog(f, a(2), 18));
  const nx = eo(prog(f, a(4), 20));
  return (
    <div style={{position: "absolute", left: 0, top: 0, width: 1920, height: 1080, background: `radial-gradient(1200px 700px at 20% 10%, #12304A 0%, ${C.slate} 60%)`, fontFamily: F.ui, color: C.ink, overflow: "hidden"}}>
      <div style={{position: "absolute", left: 0, top: 0, width: 1920, height: 1080, backgroundImage: "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)", backgroundSize: "60px 60px"}} />
      <div style={{position: "absolute", left: 110, top: 70, display: "flex", alignItems: "center", gap: 28, opacity: pk, transform: `translateY(${(1 - pk) * -16}px)`}}>
        <LogoBadge s={112} />
        <div>
          <div dir="rtl" style={{fontFamily: F.ar, fontSize: 46, fontWeight: 700}}>منظومة أكاديمي</div>
          <div style={{fontSize: 38, fontWeight: 700, color: C.emerald, marginTop: 2}}>Manzooma Excel Masterclass</div>
        </div>
      </div>
      <div style={{...glass, position: "absolute", left: 110, top: 260, width: 1040, height: 710, padding: "44px 54px", opacity: badge, transform: `translateY(${(1 - badge) * 24}px)`}}>
        <div style={{display: "flex", alignItems: "center", gap: 22}}>
          <svg width="76" height="76" viewBox="0 0 84 84"><circle cx="42" cy="42" r="38" fill={rgba(C.emerald, 0.2)} stroke={C.emerald} strokeWidth="5" /><path d="M24 43 L37 56 L61 28" fill="none" stroke={C.emerald} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <div>
            <div style={{fontSize: 30, color: C.emerald, fontWeight: 700}}>Lesson 02 Completed</div>
            <div style={{fontSize: 40, fontWeight: 700, marginTop: 2}}>Custom Number Formatting Mastered</div>
          </div>
        </div>
        <div style={{marginTop: 34, fontSize: 24, color: "#CBD5E1", display: "flex", justifyContent: "space-between"}}><span>Unit 1 · Architecture & Smart Interface</span><span style={{color: C.emerald, fontWeight: 700}}>{Math.round(fill)}%</span></div>
        <div style={{marginTop: 12, height: 22, borderRadius: 11, background: "rgba(255,255,255,0.1)", overflow: "hidden"}}><div style={{width: `${(fill / 14) * 14}%`, height: "100%", background: `linear-gradient(90deg, ${C.green}, ${C.emerald})`, borderRadius: 11}} /></div>
        <div style={{marginTop: 34}}>
          {SKILLS.map(([l, v], i) => {
            const k = eo(prog(f, a(1) + 30 + i * 26, 14));
            return (
              <div key={i} style={{display: "flex", alignItems: "center", gap: 18, fontSize: 28, marginBottom: 18, opacity: k, transform: `translateX(${(1 - k) * 24}px)`}}>
                <span style={{color: C.emerald, fontWeight: 700, fontSize: 34}}>✓</span>
                <span style={{color: "#CBD5E1"}}>{l}<span style={{color: C.ink, fontFamily: F.mono, fontSize: 25}}>{v}</span></span>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{...glass, position: "absolute", left: 1210, top: 260, width: 600, height: 210, padding: "30px 38px", opacity: dl, transform: `translateY(${(1 - dl) * 24}px)`}}>
        <div dir="rtl" style={{fontFamily: F.ar, fontSize: 30, fontWeight: 700}}>الملفات والتدريبات</div>
        <div dir="ltr" style={{marginTop: 22, padding: "14px 22px", borderRadius: 14, background: rgba(C.emerald, 0.14), border: `2px solid ${C.emerald}`, fontFamily: F.mono, fontSize: 28, fontWeight: 700, color: C.emerald, textAlign: "center"}}>solutions.gomaaintelligence.me</div>
      </div>
      <div style={{...glass, position: "absolute", left: 1210, top: 500, width: 600, height: 470, padding: "30px 38px", opacity: nx, transform: `translateY(${(1 - nx) * 30}px) scale(${lerp(0.96, 1, nx)})`}}>
        <div dir="rtl" style={{fontFamily: F.ar, fontSize: 28, color: C.blue, fontWeight: 700}}>الدرس القادم</div>
        <div dir="rtl" style={{fontFamily: F.ar, fontSize: 34, fontWeight: 700, marginTop: 10, lineHeight: 1.5}}>الدرس 3: إدارة أوراق العمل وتثبيت الصفوف <span dir="ltr" style={{fontFamily: F.ui, color: C.blue}}>Freeze Panes</span></div>
        <svg width="520" height="180" viewBox="0 0 520 180" style={{marginTop: 18}}>
          <rect x="0" y="0" width="520" height="180" rx="12" fill="#fff" />
          <rect x="0" y="0" width="520" height="30" fill="#F2F2F2" />
          <rect x="0" y="0" width="44" height="180" fill="#F2F2F2" />
          {[1, 2, 3, 4, 5].map((i) => <line key={"h" + i} x1="0" y1={30 + i * 30} x2="520" y2={30 + i * 30} stroke="#E1E1E1" />)}
          {[1, 2, 3, 4, 5, 6].map((i) => <line key={"v" + i} x1={44 + i * 79} y1="0" x2={44 + i * 79} y2="180" stroke="#E1E1E1" />)}
          <line x1="0" y1="60" x2="520" y2="60" stroke={C.green} strokeWidth="4" />
          <line x1="123" y1="0" x2="123" y2="180" stroke={C.green} strokeWidth="4" />
          <rect x="0" y="0" width="520" height="180" rx="12" fill="none" stroke={C.blue} strokeWidth="3" />
        </svg>
      </div>
    </div>
  );
};
void clamp;
