// src/store/__smoke__/stores.smoke.ts
//
// Verificación manual mínima de esta capa, NO un test suite formal.
// La Capa 6 (Testing) es la responsable de los tests reales con
// Jest + RTL sobre componentes. Este archivo es solo para que quien
// revise la Capa 5 pueda correr `npx tsx src/store/__smoke__/stores.smoke.ts`
// (o pegar el contenido en un scratch) y confirmar que el estado se
// comporta como se espera, sin depender de un entorno de test montado.

import { useCatalogoStore } from '../catalogoStore';
import { useFiltrosStore } from '../filtrosStore';
import { ejemplaresMock } from '../mocks/ejemplaresMock';

function assert(condicion: boolean, mensaje: string) {
  if (!condicion) throw new Error(`FALLÓ: ${mensaje}`);
  console.log(`OK: ${mensaje}`);
}

// --- catalogoStore ---
useCatalogoStore.getState().setEjemplares(ejemplaresMock);
assert(
  useCatalogoStore.getState().ejemplares.length === ejemplaresMock.length,
  'setEjemplares carga la lista completa'
);

const nuevo = { ...ejemplaresMock[0], id: 'nuevo-id', nombre: 'Nuevo ejemplar' };
useCatalogoStore.getState().upsertEjemplar(nuevo);
assert(
  useCatalogoStore.getState().ejemplares.some((e) => e.id === 'nuevo-id'),
  'upsertEjemplar inserta un ejemplar nuevo'
);

useCatalogoStore.getState().removerEjemplar('nuevo-id');
assert(
  !useCatalogoStore.getState().ejemplares.some((e) => e.id === 'nuevo-id'),
  'removerEjemplar elimina el ejemplar del store'
);

// --- filtrosStore ---
useFiltrosStore.getState().setCategoria('trueque');
assert(useFiltrosStore.getState().categoria === 'trueque', 'setCategoria actualiza el filtro');

useFiltrosStore.getState().resetFiltros();
assert(useFiltrosStore.getState().categoria === 'todas', 'resetFiltros vuelve al valor por defecto');

console.log('Smoke test de Capa 5 (Zustand) completo.');
