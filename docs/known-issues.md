# Known Issues y Workarounds

Fecha: 2026-02-22
Estado: vivo

## Formato de registro

- ID: `KI-XXX`
- Área: `frontend | backend | infra | data`
- Severidad: `alta | media | baja`
- Síntoma
- Causa raíz
- Workaround
- Solución definitiva
- Estado: `abierto | mitigado | resuelto`

## KI-001 - Google Maps IntersectionObserver

- Área: frontend
- Severidad: media
- Síntoma: `Failed to execute 'observe' on 'IntersectionObserver'...`
- Causa raíz: comportamiento interno de `@react-google-maps/api` en render/hidratación.
- Workaround: wrapper defensivo para `IntersectionObserver.observe` validando `target`.
- Solución definitiva: reevaluar librería y versión en sprint de hardening.
- Estado: mitigado

## KI-002 - Supabase RLS después de INSERT

- Área: backend/data
- Severidad: alta
- Síntoma: inserción aparente exitosa pero error PostgREST (`PGRST204/42501`) al devolver registro.
- Causa raíz: falta de policy `SELECT` compatible con la policy de `INSERT`.
- Workaround: agregar policy `SELECT` para el mismo actor/rol del insert.
- Solución definitiva: plantilla SQL de policies por tabla y checklist obligatorio de RLS.
- Estado: mitigado

## KI-003 - Upsert con Guid por defecto

- Área: backend/data
- Severidad: media
- Síntoma: conflictos de PK en operaciones de upsert.
- Causa raíz: envío de `00000000-0000-0000-0000-000000000000` por no asignar `Id`.
- Workaround: asignar `Guid.NewGuid()` antes de `.Upsert()`.
- Solución definitiva: encapsular upsert en repositorio con guard clause.
- Estado: mitigado

## KI-004 - URLs API duplicadas por `/api`

- Área: frontend
- Severidad: media
- Síntoma: rutas tipo `/api/api/...` (404).
- Causa raíz: concatenación manual sin normalizar `NEXT_PUBLIC_API_URL`.
- Workaround: helper único de construcción de URL base.
- Solución definitiva: validar URL base al startup y test unitario de composición.
- Estado: mitigado

## KI-005 - N+1 en tarjetas de propiedades

- Área: frontend
- Severidad: alta
- Síntoma: ráfagas de requests (429) en listados.
- Causa raíz: fetch por tarjeta/componente hijo.
- Workaround: carga agregada en contexto y acceso local vía `Set`.
- Solución definitiva: regla lint + revisión obligatoria de performance en listados.
- Estado: mitigado
