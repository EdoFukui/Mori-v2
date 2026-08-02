// src/components/publico/TarjetaEjemplar.tsx
// Port de la cardHTML() de src/js/catalog.js (Mori 1.0), como
// componente controlado: abre el modal vía callback en vez de
// delegación de eventos sobre el DOM global.

import type { Ejemplar } from '../../types/ejemplar';
import { WHATSAPP_URL } from '../../lib/whatsapp';
import { useScrollReveal } from '../../hooks/useScrollReveal';

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
  return 'Trueque';
}

interface TarjetaEjemplarProps {
  ejemplar: Ejemplar;
  onSeleccionar: (ejemplar: Ejemplar) => void;
}

export function TarjetaEjemplar({ ejemplar, onSeleccionar }: TarjetaEjemplarProps) {
  const { ref, className } = useScrollReveal<HTMLDivElement>();

  return (
    <div
      className={`card ${className}`}
      data-categoria={ejemplar.categoria}
      data-id={ejemplar.id}
      ref={ref}
      onClick={() => onSeleccionar(ejemplar)}
    >
      <div className="card-imagen">
        <img
          src={ejemplar.imagenUrl}
          alt={`${ejemplar.nombre}, tamaño ${ejemplar.tamano}, ${ejemplar.condicion}`}
          loading="lazy"
        />
        {/* stopPropagation: el botón "Consultar" va directo a WhatsApp,
            no debe también disparar la apertura del modal (mismo
            comportamiento que el "el botón Consultar queda excluido"
            de ejemplarModal.js). */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-card"
          onClick={(event) => event.stopPropagation()}
        >
          Consultar
        </a>
      </div>
      <div className="card-info">
        <h3>{ejemplar.nombre}</h3>
        <span className={`tag-card${ejemplar.estado === 'reservado' ? ' reservada' : ''}`}>
          {etiquetaComercial(ejemplar)}
        </span>
      </div>
    </div>
  );
}
