import {Config} from "@remotion/cli/config";

// Speed: JPEG frames (not PNG) + 4 parallel tabs (GitHub-hosted runner = 4 vCPU). Pure 2D, no GL.
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setConcurrency(4);
