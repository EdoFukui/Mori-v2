// src/main.tsx
//
// Punto de entrada. Solo monta <App />. Este archivo no debería
// necesitar cambios cuando Capa 3, 4 o 5 agreguen funcionalidad —
// toda la composición de providers vive en App.tsx, y las rutas de
// cada capa en src/routes/*.

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
