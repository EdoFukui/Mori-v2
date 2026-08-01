# Capa 2 — Autenticación (implementación)

Archivos entregados para integrar en `mori-2.0`. Copia la carpeta `src/`
sobre la existente en tu proyecto (sobrescribe `main.tsx`, agrega los
archivos nuevos) y coloca `.env.example` en la raíz del repo.

## Patrón de routing (actualizado tras revisión del supervisor)

La primera entrega centralizaba el router entero en `main.tsx`, lo cual
iba a chocar en cuanto Capa 3 y Capa 4 necesitaran agregar sus propias
rutas. Se corrigió a este patrón:

- `main.tsx` — solo monta `<App />`. No se vuelve a tocar.
- `App.tsx` — providers globales (`AuthProvider`) + `BrowserRouter` +
  `<AppRoutes />`. Tampoco debería necesitar cambios frecuentes.
- `src/routes/rutasAuth.tsx` — Capa 2 declara únicamente sus propias
  rutas (`/admin/login`).
- `src/routes/index.tsx` — **el único archivo compartido entre capas**.
  Importa y compone las rutas de cada una. Agregar una capa nueva es
  un import + una línea, no una reescritura.

`RutaProtegida` cambió de envolver `children` a ser una **ruta de
layout** (renderiza `<Outlet />`). Esto permite que Capa 4 anide
cuantas rutas `/admin/*` necesite bajo la misma protección, sin que
este componente tenga que conocerlas:

```tsx
<Route element={<RutaProtegida />}>
  {rutasAdmin /* Capa 4 agrega las que necesite */}
</Route>
```

Cuando Capa 3 y Capa 4 empiecen, cada una crea su propio archivo
(`src/routes/rutasPublicas.tsx`, `src/routes/rutasAdmin.tsx`) exportando
un array de `<Route>`, y solo tocan `src/routes/index.tsx` para
registrarlo — ver el ejemplo comentado dentro de ese archivo.

**Nota para la guía del proyecto:** esto es un cambio de convención de
estructura de carpetas (sección 2.3 de `mori-2.0-guia-proyecto.md`), no
un cambio al contrato de datos (`Ejemplar` ni el esquema de
`ejemplares` siguen intactos). Si el supervisor está de acuerdo,
conviene reflejarlo en la guía para que Capa 3 y Capa 4 lo sigan desde
el inicio.

## Qué hace cada archivo

- **`src/lib/supabase.ts`** — Inicializa el cliente de Supabase leyendo
  `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` desde `.env`. Lanza un
  error explícito al arrancar si faltan, en vez de fallar en silencio
  más adelante con un error críptico de red.

- **`src/contexts/AuthContext.tsx`** — `AuthProvider` + hook `useAuth()`.
  Carga la sesión existente al montar (`getSession()`), se suscribe a
  cambios de sesión (`onAuthStateChange`) y expone `session`, `user`,
  `loading`, `signIn(email, password)` y `signOut()`. El error de
  `signIn` siempre es genérico ("Credenciales inválidas") para no
  filtrar si el email existe o no.

- **`src/pages/admin/Login.tsx`** — Formulario email + contraseña, sin
  estilos. Al autenticar exitosamente redirige a la ruta desde la que
  el usuario fue rebotado (guardada por `RutaProtegida` en
  `location.state.from`), o a `/admin` si llegó directo al login.

- **`src/components/admin/RutaProtegida.tsx`** — Ruta de layout (no
  wrapper de `children`): renderiza `<Outlet />`. Se usa como elemento
  de una `<Route>` padre para proteger todas sus rutas hijas. Mientras
  `loading` es `true` muestra un mensaje de verificación; si no hay
  `session`, redirige a `/admin/login`.

- **`src/routes/rutasAuth.tsx`** — Rutas propias de Capa 2 (`/admin/login`),
  exportadas como array para que `routes/index.tsx` las componga.

- **`src/routes/index.tsx`** — Composición central de todas las rutas
  de la app. Único archivo que otras capas deben tocar para registrar
  las suyas (ver comentario con el ejemplo de Capa 4 dentro del
  archivo). Hoy incluye placeholders temporales para `/` y `/admin`
  que Capa 3 y Capa 4 reemplazan.

- **`src/App.tsx`** — `AuthProvider` + `BrowserRouter` + `AppRoutes`.

- **`src/main.tsx`** — Punto de entrada. Solo monta `<App />`.

- **`.env.example`** — Plantilla de variables de entorno para el
  proyecto Supabase `tjgkzzpvqrqvmshcwwtl` (región `sa-east-1`). No es
  el `.env` real: cópialo y completa `VITE_SUPABASE_ANON_KEY` con la
  clave anónima pública (no la `service_role`).

## Antes de correr `npm run dev`

1. Verifica que estas dos dependencias estén instaladas (no estaban en
   capas anteriores):
   ```bash
   npm install @supabase/supabase-js react-router-dom
   ```
2. Copia `.env.example` a `.env` y completa `VITE_SUPABASE_ANON_KEY`
   (Supabase → Project Settings → API → `anon` `public`).
3. Confirma que `index.html` tiene `<div id="root"></div>` (scaffold
   estándar de Vite) — `main.tsx` asume que existe.
4. Si ya tenías un `App.tsx` o rutas propias de otra capa, avisa antes
   de sobrescribir — este `App.tsx` asume que es el único punto de
   montaje del router.

## Qué NO incluye esta entrega

- Recuperación de contraseña (`resetPasswordForEmail`). No estaba en
  el Definition of Done de la guía; si la necesitas, avisa y se agrega
  como parte de Capa 2.
- El usuario admin en sí no se crea desde aquí — no hay registro
  público por diseño. Créalo desde el dashboard de Supabase
  (Authentication → Users → Add user) o con `auth.admin.createUser()`
  server-side.
- El botón de logout en la UI del panel: `signOut()` ya está expuesto
  vía `useAuth()`, pero el componente visual que lo use es parte de
  Capa 4.

## Verificación del criterio de "terminada"

- `npm run dev` compila sin errores de TypeScript.
- `http://localhost:5173/admin/login` muestra el formulario.
- `http://localhost:5173/admin` sin sesión activa redirige a
  `/admin/login`.
- Con sesión activa (usuario creado en Supabase, login exitoso),
  `/admin` muestra el placeholder de Capa 4 en vez de redirigir.
