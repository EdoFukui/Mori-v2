// src/components/publico/Header.tsx
// Port directo de la cabecera de index.html (Mori 1.0), sin cambios
// de estructura ni de accesibilidad.

export function Header() {
  return (
    <header id="inicio">
      <a href="#inicio" className="logo">
        Mori
      </a>
      <nav>
        <ul>
          <li>
            <a href="#inicio">Inicio</a>
          </li>
          <li>
            <a href="#catalogo">Catálogo</a>
          </li>
          <li>
            <a href="#acerca">Sobre Nosotros</a>
          </li>
          <li>
            <a href="#contacto">Contacto</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
