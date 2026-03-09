const items = [
  'AI Engineering',
  'Machine Learning Systems',
  'Generative AI Applications',
  'Python Development',
  'Backend API Engineering',
  'Full-Stack Development',
  'React Web Applications',
  'Database Design',
  'Data Analytics',
  'Workflow Automation'
];

export function Ticker() {
  const repeatedItems = [...items, ...items];

  return (
    <div className="pf-ticker" aria-hidden="true">
      <div className="pf-ticker-track">
        {repeatedItems.map((item, i) => (
          <span key={i} className="pf-ticker-item">{item}</span>
        ))}
      </div>
    </div>
  );
}
