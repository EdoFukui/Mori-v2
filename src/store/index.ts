// src/store/index.ts
//
// Punto único de import para la Capa 3 y la Capa 4.
//
//   import { useCatalogoStore, useFiltrosStore, useEjemplaresFiltrados } from '../store';

export { useCatalogoStore } from './catalogoStore';
export { useFiltrosStore } from './filtrosStore';
export type { FiltroCategoria, FiltroTamano } from './filtrosStore';
export { useEjemplaresFiltrados } from '../hooks/useEjemplaresFiltrados';
