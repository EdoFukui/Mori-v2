// src/lib/supabase.ts
//
// Cliente único de Supabase para todo el proyecto. Lee la URL y la
// clave anónima desde variables de entorno de Vite (prefijo VITE_),
// definidas en un archivo .env local que NO se sube al repo.
//
// Requiere en .env (proyecto tjgkzzpvqrqvmshcwwtl, región sa-east-1):
//   VITE_SUPABASE_URL=https://tjgkzzpvqrqvmshcwwtl.supabase.co
//   VITE_SUPABASE_ANON_KEY=<clave anónima pública, no la service_role>

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en el archivo .env'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
