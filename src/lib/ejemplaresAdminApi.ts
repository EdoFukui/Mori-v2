// src/lib/ejemplaresAdminApi.ts
//
// Funciones de escritura/lectura administrativa sobre la tabla
// `ejemplares` y el bucket de Storage `ejemplares` (Capa 1).
// Todas las llamadas dependen de sesión autenticada — RLS lo exige.

import { supabase } from './supabase';
import type { Ejemplar, Categoria, Estado, Tamano } from '../types/ejemplar';
import { mapEjemplarFromRow, type EjemplarRow } from './mapEjemplar';

export type EjemplarFormData = {
  nombre: string;
  especie: string;
  categoria: Categoria;
  precio: number | null;
  estado: Estado;
  tamano: Tamano;
  condicion: string;
};

const BUCKET = 'ejemplares';

/**
 * Lista TODOS los ejemplares (incluyendo 'retirado'), porque el admin
 * necesita verlos y gestionarlos aunque no aparezcan en la tienda pública.
 */
export async function listarEjemplaresAdmin(): Promise<Ejemplar[]> {
  const { data, error } = await supabase
    .from('ejemplares')
    .select('*')
    .order('creado_en', { ascending: false });

  if (error) throw error;
  return (data as EjemplarRow[]).map(mapEjemplarFromRow);
}

export async function obtenerEjemplarPorId(id: string): Promise<Ejemplar | null> {
  const { data, error } = await supabase
    .from('ejemplares')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapEjemplarFromRow(data as EjemplarRow) : null;
}

/**
 * Sube una imagen al bucket `ejemplares` con nombre aleatorio y devuelve
 * la URL pública. Requiere sesión autenticada y política de Storage
 * configurada en el dashboard de Supabase.
 */
export async function subirImagenEjemplar(file: File): Promise<string> {
  const extension = file.name.split('.').pop() ?? 'webp';
  const nombreArchivo = `${crypto.randomUUID()}.${extension}`;

  const { error: errorSubida } = await supabase.storage
    .from(BUCKET)
    .upload(nombreArchivo, file, { cacheControl: '3600', upsert: false });

  if (errorSubida) throw errorSubida;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(nombreArchivo);
  return data.publicUrl;
}

export async function crearEjemplar(
  datos: EjemplarFormData,
  imagenUrl: string
): Promise<Ejemplar> {
  const { data, error } = await supabase
    .from('ejemplares')
    .insert({
      nombre: datos.nombre,
      especie: datos.especie,
      categoria: datos.categoria,
      precio: datos.precio,
      estado: datos.estado,
      tamano: datos.tamano,
      condicion: datos.condicion,
      imagen_url: imagenUrl,
    })
    .select()
    .single();

  if (error) throw error;
  return mapEjemplarFromRow(data as EjemplarRow);
}

/**
 * `imagenUrl` es opcional: si el admin no sube imagen nueva al editar,
 * se mantiene la existente.
 */
export async function actualizarEjemplar(
  id: string,
  datos: EjemplarFormData,
  imagenUrl?: string
): Promise<Ejemplar> {
  const payload: Record<string, unknown> = {
    nombre: datos.nombre,
    especie: datos.especie,
    categoria: datos.categoria,
    precio: datos.precio,
    estado: datos.estado,
    tamano: datos.tamano,
    condicion: datos.condicion,
    actualizado_en: new Date().toISOString(),
  };
  if (imagenUrl) payload.imagen_url = imagenUrl;

  const { data, error } = await supabase
    .from('ejemplares')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return mapEjemplarFromRow(data as EjemplarRow);
}

export async function borrarEjemplar(id: string): Promise<void> {
  const { error } = await supabase.from('ejemplares').delete().eq('id', id);
  if (error) throw error;
}
