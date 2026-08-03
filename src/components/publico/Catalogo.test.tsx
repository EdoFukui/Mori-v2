// src/components/publico/Catalogo.test.tsx
//
// Capa 6 — Testing. Cubre:
//  1. Que el filtro de categoría (Todas/Trueque/Venta) muestre solo
//     los ejemplares correctos, vía el store de Capa 5
//     (useFiltrosStore + useEjemplaresFiltrados), no vía DOM directo.
//  2. Que hacer clic en una tarjeta abra ModalEjemplar con el detalle
//     correcto (integración real Catalogo + TarjetaEjemplar +
//     ModalEjemplar, no mockeados).
//
// Mock de `../../lib/supabase`: useEjemplares (Capa 3) llama a
// supabase.from('ejemplares').select('*').neq(...).order(...), que
// debe resolver sin tocar la red real. Se mockea la cadena completa
// devolviendo los datos de src/store/mocks/ejemplaresMock.ts (ya
// respetan el tipo Ejemplar, Sección 2.1 de la guía).
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Catalogo } from './Catalogo';
import { useCatalogoStore } from '../../store/catalogoStore';
import { useFiltrosStore } from '../../store/filtrosStore';
import { ejemplaresMock } from '../../store/mocks/ejemplaresMock';

// Filas "crudas" (snake_case) que devolvería Supabase, equivalentes a
// ejemplaresMock pero pasadas por mapEjemplarFromRow (Capa 1 -> Capa 3).
const filasSupabase = ejemplaresMock.map((e) => ({
  id: e.id,
  nombre: e.nombre,
  especie: e.especie,
  categoria: e.categoria,
  precio: e.precio,
  estado: e.estado,
  tamano: e.tamano,
  condicion: e.condicion,
  imagen_url: e.imagenUrl,
  creado_en: e.creadoEn,
  actualizado_en: e.actualizadoEn,
}));

const mockOrder = jest.fn();
jest.mock('../../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        neq: jest.fn(() => ({
          order: mockOrder,
        })),
      })),
    })),
  },
}));

describe('Catalogo — filtro por categoría (Capa 3 + Capa 5)', () => {
  beforeEach(() => {
    mockOrder.mockResolvedValue({ data: filasSupabase, error: null });
  });

  afterEach(() => {
    // Los stores de Zustand son singletons a nivel de módulo: si no se
    // resetean entre tests, el estado de un test (ej. filtro "venta")
    // se filtra al siguiente. Se envuelve en act() porque el reset
    // dispara un re-render de un componente que RTL ya desmontó al
    // terminar el test anterior (cleanup automático de RTL corre antes
    // de este afterEach); sin act(), React solo tira un warning, no
    // afecta el resultado, pero se envuelve para dejar la salida limpia.
    act(() => {
      useCatalogoStore.setState({ ejemplares: [], cargando: false, error: null });
      useFiltrosStore.setState({ categoria: 'todas', tamano: 'todos', busqueda: '' });
    });
  });

  it('muestra las 3 tarjetas mock cuando el filtro es "Todas"', async () => {
    render(<Catalogo />);

    await waitFor(() => {
      expect(screen.getByText('Anthurium sp Crystallinum')).toBeInTheDocument();
    });
    expect(screen.getByText('Alocasia sp Piccolini')).toBeInTheDocument();
    expect(screen.getByText('Scindapsus sp Manjula')).toBeInTheDocument();
  });

  it('al hacer clic en "Trueque" muestra solo los ejemplares de esa categoría', async () => {
    const user = userEvent.setup();
    render(<Catalogo />);

    await waitFor(() => {
      expect(screen.getByText('Anthurium sp Crystallinum')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Trueque' }));

    expect(screen.getByText('Scindapsus sp Manjula')).toBeInTheDocument();
    expect(screen.queryByText('Anthurium sp Crystallinum')).not.toBeInTheDocument();
    expect(screen.queryByText('Alocasia sp Piccolini')).not.toBeInTheDocument();
  });

  it('al hacer clic en "Venta" muestra solo los ejemplares de esa categoría', async () => {
    const user = userEvent.setup();
    render(<Catalogo />);

    await waitFor(() => {
      expect(screen.getByText('Anthurium sp Crystallinum')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Venta' }));

    expect(screen.getByText('Anthurium sp Crystallinum')).toBeInTheDocument();
    expect(screen.getByText('Alocasia sp Piccolini')).toBeInTheDocument();
    expect(screen.queryByText('Scindapsus sp Manjula')).not.toBeInTheDocument();
  });

  it('al hacer clic en una tarjeta abre ModalEjemplar con el detalle correspondiente', async () => {
    const user = userEvent.setup();
    render(<Catalogo />);

    await waitFor(() => {
      expect(screen.getByText('Anthurium sp Crystallinum')).toBeInTheDocument();
    });

    // La tarjeta es un <div onClick>, no un botón — se ubica por el
    // título y se sube al contenedor con la clase "card" (ver nota en
    // el README de esta capa sobre accesibilidad de las tarjetas).
    const tituloTarjeta = screen.getByText('Anthurium sp Crystallinum');
    const tarjeta = tituloTarjeta.closest('.card') as HTMLElement;
    await user.click(tarjeta);

    const modal = document.getElementById('modal-ejemplar') as HTMLElement;
    expect(modal).toHaveAttribute('aria-hidden', 'false');
    // La tarjeta original sigue montada detrás del modal (Catalogo no
    // la desmonta), así que el nombre aparece dos veces en pantalla:
    // se busca el heading específicamente dentro del modal.
    expect(
      within(modal).getByRole('heading', { name: 'Anthurium sp Crystallinum' })
    ).toBeInTheDocument();
    expect(within(modal).getByText('Anthurium crystallinum')).toBeInTheDocument();
  });
});
