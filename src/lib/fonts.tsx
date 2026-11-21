import regular from '../fonts/DejaVuSansCondensed.ttf';
import bold from '../fonts/DejaVuSansCondensed-Bold.ttf';
import mono from '../fonts/DejaVuSansMono.ttf';

export const FontStyles = () => (
  <style>{`
@font-face{font-family:'PBI';src:url(${regular}) format('truetype');font-weight:400;font-style:normal;}
@font-face{font-family:'PBI';src:url(${bold}) format('truetype');font-weight:700;font-style:normal;}
@font-face{font-family:'PBIMono';src:url(${mono}) format('truetype');font-weight:400;font-style:normal;}
`}</style>
);
