// src/pages/admin/PanelAdmin.tsx
//
// ASUNCIÓN SIN VERIFICAR: se asume que el store de Zustand de la
// Capa 5 vive en `src/store/catalogoStore.ts` y se exporta como
// `useCatalogoStore`, con al menos estos tres selectors/acciones:
//   - ejemplares: Ejemplar[]
//   - setEjemplares(ejemplares: Ejemplar[]): void
//   - upsertEjemplar(ejemplar: Ejemplar): void
//   - removerEjemplar(id: string): void
// Estos nombres vienen dados por la tarea de la Capa 4, no los inventé
// yo — pero la RUTA del archivo sí es una suposición mía basada en la
// sección 2.3 de la guía ("src/store/ # Zustand stores"). Si tu store
// vive en otro archivo, ajustá el import de abajo.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Ejemplar } from '../../types/ejemplar';
import { listarEjemplaresAdmin, borrarEjemplar } from '../../lib/ejemplaresAdminApi';
import { useCatalogoStore } from '../../store/catalogoStore';
import TablaEjemplares from '../../components/admin/TablaEjemplares';
import ConfirmarAccion from '../../components/admin/ConfirmarAccion';
import './admin.css';

export default function PanelAdmin() {
  const [ejemplares, setEjemplaresLocal] = useState<Ejemplar[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [idABorrar, setIdABorrar] = useState<string | null>(null);
  const [borrando, setBorrando] = useState(false);

  const removerEjemplar = useCatalogoStore((s) => s.removerEjemplar);

  useEffect(() => {
    cargarEjemplares();
  }, []);

  async function cargarEjemplares() {
    setCargando(true);
    setError(null);
    try {
      const datos = await listarEjemplaresAdmin();
      setEjemplaresLocal(datos);
    } catch (err) {
      setError('No se pudo cargar el listado de ejemplares. Intenta de nuevo.');
      console.error(err);
    } finally {
      setCargando(false);
    }
  }

  async function confirmarBorrado() {
    if (!idABorrar) return;
    setBorrando(true);
    try {
      await borrarEjemplar(idABorrar);
      // Actualización optimista local + sincronización con el store
      // global (Capa 5), para que la tienda pública refleje el borrado
      // sin necesidad de refetch.
      setEjemplaresLocal((prev) => prev.filter((e) => e.id !== idABorrar));
      removerEjemplar(idABorrar);
    } catch (err) {
      setError('No se pudo borrar el ejemplar. Intenta de nuevo.');
      console.error(err);
    } finally {
      setBorrando(false);
      setIdABorrar(null);
    }
  }

  return (
    <div className="panel-admin">
      <header className="panel-admin-header">
        <h1>Panel de administración</h1>
        <Link to="/admin/nuevo" className="btn">
          + Nuevo ejemplar
        </Link>
      </header>

      {error && <p className="panel-admin-error">{error}</p>}

      {cargando ? (
        <p>Cargando ejemplares…</p>
      ) : (
        <TablaEjemplares ejemplares={ejemplares} onBorrar={(id) => setIdABorrar(id)} />
      )}

      {idABorrar && (
        <ConfirmarAccion
          mensaje="¿Seguro que quieres borrar este ejemplar? Esta acción no se puede deshacer."
          cargando={borrando}
          onConfirmar={confirmarBorrado}
          onCancelar={() => setIdABorrar(null)}
        />
      )}
    </div>
  );
}
