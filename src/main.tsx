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
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/sections.css';
import './styles/modal.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
