# Troubleshooting de observabilidad (F1-T08)

## Que se registro

- Logs estructurados en formato JSON desde `src/features/observability/logger.ts`.
- Eventos de auth y fallos de sesion en `src/features/auth/storage.ts`.
- Errores de UI no controlados en:
  - `src/app/error.tsx`
  - `src/app/global-error.tsx`
  - `src/components/global-error-listeners.tsx` (`window.error` y `unhandledrejection`)

## Campos clave del log

- `timestamp`: fecha ISO del evento.
- `level`: `info | warn | error`.
- `event`: identificador estable (ejemplo: `auth.login.failed`).
- `message`: descripcion corta del fallo.
- `context`: datos de negocio o runtime para diagnostico.
- `error`: objeto serializado (`name`, `message`, `stack`) cuando aplica.

## Como diagnosticar rapido

1. Reproducir el flujo en `npm run dev`.
2. Revisar consola del navegador y filtrar por `"level":"error"` o por `event`.
3. Para auth, revisar eventos `auth.*` para distinguir:
   - fallo de credenciales (`auth.login.failed`)
   - problema de sesion (`auth.login.session_missing`)
   - error de cierre (`auth.logout.failed`)
4. Si falla una pantalla completa, revisar:
   - `frontend.boundary.route_error`
   - `frontend.boundary.global_error`
   - `frontend.runtime.unhandled_rejection`

## Limitaciones actuales

- Los logs viven en consola (sin sink externo aun).
- No se incluye identificador de request distribuido en frontend por ahora.
