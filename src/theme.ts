import { loadFont as loadCairo } from "@remotion/google-fonts/Cairo";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

const cairo = loadCairo("normal", { weights: ["500", "700", "900"], subsets: ["arabic", "latin"] });
const mono = loadMono("normal", { weights: ["500", "700"], subsets: ["latin"] });

export const AR = `${cairo.fontFamily}, sans-serif`;
export const MONO = `${mono.fontFamily}, monospace`;
