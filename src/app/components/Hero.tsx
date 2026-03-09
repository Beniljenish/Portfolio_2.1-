export function Hero() {
  const handleHeroLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBtnMove = (e: React.MouseEvent<HTMLElement>) => {
    const btn = e.currentTarget;
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.25;
    const y = (e.clientY - r.top - r.height / 2) * 0.25;
    btn.style.transform = `translate(${x}px,${y}px)`;
    btn.style.transition = 'transform .08s';
  };
  const handleBtnLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.transform = 'translate(0,0)';
    e.currentTarget.style.transition = 'transform .5s cubic-bezier(.77,0,.18,1)';
  };

  return (
    <section id="hero" className="pf-hero" aria-label="Introduction">
      <div className="pf-hero-content">
        <div className="pf-hero-eye">
          <span />
          Working on modern web & AI
        </div>
        <h1 className="pf-hero-name">
          <span className="pf-chrome-line">BENIL</span>
          <span className="pf-chrome-line">JENISH</span>
        </h1>
        <p className="pf-hero-sub">
          <strong>Creative Developer & Digital Architect</strong> — Crafting beautiful, scalable experiences Using modern web technologies, AI-powered solutions, and deep user research to solve real problems.
        </p>
        <div className="pf-hero-actions">
          <a
            href="#projects"
            className="pf-btn pf-btn-chrome"
            onClick={e => handleHeroLinkClick(e, 'projects')}
            onMouseMove={handleBtnMove}
            onMouseLeave={handleBtnLeave}
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            View Work ↗
          </a>
          <a
            href="#contact"
            className="pf-btn pf-btn-ghost"
            onClick={e => handleHeroLinkClick(e, 'contact')}
            onMouseMove={handleBtnMove}
            onMouseLeave={handleBtnLeave}
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            Get In Touch
          </a>
        </div>
      </div>
      <div className="pf-hero-hint">
        <div className="pf-scroll-line" />
        Scroll
      </div>
      <div className="pf-hero-coord" aria-hidden="true">13°04′57″ N, 80°16′30″ E</div>
    </section>
  );
}
