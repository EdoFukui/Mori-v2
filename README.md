# 🌿 Mori 2.0 — Tienda de plantas exóticas (React + Supabase)

Evolución de [Mori](https://github.com/EdoFukui/Mori) (sitio estático vanilla
JS) hacia una aplicación completa con panel de administración, autenticación
real y base de datos gestionada. Migra la tienda pública ya validada de
Mori 1.0 a componentes de React, y agrega gestión de catálogo sin tocar
código ni JSON a mano.

> Proyecto de portafolio. Muestra la migración de un sitio estático bien
> hecho hacia una aplicación con framework, backend real y despliegue en
> producción — sin perder el diseño ni la accesibilidad ya resueltos en
> la v1.

## ✨ Características

- **Panel de administración con login real** (Supabase Auth): crear, editar,
  marcar reservado/vendido y borrar ejemplares desde el navegador.
- **Tienda pública migrada a componentes**, con el mismo diseño, paleta y
  animaciones de Mori 1.0 — incluyendo el fondo de timelapse controlado por
  scroll y el modal de detalle con focus trap.
- **Estado global con Zustand** para catálogo y filtros, sincronizado en
  tiempo real con los cambios del panel admin (sin refetch completo).
- **Base de datos y Storage reales** con Supabase (Postgres + RLS +
  bucket de imágenes), reemplazando el `plantas.json` estático.
- **12 tests** con Jest + React Testing Library sobre los flujos más
  críticos: validación del formulario de alta, filtro del catálogo, y
  apertura/cierre accesible del modal.
- **Deploy en Vercel** conectado al repo, con CI que corre los tests en
  cada push, y un workflow de keep-alive para que la demo no aparezca
  pausada por inactividad del plan gratuito de Supabase.

**Lo que este proyecto NO es (igual que en Mori 1.0):** un e-commerce con
pasarela de pago real. El contacto para cerrar una compra o trueque sigue
siendo directo por WhatsApp.

## 🧱 Stack

React 19 + TypeScript + Vite · Supabase (Postgres, Auth, Storage) ·
Zustand · React Router · Jest + React Testing Library · Vercel.

CSS reutilizado y adaptado de Mori 1.0 (no reescrito en un framework de
utilidades) — el sistema visual ya estaba validado y no aportaba valor de
portafolio reescribirlo.

## 📂 Estructura del proyecto

```
├── public/
│   └── assets/              # Frames del fondo animado, fuentes, imágenes
├── supabase/
│   └── migrations/          # SQL versionado (tabla ejemplares, RLS)
├── src/
│   ├── types/
│   │   └── ejemplar.ts      # Contrato de datos compartido por todo el proyecto
│   ├── lib/
│   │   ├── supabase.ts      # Cliente único de Supabase
│   │   ├── mapEjemplar.ts   # Mapeo fila de Supabase (snake_case) → Ejemplar
│   │   └── ejemplaresAdminApi.ts  # CRUD contra Supabase + upload de imágenes
│   ├── store/                # Zustand: catálogo y filtros
│   ├── contexts/
│   │   └── AuthContext.tsx   # Sesión de Supabase Auth
│   ├── components/
│   │   ├── publico/          # Tienda pública (catálogo, tarjeta, modal, fondo)
│   │   └── admin/             # Tabla de ejemplares, ruta protegida, confirmaciones
│   ├── pages/
│   │   ├── InicioPage.tsx
│   │   └── admin/             # Login, panel, formulario de alta/edición
│   ├── routes/                # Un archivo de rutas por capa + composición central
│   ├── hooks/
│   └── tests/                 # Setup de Jest + mocks compartidos
└── .github/workflows/         # CI de tests + keep-alive de Supabase
```

## 🚀 Cómo correrlo localmente

```bash
npm install
```

Creá un archivo `.env` en la raíz con las credenciales de tu proyecto de
Supabase (no se sube al repo):

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima-publica
```

```bash
npm run dev       # servidor de desarrollo (Vite)
npm test          # corre los 12 tests con Jest + RTL
npm run build     # build de producción (tsc -b && vite build)
```

Para usar el panel de administración, creá un usuario manualmente desde el
dashboard de Supabase: **Authentication → Users → Add user**.

## 🏗️ Arquitectura de desarrollo — capas en paralelo

Este proyecto se construyó dividido en 7 "capas" trabajadas de forma
independiente (backend, auth, tienda pública, admin, estado global,
testing, deploy), cada una con su propio contrato de dependencias sobre
un tipo `Ejemplar` fijado desde el inicio. El detalle completo de esta
arquitectura, las decisiones técnicas fijadas y el orden de dependencias
entre capas está documentado en `mori-2.0-guia-proyecto.md`.

Convenciones que se mantuvieron durante todo el proyecto:

- `main.tsx` y `App.tsx` nunca se modifican por capa; cada una registra
  sus rutas en `src/routes/` y las compone en `src/routes/index.tsx`.
- Ninguna capa modifica silenciosamente componentes de otra — los
  cambios entre capas se señalan explícitamente (ver historial de commits
  y los README de cada entrega dentro del repo).
- Las políticas de RLS de la tabla y las policies de Storage del bucket
  se configuran y verifican por separado — no son lo mismo.

## 🧪 Testing

```bash
npm test
```

12 tests en 3 suites, cubriendo:
- Validación del formulario de alta de ejemplar (incluye una defensa en
  profundidad intencional entre validación HTML nativa y JS).
- Filtro del catálogo por categoría, sobre la integración real de
  Zustand + Supabase (no mocks de los stores).
- Apertura, cierre (Escape y botón X) y devolución de foco del modal de
  detalle.

## 🌐 Deploy

Desplegado en Vercel, conectado al repo con deploy automático en cada
push a `main`. `vercel.json` resuelve el ruteo de SPA para que las rutas
internas (`/catalogo`, `/admin/login`, etc.) funcionen con acceso directo,
no solo navegando desde adentro de la app.

Un workflow de GitHub Actions corre los tests en cada push/PR, y otro
hace ping periódico a Supabase para evitar que el proyecto se pause por
inactividad (límite del plan gratuito).

## 🗺️ Roadmap

Con esto, Mori 2.0 cubre el ciclo completo: catálogo público dinámico,
gestión real desde un panel de administración, y despliegue en producción
sobre infraestructura gestionada. Posibles próximos pasos, no
comprometidos: recuperación de contraseña desde la UI del panel admin, y
ampliar la cobertura de tests a los componentes de autenticación.

## 📄 Licencia

Mismo criterio que Mori 1.0: el código puede visualizarse libremente con
fines de portafolio, pero no está autorizado su uso, copia ni
redistribución sin permiso previo del autor — ver [`LICENSE`](./LICENSE).
Las fotografías del catálogo pertenecen a Mori y tampoco están
autorizadas para su reutilización.

## ✍️ Autor

**Eduardo Hidalgo S.**
