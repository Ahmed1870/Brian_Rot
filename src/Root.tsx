import React from "react";
import { Composition } from "remotion";
import { Lesson } from "./Lesson";
import { FPS, TOTAL_FRAMES } from "./lib";

export const Root: React.FC = () => (
  <Composition
    id="SQL-L24-DerivedTables"
    component={Lesson}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={1920}
    height={1080}
  />
);
