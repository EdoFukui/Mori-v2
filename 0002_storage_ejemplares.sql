-- Capa 1 — Backend y datos
-- Bucket de Storage para imágenes de ejemplares + RLS de storage.objects
--
-- No estaba especificado en el borrador de la sección 2.2 de la guía
-- (que solo hablaba del bucket en la entrega de la Capa 1, sin SQL
-- concreto). Esto es una propuesta razonable siguiendo el mismo patrón
-- de RLS que la tabla ejemplares: lectura pública, escritura solo
-- autenticado.

insert into storage.buckets (id, name, public)
values ('ejemplares', 'ejemplares', true)
on conflict (id) do nothing;

-- Lectura pública de las imágenes (el bucket ya es público, pero esta
-- policy es la que efectivamente lo permite a nivel de storage.objects
-- cuando se accede vía la API en vez de la URL pública directa).
create policy "Lectura pública de imágenes de ejemplares"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'ejemplares');

-- Solo un usuario autenticado puede subir/reemplazar/borrar imágenes,
-- igual que con la tabla ejemplares.
create policy "Subida solo admin autenticado"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'ejemplares');

create policy "Actualización solo admin autenticado"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'ejemplares')
  with check (bucket_id = 'ejemplares');

create policy "Borrado solo admin autenticado"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'ejemplares');

-- NOTA: bucket público (`public = true`) significa que cualquiera con la
-- URL puede ver la imagen sin pasar por RLS de storage.objects (RLS de
-- storage.objects solo aplica a listados/acceso vía la API de Storage,
-- no a la URL pública directa una vez que el objeto existe). Esto es
-- intencional y coherente con que las imágenes ya son públicas en Mori
-- 1.0 (se sirven directo desde assets/ejemplares/ sin protección).
