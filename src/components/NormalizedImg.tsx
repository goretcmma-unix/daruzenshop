import { useEffect, useState } from 'react';
import { getNormalizedImage } from '../lib/normalizeImage';

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

export const NormalizedImg: React.FC<Props> = ({ src, ...rest }) => {
  const [out, setOut] = useState<string>(src);
  const [prevSrc, setPrevSrc] = useState<string>(src);
  if (src !== prevSrc) {
    setPrevSrc(src);
    setOut(src);
  }
  useEffect(() => {
    let live = true;
    getNormalizedImage(src).then(n => { if (live) setOut(n); });
    return () => { live = false; };
  }, [src]);
  return <img src={out} {...rest} />;
};
