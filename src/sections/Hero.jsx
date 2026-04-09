import { useState } from 'react';
import { useLang } from '../hooks/useLang';
import { i18n, t } from '../data/i18n';

const COUNTERS = [
  { value: 239, key: 'souls' },
  { value: 227, key: 'passengers' },
  { value: 12,  key: 'crew' },
  { value: 14,  key: 'nations' },
];

const CANDLES = [...Array(239).keys()];

const SHARE_LABEL = {
  en: 'Share this page',
  bm: 'Kongsi halaman ini',
  zh: '分享此页面',
};
const COPIED_LABEL = {
  en: 'Link copied!',
  bm: 'Pautan disalin!',
  zh: '链接已复制！',
};

export default function Hero() {
  const { lang } = useLang();
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const shareData = {
      title: 'MH370 — We Remember',
      text: 'A tribute to the 239 souls aboard Malaysia Airlines Flight MH370.',
      url: window.location.href,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <section id="hero" className="hero-section">

      {/* Date / route label */}
      <p className="hero-date-route hero-anim" style={{ '--delay': '0.3s' }}>
        <span className="hero-plane" aria-hidden="true">✈</span>
        {t(i18n.hero.dateRoute, lang)}
      </p>

      {/* Main heading */}
      <h1 className="hero-heading hero-anim" style={{ '--delay': '0.6s' }}>
        <span className="hero-mh">MH</span>
        <span className="hero-num">370</span>
      </h1>

      {/* Aircraft subtitle */}
      <p className="hero-subtitle hero-anim" style={{ '--delay': '0.9s' }}>
        {t(i18n.hero.subtitle, lang)}
      </p>

      {/* Soul counters — 2×2 on mobile via CSS */}
      <div className="hero-counters hero-anim" style={{ '--delay': '1.1s' }}>
        {COUNTERS.map(({ value, key }, idx) => (
          <div key={key} className="hero-counter-group">
            {idx > 0 && <div className="hero-counter-divider" aria-hidden="true" />}
            <span className="hero-counter-num">{value}</span>
            <span className="hero-counter-label">
              {t(i18n.hero.counters[key], lang)}
            </span>
          </div>
        ))}
      </div>

      {/* Tagline */}
      <p className="hero-tagline hero-anim" style={{ '--delay': '1.3s' }}>
        {t(i18n.hero.tagline, lang)}
      </p>

      {/* Share button */}
      <button
        className="hero-share hero-anim"
        style={{ '--delay': '1.5s' }}
        onClick={handleShare}
        aria-label={t(SHARE_LABEL, lang)}
      >
        {copied ? t(COPIED_LABEL, lang) : `↗ ${t(SHARE_LABEL, lang)}`}
      </button>

      {/* 239 candles */}
      <div
        className="hero-candles hero-anim"
        style={{ '--delay': '1.6s' }}
        aria-label="239 memorial candles"
      >
        {CANDLES.map((i) => (
          <span
            key={i}
            className="hero-candle"
            style={{ '--i': i }}
            aria-hidden="true"
          >
            🕯️
          </span>
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll hero-anim" style={{ '--delay': '2s' }}>
        <div className="hero-scroll-line" />
        <span className="hero-scroll-label">{t(i18n.hero.scroll, lang)}</span>
      </div>

    </section>
  );
}
