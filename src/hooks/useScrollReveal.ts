// src/hooks/useScrollReveal.ts
//
// Réplica en React de src/js/scrollReveal.js (Mori 1.0): agrega la
// clase "active" cuando el elemento entra en el viewport, para
// disparar la transición ya definida en .reveal / .reveal.active
// (base.css, sin modificar).
//
// Diferencia menor respecto al original: acá se hace unobserve() una
// vez que el elemento se activó (micro-optimización), mientras que el
// original deja el observer corriendo indefinidamente. El resultado
// visual es idéntico porque la clase "active" nunca se remueve en
// ninguna de las dos versiones.

import { useEffect, useRef, useState } from 'react';

export function useScrollReveal<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [activo, setActivo] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActivo(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, className: `reveal${activo ? ' active' : ''}` };
}
