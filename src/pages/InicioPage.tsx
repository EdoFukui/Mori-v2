// src/pages/InicioPage.tsx
//
// Página de inicio (ruta "/"). Reproduce la estructura de index.html
// de Mori 1.0 como componentes: fondo animado, header, Hero, Catálogo
// (núcleo de esta capa), Sobre nosotros, Contacto/Footer y el botón
// de volver arriba.
//
// NO incluye lo que vivía en el <head> del index.html original (meta
// Open Graph, Twitter Card, JSON-LD, canonical, favicons). Eso
// depende de cómo el proyecto resuelva SEO en un SPA de Vite/React
// (ej. react-helmet-async, o metadata estático si se usa un framework
// con SSR) — no está decidido en la guía y no es parte del encargo de
// esta capa, así que no lo inventé.

import { FondoAnimado } from '../components/publico/FondoAnimado';
import { Header } from '../components/publico/Header';
import { Hero } from '../components/publico/Hero';
import { Catalogo } from '../components/publico/Catalogo';
import { SobreNosotros } from '../components/publico/SobreNosotros';
import { Contacto } from '../components/publico/Contacto';
import { BotonArriba } from '../components/publico/BotonArriba';

export default function InicioPage() {
  return (
    <>
      <FondoAnimado />
      <Header />
      <main>
        <Hero />
        <Catalogo />
        <SobreNosotros />
      </main>
      <Contacto />
      <BotonArriba />
    </>
  );
}
