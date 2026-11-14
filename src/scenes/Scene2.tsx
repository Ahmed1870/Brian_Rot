import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, SCENES, START} from '../theme';
import {Caption, CellV, prog, ribbonItemBox, sec} from '../kit';
import {Stage} from '../kit';
import {tabBox} from '../xl';
import {Pointer, Wp} from '../lq';
import {Tag} from '../l54';
import {ADD_OK, AddinsDlg, BACK, Backstage, DA_OK, DESC, DS_OK, DataAnalysisDlg, DescDlg, Host63, OPT, OPT_GO, OptionsDlg, addChk, daItem, dsPt, f4, optNav, salesCell} from '../l63';

// SC02 anchors (s, abs): 46.9 File | 47.9 Options | 48.8 Add-ins | 50.1 Go | 50.9 tick ToolPak | 51.4 OK | 51.9 OK | 52.3 Data tab | 53.4 Data Analysis | 54.4 Descriptive Statistics | 55.4 OK | 57-62 dialog | 62.4 OK | 65.6-70 rows | 72.8 mean/median/mode | 75.6 sd/range/skew
const S = START.s2;
const t = (g: number) => sec(g - S);
const FILE = tabBox('File'), DATA = tabBox('Data');
const DAB = ribbonItemBox('Data', 'DataAnalysis');
const EV: Array<[number, number, number]> = [
  [46.9, FILE.cx, 48], [47.9, BACK.optX, BACK.optY], [48.8, optNav(10).x, optNav(10).y], [49.5, OPT.x + 390, OPT.y + OPT.h - 87], [50.1, OPT_GO.x + 32, OPT_GO.y + 13],
  [50.9, addChk(0).x, addChk(0).y], [51.4, ADD_OK.x, ADD_OK.y], [51.9, OPT.x + OPT.w - 150, OPT.y + OPT.h - 27], [52.3, DATA.cx, 48], [53.4, DAB.cx, DAB.cy],
  [54.4, daItem(5).x, daItem(5).y], [55.4, DA_OK.x, DA_OK.y], [57.0, dsPt('input').x, dsPt('input').y], [58.8, dsPt('labels').x, dsPt('labels').y], [59.7, dsPt('summary').x, dsPt('summary').y],
  [60.4, dsPt('conf').x, dsPt('conf').y], [60.9, dsPt('kl').x, dsPt('kl').y], [61.4, dsPt('ks').x, dsPt('ks').y], [62.4, DS_OK.x, DS_OK.y],
];
const PTS: Wp[] = [{f: 0, x: 760, y: 560}];
const CLICKS: number[] = [];
EV.forEach(([g, x, y]) => { PTS.push({f: t(g - 0.28), x, y}, {f: t(g), x, y}); CLICKS.push(t(g)); });
PTS.push({f: t(64.0), x: 900, y: 520});
const cwT = (c: number) => [0, 230, 150][c] ?? 64;
const INPUT = '$G$1:$G$50001';

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const win = (a: number, b: number) => prog(f, t(a), 8) * (1 - prog(f, t(b), 6));
  const typedIn = INPUT.slice(0, Math.floor(INPUT.length * prog(f, t(57.1), sec(1.5)) + 0.0001));
  const onStats = at(62.6);
  const shown = at(65.6) ? Math.min(16, Math.floor((f - t(65.6)) / sec(0.28)) + 1) : 0;
  const grp = (i: number): string | undefined => {
    const a = at(72.8) && !at(75.4) && [0, 2, 3].includes(i), b = at(75.6) && !at(78.4) && [4, 8, 7].includes(i);
    return a ? '#D1FAE5' : b ? '#DDEBF7' : undefined;
  };
  const cell = (r: number, c: number): CellV | undefined => {
    if (!onStats) return salesCell(r, c);
    if (c < 1 || c > 2) return undefined;
    if (r === 1) return c === 1 ? {t: 'Total', b: true, bg: '#F2F2F2'} : {t: '', bg: '#F2F2F2'};
    const i = r - 3;
    if (i < 0 || i >= shown) return undefined;
    const [n, v] = DESC[i]; const bg = grp(i);
    return c === 1 ? {t: n, bg, b: !!bg} : {t: f4(v), num: 1, al: 'r', bg, b: !!bg};
  };
  const tabNow = !onStats && at(52.3) ? 'Data' : 'Home';
  return (
    <Stage dur={SCENES.s2.dur} inFx="zoom" outFx="left">
      <Host63 tab={tabNow} cell={cell} colW={onStats ? cwT : undefined} sheets={onStats ? ['Sales', 'Stats'] : ['Sales']} sheet={onStats ? 'Stats' : 'Sales'} checks={{Analyze: at(51.9) ? 1 : 0}} ribbonHot={at(52.5) && !at(53.4) ? 'DataAnalysis' : undefined} glow={onStats && at(65.6) ? C.green : undefined}>
        <Backstage p={win(47.0, 48.0)} hot={at(47.6)} />
        <OptionsDlg p={win(48.0, 51.95)} nav={at(48.8) ? 10 : 0} goHot={at(50.1) && !at(50.4)} />
        <AddinsDlg p={win(50.2, 51.5)} on={at(50.9)} okHot={at(51.3)} />
        <DataAnalysisDlg p={win(53.4, 55.5)} sel={at(54.4) ? 5 : -1} okHot={at(55.2)} />
        <DescDlg p={win(55.6, 62.5)} input={typedIn} caret={at(57.0) && !at(58.7)} labels={at(58.8)} summary={at(59.7)} conf={at(60.4)} kl={at(60.9)} ks={at(61.4)} okHot={at(62.2)} />
        <Tag x={470} y={430} text="Summary statistics = 13 rows ──► + Confidence, Largest, Smallest = 16" color={C.green} p={prog(f, t(70.2), 10) * (1 - prog(f, t(78.6), 8))} dark />
        <Tag x={470} y={466} text="Static values ──► written into a separate worksheet" color={C.blue} p={prog(f, t(78.9), 10)} dark />
        <Pointer f={f} pts={PTS} clicks={CLICKS} hide={at(64.2)} />
      </Host63>
      <Caption text="Activate Analysis ToolPak ──► File ──► Options ──► Add-ins ──► Excel Add-ins ──► Data Analysis" from={t(42.0)} to={t(60.0)} />
      <Caption text="Descriptive Statistics Report ──► Generates 16 Core Statistical Metrics in One Click" from={t(64.0)} to={t(82.0)} tone="ok" />
    </Stage>
  );
};
