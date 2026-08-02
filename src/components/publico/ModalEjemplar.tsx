// src/components/publico/ModalEjemplar.tsx
//
// Port de src/js/ejemplarModal.js (Mori 1.0). Mantiene el mismo
// comportamiento de accesibilidad, tal como pide el Project
// instructions:
// - Focus trap con Tab / Shift+Tab dentro del modal.
// - Cierre con Escape.
// - Cierre al hacer clic en el overlay (fuera de la caja).
// - aria-hidden sincronizado con el estado abierto/cerrado.
// - Devuelve el foco al elemento que abrió el modal al cerrarse.
//
// Diferencia de implementación (no de comportamiento): el original
// limpia el innerHTML del modal recién al abrir uno nuevo, así que
// durante la transición de cierre (opacity/transform en modal.css)
// el contenido anterior sigue visible. Acá reproduzco eso guardando
// el último ejemplar mostrado en estado local (`ejemplarMostrado`) en
// vez de renderizar directo la prop `ejemplar` — si renderizara la
// prop directo, el contenido desaparecería de golpe al cerrar, antes
// de que termine la transición CSS de 0.3s.

import { useEffect, useRef, useState } from 'react';
import type { Ejemplar } from '../../types/ejemplar';
import { WHATSAPP_URL } from '../../lib/whatsapp';

const SELECTOR_FOCUSEABLES =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function formatoPrecioCLP(precio: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(precio);
}

function etiquetaComercial(ejemplar: Ejemplar): string {
  if (ejemplar.estado === 'reservado') return 'Reservada';
  if (ejemplar.categoria === 'venta' && typeof ejemplar.precio === 'number') {
    return formatoPrecioCLP(ejemplar.precio);
  }
  return 'Disponible para trueque';
}

function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

interface ModalEjemplarProps {
  ejemplar: Ejemplar | null;
  onCerrar: () => void;
}

export function ModalEjemplar({ ejemplar, onCerrar }: ModalEjemplarProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const cajaRef = useRef<HTMLDivElement | null>(null);
  const elementoAnteriorRef = useRef<HTMLElement | null>(null);
  const [ejemplarMostrado, setEjemplarMostrado] = useState<Ejemplar | null>(null);

  const abierto = ejemplar !== null;

  useEffect(() => {
    if (ejemplar) setEjemplarMostrado(ejemplar);
  }, [ejemplar]);

  useEffect(() => {
    if (!abierto) return;

    elementoAnteriorRef.current = document.activeElement as HTMLElement;
    document.body.classList.add('modal-abierto');

    function obtenerFocuseables(): HTMLElement[] {
      const caja = cajaRef.current;
      if (!caja) return [];
      return Array.from(caja.querySelectorAll<HTMLElement>(SELECTOR_FOCUSEABLES)).filter(
        (el) => el.offsetParent !== null
      );
    }

    const focuseables = obtenerFocuseables();
    (focuseables[0] ?? cajaRef.current)?.focus();

    function manejarTeclado(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onCerrar();
        return;
      }

      if (event.key !== 'Tab') return;

      const items = obtenerFocuseables();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }

      const primero = items[0];
      const ultimo = items[items.length - 1];

      if (event.shiftKey && document.activeElement === primero) {
        event.preventDefault();
        ultimo.focus();
      } else if (!event.shiftKey && document.activeElement === ultimo) {
        event.preventDefault();
        primero.focus();
      }
    }

    document.addEventListener('keydown', manejarTeclado);

    return () => {
      document.removeEventListener('keydown', manejarTeclado);
      document.body.classList.remove('modal-abierto');
      if (elementoAnteriorRef.current && document.body.contains(elementoAnteriorRef.current)) {
        elementoAnteriorRef.current.focus();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abierto]);

  return (
    <div
      id="modal-ejemplar"
      className={`modal-overlay${abierto ? ' activo' : ''}`}
      aria-hidden={!abierto}
      ref={overlayRef}
      onClick={(event) => {
        if (event.target === overlayRef.current) onCerrar();
      }}
    >
      <div className="modal-caja" tabIndex={-1} ref={cajaRef}>
        <button type="button" className="modal-cerrar-x" aria-label="Cerrar" onClick={onCerrar}>
          ×
        </button>
        {ejemplarMostrado && (
          <>
            <div className="modal-imagen">
              <img src={ejemplarMostrado.imagenUrl} alt={ejemplarMostrado.nombre} />
            </div>
            <div className="modal-info">
              <span
                className={`tag-card${ejemplarMostrado.estado === 'reservado' ? ' reservada' : ''}`}
              >
                {etiquetaComercial(ejemplarMostrado)}
              </span>
              <h3>{ejemplarMostrado.nombre}</h3>
              <p className="modal-especie">{ejemplarMostrado.especie}</p>
              <ul className="modal-detalles">
                <li>
                  <strong>Tamaño:</strong> {capitalizar(ejemplarMostrado.tamano)}
                </li>
                <li>
                  <strong>Condición:</strong> {ejemplarMostrado.condicion}
                </li>
              </ul>
              <div className="modal-acciones">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-contacto"
                >
                  Contactar por este ejemplar
                </a>
                <button type="button" className="btn-cerrar-modal" onClick={onCerrar}>
                  Volver al catálogo
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
