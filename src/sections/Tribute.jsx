import { useState, useEffect, useRef } from 'react';
import { useLang } from '../hooks/useLang';
import { i18n, t } from '../data/i18n';
import { CITIES } from '../data/cities';

const API = '/api/tributes';

const LOADING_MSG = {
  en: 'Loading tributes…',
  bm: 'Memuatkan penghormatan…',
  zh: '正在加载留言…',
};
const ERROR_MSG = {
  en: 'Could not load tributes. Please refresh.',
  bm: 'Gagal memuatkan penghormatan. Sila muat semula.',
  zh: '无法加载留言，请刷新页面。',
};
const SUBMIT_ERROR_MSG = {
  en: 'Failed to submit. Please try again.',
  bm: 'Gagal menghantar. Sila cuba lagi.',
  zh: '提交失败，请重试。',
};

export default function Tribute() {
  const { lang } = useLang();

  // Form state
  const [name,    setName]    = useState('');
  const [from,    setFrom]    = useState('');
  const [message, setMessage] = useState('');
  const [fieldErr,  setFieldErr]  = useState(false);
  const [submitErr, setSubmitErr] = useState(false);
  const [success,   setSuccess]   = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Data state
  const [tributes, setTributes] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [fetchErr, setFetchErr] = useState(false);

  // Animate new card
  const [newId, setNewId] = useState(null);
  const gridRef = useRef(null);

  // ── Fetch on mount ───────────────────────────────────
  useEffect(() => {
    fetch(API)
      .then((r) => {
        if (!r.ok) throw new Error(r.status);
        return r.json();
      })
      .then(({ tributes }) => {
        setTributes(tributes);
        setLoading(false);
      })
      .catch(() => {
        setFetchErr(true);
        setLoading(false);
      });
  }, []);

  // Clear new-card animation flag
  useEffect(() => {
    if (!newId) return;
    const t = setTimeout(() => setNewId(null), 700);
    return () => clearTimeout(t);
  }, [newId]);

  // ── Submit ───────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim()) { setFieldErr(true); return; }

    setFieldErr(false);
    setSubmitErr(false);
    setSubmitting(true);

    try {
      const res = await fetch(API, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, from, message }),
      });
      if (!res.ok) throw new Error(res.status);
      const newTribute = await res.json();

      setTributes((prev) => [newTribute, ...prev]);
      setNewId(newTribute._id);
      setName('');
      setFrom('');
      setMessage('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
      setTimeout(() => gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch {
      setSubmitErr(true);
    } finally {
      setSubmitting(false);
    }
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

          <div className="tribute-form-row">
            <div className="tribute-field">
              <label className="tribute-label">{t(i18n.tribute.nameLabel, lang)}</label>
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
              <label className="tribute-label" htmlFor="tribute-from">
                {t(i18n.tribute.fromLabel, lang)}
              </label>
              <input
                id="tribute-from"
                type="text"
                list="cities-list"
                className="tribute-input"
                placeholder={t(i18n.tribute.fromPlaceholder, lang)}
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                maxLength={80}
                autoComplete="off"
              />
              <datalist id="cities-list">
                {CITIES.map((city) => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="tribute-field">
            <label className="tribute-label">{t(i18n.tribute.messageLabel, lang)}</label>
            <textarea
              className={`tribute-textarea${fieldErr ? ' tribute-textarea--error' : ''}`}
              placeholder={t(i18n.tribute.messagePlaceholder, lang)}
              value={message}
              onChange={(e) => { setMessage(e.target.value); setFieldErr(false); }}
              rows={4}
              maxLength={500}
            />
            {fieldErr && (
              <p className="tribute-error">{t(i18n.tribute.errorEmpty, lang)}</p>
            )}
          </div>

          <div className="tribute-form-footer">
            <button type="submit" className="tribute-submit" disabled={submitting}>
              {submitting ? '…' : t(i18n.tribute.submit, lang)}
            </button>
            {success   && <p className="tribute-success">{t(i18n.tribute.successMsg, lang)}</p>}
            {submitErr && <p className="tribute-error">{t(SUBMIT_ERROR_MSG, lang)}</p>}
          </div>

        </form>
      </div>

      {/* Tribute grid */}
      {loading ? (
        <p className="tribute-status">{t(LOADING_MSG, lang)}</p>
      ) : fetchErr ? (
        <p className="tribute-status tribute-status--err">{t(ERROR_MSG, lang)}</p>
      ) : (
        <div className="tribute-grid" ref={gridRef}>
          {tributes.map((tribute) => (
            <div
              key={String(tribute._id)}
              className={`tribute-card${String(tribute._id) === String(newId) ? ' tribute-card--new' : ''}`}
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
      )}
    </section>
  );
}
