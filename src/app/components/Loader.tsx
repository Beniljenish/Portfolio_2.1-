import { useEffect, useRef, useState } from 'react';

interface LoaderProps {
  onDone: () => void;
}

export function Loader({ onDone }: LoaderProps) {
  const [pct, setPct] = useState(0);
  const [out, setOut] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPct(prev => {
        const next = prev + Math.floor(Math.random() * 14) + 3;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 110);

    const timer = setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        setOut(true);
        setTimeout(onDone, 1000);
      }
    }, 2400);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onDone]);

  return (
    <div className={`pf-loader${out ? ' out' : ''}`}>
      <div className="pf-loader-logo">BJ</div>
      <div className="pf-loader-bar" />
      <div className="pf-loader-pct">Loading — {Math.min(pct, 100)}%</div>
    </div>
  );
}
