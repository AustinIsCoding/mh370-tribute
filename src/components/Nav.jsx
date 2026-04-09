import { useState } from 'react';
import { useLang } from '../hooks/useLang';
import { i18n, t } from '../data/i18n';

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'bm', label: 'BM' },
  { code: 'zh', label: '中' },
];

const NAV_LINKS = [
  { key: 'home',     href: '#hero' },
  { key: 'timeline', href: '#timeline' },
  { key: 'souls',    href: '#souls' },
  { key: 'theories', href: '#theories' },
  { key: 'updates',  href: '#updates' },
  { key: 'tribute',  href: '#tribute' },
];

export default function Nav() {
  const { lang, setLang } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() { setMenuOpen(false); }

  return (
    <nav className="nav" role="navigation" aria-label="Main navigation">
      {/* Logo */}
      <a href="#hero" className="nav-logo" onClick={closeMenu}>
        <span className="nav-logo-mh">MH370</span>
        <span className="nav-logo-sub">We Remember</span>
      </a>

      {/* Desktop links */}
      <ul className="nav-links" role="list">
        {NAV_LINKS.map(({ key, href }) => (
          <li key={key}>
            <a href={href} className="nav-link">
              {t(i18n.nav[key], lang)}
            </a>
          </li>
        ))}
      </ul>

      {/* Right side: lang switcher + hamburger */}
      <div className="nav-right">
        <div className="lang-switcher">
          {LANGS.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => setLang(code)}
              className={`lang-btn${lang === code ? ' lang-btn--active' : ''}`}
              aria-label={`Switch language to ${label}`}
              aria-pressed={lang === code}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Hamburger — mobile only */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className={`hamburger-line${menuOpen ? ' hamburger-line--open' : ''}`} />
          <span className={`hamburger-line${menuOpen ? ' hamburger-line--open' : ''}`} />
          <span className={`hamburger-line${menuOpen ? ' hamburger-line--open' : ''}`} />
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="nav-drawer" role="dialog" aria-label="Navigation menu">
          <ul role="list">
            {NAV_LINKS.map(({ key, href }) => (
              <li key={key}>
                <a href={href} className="nav-drawer-link" onClick={closeMenu}>
                  {t(i18n.nav[key], lang)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
