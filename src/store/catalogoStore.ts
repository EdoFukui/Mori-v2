// src/store/catalogoStore.ts
//
// Capa 5 — Estado global (Zustand).
//
// Este store SOLO mantiene el estado del catálogo en memoria. No hace
// fetch a Supabase ni conoce nada de la capa de datos — eso es
// responsabilidad de la Capa 1 (cliente Supabase) y de quien consuma
// este store (Capa 3 para la tienda pública, Capa 4 para el admin).
//
// Patrón esperado de uso desde otra capa:
//
//   const setEjemplares = useCatalogoStore((s) => s.setEjemplares);
//   useEffect(() => {
//     supabase.from('ejemplares').select('*').then(({ data }) => {
//       setEjemplares(data ?? []);
//     });
//   }, []);
//
// Mientras la Capa 1 no esté conectada, la Capa 3 puede poblar este
// store con datos mock que respeten el tipo `Ejemplar` (ver Sección 2.1
// de la guía), o con el JSON estático de Mori 1.0 adaptado al nuevo
// contrato (recordar el rename `tamaño` -> `tamano`).

import { create } from 'zustand';
import type { Ejemplar } from '../types/ejemplar';

interface CatalogoState {
  /** Lista completa de ejemplares tal como vienen de la fuente de datos. */
  ejemplares: Ejemplar[];
  /** true mientras la capa que consume este store está cargando datos. */
  cargando: boolean;
  /** Mensaje de error de la última carga fallida, o null si no hay error. */
  error: string | null;

  /** Reemplaza la lista completa (ej. tras un fetch inicial). */
  setEjemplares: (ejemplares: Ejemplar[]) => void;

  /** Marca el estado de carga. Lo controla quien hace el fetch (Capa 1/3). */
  setCargando: (cargando: boolean) => void;

  /** Registra un error de carga. Pasar null para limpiarlo. */
  setError: (error: string | null) => void;

  /**
   * Inserta o actualiza un ejemplar por id (upsert local).
   * Pensado para que la Capa 4 refleje al instante en el store el
   * resultado de un insert/update contra Supabase, sin esperar un
   * refetch completo de la tabla.
   */
  upsertEjemplar: (ejemplar: Ejemplar) => void;

  /**
   * Elimina un ejemplar del store por id (borrado local).
   * Igual que upsertEjemplar: refleja localmente el resultado de un
   * delete ya confirmado contra Supabase.
   */
  removerEjemplar: (id: string) => void;
}

export const useCatalogoStore = create<CatalogoState>((set) => ({
  ejemplares: [],
  cargando: false,
  error: null,

  setEjemplares: (ejemplares) => set({ ejemplares, error: null }),

  setCargando: (cargando) => set({ cargando }),

  setError: (error) => set({ error }),

  upsertEjemplar: (ejemplar) =>
    set((state) => {
      const existe = state.ejemplares.some((e) => e.id === ejemplar.id);
      return {
        ejemplares: existe
          ? state.ejemplares.map((e) => (e.id === ejemplar.id ? ejemplar : e))
          : [...state.ejemplares, ejemplar],
      };
    }),

  removerEjemplar: (id) =>
    set((state) => ({
      ejemplares: state.ejemplares.filter((e) => e.id !== id),
    })),
}));
