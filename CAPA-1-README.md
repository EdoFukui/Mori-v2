# Capa 1 — Backend y datos (Supabase)

Este archivo documenta el estado de esta capa y los pasos manuales que
faltan (crear el proyecto Supabase en sí no se puede automatizar desde
acá — necesita tu cuenta y el dashboard).

## Qué entrega esto

- `supabase/migrations/0001_create_ejemplares.sql` — tabla `ejemplares`
  con RLS, siguiendo el contrato de la sección 2 de la guía, con un
  ajuste validado en las policies (ver comentarios en el archivo).
- `supabase/migrations/0002_storage_ejemplares.sql` — bucket de Storage
  `ejemplares` (público) con policies de lectura pública / escritura
  autenticada.
- `src/lib/supabase.ts` — cliente Supabase para el resto de las capas
  (Capa 2, 3, 4 lo importan, no lo reimplementan).
- `scripts/migrate-plantas.mjs` — migra `plantas.json` + las imágenes de
  `assets/ejemplares/` de Mori 1.0 a Supabase.
- `.env.example` — variables necesarias (separadas en cliente vs. solo
  servidor, ver nota de seguridad abajo).

## Pasos para dejar esta capa "terminada" (criterio de la sección 3)

1. **Crear el proyecto en supabase.com** (dashboard, no automatizable
   desde aquí). Región sugerida: la más cercana a Chile disponible
   (`sa-east-1`, si existe en tu plan; si no, la default).
2. **Correr las migraciones**, en orden, desde el SQL Editor del
   dashboard (o con la CLI de Supabase si la tienes configurada):
   - `0001_create_ejemplares.sql`
   - `0002_storage_ejemplares.sql`
3. **Copiar credenciales** a un archivo `.env` real (no lo subas al
   repo): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` desde
   Project Settings → API, y `SUPABASE_SERVICE_ROLE_KEY` (misma página,
   sección "service_role" — **nunca** la pongas en código de cliente).
4. **Copiar los datos fuente de Mori 1.0** a:
   - `mori1-source/plantas.json` (el archivo `src/data/plantas.json` de
     Mori 1.0)
   - `mori1-source/ejemplares/` (el contenido de `assets/ejemplares/` de
     Mori 1.0)

   O bien apuntar `MORI1_JSON_PATH` / `MORI1_ASSETS_DIR` en `.env` a las
   rutas reales donde tengas el zip descomprimido.
5. **Instalar dependencias y correr el script**:
   ```bash
   npm install
   npm run migrate:plantas
   ```
6. **Verificar en el dashboard de Supabase** (Table Editor → `ejemplares`
   y Storage → bucket `ejemplares`) que las 6 filas y las 6 imágenes
   están ahí, con `imagen_url` apuntando a una URL de Supabase que carga
   en el navegador.
7. **Validar RLS manualmente** (esto es lo que la guía marca como "no
   verificado por mí" en la sección 6 — hazlo antes de dar la capa por
   cerrada):
   ```bash
   # Sin sesión (anon): debe devolver solo estado != 'retirado'
   curl "$VITE_SUPABASE_URL/rest/v1/ejemplares?select=nombre,estado" \
     -H "apikey: $VITE_SUPABASE_ANON_KEY"

   # Sin sesión, intento de escritura: debe fallar
   curl -X POST "$VITE_SUPABASE_URL/rest/v1/ejemplares" \
     -H "apikey: $VITE_SUPABASE_ANON_KEY" \
     -H "Content-Type: application/json" \
     -d '{"nombre":"test","especie":"test","categoria":"venta","estado":"disponible","tamano":"pequeño","condicion":"test","imagen_url":"x"}'
   ```
   El segundo comando debe devolver un error (403 o similar), no una
   fila creada. Si crea la fila, las policies de escritura no están
   restringiendo como deberían y hay que revisar la migración 0001
   antes de seguir.

## Nota de seguridad

`SUPABASE_SERVICE_ROLE_KEY` bypassea todas las políticas RLS. Se usa
únicamente en `scripts/migrate-plantas.mjs`, que corres tú manualmente
desde tu máquina. Nunca debe:
- aparecer en ningún archivo dentro de `src/`,
- tener el prefijo `VITE_` (eso la expondría al bundle del navegador),
- subirse a git (confirma que `.env` está en `.gitignore` del repo
  `mori-2.0` — el `.gitignore` de Mori 1.0 que tienes ahora no lo
  incluye porque ese proyecto no usa variables de entorno; hay que
  agregarlo en el repo nuevo).

## Pendiente / fuera del alcance de esta capa

- La validación manual del punto 7 de arriba: la dejo documentada pero
  no la puedo ejecutar yo mismo (necesita tu proyecto Supabase real).
- Roles más allá de "autenticado = admin": si en algún momento hay más
  de un usuario con permisos distintos, las policies de 0001 hay que
  revisarlas — ver nota en ese archivo.
- Capa 2 (Auth) y Capa 4 (panel admin) consumen `src/lib/supabase.ts`
  tal cual está; si necesitan algo más (por ejemplo, un cliente
  server-side distinto), es una extensión de esa capa, no de esta.
