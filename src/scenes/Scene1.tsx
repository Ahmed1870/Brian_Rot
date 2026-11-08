import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, SCENES, START} from '../theme';
import {smallCell} from '../data';
import {CAM0, CAM_QAT, Caption, ExcelApp, ExcelWindow, KeyBadge, Neon, Stage, TOTAL_TABS_SWEEP, TopBadge, XL, camLerp, prog, sec, tabBox} from '../kit';

// SC01: anatomy of the Excel interface (4 core regions).
// Anchors (s): 1.76 lesson | 5.76 Excel 365 | 15.45 integrated workspace | 22.77 Ribbon | 24.18 Name Box | 26.03 Formula Bar | 27.8 Grid | 30.85 Status Bar | 36.1 workspace
const S = START.s1;
const t = (g: number) => sec(g - S);

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, CAM_QAT, prog(f, t(39.0), 58));
  // Ctrl+F1: collapse at 11.0, expand at 15.0
  const col = prog(f, t(11.0), 16);
  const exp = prog(f, t(15.0), 16);
  const ribbon = 1 - col * (1 - exp);
  const keyP = Math.max(prog(f, t(10.4), 8) * (1 - prog(f, t(13.2), 8)), prog(f, t(14.4), 8) * (1 - prog(f, t(17.2), 8)));
  // spotlight sweep over the tabs 5.9 -> 9.5
  const sweep = (f - t(5.9)) / sec(0.45);
  const tabIdx = sweep >= 0 && sweep < 8 ? Math.floor(sweep) : -1;
  const tabName = tabIdx >= 0 ? TOTAL_TABS_SWEEP[tabIdx] : undefined;
  const glowP = prog(f, t(1.76), 20) * (1 - prog(f, t(6.0), 20));
  const nRib = prog(f, t(22.77), 14), nName = prog(f, t(24.18), 14), nGrid = prog(f, t(27.8), 14), nStat = prog(f, t(30.85), 14);
  const tb = tabName ? tabBox(tabName) : null;
  return (
    <Stage dur={SCENES.s1.dur} inFx="fade" outFx="none">
      <ExcelWindow cam={cam} glow={glowP > 0.02 ? C.blue : undefined}>
        <ExcelApp
          file="Book1" ribbon={ribbon} tabHot={tabName} nameBox="A1" formula="Order ID"
          cell={smallCell} sel={{r1: 1, c1: 1, r2: 1, c2: 1}} active={{r: 1, c: 1}}
          thumb={0} thumbSize={0.55}
        >
          {tb ? <Neon x={tb.x} y={XL.title + 2} w={tb.w} h={XL.tabs - 2} color={C.blue} p={1} /> : null}
          <Neon x={0} y={XL.title} w={XL.W} h={XL.tabs + XL.ribbon} color={C.blue} p={nRib} label="Ribbon & Tabs" labelBelow />
          <Neon x={0} y={XL.title + XL.tabs + XL.ribbon} w={XL.W} h={XL.fbar} color={C.purple} p={nName} label="Name Box & Formula Bar" labelBelow />
          <Neon x={0} y={XL.title + XL.tabs + XL.ribbon + XL.fbar} w={XL.W - XL.vbar} h={XL.H - XL.status - XL.sheetBar - (XL.title + XL.tabs + XL.ribbon + XL.fbar)} color={C.green} p={nGrid} label="Grid Sheet" />
          <Neon x={0} y={XL.H - XL.status} w={XL.W} h={XL.status} color={C.amber} p={nStat} label="Status Bar" />
        </ExcelApp>
      </ExcelWindow>
      <KeyBadge keys={['Ctrl', 'F1']} p={keyP} left={1500} top={262} />
      <TopBadge text="واجهة Excel 365 وتخصيص بيئة عمل المحلل | Interface Architecture" from={t(2.0)} to={t(18.0)} />
      <Caption text="4 Core Regions: Ribbon | Name Box & Formula Bar | Grid Sheet | Status Bar" from={t(22.0)} to={t(38.0)} />
    </Stage>
  );
};
