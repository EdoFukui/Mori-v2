// src/lib/mapEjemplar.ts
//
// El esquema SQL (sección 2.2 de la guía) usa columnas snake_case
// (imagen_url, creado_en, actualizado_en, tamano), pero el tipo
// `Ejemplar` (sección 2.1) usa camelCase. Este archivo es el único
// punto de traducción entre ambos — necesario porque el contrato no
// lo resuelve explícitamente.
//
// LIMITACIÓN CONOCIDA: los `as Categoria/Estado/Tamano` de abajo son
// casts de TypeScript, no validación en tiempo de ejecución. Si la
// tabla `ejemplares` llegara a tener un valor fuera de los checks SQL
// (no debería pasar si el constraint de la sección 2.2 está activo,
// pero no lo verifiqué yo mismo contra la base real), esto lo dejaría
// pasar silenciosamente en vez de fallar. No agregué un validador
// (ej. zod) porque no está en la tabla de decisiones técnicas de la
// guía — si lo quieres, es una decisión a tomar explícitamente.

import type { Categoria, Ejemplar, Estado, Tamano } from '../types/ejemplar';

export interface EjemplarRow {
  id: string;
  nombre: string;
  especie: string;
  categoria: string;
  precio: number | null;
  estado: string;
  tamano: string;
  condicion: string;
  imagen_url: string;
  creado_en: string;
  actualizado_en: string;
}

export function mapEjemplarFromRow(row: EjemplarRow): Ejemplar {
  return {
    id: row.id,
    nombre: row.nombre,
    especie: row.especie,
    categoria: row.categoria as Categoria,
    precio: row.precio,
    estado: row.estado as Estado,
    tamano: row.tamano as Tamano,
    condicion: row.condicion,
    imagenUrl: row.imagen_url,
    creadoEn: row.creado_en,
    actualizadoEn: row.actualizado_en,
  };
}
