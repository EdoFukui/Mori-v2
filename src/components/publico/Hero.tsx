// src/components/publico/Hero.tsx
// Port directo del Hero de index.html (Mori 1.0).

import { useScrollReveal } from '../../hooks/useScrollReveal';

export function Hero() {
  const { ref, className } = useScrollReveal<HTMLDivElement>();

  return (
    <section className="hero" id="inicio-hero">
      <div className={`hero-contenido ${className}`} ref={ref}>
        <span className="tag">Trueque y Venta</span>
        <h1>Exóticas para tu colección</h1>
        <p>
          Plantas exóticas de interior criadas con amor. Intercambia, adquiere y lleva un pedazo
          de selva tropical a tu hogar.
        </p>
        <a href="#catalogo" className="btn">
          Explorar catálogo
        </a>
      </div>
    </section>
  );
}
