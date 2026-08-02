import React from 'react';
import { motion, useAnimationControls } from 'framer-motion';

type Props = {
  onClick: () => void;
  label: string;
  withRotate?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
};

const QtyButton: React.FC<Props> = ({ onClick, label, withRotate = false, disabled = false, children }) => {
  const controls = useAnimationControls();

  const handleClick = () => {
    if (disabled) return;
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
      disabled={disabled}
      onClick={(e) => {
        handleClick();
        e.currentTarget.blur();
      }}
      onMouseDown={(e) => e.preventDefault()}
      onPointerDown={release}
      onPointerUp={release}
      onPointerCancel={release}
      onTouchEnd={release}
      onMouseUp={release}
      animate={controls}
      style={{
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {children}
    </motion.button>
  );
};

export default QtyButton;
