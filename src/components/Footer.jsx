export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {/* Plane + title */}
        <p className="footer-plane" aria-hidden="true">✈</p>
        <h2 className="footer-title">MH370 — We Remember</h2>

        {/* Trilingual tagline */}
        <p className="footer-tri">
          <span>We Remember</span>
          <span className="footer-dot" aria-hidden="true">·</span>
          <span>Kami Mengenang</span>
          <span className="footer-dot" aria-hidden="true">·</span>
          <span>我们铭记</span>
        </p>

        {/* Disclaimer */}
        <p className="footer-note">
          A personal tribute project. Not affiliated with Malaysia Airlines or any
          government body. Built with love by a Malaysian who cares.
        </p>

        {/* Bottom rule */}
        <div className="footer-rule" />

        {/* Bottom line */}
        <p className="footer-bottom">
          MH370 · 8 March 2014 · 239 Souls · Lest We Forget
        </p>
      </div>
    </footer>
  );
}
