// src/pages/admin/EjemplarFormulario.test.tsx
//
// Capa 6 — Testing. Cubre la validación de EjemplarFormulario (Capa 4)
// en modo "crear": que no se pueda enviar el formulario con campos
// obligatorios vacíos, y que la validación específica de precio para
// categoría "venta" también bloquee el envío.
//
// Mock de `../../lib/ejemplaresAdminApi` completo (no solo supabase):
// el objetivo de estos tests es la validación del formulario, no el
// resultado de la llamada a Supabase — mockear un nivel más arriba
// evita tener que reproducir la cadena `.from().insert().select()...`
// solo para verificar que NUNCA debería llamarse en estos casos.
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import EjemplarFormulario from './EjemplarFormulario';

jest.mock('../../lib/ejemplaresAdminApi', () => ({
  crearEjemplar: jest.fn(),
  actualizarEjemplar: jest.fn(),
  obtenerEjemplarPorId: jest.fn(),
  subirImagenEjemplar: jest.fn(),
}));

import {
  crearEjemplar,
  actualizarEjemplar,
} from '../../lib/ejemplaresAdminApi';

function renderFormulario() {
  return render(
    <MemoryRouter>
      <EjemplarFormulario modo="crear" />
    </MemoryRouter>
  );
}

describe('EjemplarFormulario — validación (Capa 4)', () => {
  // HALLAZGO (no es un bug que esta capa deba corregir, pero sí señalarlo):
  // nombre, especie y condición ya tienen el atributo HTML `required`.
  // Eso significa que un clic real de mouse/teclado sobre "Guardar" con
  // esos campos vacíos NUNCA llega a disparar `manejarEnvio` — el
  // navegador (y jsdom, que lo reproduce fielmente) bloquea el submit
  // por validación nativa antes de que corra React. Lo comprobé
  // intentando el test "obvio" (click en Guardar -> buscar el texto de
  // error) y falló porque el mensaje nunca se renderiza por esa razón,
  // no porque la validación esté rota.
  //
  // Consecuencia: el chequeo manual de
  // `!datos.nombre.trim() || !datos.especie.trim() || !datos.condicion.trim()`
  // dentro de `manejarEnvio` es código muerto en el flujo normal de UI
  // — solo se alcanzaría si alguien quita el `required` del HTML, o si
  // el formulario se envía programáticamente evitando la validación
  // del navegador (poco realista aquí). No lo modifiqué porque no es
  // mi capa y no rompe nada, pero es deuda técnica a decidir: o se
  // quita el chequeo redundante, o se documenta como defensa en
  // profundidad intencional.
  //
  // Por eso este test verifica el comportamiento real (el navegador
  // bloquea el envío y no se llama a crearEjemplar), y el siguiente
  // test aparte ejercita el chequeo de JS directamente disparando el
  // evento `submit` sobre el <form> (evita la validación nativa, igual
  // que haría `form.submit()` o `dispatchEvent` a mano) para confirmar
  // que, si se llegara a ejecutar, el mensaje es el esperado.
  it('el navegador bloquea el envío por validación nativa (required) si nombre/especie/condición están vacíos', async () => {
    const user = userEvent.setup();
    renderFormulario();

    await user.click(screen.getByRole('button', { name: /guardar/i }));

    expect(screen.getByLabelText(/^nombre$/i)).toBeInvalid();
    expect(crearEjemplar).not.toHaveBeenCalled();
    expect(actualizarEjemplar).not.toHaveBeenCalled();
    // El mensaje de error propio del componente no llega a mostrarse
    // porque manejarEnvio nunca se ejecuta en este flujo.
    expect(
      screen.queryByText('Nombre, especie y condición son obligatorios.')
    ).not.toBeInTheDocument();
  });

  it('(defensa en profundidad) si el submit se dispara evitando la validación nativa, el chequeo de JS también bloquea campos vacíos', async () => {
    const { container } = renderFormulario();

    const form = container.querySelector('form') as HTMLFormElement;
    // fireEvent.submit despacha el evento directo sobre el form, sin
    // pasar por el botón — a diferencia de un clic real, esto no
    // dispara la validación nativa del navegador, así que sí llega a
    // ejecutar `manejarEnvio`.
    fireEvent.submit(form);

    expect(
      await screen.findByText('Nombre, especie y condición son obligatorios.')
    ).toBeInTheDocument();
    expect(crearEjemplar).not.toHaveBeenCalled();
    expect(actualizarEjemplar).not.toHaveBeenCalled();
  });

  it('exige un precio mayor a 0 cuando la categoría es "venta"', async () => {
    const user = userEvent.setup();
    renderFormulario();

    await user.type(screen.getByLabelText(/^nombre$/i), 'Monstera deliciosa');
    await user.type(screen.getByLabelText(/^especie$/i), 'Monstera deliciosa');
    await user.type(screen.getByLabelText(/^condición$/i), 'Enraizada');
    // La categoría por defecto ya es "venta" (VALORES_INICIALES), y el
    // precio por defecto es null, así que no hace falta tocar el
    // <select> de categoría para este caso.

    await user.click(screen.getByRole('button', { name: /guardar/i }));

    expect(
      await screen.findByText('Si la categoría es "venta", el precio debe ser mayor a 0.')
    ).toBeInTheDocument();
    expect(crearEjemplar).not.toHaveBeenCalled();
  });

  it('no exige imagen ni precio si se cambia a categoría "trueque", pero sí exige imagen para un ejemplar nuevo', async () => {
    const user = userEvent.setup();
    renderFormulario();

    await user.type(screen.getByLabelText(/^nombre$/i), 'Philodendron gloriosum');
    await user.type(screen.getByLabelText(/^especie$/i), 'Philodendron gloriosum');
    await user.type(screen.getByLabelText(/^condición$/i), 'Enraizado');
    await user.selectOptions(screen.getByLabelText(/^categoría$/i), 'trueque');

    await user.click(screen.getByRole('button', { name: /guardar/i }));

    // Con datos válidos y categoría "trueque" (sin precio), la siguiente
    // validación en la cadena es la de imagen obligatoria en modo "crear".
    expect(
      await screen.findByText('Debes subir una imagen para un ejemplar nuevo.')
    ).toBeInTheDocument();
    expect(crearEjemplar).not.toHaveBeenCalled();
  });
});
