import {Composition} from "remotion";
import {Video} from "./Video";
import {COMP_ID, DURATION, FPS, HEIGHT, WIDTH} from "./theme";

export const RemotionRoot = () => (
  <Composition id={COMP_ID} component={Video} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
);
