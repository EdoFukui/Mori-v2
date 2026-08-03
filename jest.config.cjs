// jest.config.cjs
//
// Config de Jest para Capa 6 (Testing). Extensión .cjs por el mismo
// motivo que babel.config.cjs: el proyecto es "type": "module" y Jest
// carga este archivo con require().
module.exports = {
  testEnvironment: 'jsdom',
  rootDir: '.',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts'],
  moduleNameMapper: {
    // Imports de CSS (ej. `import './admin.css'`) no se resuelven en
    // Jest (no hay bundler procesando assets) — se mapean a un mock
    // vacío. No son CSS Modules, así que no hace falta identity-obj-proxy
    // para estos; se deja instalado por si algún componente futuro migra
    // a *.module.css.
    '\\.(css|less|scss)$': '<rootDir>/src/tests/styleMock.cjs',
  },
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
  transform: {
    '^.+\\.(t|j)sx?$': 'babel-jest',
  },
  clearMocks: true,
};
