#!/usr/bin/env node
// scripts/migrate-plantas.mjs
//
// Migra los datos de Mori 1.0 (src/data/plantas.json + assets/ejemplares/)
// al proyecto Supabase: sube cada imagen a Storage y crea la fila
// correspondiente en la tabla `ejemplares`.
//
// Uso:
//   1. Copiar plantas.json y la carpeta assets/ejemplares/ del zip de
//      Mori 1.0 a las rutas indicadas en MORI1_JSON_PATH / MORI1_ASSETS_DIR
//      abajo (o pasarlas como variables de entorno).
//   2. Completar .env con SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY
//      (la service_role, NO la anon — este script necesita bypassear
//      RLS porque corre sin sesión de usuario autenticado. La
//      service_role NUNCA debe usarse en código de cliente, solo aquí,
//      en un script que corres tú manualmente desde tu máquina).
//   3. node scripts/migrate-plantas.mjs
//
// Es re-ejecutable: si un ejemplar con el mismo `id` de Mori 1.0 ya fue
// migrado, se hace upsert en vez de duplicar la fila (se usa el id de
// Mori 1.0 como parte del nombre del objeto en Storage, y se busca por
// nombre/especie antes de insertar — ver `yaExiste` más abajo, porque el
// contrato de la Capa 0 genera un uuid nuevo con `gen_random_uuid()` y no
// preserva el id textual de Mori 1.0).

import { createClient } from '@supabase/supabase-js';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MORI1_JSON_PATH =
  process.env.MORI1_JSON_PATH ?? path.join(__dirname, '../mori1-source/plantas.json');
const MORI1_ASSETS_DIR =
  process.env.MORI1_ASSETS_DIR ?? path.join(__dirname, '../mori1-source/ejemplares');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    'Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno. Revisa .env (ver .env.example).'
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const BUCKET = 'ejemplares';

function contentTypeFromExt(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.webp') return 'image/webp';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.png') return 'image/png';
  return 'application/octet-stream';
}

async function subirImagen(planta) {
  // planta.imagen viene como "assets/ejemplares/Nombre_Archivo.webp"
  // (ruta relativa de Mori 1.0). Tomamos solo el nombre de archivo.
  const nombreArchivo = path.basename(planta.imagen);
  const rutaLocal = path.join(MORI1_ASSETS_DIR, nombreArchivo);

  const buffer = await readFile(rutaLocal);
  const rutaStorage = `${planta.id}/${nombreArchivo}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(rutaStorage, buffer, {
      contentType: contentTypeFromExt(rutaLocal),
      upsert: true,
    });

  if (error) throw new Error(`Subiendo ${rutaLocal} a Storage: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(rutaStorage);
  return data.publicUrl;
}

async function yaExiste(planta) {
  // El id de Mori 1.0 (ej. "anthurium-crystallinum-01") no se preserva
  // como PK (la tabla usa uuid), así que para hacer el script
  // re-ejecutable sin duplicar filas, buscamos por nombre + especie.
  // No es una clave perfecta, pero es razonable para un catálogo chico
  // administrado por una sola persona.
  const { data, error } = await supabase
    .from('ejemplares')
    .select('id')
    .eq('nombre', planta.nombre)
    .eq('especie', planta.especie)
    .limit(1);

  if (error) throw new Error(`Consultando duplicados de "${planta.nombre}": ${error.message}`);
  return data.length > 0;
}

async function migrarPlanta(planta) {
  const imagenUrl = await subirImagen(planta);

  // Mapeo del contrato Mori 1.0 -> tipo Ejemplar (sección 2.1):
  // - "tamaño" (con ñ) -> "tamano" (sin ñ), mismo valor.
  // - "imagen" (ruta local) -> "imagen_url" (URL de Storage).
  // - "id" textual de Mori 1.0 se descarta; Supabase genera uuid nuevo.
  const fila = {
    nombre: planta.nombre,
    especie: planta.especie,
    categoria: planta.categoria,
    precio: planta.precio,
    estado: planta.estado,
    tamano: planta.tamaño,
    condicion: planta.condicion,
    imagen_url: imagenUrl,
  };

  const { error } = await supabase.from('ejemplares').insert(fila);
  if (error) throw new Error(`Insertando "${planta.nombre}": ${error.message}`);

  console.log(`✅ Migrado: ${planta.nombre} (${planta.especie})`);
}

async function main() {
  const raw = await readFile(MORI1_JSON_PATH, 'utf-8');
  const plantas = JSON.parse(raw);

  console.log(`Migrando ${plantas.length} ejemplares desde ${MORI1_JSON_PATH}...`);

  // Verificación previa: que todas las imágenes referenciadas existan
  // localmente antes de tocar Supabase, para no dejar la migración a
  // medias por un archivo faltante.
  const archivosLocales = new Set(await readdir(MORI1_ASSETS_DIR));
  const faltantes = plantas
    .map((p) => path.basename(p.imagen))
    .filter((nombre) => !archivosLocales.has(nombre));

  if (faltantes.length > 0) {
    console.error('❌ Faltan estas imágenes en', MORI1_ASSETS_DIR, ':\n', faltantes.join('\n'));
    process.exit(1);
  }

  let migradas = 0;
  let omitidas = 0;

  for (const planta of plantas) {
    if (await yaExiste(planta)) {
      console.log(`⏭  Ya existe, se omite: ${planta.nombre} (${planta.especie})`);
      omitidas++;
      continue;
    }
    await migrarPlanta(planta);
    migradas++;
  }

  console.log(`\nListo. Migradas: ${migradas}. Omitidas (ya existían): ${omitidas}.`);
}

main().catch((error) => {
  console.error('❌ Migración interrumpida:', error.message);
  process.exit(1);
});
