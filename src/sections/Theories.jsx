import { useEffect, useRef } from 'react';
import { useLang } from '../hooks/useLang';
import { i18n, t } from '../data/i18n';
import { theories } from '../data/theories';

export default function Theories() {
  const { lang } = useLang();
  const cardRefs = useRef([]);

  useEffect(() => {
    const observers = [];
    cardRefs.current.forEach((el, idx) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => el.classList.add('theory-card--visible'), idx * 120);
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
    <section id="theories" className="theories-section">
      {/* Section header */}
      <div className="section-header">
        <span className="section-label">{t(i18n.theories.label, lang)}</span>
        <h2 className="section-heading">{t(i18n.theories.heading, lang)}</h2>
        <div className="section-rule" />
        <p className="theories-disclaimer">{t(i18n.theories.disclaimer, lang)}</p>
      </div>

      {/* Theory cards grid */}
      <div className="theories-grid">
        {theories.map((theory, idx) => (
          <div
            key={theory.id}
            className="theory-card"
            ref={(el) => (cardRefs.current[idx] = el)}
          >
            <div className="theory-icon" aria-hidden="true">{theory.icon}</div>
            <div className={`theory-badge theory-badge--${theory.status}`}>
              {t(theory.statusLabel, lang)}
            </div>
            <h3 className="theory-title">{t(theory.title, lang)}</h3>
            <p className="theory-body">{t(theory.body, lang)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
