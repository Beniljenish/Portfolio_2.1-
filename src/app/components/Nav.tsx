import { useEffect, useState } from 'react';

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('section[id]');
    const onScroll = () => {
      let current = '';
      sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 220) current = s.id;
      });
      setActiveSection(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const navLinks = ['about', 'skills', 'projects', 'contact'];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string, shouldClose = false) => {
    e.preventDefault();
    scrollTo(id);
    if (shouldClose) closeMenu();
  };

  return (
    <>
      <nav className="pf-nav" role="navigation" aria-label="Main navigation">
        <a
          href="#hero"
          className="pf-nav-logo"
          aria-label="Benil Jenish — Home"
          onClick={e => handleAnchorClick(e, 'hero')}
          style={{ cursor: 'pointer', userSelect: 'none' }}
        >
          BJ
        </a>
        <ul className="pf-nav-links">
          {navLinks.map(link => (
            <li key={link}>
              <a
                href={`#${link}`}
                onClick={e => handleAnchorClick(e, link)}
                className={activeSection === link ? 'active' : ''}
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                {link.charAt(0).toUpperCase() + link.slice(1)}
              </a>
            </li>
          ))}
        </ul>
        <button
          className="pf-hamburger"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </nav>

      <div className={`pf-mobile-menu${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
        <button className="pf-mobile-close" onClick={closeMenu} aria-label="Close menu">✕</button>
        {navLinks.map(link => (
          <a
            key={link}
            href={`#${link}`}
            onClick={e => handleAnchorClick(e, link, true)}
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            {link.charAt(0).toUpperCase() + link.slice(1)}
          </a>
        ))}
      </div>
    </>
  );
}
