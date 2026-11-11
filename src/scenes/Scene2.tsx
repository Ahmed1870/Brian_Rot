import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, SCENES, START} from '../theme';
import {Caption, Stage, prog, sec, Menu, menuItemY, ribbonItemBox, XL, camLerp, CAM0} from '../kit';
import {RangeFx} from '../l7';
import {GD_ITEMS, PQEditor, Pointer, STEP_VIEW, FB, dataTabPos, Wp} from '../lq';
import {Host} from '../l46';

// SC02 anchors (s, abs): 43.0 click Data | 43.8 group | 45.9 click Get Data | 49.2 click Launch | 50.4 editor opens | 59.3 ribbon | 61.9 queries | 63.9 preview | 66.0 settings | 70.8 recap
const S = START.s2;
const t = (g: number) => sec(g - S);
const GD = ribbonItemBox('Data', 'GetData');
const DT = dataTabPos();
const MENU = {x: GD.x, y: XL.title + XL.tabs + XL.ribbon, w: 250};
const LAUNCH = {x: MENU.x + 120, y: menuItemY(MENU.y, GD_ITEMS as any, 7)};
const PTS: Wp[] = [
  {f: 0, x: 760, y: 360}, {f: t(42.6), x: DT.x, y: DT.y}, {f: t(44.2), x: GD.cx, y: GD.cy}, {f: t(45.8), x: GD.cx, y: GD.cy}, {f: t(48.8), x: LAUNCH.x, y: LAUNCH.y}, {f: t(49.2), x: LAUNCH.x, y: LAUNCH.y},
];
const CLICKS = [t(43.0), t(45.9), t(49.3)];
const STEPS = ['Source', 'Navigation'];

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const tab = at(43.0) ? 'Data' : 'Home';
  const menuOn = at(45.9) && !at(49.5);
  const items = (GD_ITEMS as any[]).map((it, i) => ({...it, hot: i === 7 && at(48.6)}));
  const open = prog(f, t(50.3), 24);
  const z = (a: number, b: number) => prog(f, t(a), 8) * (1 - prog(f, t(b), 8));
  const recap = prog(f, t(70.8), 10) * (1 - prog(f, t(83.6), 14));
  const pulse = 0.55 + 0.25 * Math.sin(f * 0.12);
  const cam = camLerp(CAM0, CAM0, 0);
  return (
    <Stage dur={SCENES.s2.dur} inFx="zoom" outFx="left">
      <Host cam={cam} tab={tab} tabHot={at(42.5) && !at(43.2) ? 'Data' : undefined} ribbonHot={at(45.5) && !at(49.4) ? 'GetData' : undefined} glow={C.blue}>
        <RangeFx rect={{x: 6, y: XL.title + XL.tabs + 2, w: 440, h: 92}} color={C.blue} p={z(43.8, 45.7) * (tab === 'Data' ? 1 : 0)} fill={0.08} label="Get & Transform Data" labelBelow />
        {menuOn ? <Menu x={MENU.x} y={MENU.y} w={MENU.w} items={items} /> : null}
        {open > 0.01 ? (
          <PQEditor open={open} view={STEP_VIEW(STEPS, 1)} steps={STEPS} sel={1} fb={FB.Navigation}
            zones={{ribbon: z(59.3, 61.8) + recap * pulse * (f > t(70.8) ? 1 : 0), queries: z(61.9, 63.7) + recap * pulse, preview: z(63.9, 65.9) + recap * pulse, settings: z(66.0, 70.3) + recap * pulse}} />
        ) : null}
        <Pointer f={f} pts={PTS} clicks={CLICKS} hide={at(50.0)} />
      </Host>
      <Caption text="Launching Power Query ──► Data Tab ──► Get Data ──► Launch Power Query Editor" from={t(42.0)} to={t(59.0)} />
      <Caption text="4 Core Editor Zones ──► Ribbon | Queries | Data Preview | Applied Steps" from={t(70.8)} to={t(83.4)} tone="ok" />
    </Stage>
  );
};
