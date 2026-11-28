import { allSfx } from '../src/data/cues';
import * as fs from 'fs';
fs.writeFileSync('scripts/cues_abs.json', JSON.stringify(allSfx(), null, 1));
console.log('cues', allSfx().length);
