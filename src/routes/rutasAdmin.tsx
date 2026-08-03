// src/routes/rutasAdmin.tsx
//
// Rutas del panel admin (Capa 4). NO se envuelven acá en
// <RutaProtegida /> — esa lógica vive en src/routes/index.tsx,
// donde este fragmento se anida bajo el layout route protegido.

import { Route } from 'react-router-dom';
import PanelAdmin from '../pages/admin/PanelAdmin';
import EjemplarFormulario from '../pages/admin/EjemplarFormulario';

export const rutasAdmin = (
  <>
    <Route path="/admin" element={<PanelAdmin />} />
    <Route path="/admin/nuevo" element={<EjemplarFormulario modo="crear" />} />
    <Route path="/admin/editar/:id" element={<EjemplarFormulario modo="editar" />} />
  </>
);
