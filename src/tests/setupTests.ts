// src/tests/setupTests.ts
//
// Setup global de Jest (Capa 6). Se ejecuta antes de cada archivo de
// test (ver `setupFilesAfterEnv` en jest.config.cjs).

import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'node:util';

// jsdom no expone TextEncoder/TextDecoder globalmente (dependencia
// indirecta de react-router-dom). Se poliféan desde el módulo nativo
// de Node antes de que se cargue cualquier componente.
if (typeof global.TextEncoder === 'undefined') {
  // @ts-expect-error -- polyfill mínimo, no necesita el tipado exacto de lib.dom
  global.TextEncoder = TextEncoder;
  // @ts-expect-error -- idem
  global.TextDecoder = TextDecoder;
}

// jsdom no implementa IntersectionObserver. `useScrollReveal` (Capa 3,
// usado por Catalogo y TarjetaEjemplar) instancia uno en cada mount,
// así que sin este stub cualquier test que renderice esos componentes
// falla con "IntersectionObserver is not defined" — no es un bug de
// la Capa 3, es una limitación conocida de jsdom.
class IntersectionObserverStub implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  takeRecords = jest.fn(() => []);
}

// @ts-expect-error -- stub deliberadamente incompleto, solo lo que usan los componentes.
global.IntersectionObserver = IntersectionObserverStub;
