// src/components/publico/ModalEjemplar.test.tsx
//
// Capa 6 — Testing. Cubre ModalEjemplar en aislamiento (sin pasar por
// Catalogo/TarjetaEjemplar) usando un pequeño harness con un <button>
// real como "elemento que abre el modal".
//
// Por qué un harness con <button> y no reusar TarjetaEjemplar: la
// tarjeta de Capa 3 es un <div onClick> sin tabIndex/role="button", es
// decir, NO es un elemento focuseable. Un clic de mouse sobre un div
// así no mueve el foco del navegador hacia él (ni en un browser real
// ni en jsdom), así que "el elemento que abrió el modal" nunca llega a
// tener el foco en primer lugar cuando se abre desde una tarjeta — el
// mismo comportamiento existía ya en Mori 1.0 (ejemplarModal.js hace
// exactamente lo mismo: guarda document.activeElement antes de abrir).
// No es una regresión de la Capa 3 ni algo que esta capa deba
// "arreglar" silenciosamente: queda señalado en el README de Capa 6
// como hallazgo de accesibilidad para quien decida abordarlo (tabIndex
// + role="button" + onKeyDown en TarjetaEjemplar). Lo que SÍ es
// responsabilidad de Capa 6 es probar que la lógica de devolución de
// foco de ModalEjemplar funciona correctamente cuando el elemento que
// lo abre sí es foco-alcanzable, que es el caso general de la lógica
// que implementa el componente.
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModalEjemplar } from './ModalEjemplar';
import type { Ejemplar } from '../../types/ejemplar';

const ejemplarDemo: Ejemplar = {
  id: 'demo-01',
  nombre: 'Monstera deliciosa',
  especie: 'Monstera deliciosa',
  categoria: 'venta',
  precio: 15000,
  estado: 'disponible',
  tamano: 'mediano',
  condicion: 'Enraizada',
  imagenUrl: '/mock/monstera.webp',
  creadoEn: '2026-01-01T00:00:00.000Z',
  actualizadoEn: '2026-01-01T00:00:00.000Z',
};

function Harness() {
  const [abierto, setAbierto] = useState(false);
  return (
    <>
      <button onClick={() => setAbierto(true)}>Abrir ejemplar</button>
      <ModalEjemplar ejemplar={abierto ? ejemplarDemo : null} onCerrar={() => setAbierto(false)} />
    </>
  );
}

function getModal() {
  return document.getElementById('modal-ejemplar') as HTMLElement;
}

describe('ModalEjemplar — apertura, cierre y foco', () => {
  it('se abre al hacer clic en el elemento disparador (aria-hidden pasa a false)', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    expect(getModal()).toHaveAttribute('aria-hidden', 'true');

    await user.click(screen.getByRole('button', { name: 'Abrir ejemplar' }));

    expect(getModal()).toHaveAttribute('aria-hidden', 'false');
    expect(screen.getByRole('heading', { name: 'Monstera deliciosa' })).toBeInTheDocument();
  });

  it('se cierra con la tecla Escape', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole('button', { name: 'Abrir ejemplar' }));
    expect(getModal()).toHaveAttribute('aria-hidden', 'false');

    await user.keyboard('{Escape}');

    expect(getModal()).toHaveAttribute('aria-hidden', 'true');
  });

  it('se cierra con el botón "X"', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole('button', { name: 'Abrir ejemplar' }));
    expect(getModal()).toHaveAttribute('aria-hidden', 'false');

    await user.click(screen.getByRole('button', { name: 'Cerrar' }));

    expect(getModal()).toHaveAttribute('aria-hidden', 'true');
  });

  it('devuelve el foco al elemento que abrió el modal al cerrarse', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    const botonAbrir = screen.getByRole('button', { name: 'Abrir ejemplar' });
    await user.click(botonAbrir);
    expect(botonAbrir).not.toHaveFocus(); // el foco se movió dentro del modal

    await user.keyboard('{Escape}');

    expect(botonAbrir).toHaveFocus();
  });
});
