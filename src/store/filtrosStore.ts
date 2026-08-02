// src/store/filtrosStore.ts
//
// Capa 5 — Estado global (Zustand).
//
// Estado de los filtros del catálogo público. En Mori 1.0 (ver
// src/js/catalog.js del repo original) el filtro de categoría se
// resolvía manipulando `tarjeta.style.display` directamente sobre el
// DOM. Ese enfoque desaparece acá: los componentes de la Capa 3 deben
// leer `useEjemplaresFiltrados()` (ver src/hooks) y renderizar
// condicionalmente a partir del resultado, sin tocar el DOM a mano.
//
// Nota: 'todas' como valor de categoría reproduce el botón "Todas" de
// Mori 1.0 (ver filtros por defecto en index.html).

import { create } from 'zustand';
import type { Categoria, Tamano } from '../types/ejemplar';

export type FiltroCategoria = Categoria | 'todas';
export type FiltroTamano = Tamano | 'todos';

interface FiltrosState {
  categoria: FiltroCategoria;
  tamano: FiltroTamano;
  /** Texto de búsqueda libre sobre nombre/especie. Vacío = sin búsqueda. */
  busqueda: string;

  setCategoria: (categoria: FiltroCategoria) => void;
  setTamano: (tamano: FiltroTamano) => void;
  setBusqueda: (busqueda: string) => void;

  /** Vuelve todos los filtros a su valor por defecto. */
  resetFiltros: () => void;
}

const filtrosPorDefecto = {
  categoria: 'todas' as FiltroCategoria,
  tamano: 'todos' as FiltroTamano,
  busqueda: '',
};

export const useFiltrosStore = create<FiltrosState>((set) => ({
  ...filtrosPorDefecto,

  setCategoria: (categoria) => set({ categoria }),
  setTamano: (tamano) => set({ tamano }),
  setBusqueda: (busqueda) => set({ busqueda }),

  resetFiltros: () => set({ ...filtrosPorDefecto }),
}));
