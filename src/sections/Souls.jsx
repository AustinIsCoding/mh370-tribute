import { useEffect, useRef } from 'react';
import { useLang } from '../hooks/useLang';
import { i18n, t } from '../data/i18n';
import { nationalities, featuredSouls } from '../data/souls';

const WIKI_URL = 'https://en.wikipedia.org/wiki/Malaysia_Airlines_Flight_370';

export default function Souls() {
  const { lang } = useLang();
  const cardRefs = useRef([]);

  useEffect(() => {
    const observers = [];
    cardRefs.current.forEach((el, idx) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => el.classList.add('soul-card--visible'), idx * 100);
            obs.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <section id="souls" className="souls-section">
      {/* Section header */}
      <div className="section-header">
        <span className="section-label">{t(i18n.souls.label, lang)}</span>
        <h2 className="section-heading">{t(i18n.souls.heading, lang)}</h2>
        <div className="section-rule" />
      </div>

      {/* Nationality pills */}
      <div className="souls-nat-wrap">
        <p className="souls-nat-label">{t(i18n.souls.nationalitiesLabel, lang)}</p>
        <div className="souls-nat-pills">
          {nationalities.map(({ flag, country, count }) => (
            <div key={t(country, 'en')} className="nat-pill">
              <span className="nat-flag">{flag}</span>
              <span className="nat-country">{t(country, lang)}</span>
              <span className="nat-count">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Soul cards grid */}
      <div className="souls-grid">
        {featuredSouls.map((soul, idx) => (
          <div
            key={soul.id}
            className="soul-card"
            ref={(el) => (cardRefs.current[idx] = el)}
          >
            <span className="soul-role">{t(soul.role, lang)}</span>
            <h3 className="soul-name">
              <span className="soul-flag">{soul.flag}</span>
              {soul.name}
            </h3>
            <p className="soul-info">{t(soul.info, lang)}</p>
            <p className="soul-story">{t(soul.story, lang)}</p>
            <span className="soul-candle" aria-hidden="true">🕯️</span>
          </div>
        ))}
      </div>

      {/* Remainder block */}
      <div className="souls-remainder">
        <h3 className="souls-remainder-title">
          {t(i18n.souls.remainderTitle, lang)}
        </h3>
        <p className="souls-remainder-body">
          {t(i18n.souls.remainderBody, lang)}
        </p>
        <a
          href={WIKI_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="souls-remainder-link"
        >
          {t(i18n.souls.remainderLink, lang)}
        </a>
      </div>
    </section>
  );
}
