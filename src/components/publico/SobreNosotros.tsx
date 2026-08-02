// src/components/publico/SobreNosotros.tsx
// Port directo, texto sin cambios respecto a index.html (Mori 1.0).

import { useScrollReveal } from '../../hooks/useScrollReveal';

export function SobreNosotros() {
  const titulo = useScrollReveal<HTMLHeadingElement>();
  const texto = useScrollReveal<HTMLDivElement>();

  return (
    <section className="sobre-nosotros" id="acerca">
      <h2 className={`titulo-seccion ${titulo.className}`} ref={titulo.ref}>
        Sobre nosotros
      </h2>
      <div className={`texto-sobre-nosotros ${texto.className}`} ref={texto.ref}>
        <p>
          Hace tres años descubrimos el mundo de las plantas exóticas y, sin darnos cuenta,
          comenzaron a llenar nuestros espacios y nuestro día a día. Lo que empezó con una sola
          planta pronto se transformó en una colección que seguimos cuidando y haciendo crecer
          con mucha dedicación.
        </p>
        <p>
          En Mori queremos compartir esa misma emoción con otras personas. Creemos que una planta
          puede cambiar por completo un rincón de un hogar, aportando vida, calma y un toque
          único.
        </p>
        <p>
          Somos un proyecto familiar dedicado al cultivo y cuidado de plantas exóticas. Aquí
          encontrarás plantas que hemos cultivado, reproducido y cuidado con cariño{' '}
          <em>
            —cada fotografía que ves corresponde al ejemplar real que recibirás, nunca a una
            imagen genérica—
          </em>
          , además de un espacio para intercambiar, aprender y conectar.
        </p>
        <p>
          Esperamos que encuentres esa planta que haga de tu hogar un lugar aún más verde y
          especial.
        </p>
      </div>
    </section>
  );
}
