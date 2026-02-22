# Pantalla: Listing + Map

Fecha: 2026-02-22
Estado: v1
Ruta objetivo: `/`

## Objetivo
Permitir búsqueda rápida de alquileres con contexto de mapa y comparación visual inmediata.

## Estructura

1. TopNav
- Logo textual
- Search input (ciudad)
- Navegación superior
- Botón `Join / Sign in`

2. FilterBar
- `For rent`
- `Price`
- `Beds/baths`
- `Home type`
- `Filters`
- `Save search`

3. Contenido principal
- Izquierda: listado con cards (2 columnas en desktop).
- Derecha: mapa fijo con pins de precio y controles.

## Comportamiento responsive

Desktop:
- Mapa sticky ocupando alto de viewport.
- Grid de cards en 2 columnas.

Mobile:
- Header compacto.
- FilterBar con scroll horizontal.
- Cards en 1 columna.
- Mapa resumido al final.

## Interacciones planificadas (siguiente iteración)

- Hover card resalta pin.
- Click pin hace scroll/selección de card.
- Filtros sincronizados con query params.
- Carga real de datos desde backend `/api/v1/properties`.
