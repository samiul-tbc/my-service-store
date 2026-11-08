'use client';

import { useState } from 'react';

// Renders text with every emoji replaced by the Apple (iOS) emoji image
// from emoji-datasource-apple on jsDelivr, so descriptions look identical
// on Android, iOS and desktop. If an image is missing, it gracefully
// falls back to the device's own emoji character.

const CDN = 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.0.1/img/apple/64';
const EP_TEST = /\p{Emoji_Presentation}/u;
const EXTRA = '\\u00A9\\u00AE\\u203C\\u2049\\u2122\\u2139\\u2194-\\u2199\\u21A9\\u21AA\\u2934\\u2935\\u3030\\u303D\\u3297\\u3299';
const HAS_EMOJI = new RegExp(`(\\p{Extended_Pictographic}|\\p{Regional_Indicator}|[#*0-9]\\uFE0F?\\u20E3|[${EXTRA}])`, 'u');
const FALLBACK_RE = new RegExp(`[#*0-9]\\uFE0F?\\u20E3|\\p{Regional_Indicator}\\p{Regional_Indicator}|(?:\\p{Extended_Pictographic}|[${EXTRA}])(?:\\p{Emoji_Modifier})?\\uFE0F?(?:\\u200D(?:\\p{Extended_Pictographic}|[${EXTRA}])(?:\\p{Emoji_Modifier})?\\uFE0F?)*`, 'gu');

function emojiFile(emoji) {
  let cps = [...emoji].map((c) => c.codePointAt(0).toString(16).padStart(4, '0'));
  // emoji-datasource file names drop FE0F for emoji-presentation bases
  // (unless the sequence is a ZWJ chain), and keep it otherwise.
  if (!emoji.includes('\u200D') && EP_TEST.test([...emoji][0])) {
    cps = cps.filter((c) => c !== 'fe0f');
  }
  return cps.join('-');
}

function splitEmoji(text) {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    try {
      const seg = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
      return [...seg.segment(text)].map((x) => x.segment);
    } catch {}
  }
  const parts = [];
  let last = 0;
  for (const m of text.matchAll(FALLBACK_RE)) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(m[0]);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function EmojiImg({ emoji }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <>{emoji}</>;
  return (
    <img
      src={`${CDN}/${emojiFile(emoji)}.png`}
      alt={emoji}
      draggable={false}
      loading="lazy"
      onError={() => setFailed(true)}
      style={{
        width: '1.18em', height: '1.18em',
        verticalAlign: '-0.22em', margin: '0 0.06em',
        display: 'inline-block',
      }}
    />
  );
}

export default function EmojiText({ text }) {
  if (!text) return null;
  if (!HAS_EMOJI.test(text)) return <>{text}</>;
  const parts = splitEmoji(text);
  return (
    <>
      {parts.map((part, i) =>
        part.length <= 32 && HAS_EMOJI.test(part)
          ? <EmojiImg key={i} emoji={part} />
          : <span key={i}>{part}</span>
      )}
    </>
  );
}
