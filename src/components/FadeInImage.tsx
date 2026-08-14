import { motion } from 'framer-motion';
import { useNormalizedImage } from '../lib/normalizeImage';

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  targetOpacity?: number;
  fadeDuration?: number;
}

export const FadeInImage: React.FC<Props> = ({
  src,
  targetOpacity = 1,
  fadeDuration = 0.25,
  ...rest
}) => {
  const out = useNormalizedImage(src);
  return (
    <motion.img
      {...rest}
      src={out}
      initial={{ opacity: 0 }}
      animate={{ opacity: targetOpacity }}
      transition={{ duration: fadeDuration, ease: 'easeOut' }}
    />
  );
};
