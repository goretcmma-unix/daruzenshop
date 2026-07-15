import React from 'react';
import { motion, useAnimationControls } from 'framer-motion';

type Props = {
  onClick: () => void;
  label: string;
  withRotate?: boolean;
  children: React.ReactNode;
};

const QtyButton: React.FC<Props> = ({ onClick, label, withRotate = false, children }) => {
  const controls = useAnimationControls();

  // Короткая золотая вспышка ровно по клику: подсветились и сразу вернулись,
  // без «зажатого» состояния (whileTap на тач-устройствах залипает, а фокус
  // после тапа держится, пока не ткнёшь в другое место).
  const handleClick = () => {
    controls.start(
      {
        scale: [1, 0.82, 1],
        rotate: withRotate ? [0, -10, 0] : 0,
        backgroundColor: ['rgba(212,175,55,0)', 'rgba(212,175,55,0.28)', 'rgba(212,175,55,0)'],
      },
      { duration: 0.28, ease: 'easeOut' }
    );
    onClick();
  };

  const release = (e: React.SyntheticEvent<HTMLButtonElement>) => e.currentTarget.blur();

  return (
    <motion.button
      type="button"
      className="qty-btn"
      aria-label={label}
      onClick={(e) => {
        handleClick();
        e.currentTarget.blur();
      }}
      // Не даём кнопке получать фокус при тапе/клике — иначе браузерный
      // жёлтый фокус «залипает» до следующего касания. Клик при этом работает.
      onMouseDown={(e) => e.preventDefault()}
      onPointerDown={release}
      onPointerUp={release}
      onPointerCancel={release}
      onTouchEnd={release}
      onMouseUp={release}
      animate={controls}
      style={{
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {children}
    </motion.button>
  );
};

export default QtyButton;
