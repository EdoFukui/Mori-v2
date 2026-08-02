// src/components/publico/BotonArriba.tsx
// Port directo de src/js/scrollTop.js (Mori 1.0).

import { useEffect, useState } from 'react';

export function BotonArriba() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 300);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      id="btn-arriba"
      className={`btn-arriba${visible ? ' visible' : ''}`}
      aria-label="Ir arriba"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      ↑
    </button>
  );
}
