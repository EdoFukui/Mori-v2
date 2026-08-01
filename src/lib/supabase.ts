// src/lib/supabase.ts
// Cliente Supabase inicializado. Consumido por Capa 2 (Auth),
// Capa 3 (tienda pública) y Capa 4 (panel admin).
//
// Usa las variables de entorno de Vite (prefijo VITE_). NO expone la
// service_role key: esta es la anon key, pensada para código de cliente
// y protegida por las policies RLS de la migración 0001.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. Copia .env.example a .env y completa los valores del proyecto Supabase.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
