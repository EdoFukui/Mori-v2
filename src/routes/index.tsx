// src/routes/index.tsx
//
// ÚNICO archivo de routing compartido entre capas. Cada capa declara
// sus propias rutas en su propio archivo y acá solo se importan y
// componen. Editar este archivo para agregar una capa nueva es un
// import + una línea — no una reescritura.

import { Routes, Route } from 'react-router-dom';
import { RutaProtegida } from '../components/admin/RutaProtegida';
import { rutasAuth } from './rutasAuth';
import { rutasPublicas } from './rutasPublicas';
import { rutasAdmin } from './rutasAdmin';

export function AppRoutes() {
  return (
    <Routes>
      {rutasPublicas}

      {rutasAuth}

      <Route element={<RutaProtegida />}>
        {rutasAdmin}
      </Route>
    </Routes>
  );
}
