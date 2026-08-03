// src/components/admin/TablaEjemplares.tsx
import { Link } from 'react-router-dom';
import type { Ejemplar } from '../../types/ejemplar';

interface Props {
  ejemplares: Ejemplar[];
  onBorrar: (id: string) => void;
}

function formatoPrecioCLP(precio: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(precio);
}

export default function TablaEjemplares({ ejemplares, onBorrar }: Props) {
  if (ejemplares.length === 0) {
    return <p>No hay ejemplares cargados todavía.</p>;
  }

  return (
    <table className="tabla-ejemplares">
      <thead>
        <tr>
          <th>Imagen</th>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Precio</th>
          <th>Estado</th>
          <th>Tamaño</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {ejemplares.map((e) => (
          <tr key={e.id}>
            <td>
              <img
                src={e.imagenUrl}
                alt={e.nombre}
                width={56}
                height={56}
                style={{ objectFit: 'cover', borderRadius: 6 }}
              />
            </td>
            <td>{e.nombre}</td>
            <td>{e.categoria}</td>
            <td>{e.precio !== null ? formatoPrecioCLP(e.precio) : '—'}</td>
            <td>{e.estado}</td>
            <td>{e.tamano}</td>
            <td>
              <Link to={`/admin/editar/${e.id}`}>Editar</Link>{' '}
              <button type="button" onClick={() => onBorrar(e.id)}>
                Borrar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
