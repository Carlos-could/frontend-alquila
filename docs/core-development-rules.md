# Reglas Core de Desarrollo

Fecha: 2026-02-22
Estado: vigente

## 1) API y DTOs

- Nunca retornar modelos DB/ORM directamente desde controllers.
- Siempre usar DTOs para request/response con campos serializables.
- Mantener contrato estable de respuesta por endpoint (evitar cambios ad hoc).

## 2) Serialización y errores en .NET

- Configurar JSON global en `Program.cs` (`camelCase`, evitar ciclos, null handling).
- Implementar middleware global de excepciones.
- Estandarizar payload de error (idealmente `ProblemDetails` o esquema equivalente único).
- No exponer detalles internos en producción.

## 3) Auth y autorización

- Definir un único patrón de autenticación para backend (sin mezclar enfoques por endpoint).
- Configurar `AddAuthentication`, `AddAuthorization`, `UseAuthentication`, `UseAuthorization` desde F1.
- Roles iniciales obligatorios: `inquilino`, `propietario`, `admin`.
- Toda ruta protegida debe tener prueba de autorización positiva y negativa.

## 4) Supabase y RLS

- Activar RLS en tablas de usuario desde la primera migración.
- Crear políticas de `SELECT/INSERT/UPDATE/DELETE` alineadas con cada flujo.
- Usar cliente con `ServiceRoleKey` solo en operaciones administrativas del backend.
- Preferir RPC SQL para consultas complejas/fuzzy en lugar de expresiones C# frágiles.

## 5) TypeScript estricto

- `strict: true` y `noImplicitAny: true` obligatorios.
- Prohibido usar `any` en código nuevo salvo excepción documentada.
- Usar `unknown` en `catch` y hacer narrowing explícito.

## 6) Estado, datos y rendimiento

- Evitar N+1 de red en frontend (nunca fetch por ítem en listados).
- Cargar datos en padre/context/store y acceder en O(1) cuando aplique (`Set/Map`).
- Sanitizar datos en capa de servicio/converter, no en JSX.
- Backend: no asumir eager loading implícito; cargar relaciones necesarias explícitamente.

## 7) Servicios externos y resiliencia

- Toda integración externa debe ser opcional en `dev` con fallback/mock.
- Variables de entorno validadas al iniciar; si falta una crítica, fail-fast con mensaje claro.
- Documentar por servicio: para qué se usa, si es requerido y fallback disponible.

## 8) Testing mínimo por feature

- Backend: build + tests del módulo afectado.
- Frontend: build y type-check sin warnings críticos.
- E2E o prueba manual guiada de flujo principal impactado.
- Agregar o actualizar pruebas de regresión cuando se corrige un bug real.

## 9) Documentación y trazabilidad

- Cada ticket que cambie comportamiento debe actualizar docs relevantes.
- Nuevos riesgos o bugs de terceros van a `docs/known-issues.md`.
- PR debe incluir evidencia corta de validación (build/tests/checklist DoD).
