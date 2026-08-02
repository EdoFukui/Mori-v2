// src/components/publico/Catalogo.tsx
//
// Port de src/js/catalog.js (Mori 1.0), consumiendo Supabase en vez
// del JSON estático (vía useEjemplares).
//
// ⚠️ ESTADO DEL FILTRO — PENDIENTE DE CAPA 5: la guía dice
// explícitamente que "los filtros de categoría funcionan vía store
// [Zustand] en vez de manipulación directa del DOM" (criterio de
// término de Capa 5). Ahora mismo uso useState local para el filtro
// porque Capa 5 está "en paralelo, no bloqueadora" según tu mensaje.
// Cuando Capa 5 entregue el store, hay que reemplazar el useState de
// `filtro` por el selector del store — el resto del componente no
// debería necesitar cambios.
//
// Diferencia de implementación respecto al original: catalog.js
// mantiene todas las tarjetas montadas y las oculta con
// `display:none`. Acá filtro el array antes de mapear, así que las
// tarjetas ocultas se desmontan. Efecto secundario menor: si alguien
// cambia de filtro y vuelve, la tarjeta reaparece y su animación
// "reveal" se dispara de nuevo (en el original quedaba "active" para
// siempre una vez vista). No es una regresión funcional, pero lo dejo
// señalado porque es un cambio de comportamiento, no solo de código.

import { useState } from 'react';
import type { Ejemplar } from '../../types/ejemplar';
import { useEjemplares } from '../../hooks/useEjemplares';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { TarjetaEjemplar } from './TarjetaEjemplar';
import { ModalEjemplar } from './ModalEjemplar';
import { useFiltrosStore } from '../../store/filtrosStore';
import { useEjemplaresFiltrados } from '../../hooks/useEjemplaresFiltrados';
import type { FiltroCategoria } from '../../store/filtrosStore';
import { useEffect } from 'react';
import { useCatalogoStore } from '../../store/catalogoStore';

const FILTROS: { valor: FiltroCategoria; etiqueta: string }[] = [
  { valor: 'todas', etiqueta: 'Todas' },
  { valor: 'trueque', etiqueta: 'Trueque' },
  { valor: 'venta', etiqueta: 'Venta' },
];

export function Catalogo() {
const { ejemplares, cargando, error } = useEjemplares();
const { setEjemplares } = useCatalogoStore();
const { categoria, setCategoria } = useFiltrosStore();
const ejemplaresFiltrados = useEjemplaresFiltrados();

// Llenar el store cuando carguen los ejemplares
useEffect(() => {
  if (ejemplares.length > 0) {
    setEjemplares(ejemplares);
  }
}, [ejemplares, setEjemplares]);
  const [seleccionado, setSeleccionado] = useState<Ejemplar | null>(null);
  const titulo = useScrollReveal<HTMLHeadingElement>();
  const filtrosReveal = useScrollReveal<HTMLDivElement>();

  return (
    <section className="catalogo" id="catalogo">
      <h2 className={`titulo-seccion ${titulo.className}`} ref={titulo.ref}>
        Nuestra Colección
      </h2>

      <div className={`filtros ${filtrosReveal.className}`} ref={filtrosReveal.ref}>
        {FILTROS.map((f) => (
          <button
            key={f.valor}
            type="button"
            className={`btn-filtro${categoria === f.valor ? ' activo' : ''}`}
	    aria-pressed={categoria === f.valor}
            onClick={() => setCategoria(f.valor)}
          >
            {f.etiqueta}
          </button>
        ))}
      </div>

      <div className="grid-plantas" id="contenedor-plantas">
        {cargando &&
          Array.from({ length: 3 }).map((_, i) => (
            <div className="skeleton-card" key={i}>
              <div className="skeleton-img" />
              <div className="skeleton-info">
                <div className="skeleton-line medium" />
                <div className="skeleton-line short" />
              </div>
            </div>
          ))}

        {!cargando && error && (
          <p className="error-catalogo">
            No fue posible cargar el catálogo. Intenta nuevamente más tarde.
          </p>
        )}

        {!cargando &&
          !error &&
          ejemplaresFiltrados.map((ejemplar) => (
            <TarjetaEjemplar key={ejemplar.id} ejemplar={ejemplar} onSeleccionar={setSeleccionado} />
          ))}
      </div>

      <ModalEjemplar ejemplar={seleccionado} onCerrar={() => setSeleccionado(null)} />
    </section>
  );
}
