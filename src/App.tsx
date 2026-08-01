// src/App.tsx
//
// Providers globales (Auth) + router. Separado de main.tsx a propósito:
// main.tsx no vuelve a tocarse por ninguna capa; este archivo tampoco
// debería necesitar cambios frecuentes, porque el contenido de cada
// capa vive en src/routes/*, no acá.

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppRoutes } from './routes';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
