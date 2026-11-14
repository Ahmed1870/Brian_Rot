import React from "react";
import { Composition } from "remotion";
import { Video } from "./Video";
import { COMP_ID, DURATION, FPS, HEIGHT, WIDTH } from "./theme";

export const Root: React.FC = () => (
  <Composition id={COMP_ID} component={Video} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
);
