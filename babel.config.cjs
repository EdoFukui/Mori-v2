// babel.config.cjs
//
// Config de Babel usada SOLO por Jest para transformar TS/TSX a
// CommonJS en tiempo de test. No reemplaza a Vite/tsc para build ni
// para chequeo de tipos — de eso se sigue encargando `tsc -b` (script
// "build" de package.json). Este archivo no toca la config de Vite.
//
// Extensión .cjs deliberada: el proyecto tiene "type": "module" en
// package.json, y un archivo .js heredaría ese modo ESM. Jest carga
// este archivo con require(), así que necesita ser CommonJS explícito.
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
};
