// src/hooks/useEjemplares.ts
//
// Trae los ejemplares activos (estado != 'retirado') desde la tabla
// `ejemplares`. La policy de RLS de lectura pública (sección 2.2 de la
// guía) ya filtra esto en el servidor, pero igual agrego el .neq()
// explícito acá para no depender silenciosamente de una policy que
// otro chat (Capa 1) podría modificar sin que Capa 3 se entere.
//
// No usa Zustand: la Capa 5 está "en paralelo, no bloqueadora" según
// tu mensaje, así que este hook es el punto de datos que el store de
// Capa 5 debería envolver más adelante — no lo reemplacé por nada
// propio para que ese reemplazo sea directo.

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { mapEjemplarFromRow, type EjemplarRow } from '../lib/mapEjemplar';
import type { Ejemplar } from '../types/ejemplar';

interface UseEjemplaresResult {
  ejemplares: Ejemplar[];
  cargando: boolean;
  error: string | null;
}

export function useEjemplares(): UseEjemplaresResult {
  const [ejemplares, setEjemplares] = useState<Ejemplar[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;

    async function cargar() {
      setCargando(true);
      setError(null);

      const { data, error: errorSupabase } = await supabase
        .from('ejemplares')
        .select('*')
        .neq('estado', 'retirado')
        .order('creado_en', { ascending: false });

      if (!activo) return;

      if (errorSupabase) {
        setError(errorSupabase.message);
        setEjemplares([]);
      } else {
        setEjemplares(((data ?? []) as EjemplarRow[]).map(mapEjemplarFromRow));
      }

      setCargando(false);
    }

    cargar();

    return () => {
      activo = false;
    };
  }, []);

  return { ejemplares, cargando, error };
}
