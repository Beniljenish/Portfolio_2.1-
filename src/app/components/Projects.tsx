import { useRef, useEffect } from 'react';

interface Project {
  id: string;
  idx: string;
  title: string;
  desc: string;
  tags: string[];
  accent: string;
  label: string;
  delay: string;
}

const projects: Project[] = [
  {
    id: 'pv1',
    idx: '001 · 2025 · Full-Stack Development',
    title: 'ROLE-BASED TASK MANAGEMENT SYSTEM',
    desc: 'A full-stack project management platform where managers assign tasks and track progress while users manage workflows through role-based access control and real-time dashboards.',
    tags: ['Flask', 'React', 'MySQL', 'JWT Authentication'],
    accent: 'rgba(120,180,255,0.08)',
    label: 'TASK\nMGMT',
    delay: '',
  },
  {
    id: 'pv2',
    idx: '002 · 2025 · AI + Web Application',
    title: 'SMART TASK MANAGER WITH AI REMINDERS',
    desc: 'A productivity web application that integrates AI-driven reminders and task prioritization to help users organize work efficiently and manage daily schedules.',
    tags: ['React', 'Python', 'Flask', 'MySQL'],
    accent: 'rgba(180,120,255,0.08)',
    label: 'AI\nTASKS',
    delay: 'pf-d1',
  },
];

function ProjectVisual({ project }: { project: Project }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: '100%',
        height: '100%',
        background: `radial-gradient(ellipse at 30% 40%, ${project.accent}, transparent 70%), #080808`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* grid lines */}
      <svg
        width="100%" height="100%"
        style={{ position: 'absolute', inset: 0 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id={`grid-${project.id}`} width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${project.id})`} />
      </svg>

      {/* large watermark label */}
      <span style={{
        fontFamily: "'Anton', sans-serif",
        fontSize: 'clamp(56px, 10vw, 88px)',
        lineHeight: 1,
        color: 'rgba(255,255,255,0.06)',
        letterSpacing: '0.05em',
        textAlign: 'center',
        whiteSpace: 'pre',
        userSelect: 'none',
        position: 'relative',
        zIndex: 1,
      }}>
        {project.label}
      </span>

      {/* corner tag */}
      <span style={{
        position: 'absolute',
        bottom: 14,
        right: 16,
        fontFamily: "'Space Mono', monospace",
        fontSize: 9,
        letterSpacing: '0.3em',
        color: 'rgba(255,255,255,0.18)',
        textTransform: 'uppercase',
      }}>
        {project.id.toUpperCase()}
      </span>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg)`;
    card.style.transition = 'transform .05s';
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(900px) rotateY(0) rotateX(0)';
    card.style.transition = 'transform .6s cubic-bezier(.77,0,.18,1)';
  };

  return (
    <article
      ref={cardRef}
      className={`pf-proj-card pf-reveal${project.delay ? ' ' + project.delay : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="pf-proj-vis">
        <ProjectVisual project={project} />
        <div className="pf-proj-vis-fade" />
      </div>
      <div className="pf-proj-body">
        <div className="pf-proj-idx">{project.idx}</div>
        <div className="pf-proj-title">{project.title}</div>
        <p className="pf-proj-desc">{project.desc}</p>
        <div className="pf-proj-foot">
          <div className="pf-proj-tags">
            {project.tags.map(tag => (
              <span key={tag} className="pf-p-tag">{tag}</span>
            ))}
          </div>
          <a href="#" className="pf-proj-arrow" aria-label={`View ${project.title}`}>↗</a>
        </div>
      </div>
    </article>
  );
}

export function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      }),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll('.pf-reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="projects" className="pf-section" aria-label="Selected projects" ref={sectionRef}>
      <div className="pf-s-label pf-reveal">Work</div>
      <h2 className="pf-s-title pf-reveal">Key<br />Projects</h2>
      <div className="pf-proj-grid">
        {projects.map(p => <ProjectCard key={p.id} project={p} />)}
      </div>
    </section>
  );
}
