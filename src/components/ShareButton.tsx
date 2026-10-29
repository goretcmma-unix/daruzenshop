import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Check } from 'lucide-react';
import { useLang } from '../i18n';

interface ShareButtonProps {
  title: string;
  text?: string;
  url: string;
}

/**
 * ShareButton — triggers the native Web Share API sheet on mobile
 * (WhatsApp, Telegram, Notes, Instagram, etc.). Falls back to copying
 * the product URL to the clipboard on desktop / when navigator.share
 * is unavailable, with a brief toast confirmation.
 */
const ShareButton: React.FC<ShareButtonProps> = ({ title, text, url }) => {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (err) {
        // User dismissed the share sheet or an error occurred — silently ignore
        console.debug('Share cancelled:', err);
      }
    } else {
      // Desktop fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (err) {
        console.error('Failed to copy URL to clipboard:', err);
      }
    }
  };

  return (
    <>
      <motion.button
        type="button"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleShare}
        aria-label={t.share.button}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 14px',
          borderRadius: '10px',
          background: 'rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          color: 'var(--primary-dark)',
          fontSize: '13px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        <Share2 size={16} />
        {t.share.button}
      </motion.button>

      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              bottom: '80px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0, 0, 0, 0.85)',
              color: '#fff',
              padding: '10px 22px',
              borderRadius: '14px',
              fontSize: '13px',
              fontWeight: '500',
              zIndex: 9999,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
            }}
          >
            <Check size={15} />
            {t.share.copied}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ShareButton;