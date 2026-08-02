// src/components/publico/Contacto.tsx
// Port directo de la sección de contacto + footer de index.html
// (Mori 1.0). Enlaces de WhatsApp/Instagram bindeados directo a
// WHATSAPP_URL (ver nota en lib/whatsapp.ts sobre por qué ya no hace
// falta el equivalente de whatsappLinks.js).

import { useScrollReveal } from '../../hooks/useScrollReveal';
import { WHATSAPP_URL } from '../../lib/whatsapp';

export function Contacto() {
  const titulo = useScrollReveal<HTMLHeadingElement>();
  const texto = useScrollReveal<HTMLParagraphElement>();
  const info = useScrollReveal<HTMLUListElement>();
  const botones = useScrollReveal<HTMLDivElement>();

  return (
    <section className="contacto" id="contacto">
      <h2 className={`titulo-seccion ${titulo.className}`} ref={titulo.ref}>
        Hablemos
      </h2>
      <p className={`texto-contacto ${texto.className}`} ref={texto.ref}>
        ¿Viste algo que te gustó? Escríbeme y hagamos que tu jardín crezca.
      </p>

      <ul className={`info-comercial ${info.className}`} ref={info.ref}>
        <li>Compra y trueque de ejemplares.</li>
        <li>
          Entrega presencial en Santiago o envío a regiones (por pagar) a través de empresas de
          transporte acordadas contigo.
        </li>
        <li>
          Coordinamos cada detalle directamente por WhatsApp antes de concretar la operación.
        </li>
      </ul>

      <div className={`botones-contacto ${botones.className}`} ref={botones.ref}>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-contacto">
          WhatsApp
        </a>
        <a
          href="https://www.instagram.com/plantasmori"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-contacto"
        >
          Instagram
        </a>
      </div>

      <Footer />
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="footer-contenido">
        <p className="footer-texto">© 2026 Mori</p>
        <div className="footer-redes">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17.6 6.3A8.9 8.9 0 0 0 3.2 16.9L2 21l4.2-1.1A8.9 8.9 0 0 0 12 21a8.9 8.9 0 0 0 5.6-14.7Z" />
              <path d="M9 8.5c0-.3.2-.5.5-.5H10c.3 0 .5.2.6.5l.6 1.8c.1.3 0 .6-.2.8l-.6.6a5.5 5.5 0 0 0 2.9 2.9l.6-.6c.2-.2.5-.3.8-.2l1.8.6c.3.1.5.3.5.6v.6c0 1-.8 1.8-1.8 1.8h-.3C11.2 17.9 6.1 12.8 6 9v-.3c0-1 .8-1.8 1.8-1.8" />
            </svg>
          </a>
          <a
            href="https://www.instagram.com/plantasmori"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
