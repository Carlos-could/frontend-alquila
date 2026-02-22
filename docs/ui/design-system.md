# Design System UI

Fecha: 2026-02-22
Estado: vigente
Referencia visual: estilo portal inmobiliario tipo Redfin/Zillow (sin clonar branding)

## 1) Dirección visual

- Producto: marketplace inmobiliario para expats.
- Personalidad: claro, confiable, rápido, data-first.
- Estilo: limpio, con fuerte jerarquía de información y foco en búsqueda.

## 2) Tokens base

- Primario: `#e53935` (acciones principales).
- Primario hover: `#cc2f2f`.
- Fondo app: `#f5f7fa`.
- Superficie: `#ffffff`.
- Borde: `#d9dee8`.
- Texto principal: `#142033`.
- Texto secundario: `#4f5b6b`.
- Éxito: `#0f9d58`.
- Info mapa/pins: `#9c3ea4`.

Tipografías:
- Heading/UI: `Space Grotesk`.
- Cuerpo: `Source Sans 3`.

Radio/espaciado:
- Radio base: 12px.
- Radio cards: 16px.
- Espaciado base: escala 4/8/12/16/24/32.

## 3) Componentes clave

- TopNav: marca, búsqueda principal, enlaces de navegación, CTA auth.
- FilterBar: chips/botones de filtro con estados activos.
- PropertyCard: imagen, precio, meta, CTA.
- ListingPane: grid de cards y conteo/orden.
- MapPane: mapa fijo con pins de precio y controles de zoom.

## 4) Reglas de layout

Desktop (>= 1200px):
- Split principal 50/50 (`list` + `map`) con mapa sticky.

Tablet (768px - 1199px):
- Split 55/45, cards en una columna.

Mobile (< 768px):
- Flujo vertical: filtros horizontales, listado primero, mini mapa al final.

## 5) Estados UX mínimos

- `loading`: skeleton en cards y mapa.
- `empty`: mensaje con CTA para limpiar filtros.
- `error`: feedback corto + reintento.
- `selected`: card activa resalta pin asociado.

## 6) Accesibilidad

- Contraste AA en texto/botones.
- Focus visible en controles interactivos.
- Navegación por teclado en filtros/listado.
- `aria-label` en controles de mapa.
