import { useEffect, useRef } from 'react';
import { useLang } from '../hooks/useLang';
import { t } from '../data/i18n';
import { timeline } from '../data/timeline';

const SECTION_LABEL = { en: 'Chronology', bm: 'Kronologi', zh: '事件年表' };
const SECTION_HEADING = {
  en: 'The Final Flight',
  bm: 'Penerbangan Terakhir',
  zh: '最后的飞行',
};

export default function Timeline() {
  const { lang } = useLang();
  const itemRefs = useRef([]);

  useEffect(() => {
    const observers = [];

    itemRefs.current.forEach((el, idx) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // stagger each item by 80ms
            setTimeout(() => {
              el.classList.add('tl-item--visible');
            }, idx * 80);
            obs.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <section id="timeline" className="tl-section">
      {/* Section header */}
      <div className="section-header">
        <span className="section-label">{t(SECTION_LABEL, lang)}</span>
        <h2 className="section-heading">{t(SECTION_HEADING, lang)}</h2>
        <div className="section-rule" />
      </div>

      {/* Timeline track */}
      <div className="tl-track">
        {/* Vertical gold line */}
        <div className="tl-line" />

        {timeline.map((item, idx) => (
          <div
            key={item.id}
            className="tl-item"
            ref={(el) => (itemRefs.current[idx] = el)}
          >
            {/* Gold dot on the line */}
            <div className="tl-dot" />

            {/* Content card */}
            <div className="tl-card">
              <span className="tl-date">{t(item.date, lang)}</span>
              <h3 className="tl-event">{t(item.event, lang)}</h3>
              <p className="tl-detail">{t(item.detail, lang)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
