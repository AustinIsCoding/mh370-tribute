import { useEffect, useRef } from 'react';
import { useLang } from '../hooks/useLang';
import { i18n, t } from '../data/i18n';
import { updates } from '../data/updates';

export default function Updates() {
  const { lang } = useLang();
  const cardRefs = useRef([]);

  useEffect(() => {
    const observers = [];
    cardRefs.current.forEach((el, idx) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => el.classList.add('update-card--visible'), idx * 110);
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
    <section id="updates" className="updates-section">
      {/* Section header */}
      <div className="section-header">
        <span className="section-label">{t(i18n.updates.label, lang)}</span>
        <h2 className="section-heading">{t(i18n.updates.heading, lang)}</h2>
        <div className="section-rule" />
      </div>

      {/* 2-column responsive grid */}
      <div className="updates-grid">
        {updates.map((item, idx) => (
          <div
            key={item.id}
            className="update-card"
            ref={(el) => (cardRefs.current[idx] = el)}
          >
            {/* Gold badge */}
            <span className="update-badge">{t(item.badge, lang)}</span>

            {/* Heading */}
            <h3 className="update-title">{t(item.title, lang)}</h3>

            {/* Body */}
            <p className="update-body">{t(item.body, lang)}</p>

            {/* Quote block — only if present */}
            {item.quote && (
              <blockquote className="update-quote">
                <p className="update-quote-text">{t(item.quote, lang)}</p>
                {item.cite && (
                  <cite className="update-quote-cite">{t(item.cite, lang)}</cite>
                )}
              </blockquote>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
