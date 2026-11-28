import { L } from './layout';
import { geom } from './code';

export const edPoint = (edY: number, fontSize: number, line: number, col: number) => {
  const g = geom(fontSize);
  return { x: L.edX + g.gutter + col * g.charW, y: edY + g.padTop + line * g.lineH + g.lineH / 2 };
};
export const RUN_BTN = { x: L.chromeW - 40, y: L.tabY + 27 };
