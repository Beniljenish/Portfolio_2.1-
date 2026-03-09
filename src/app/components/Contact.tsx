import { useEffect, useRef, useState } from 'react';

export function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error || 'Failed to send. Please try again.');
      }
      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSending(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  return (
    <section id="contact" className="pf-section" aria-label="Contact Benil Jenish" ref={sectionRef}>
      <div className="pf-s-label pf-reveal">Contact</div>
      <div className="pf-contact-grid">
        <div className="pf-ct-left pf-reveal">
          <h3>Let's Build<br />Something<br />Remarkable</h3>
          <p>Open to freelance projects, full-time roles, and ambitious creative collaborations. If you have a vision worth realising, I want to hear about it.</p>
          <nav className="pf-ct-links" aria-label="Contact and social links">
            {[
              { href: 'mailto:beniljenish@gmail.com', label: 'hello@beniljenish' },
              { href: 'https://github.com/Beniljenish', label: 'GitHub', external: true },
              { href: 'https://www.linkedin.com/in/benil-jenish/', label: 'LinkedIn', external: true },
              { href: 'https://x.com/benil_jenish?s=21', label: ' X', external: true },
            ].map(link => (
              <a
                key={link.label}
                href={link.href}
                className="pf-ct-link"
                {...(link.external ? { target: '_blank', rel: 'noopener' } : {})}
              >
                {link.label}
                <span className="pf-ct-arrow">↗</span>
              </a>
            ))}
          </nav>
        </div>

        <form className="pf-ct-form pf-reveal pf-d1" onSubmit={handleSubmit}>
          <div className="pf-f-grp">
            <label htmlFor="fn">Name</label>
            <input
              type="text"
              id="fn"
              name="name"
              placeholder="Your full name"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div className="pf-f-grp">
            <label htmlFor="fe">Email</label>
            <input
              type="email"
              id="fe"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="pf-f-grp">
            <label htmlFor="fs">Subject</label>
            <input
              type="text"
              id="fs"
              name="subject"
              placeholder="Project enquiry, collaboration..."
              value={form.subject}
              onChange={handleChange}
            />
          </div>
          <div className="pf-f-grp">
            <label htmlFor="fm">Message</label>
            <textarea
              id="fm"
              name="message"
              placeholder="Tell me about what you're building..."
              value={form.message}
              onChange={handleChange}
            />
          </div>
          {error && (
            <p style={{ color: '#e53e3e', fontSize: '13px', marginBottom: '8px' }}>{error}</p>
          )}
          <div className="pf-form-btn">
            <button
              type="submit"
              className="pf-btn pf-btn-chrome"
              disabled={sending || sent}
              style={sent ? { backgroundImage: 'linear-gradient(135deg,#888,#ccc,#888)' } : {}}
            >
              {sending ? 'Sending…' : sent ? 'Message Sent ✓' : 'Send Message ↗'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
