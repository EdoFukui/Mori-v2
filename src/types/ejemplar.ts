// src/types/ejemplar.ts
//
// Contrato compartido — Sección 2.1 de mori-2.0-guia-proyecto.md.
// No modificar sin señalarlo explícitamente como "propuesta de cambio
// de contrato" (ver Project instructions).

export type Categoria = 'venta' | 'trueque';
export type Estado = 'disponible' | 'reservado' | 'retirado';
export type Tamano = 'pequeño' | 'mediano' | 'grande';

export interface Ejemplar {
  id: string; // uuid generado por Supabase
  nombre: string;
  especie: string;
  categoria: Categoria;
  precio: number | null; // null si es trueque
  estado: Estado;
  tamano: Tamano;
  condicion: string;
  imagenUrl: string; // URL de Supabase Storage, no ruta local
  creadoEn: string; // ISO date
  actualizadoEn: string; // ISO date
}
