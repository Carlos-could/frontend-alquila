# Frontend Alquila

Base UI para el MVP inmobiliario.

## Ejecutar (1 comando)

```bash
npm run dev
```

## Scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run typecheck`

## Variables de entorno

Usar `.env.example` como base para `.env.local`.

Variables críticas:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Si falta una variable crítica, el frontend falla al iniciar con mensaje claro.

## Estructura inicial (F1-T01)

```text
src/
  app/
  components/
  config/
    env.ts
  features/
    auth/
    properties/
    applications/
    messaging/
```

## Diseño

- Tokens y reglas: `docs/ui/design-system.md`
- Pantalla listing+map: `docs/ui/listing-map.md`

