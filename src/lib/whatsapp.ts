// src/lib/whatsapp.ts
//
// Migrado de src/js/config.js de Mori 1.0. No está en el contrato de
// la sección 2 de la guía (que solo cubre el tipo Ejemplar y el
// esquema SQL) — lo agrego como utilidad propia de Capa 3 porque
// tanto la tarjeta como el modal lo necesitan.
//
// Nota: en Mori 1.0 existía también whatsappLinks.js para sincronizar
// enlaces <a> estáticos del HTML con este valor en tiempo de ejecución
// (necesario porque el HTML tenía el número "hardcodeado" como
// fallback sin JS). En React esto ya no aplica: los componentes
// importan WHATSAPP_URL directo y lo usan en el JSX, así que no hay
// nada que sincronizar. No porté whatsappLinks.js por ser innecesario,
// no por descuido.

export const WHATSAPP_URL = 'https://wa.me/56968242441';
