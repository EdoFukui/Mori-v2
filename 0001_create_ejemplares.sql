-- Capa 1 — Backend y datos
-- Tabla ejemplares + RLS
--
-- Esquema tomado de la sección 2.2 de mori-2.0-guia-proyecto.md, con UN
-- ajuste a las políticas RLS respecto al borrador original del documento.
-- Ver nota "AJUSTE VALIDADO" más abajo para el detalle y la fuente.

create table if not exists ejemplares (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  especie text not null,
  categoria text not null check (categoria in ('venta','trueque')),
  precio integer,
  estado text not null default 'disponible' check (estado in ('disponible','reservado','retirado')),
  tamano text not null check (tamano in ('pequeño','mediano','grande')),
  condicion text not null,
  imagen_url text not null,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

-- Trigger para mantener actualizado_en al día en cada UPDATE.
-- (No estaba en el borrador de la guía; sin esto, actualizado_en se
-- queda pegado en el valor de creación en cada edición del panel admin
-- — es un detalle menor pero que la Capa 4 va a necesitar sí o sí.)
create or replace function set_actualizado_en()
returns trigger as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_ejemplares_actualizado_en on ejemplares;
create trigger trg_ejemplares_actualizado_en
  before update on ejemplares
  for each row
  execute function set_actualizado_en();

alter table ejemplares enable row level security;

-- ============================================================
-- AJUSTE VALIDADO respecto al borrador de la sección 2.2
-- ============================================================
-- El borrador original usaba:
--   using (auth.role() = 'authenticated')
-- en la policy de escritura. Validado contra la documentación oficial
-- de Supabase (guía de rendimiento y buenas prácticas de RLS,
-- supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices),
-- el patrón recomendado es usar la cláusula `TO <rol>` de la policy en
-- vez de evaluar auth.role() dentro de USING/WITH CHECK: Postgres
-- descarta la policy a nivel de rol ANTES de evaluar la expresión, lo
-- que es más rápido y más explícito para quien lea el SQL. Este archivo
-- ya aplica esa forma. No cambia el comportamiento de seguridad respecto
-- al borrador, solo la forma recomendada de expresarlo.

-- Lectura pública: cualquiera (anon o authenticated) puede ver ejemplares
-- que no estén retirados. Este es el catálogo público (Capa 3).
create policy "Lectura pública de catálogo activo"
  on ejemplares for select
  to anon, authenticated
  using (estado != 'retirado');

-- Lectura completa para el panel admin (Capa 4): un usuario autenticado
-- también debe poder ver los ejemplares "retirado" para poder
-- reactivarlos o consultarlos en el listado admin.
create policy "Lectura completa para admin autenticado"
  on ejemplares for select
  to authenticated
  using (true);

-- Escritura (insert/update/delete) solo para usuarios autenticados.
create policy "Escritura solo admin autenticado"
  on ejemplares for insert
  to authenticated
  with check (true);

create policy "Actualización solo admin autenticado"
  on ejemplares for update
  to authenticated
  using (true)
  with check (true);

create policy "Borrado solo admin autenticado"
  on ejemplares for delete
  to authenticated
  using (true);

-- ============================================================
-- PENDIENTE DE VALIDACIÓN MANUAL (no lo doy por cerrado desde acá)
-- ============================================================
-- Estas policies asumen que cualquier fila autenticada (auth.uid() no
-- nulo) es "el admin", es decir: un único usuario administrador, sin
-- roles ni multi-tenant. Eso coincide con el alcance de Mori 2.0 (un
-- solo dueño de catálogo), pero si en algún momento se agregan más
-- usuarios autenticados con permisos distintos, este esquema de "todo
-- autenticado es admin" deja de servir y hay que introducir un rol
-- explícito (columna en una tabla de perfiles, o app_metadata en el JWT).
--
-- Antes de dar la Capa 1 por terminada, probar explícitamente en el
-- SQL Editor de Supabase (que corre como superusuario y NO refleja RLS)
-- está descartado como método de verificación real — hay que probar con
-- la anon key (sin sesión) y con un usuario autenticado real, vía curl
-- o el explorador de API de Supabase, confirmando que:
--   1. anon puede leer solo estado != 'retirado'.
--   2. anon NO puede insertar/actualizar/borrar (debe fallar).
--   3. un usuario autenticado puede leer todo, incluido 'retirado'.
--   4. un usuario autenticado puede insertar/actualizar/borrar.
