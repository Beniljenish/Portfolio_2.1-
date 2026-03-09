import { useEffect, useRef } from 'react';

const skills = [
  { name: 'Python / Machine Learning', pct: 82, delay: '' },
  { name: 'React.js / Frontend Development', pct: 75, delay: 'pf-d1' },
  { name: 'Flask / Backend Development', pct: 72, delay: 'pf-d2' },
  { name: 'SQL / Database Management', pct: 78, delay: '' },
  { name: 'Generative AI / LLM Integration', pct: 70, delay: 'pf-d1' },
  { name: 'REST APIs Development', pct: 74, delay: 'pf-d2' },
  { name: 'Data Analysis / Business Analytics', pct: 80, delay: '' },
  { name: 'Figma / UI Design', pct: 70, delay: 'pf-d1' },
];

export function Skills() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const fillRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('visible');
        const fill = e.target.querySelector<HTMLDivElement>('.pf-sk-fill');
        if (fill) {
          const w = fill.dataset.width;
          setTimeout(() => { fill.style.width = w + '%'; }, 300);
        }
      }),
      { threshold: 0.15 }
    );

    const reveals = sectionRef.current?.querySelectorAll('.pf-reveal') ?? [];
    reveals.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="skills" className="pf-section" aria-label="Skills and expertise" ref={sectionRef}>
      <div className="pf-s-label pf-reveal">Expertise</div>
      <h2 className="pf-s-title pf-reveal">Skills &amp;<br />Tooling</h2>
      <div>
        {skills.map((sk, i) => (
          <div
            key={sk.name}
            className={`pf-skill-row pf-reveal${sk.delay ? ' ' + sk.delay : ''}`}
          >
            <div className="pf-sk-name">{sk.name}</div>
            <div className="pf-sk-track">
              <div
                className="pf-sk-fill"
                data-width={sk.pct}
                ref={el => { fillRefs.current[i] = el; }}
              />
            </div>
            <div className="pf-sk-pct">{sk.pct}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
