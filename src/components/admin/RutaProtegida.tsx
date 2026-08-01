// src/components/admin/RutaProtegida.tsx
//
// Ruta de layout (no envoltorio de children): se usa como elemento de
// una <Route> padre en React Router y renderiza <Outlet /> para sus
// rutas hijas. Esto permite que Capa 4 anide tantas rutas /admin/*
// como necesite bajo esta protección sin que este archivo tenga que
// conocerlas — ver src/routes/index.tsx para el patrón de composición.
//
// Mientras se resuelve la sesión inicial muestra un estado de carga;
// si no hay sesión, redirige a /admin/login guardando la ruta de
// origen para volver a ella después del login.

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function RutaProtegida() {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p>Verificando sesión…</p>;
  }

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}
