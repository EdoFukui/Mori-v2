// src/routes/rutasAuth.tsx
//
// Rutas que aporta Capa 2. No compone el router completo — eso es
// responsabilidad de src/routes/index.tsx. Este archivo solo declara
// lo que Capa 2 sabe: dónde vive el login y cuál es el elemento de
// layout que protege las rutas admin.
//
// Capa 4 NO debe importar de acá para armar sus propias rutas de
// contenido — solo usa <RutaProtegida /> como elemento de la <Route>
// padre que envuelve las suyas (ver ejemplo comentado en index.tsx).

import type { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { Login } from '../pages/admin/Login';

export const rutasAuth: ReactNode[] = [
  <Route key="admin-login" path="/admin/login" element={<Login />} />,
];
