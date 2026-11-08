import React from "react";
import {Composition} from "remotion";
import {COMP_ID, DURATION, FPS, H, W} from "./theme";
import {Video} from "./Video";

export const Root: React.FC = () => (
  <Composition id={COMP_ID} component={Video} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
);
