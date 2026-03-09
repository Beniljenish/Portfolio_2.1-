import { useEffect, useRef } from 'react';

export function About() {
  const orbRef = useRef<HTMLCanvasElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const sideRef = useRef<HTMLDivElement>(null);

  // Orb canvas animation
  useEffect(() => {
    const cvs = orbRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    let t = 0;
    let rafId: number;

    const resize = () => {
      const s = cvs.parentElement?.offsetWidth ?? 300;
      cvs.width = s;
      cvs.height = s;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const draw = () => {
      t += 0.014;
      const sz = cvs.width, cx = sz / 2, cy = sz / 2, r = sz * 0.38;
      ctx.clearRect(0, 0, sz, sz);

      // halo
      const h = ctx.createRadialGradient(cx, cy, r * 0.65, cx, cy, r * 1.4);
      h.addColorStop(0, 'rgba(255,255,255,0.025)');
      h.addColorStop(1, 'transparent');
      ctx.fillStyle = h;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.4, 0, Math.PI * 2);
      ctx.fill();

      // sphere gradient
      const lx = cx + Math.cos(t * 0.6) * r * 0.28;
      const ly = cy + Math.sin(t * 0.4) * r * 0.28;
      const sg = ctx.createRadialGradient(lx, ly, 0, cx, cy, r);
      sg.addColorStop(0, '#ffffff');
      sg.addColorStop(0.12, '#eeeeee');
      sg.addColorStop(0.28, '#c0c0c0');
      sg.addColorStop(0.48, '#808080');
      sg.addColorStop(0.68, '#3a3a3a');
      sg.addColorStop(0.84, '#181818');
      sg.addColorStop(1, '#040404');
      ctx.fillStyle = sg;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // highlight
      const hx = cx - r * 0.22 + Math.sin(t * 0.9) * r * 0.08;
      const hy = cy - r * 0.22 + Math.cos(t * 0.6) * r * 0.08;
      const hl = ctx.createRadialGradient(hx, hy, 0, hx, hy, r * 0.45);
      hl.addColorStop(0, 'rgba(255,255,255,0.32)');
      hl.addColorStop(0.5, 'rgba(255,255,255,0.04)');
      hl.addColorStop(1, 'transparent');
      ctx.fillStyle = hl;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // equator ring
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy, r, r * 0.07 * (1 + 0.3 * Math.sin(t)), 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.07)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // orbiting dot
      const ox = cx + Math.cos(t) * r * 0.9;
      const oy = cy + Math.sin(t * 0.65) * r * 0.22;
      const dg = ctx.createRadialGradient(ox, oy, 0, ox, oy, 9);
      dg.addColorStop(0, 'rgba(255,255,255,.85)');
      dg.addColorStop(1, 'transparent');
      ctx.fillStyle = dg;
      ctx.beginPath();
      ctx.arc(ox, oy, 9, 0, Math.PI * 2);
      ctx.fill();

      rafId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Reveal observer
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      }),
      { threshold: 0.15 }
    );
    [bodyRef.current, sideRef.current].forEach(el => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <section id="about" className="pf-section" aria-label="About Benil Jenish">
      <div className="pf-s-label">About</div>
      <div className="pf-about-grid">
        <div className="pf-about-body pf-reveal" ref={bodyRef}>
          <h2 className="pf-s-title">Intelligent<br /> Systems Architect</h2>
          <p>
            I am an AI/ML engineer focused on building intelligent software and data-driven applications that solve real business problems. With professional experience as a Financial Analyst at IBM, I developed strong analytical and problem-solving skills, which I now apply to designing AI-powered systems and scalable software solutions.
          </p>
          <p>
            My work centers around Python, machine learning, Generative AI, and full-stack development using technologies like React, Flask, and SQL. I enjoy building automation tools, AI-powered platforms, and data-driven applications that improve efficiency, streamline workflows, and deliver measurable value.
          </p>
          <div className="pf-about-rows">
            {[
              ['Location', 'Chennai,India'],
              ['Email', 'beniljenish@gmail.com'],
              ['Status', 'Open to work'],
              ['Timezone', 'IST · UTC+5:30'],
            ].map(([label, value]) => (
              <div key={label} className="pf-a-row">
                <span className="pf-a-lbl">{label}</span>
                <span className="pf-a-val">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pf-reveal pf-d1" ref={sideRef}>
          <canvas ref={orbRef} className="pf-orb-canvas" aria-hidden="true" />
          <div className="pf-stat-grid">
            {[
              ['3+', 'Years Exp.'],
              ['4', 'Projects'],
              ['3', 'Awards'],
              ['∞', 'Coffee'],
            ].map(([num, label]) => (
              <div key={label} className="pf-stat-cell">
                <div className="pf-stat-n">{num}</div>
                <div className="pf-stat-l">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
