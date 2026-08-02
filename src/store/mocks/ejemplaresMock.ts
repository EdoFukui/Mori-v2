// src/store/mocks/ejemplaresMock.ts
//
// Datos mock que respetan el tipo `Ejemplar` (Sección 2.1 de la guía),
// pensados solo para probar los stores de esta capa de forma aislada
// mientras la Capa 1 (Supabase) no está conectada. NO son datos reales
// del catálogo — son una adaptación mínima de src/data/plantas.json de
// Mori 1.0 al nuevo contrato (rename tamaño -> tamano, imagen ->
// imagenUrl, agregado de creadoEn/actualizadoEn).
//
// Esto no reemplaza el script de migración real de la Capa 1.

import type { Ejemplar } from '../../types/ejemplar';

export const ejemplaresMock: Ejemplar[] = [
  {
    id: 'anthurium-crystallinum-01',
    nombre: 'Anthurium sp Crystallinum',
    especie: 'Anthurium crystallinum',
    categoria: 'venta',
    precio: 20000,
    estado: 'disponible',
    tamano: 'pequeño',
    condicion: 'Enraizado',
    imagenUrl: '/mock/Anthurium_sp_Crystallinum.webp',
    creadoEn: '2026-01-01T00:00:00.000Z',
    actualizadoEn: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'alocasia-piccolini-01',
    nombre: 'Alocasia sp Piccolini',
    especie: 'Alocasia piccolini',
    categoria: 'venta',
    precio: 12000,
    estado: 'disponible',
    tamano: 'pequeño',
    condicion: 'Enraizado',
    imagenUrl: '/mock/Alocasia_sp_Piccolini.webp',
    creadoEn: '2026-01-01T00:00:00.000Z',
    actualizadoEn: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'scindapsus-manjula-01',
    nombre: 'Scindapsus sp Manjula',
    especie: "Scindapsus pictus 'Manjula'",
    categoria: 'trueque',
    precio: null,
    estado: 'reservado',
    tamano: 'pequeño',
    condicion: 'Enraizado',
    imagenUrl: '/mock/Scindapsus_sp_Manjula_1.webp',
    creadoEn: '2026-01-01T00:00:00.000Z',
    actualizadoEn: '2026-01-15T00:00:00.000Z',
  },
];
