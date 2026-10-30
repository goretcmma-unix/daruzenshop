import React from 'react';

/**
 * Splits a product title after the first two words so that long drug
 * names wrap onto a second line and don't get overlapped by the
 * desktop ShareButton (positioned at the top-right of the modal).
 *
 * - If the title has 2 or fewer words, it's returned as-is.
 * - Otherwise, a <br /> is inserted after the second word.
 */
export function wrapTitleAfterTwoWords(text: string): React.ReactNode {
  if (!text) return text;
  const words = text.split(' ');
  if (words.length <= 2) return text;
  return (
    <>
      {words.slice(0, 2).join(' ')}
      <br />
      {words.slice(2).join(' ')}
    </>
  );
}
