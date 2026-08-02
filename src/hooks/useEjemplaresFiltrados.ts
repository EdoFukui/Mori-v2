// src/hooks/useEjemplaresFiltrados.ts
//
// Capa 5 — Estado global (Zustand).
//
// Hook de consumo pensado para la Capa 3 (tienda pública). Combina el
// store de catálogo con el store de filtros y devuelve la lista ya
// filtrada, memoizada para no recalcular en cada render si ni los
// ejemplares ni los filtros cambiaron.
//
// Decisión explícita que debe conocer quien lo use: este hook NO
// excluye ejemplares en estado "retirado". Esa exclusión ya la hace
// la política RLS de lectura pública definida en la Sección 2.2 de la
// guía ("Lectura pública de catálogo activo"), así que si este store
// se puebla con datos ya filtrados por RLS (caso normal de la Capa 3),
// no hay ejemplares retirados que filtrar acá. Si en algún momento se
// usa este mismo store desde el panel admin (Capa 4) con datos sin
// filtrar por RLS, hay que decidir explícitamente si ese caso necesita
// su propio hook — no asumido en esta capa.

import { useMemo } from 'react';
import { useCatalogoStore } from '../store/catalogoStore';
import { useFiltrosStore } from '../store/filtrosStore';
import type { Ejemplar } from '../types/ejemplar';

export function useEjemplaresFiltrados(): Ejemplar[] {
  const ejemplares = useCatalogoStore((s) => s.ejemplares);
  const categoria = useFiltrosStore((s) => s.categoria);
  const tamano = useFiltrosStore((s) => s.tamano);
  const busqueda = useFiltrosStore((s) => s.busqueda);

  return useMemo(() => {
    const busquedaNormalizada = busqueda.trim().toLowerCase();

    return ejemplares.filter((ejemplar) => {
      if (categoria !== 'todas' && ejemplar.categoria !== categoria) {
        return false;
      }
      if (tamano !== 'todos' && ejemplar.tamano !== tamano) {
        return false;
      }
      if (busquedaNormalizada) {
        const coincide =
          ejemplar.nombre.toLowerCase().includes(busquedaNormalizada) ||
          ejemplar.especie.toLowerCase().includes(busquedaNormalizada);
        if (!coincide) return false;
      }
      return true;
    });
  }, [ejemplares, categoria, tamano, busqueda]);
}
