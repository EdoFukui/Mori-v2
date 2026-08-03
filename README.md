# Capa 6 — Testing (consolidada, con correcciones aplicadas)

Esta entrega integra el trabajo original de Capa 6 (Jest + RTL, 12
tests) más dos correcciones que decidí aplicar sobre los hallazgos que
esa capa reportó — señaladas explícitamente, no aplicadas en silencio.

## Instalación

Copiá el contenido de esta carpeta sobre `Mori-v2/`, respetando la
estructura. **`package.json` reemplaza al existente** (agrega
devDependencies de testing + el script `test`; ninguna dependencia de
producción cambia).

```bash
npm install
npm test
```

## Qué contiene

| Archivo | Origen | Cambio |
|---|---|---|
| `jest.config.cjs` | Capa 6 | Sin cambios |
| `babel.config.cjs` | Capa 6 | Sin cambios |
| `src/tests/setupTests.ts` | Capa 6 | Sin cambios |
| `src/tests/styleMock.cjs` | Capa 6 | Sin cambios |
| `src/pages/admin/EjemplarFormulario.test.tsx` | Capa 6 | Sin cambios |
| `src/components/publico/Catalogo.test.tsx` | Capa 6 | Sin cambios |
| `src/components/publico/ModalEjemplar.test.tsx` | Capa 6 | Sin cambios |
| `package.json` | Capa 6 | Sin cambios (ya coincidía con el real del repo) |
| `src/pages/admin/EjemplarFormulario.tsx` | Capa 4 | **Comentario agregado** — ver Corrección 1 |
| `src/components/publico/TarjetaEjemplar.tsx` | Capa 3 | **Código modificado** — ver Corrección 2 |

## Correcciones aplicadas

### 1. Validación duplicada en `EjemplarFormulario` — se mantiene, documentada

**Decisión:** mantener el chequeo de JS en `manejarEnvio()`, no
eliminarlo.

**Por qué:** el costo de mantenerlo es cero — no interfiere con el
flujo normal porque el HTML `required` ya bloquea el envío antes. El
beneficio de mantenerlo es real: si en el futuro alguien quita
`required` del JSX sin darse cuenta de que era la única validación, o
si el formulario se envía programáticamente (evitando la validación
nativa del navegador), el chequeo de JS sigue siendo la red de
seguridad. Eliminarlo no aportaba nada y sí quitaba una capa de
protección barata.

**Cambio real:** un comentario en `EjemplarFormulario.tsx` (arriba del
componente y en la línea del chequeo) documentando que la duplicación
es intencional. Cero cambios de comportamiento.

### 2. `TarjetaEjemplar` no era accesible por teclado — corregido

**Decisión:** agregar `tabIndex={0}`, `role="button"`, `aria-label` y
manejo de `onKeyDown` (Enter/Espacio) a la tarjeta.

**Por qué:** es una mejora real y de bajo riesgo sobre una limitación
heredada de Mori 1.0. El proyecto ya prioriza explícitamente mantener
(y por extensión, mejorar cuando sea razonable) la accesibilidad del
flujo de modal — dejar el disparador inalcanzable por teclado iba en
contra de ese principio. El fix no cambia el comportamiento con mouse,
no interfiere con el botón "Consultar" (que sigue con
`stopPropagation` y su propio `tabIndex` nativo de `<a>`), y usa el
patrón estándar de accesibilidad para "div que actúa como botón".

**Cambio real:** ver el archivo — la tarjeta ahora es alcanzable con
`Tab` y activable con `Enter`/`Espacio`, además de clic de mouse.

**Nota para quien continúe con Capa 6 u otra ronda de testing:** con
este fix, ya sería posible escribir un test de `ModalEjemplar` que
reuse `TarjetaEjemplar` real (en vez del harness con `<button>`) para
probar la devolución de foco de extremo a extremo. No lo agregué en
esta entrega para no exceder el alcance que me pediste (integrar +
corregir, no ampliar cobertura de tests) — quedó como sugerencia.

## Verificación pendiente de tu parte

Después de copiar los archivos:

```bash
npm install
npm test        # deben seguir pasando los 12 tests
npm run build   # confirma que tsc -b sigue sin errores (el fix de
                 # TarjetaEjemplar usa React.KeyboardEvent, tipado
                 # estándar, no debería romper nada)
npm run dev     # prueba manual: Tab hasta una tarjeta del catálogo,
                 # Enter para abrir el modal, Escape para cerrar
```

Si `npm test` sigue en verde y `npm run dev` muestra la tarjeta
navegable por teclado, la integración de Capa 6 queda cerrada.
