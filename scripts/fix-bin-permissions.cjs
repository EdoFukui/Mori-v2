// scripts/fix-bin-permissions.cjs
//
// Corrige un bug conocido: cuando package-lock.json se genera/instala
// en Windows y luego se instala en un entorno Linux (como el build
// de Vercel), algunos binarios dentro de node_modules/.bin/ (ej. tsc)
// pierden el bit de ejecución. El síntoma es "Permission denied" al
// correr `npm run build` en Vercel, aunque `npm run build` funcione
// sin problema en la máquina Windows local.
//
// Este script se corre automáticamente después de `npm install` (ver
// "postinstall" en package.json) y le vuelve a dar permiso de
// ejecución a todo lo que haya en node_modules/.bin/. Usa la API de
// Node (fs.chmodSync) en vez del comando de shell `chmod`, por eso
// funciona igual en Windows, Mac y Linux sin romper nada localmente:
// en Windows, chmod es esencialmente un no-op seguro.
const fs = require('fs');
const path = require('path');

const binDir = path.join(__dirname, '..', 'node_modules', '.bin');

try {
  const archivos = fs.readdirSync(binDir);
  let corregidos = 0;

  for (const archivo of archivos) {
    const rutaCompleta = path.join(binDir, archivo);
    try {
      fs.chmodSync(rutaCompleta, 0o755);
      corregidos++;
    } catch {
      // Si un archivo puntual falla (ej. es un directorio), lo ignoramos
      // y seguimos con el resto — no vale la pena romper el install por uno.
    }
  }

  if (corregidos > 0) {
    console.log(`[fix-bin-permissions] Permisos de ejecución verificados en ${corregidos} archivo(s) de node_modules/.bin`);
  }
} catch {
  // Si node_modules/.bin todavía no existe en este punto del install,
  // no es un error real — simplemente no hay nada que corregir todavía.
}
