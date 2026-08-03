// src/components/admin/ConfirmarAccion.tsx
interface Props {
  mensaje: string;
  cargando: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export default function ConfirmarAccion({
  mensaje,
  cargando,
  onConfirmar,
  onCancelar,
}: Props) {
  return (
    <div className="confirmar-overlay" role="dialog" aria-modal="true">
      <div className="confirmar-caja">
        <p>{mensaje}</p>
        <div className="confirmar-acciones">
          <button type="button" onClick={onCancelar} disabled={cargando}>
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            disabled={cargando}
            className="btn-peligro"
          >
            {cargando ? 'Borrando…' : 'Sí, borrar'}
          </button>
        </div>
      </div>
    </div>
  );
}
