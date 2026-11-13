import { loadFont as loadAr } from "@remotion/google-fonts/IBMPlexSansArabic";
import { loadFont as loadUi } from "@remotion/google-fonts/Carlito";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

const ar = loadAr("normal", { weights: ["400", "600"], subsets: ["arabic", "latin"] });
const ui = loadUi("normal", { weights: ["400", "700"], subsets: ["latin"] });
const mono = loadMono("normal", { weights: ["500"], subsets: ["latin"] });

export const FAR = `${ar.fontFamily}, sans-serif`;
export const FUI = `${ui.fontFamily}, Calibri, sans-serif`; // Carlito = open Calibri-metric clone
export const FMONO = `${mono.fontFamily}, monospace`;
