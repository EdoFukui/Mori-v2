// src/routes/index.tsx
//
// ÚNICO archivo de routing compartido entre capas. Cada capa declara
// sus propias rutas en su propio archivo (rutasAuth.tsx, y en el
// futuro rutasPublicas.tsx de Capa 3, rutasAdmin.tsx de Capa 4) y acá
// solo se importan y componen. Editar este archivo para agregar una
// capa nueva es un import + una línea — no una reescritura.
//
// Patrón para rutas protegidas: RutaProtegida es un elemento de layout
// (renderiza <Outlet />), así que las rutas de Capa 4 van ANIDADAS
// dentro de la <Route> que la usa como elemento, no como children de
// un componente. Ejemplo de cómo Capa 4 se integra (comentado porque
// esa capa aún no existe):
//
//   import { rutasAdmin } from './rutasAdmin';
//   ...
//   <Route element={<RutaProtegida />}>
//     {rutasAdmin}
//   </Route>
//
// Y rutasAdmin.tsx exportaría algo como:
//   export const rutasAdmin = [
//     <Route key="admin-panel" path="/admin" element={<Panel />} />,
//     <Route key="admin-productos" path="/admin/productos" element={<Productos />} />,
//   ];

import { Routes, Route } from 'react-router-dom';
import { RutaProtegida } from '../components/admin/RutaProtegida';
import { rutasAuth } from './rutasAuth';
import { rutasPublicas } from './rutasPublicas';

function PanelAdminPlaceholder() {
  return <p>Panel admin — pendiente (Capa 4). Si ves esto, la sesión es válida.</p>;
}

export function AppRoutes() {
  return (
    <Routes>
      {rutasPublicas}

      {rutasAuth}

      <Route element={<RutaProtegida />}>
        <Route path="/admin" element={<PanelAdminPlaceholder />} />
      </Route>
    </Routes>
  );
}