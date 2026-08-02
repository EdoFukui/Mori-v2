// src/routes/rutasPublicas.tsx
// Rutas públicas de la tienda (Capa 3).

import { Route } from 'react-router-dom';
import InicioPage from '../pages/InicioPage';

export const rutasPublicas = [
  <Route key="inicio" path="/" element={<InicioPage />} />,
];