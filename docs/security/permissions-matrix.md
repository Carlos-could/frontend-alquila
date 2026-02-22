# Matriz de permisos (F1-T04)

Fecha: 2026-02-22  
Estado: vigente

## Roles

- `inquilino`
- `propietario`
- `admin`

## Reglas por ruta

| Ruta | inquilino | propietario | admin |
|---|---|---|---|
| `/admin` | denegado | denegado | permitido |
| `/propietario` | denegado | permitido | permitido |
| `/inquilino` | permitido | permitido | permitido |
| `/` y rutas publicas | permitido | permitido | permitido |

## Fuente tecnica

- Definicion de roles y permisos en `src/features/auth/roles.ts`.
- Guard de ruta en cliente en `src/features/auth/route-guard.tsx`.
- Rutas protegidas de referencia:
  - `src/app/admin/page.tsx`
  - `src/app/propietario/page.tsx`

## Nota de implementacion

En esta fase frontend, el rol se toma de la sesion de Supabase (`app_metadata.role` o `user_metadata.role`) y si no existe, se usa `inquilino` por defecto.
