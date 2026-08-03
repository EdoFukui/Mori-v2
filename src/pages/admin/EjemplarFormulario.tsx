// src/pages/admin/EjemplarFormulario.tsx
//
// Mismo formulario para /admin/nuevo y /admin/editar/:id, controlado
// por la prop `modo`. En modo 'editar' precarga los datos existentes
// vía obtenerEjemplarPorId(); en modo 'crear' parte de valores vacíos.
//
// DECISIÓN SOBRE VALIDACIÓN EN DOS CAPAS (hallazgo de Capa 6):
// nombre/especie/condicion tienen `required` en el HTML, y el chequeo
// equivalente en manejarEnvio() es inalcanzable por un clic normal en
// "Guardar" (el navegador bloquea el submit antes de que corra React).
// Se decide MANTENER el chequeo de JS a propósito, como defensa en
// profundidad: cubre el caso de que alguien quite `required` del JSX
// más adelante sin notar que era la única validación real, y el envío
// programático del form (fireEvent.submit / form.submit()) sigue
// pasando por acá. El costo de mantenerlo es cero: no interfiere con
// el flujo normal, solo actúa como red de seguridad si la validación
// nativa deja de estar presente por cualquier motivo.
import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Categoria, Estado, Tamano } from '../../types/ejemplar';
import {
  actualizarEjemplar,
  crearEjemplar,
  obtenerEjemplarPorId,
  subirImagenEjemplar,
  type EjemplarFormData,
} from '../../lib/ejemplaresAdminApi';
import { useCatalogoStore } from '../../store/catalogoStore';
import './admin.css';

interface Props {
  modo: 'crear' | 'editar';
}

const VALORES_INICIALES: EjemplarFormData = {
  nombre: '',
  especie: '',
  categoria: 'venta',
  precio: null,
  estado: 'disponible',
  tamano: 'pequeño',
  condicion: '',
};

export default function EjemplarFormulario({ modo }: Props) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const upsertEjemplar = useCatalogoStore((s) => s.upsertEjemplar);

  const [datos, setDatos] = useState<EjemplarFormData>(VALORES_INICIALES);
  const [imagenActual, setImagenActual] = useState<string>('');
  const [archivoImagen, setArchivoImagen] = useState<File | null>(null);
  const [cargandoDatos, setCargandoDatos] = useState(modo === 'editar');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (modo !== 'editar' || !id) return;

    obtenerEjemplarPorId(id)
      .then((ejemplar) => {
        if (!ejemplar) {
          setError('No se encontró el ejemplar solicitado.');
          return;
        }
        setDatos({
          nombre: ejemplar.nombre,
          especie: ejemplar.especie,
          categoria: ejemplar.categoria,
          precio: ejemplar.precio,
          estado: ejemplar.estado,
          tamano: ejemplar.tamano,
          condicion: ejemplar.condicion,
        });
        setImagenActual(ejemplar.imagenUrl);
      })
      .catch((err) => {
        console.error(err);
        setError('No se pudo cargar el ejemplar a editar.');
      })
      .finally(() => setCargandoDatos(false));
  }, [modo, id]);

  function actualizarCampo<K extends keyof EjemplarFormData>(
    campo: K,
    valor: EjemplarFormData[K]
  ) {
    setDatos((prev) => ({ ...prev, [campo]: valor }));
  }

  // Si cambia a 'trueque', el precio deja de tener sentido — se limpia
  // para no mandar un precio fantasma a una planta que no se vende.
  function manejarCambioCategoria(nuevaCategoria: Categoria) {
    setDatos((prev) => ({
      ...prev,
      categoria: nuevaCategoria,
      precio: nuevaCategoria === 'trueque' ? null : prev.precio,
    }));
  }

  async function manejarEnvio(event: FormEvent) {
    event.preventDefault();
    setError(null);

    // Ver nota al inicio del archivo: este chequeo es defensa en
    // profundidad, no la validación principal (esa la hace `required`
    // en el HTML). Se mantiene deliberadamente.
    if (!datos.nombre.trim() || !datos.especie.trim() || !datos.condicion.trim()) {
      setError('Nombre, especie y condición son obligatorios.');
      return;
    }
    if (datos.categoria === 'venta' && (datos.precio === null || datos.precio <= 0)) {
      setError('Si la categoría es "venta", el precio debe ser mayor a 0.');
      return;
    }
    if (modo === 'crear' && !archivoImagen) {
      setError('Debes subir una imagen para un ejemplar nuevo.');
      return;
    }

    setGuardando(true);
    try {
      let imagenUrl = imagenActual;
      if (archivoImagen) {
        imagenUrl = await subirImagenEjemplar(archivoImagen);
      }

      const ejemplarGuardado =
        modo === 'crear'
          ? await crearEjemplar(datos, imagenUrl)
          : await actualizarEjemplar(id as string, datos, archivoImagen ? imagenUrl : undefined);

      // Sincroniza el store global (Capa 5) para que la tienda pública
      // (Capa 3) refleje el alta/edición sin refetch completo.
      upsertEjemplar(ejemplarGuardado);
      navigate('/admin');
    } catch (err) {
      console.error(err);
      setError('No se pudo guardar el ejemplar. Revisa los datos e intenta de nuevo.');
    } finally {
      setGuardando(false);
    }
  }

  if (cargandoDatos) return <p>Cargando…</p>;

  return (
    <form className="formulario-ejemplar" onSubmit={manejarEnvio}>
      <h1>{modo === 'crear' ? 'Nuevo ejemplar' : 'Editar ejemplar'}</h1>

      {error && <p className="formulario-error">{error}</p>}

      <label>
        Nombre
        <input
          type="text"
          value={datos.nombre}
          onChange={(e) => actualizarCampo('nombre', e.target.value)}
          required
        />
      </label>

      <label>
        Especie
        <input
          type="text"
          value={datos.especie}
          onChange={(e) => actualizarCampo('especie', e.target.value)}
          required
        />
      </label>

      <label>
        Categoría
        <select
          value={datos.categoria}
          onChange={(e) => manejarCambioCategoria(e.target.value as Categoria)}
        >
          <option value="venta">Venta</option>
          <option value="trueque">Trueque</option>
        </select>
      </label>

      {datos.categoria === 'venta' && (
        <label>
          Precio (CLP)
          <input
            type="number"
            min={0}
            value={datos.precio ?? ''}
            onChange={(e) =>
              actualizarCampo('precio', e.target.value ? Number(e.target.value) : null)
            }
          />
        </label>
      )}

      <label>
        Estado
        <select
          value={datos.estado}
          onChange={(e) => actualizarCampo('estado', e.target.value as Estado)}
        >
          <option value="disponible">Disponible</option>
          <option value="reservado">Reservado</option>
          <option value="retirado">Retirado</option>
        </select>
      </label>

      <label>
        Tamaño
        <select
          value={datos.tamano}
          onChange={(e) => actualizarCampo('tamano', e.target.value as Tamano)}
        >
          <option value="pequeño">Pequeño</option>
          <option value="mediano">Mediano</option>
          <option value="grande">Grande</option>
        </select>
      </label>

      <label>
        Condición
        <input
          type="text"
          value={datos.condicion}
          onChange={(e) => actualizarCampo('condicion', e.target.value)}
          placeholder="ej. Enraizado"
          required
        />
      </label>

      <label>
        Imagen {modo === 'editar' && '(opcional — deja vacío para mantener la actual)'}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setArchivoImagen(e.target.files?.[0] ?? null)}
        />
      </label>

      {imagenActual && !archivoImagen && (
        <img src={imagenActual} alt="Imagen actual del ejemplar" width={120} />
      )}

      <div className="formulario-acciones">
        <button type="button" onClick={() => navigate('/admin')} disabled={guardando}>
          Cancelar
        </button>
        <button type="submit" disabled={guardando}>
          {guardando ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}
