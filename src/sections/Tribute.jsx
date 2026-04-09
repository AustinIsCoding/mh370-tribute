import { useState, useRef, useEffect } from 'react';
import { useLang } from '../hooks/useLang';
import { i18n, t } from '../data/i18n';
import { seededTributes } from '../data/tributes';

let nextId = seededTributes.length + 1;

export default function Tribute() {
  const { lang } = useLang();
  const [name, setName]       = useState('');
  const [from, setFrom]       = useState('');
  const [message, setMessage] = useState('');
  const [error, setError]     = useState(false);
  const [success, setSuccess] = useState(false);
  const [tributes, setTributes] = useState(seededTributes);

  // Track which card ids are "new" so we apply the popIn animation
  const [newIds, setNewIds] = useState(new Set());
  const gridRef = useRef(null);

  // Clear the "new" flag after animation completes
  useEffect(() => {
    if (newIds.size === 0) return;
    const timer = setTimeout(() => setNewIds(new Set()), 700);
    return () => clearTimeout(timer);
  }, [newIds]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim()) {
      setError(true);
      return;
    }
    setError(false);

    const id = nextId++;
    const newTribute = {
      id,
      name: name.trim() || t(i18n.tribute.namePlaceholder, lang),
      from: from.trim() || '',
      message: message.trim(),
    };

    setTributes((prev) => [newTribute, ...prev]);
    setNewIds(new Set([id]));
    setName('');
    setFrom('');
    setMessage('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);

    // Scroll grid into view
    setTimeout(() => {
      gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  return (
    <section id="tribute" className="tribute-section">
      {/* Section header */}
      <div className="section-header">
        <span className="section-label">{t(i18n.tribute.label, lang)}</span>
        <h2 className="section-heading">{t(i18n.tribute.heading, lang)}</h2>
        <div className="section-rule" />
      </div>

      {/* Form panel */}
      <div className="tribute-form-panel">
        <form onSubmit={handleSubmit} noValidate className="tribute-form">
          {/* Name + From row */}
          <div className="tribute-form-row">
            <div className="tribute-field">
              <label className="tribute-label">
                {t(i18n.tribute.nameLabel, lang)}
              </label>
              <input
                type="text"
                className="tribute-input"
                placeholder={t(i18n.tribute.namePlaceholder, lang)}
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={60}
              />
            </div>
            <div className="tribute-field">
              <label className="tribute-label">
                {t(i18n.tribute.fromLabel, lang)}
              </label>
              <input
                type="text"
                className="tribute-input"
                placeholder={t(i18n.tribute.fromPlaceholder, lang)}
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                maxLength={80}
              />
            </div>
          </div>

          {/* Message */}
          <div className="tribute-field">
            <label className="tribute-label">
              {t(i18n.tribute.messageLabel, lang)}
            </label>
            <textarea
              className={`tribute-textarea${error ? ' tribute-textarea--error' : ''}`}
              placeholder={t(i18n.tribute.messagePlaceholder, lang)}
              value={message}
              onChange={(e) => { setMessage(e.target.value); setError(false); }}
              rows={4}
              maxLength={500}
            />
            {error && (
              <p className="tribute-error">{t(i18n.tribute.errorEmpty, lang)}</p>
            )}
          </div>

          {/* Submit */}
          <div className="tribute-form-footer">
            <button type="submit" className="tribute-submit">
              {t(i18n.tribute.submit, lang)}
            </button>
            {success && (
              <p className="tribute-success">{t(i18n.tribute.successMsg, lang)}</p>
            )}
          </div>
        </form>
      </div>

      {/* Tribute grid */}
      <div className="tribute-grid" ref={gridRef}>
        {tributes.map((tribute) => (
          <div
            key={tribute.id}
            className={`tribute-card${newIds.has(tribute.id) ? ' tribute-card--new' : ''}`}
          >
            <span className="tribute-candle" aria-hidden="true">🕯️</span>
            <p className="tribute-message">"{tribute.message}"</p>
            <p className="tribute-name">{tribute.name}</p>
            {tribute.from && (
              <p className="tribute-from">
                <span aria-hidden="true">📍</span> {tribute.from}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
