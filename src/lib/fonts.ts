import { useEffect, useState } from 'react';
import { cancelRender, continueRender, delayRender } from 'remotion';
import { MONO_BOLD, MONO_REG, SANS_BOLD, SANS_REG } from '../fonts/fontData';

/** Loads the bundled fonts (data URLs, no network) and holds the render until they are ready. */
export const useLessonFonts = () => {
  const [handle] = useState(() => delayRender('lesson-fonts'));
  useEffect(() => {
    const faces: [string, string, string][] = [
      ['LessonSans', SANS_REG, '400'],
      ['LessonSans', SANS_BOLD, '700'],
      ['LessonMono', MONO_REG, '400'],
      ['LessonMono', MONO_BOLD, '700'],
    ];
    Promise.all(
      faces.map(([fam, url, w]) => {
        const f = new FontFace(fam, `url(${url})`, { weight: w });
        (document.fonts as FontFaceSet & { add: (font: FontFace) => void }).add(f);
        return f.load();
      })
    )
      .then(() => continueRender(handle))
      .catch((e) => cancelRender(e));
  }, [handle]);
};
