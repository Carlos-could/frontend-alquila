# ADR-001: Stack técnico del MVP

Fecha: 2026-02-22  
Estado: aceptado

## Contexto
Necesitamos lanzar un MVP inmobiliario en 90 días para el mercado alemán, con foco en velocidad de entrega, bajo costo operativo inicial y mantenimiento sencillo para un equipo pequeño.

## Decisión
Se adopta el siguiente stack:

1. Frontend
- Next.js (App Router) + TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form + Zod

2. Backend API
- ASP.NET Core 9 (Web API REST)
- OpenAPI/Swagger
- Arquitectura por capas (API, Application, Domain, Infrastructure)

3. Plataforma de datos y servicios base
- Supabase PostgreSQL (DB)
- Supabase Auth
- Supabase Storage

4. Notificaciones
- Correo transaccional: Resend o Postmark

5. Despliegue
- Frontend: Vercel (o equivalente)
- Backend ASP.NET Core 9: Render, Fly.io o Azure App Service
- Variables de entorno separadas para `dev`, `staging`, `prod`

6. Infraestructura y calidad
- GitHub Actions para CI/CD
- Pipeline mínimo: restore, build, test, lint, deploy a `staging`
- Logging estructurado + Sentry
- Endpoint `/health`

7. Convenciones iniciales
- API versionada: `/api/v1`
- Roles: `inquilino`, `propietario`, `admin`
- Entornos: `dev`, `staging`, `prod`

## Razones
- ASP.NET Core 9 ofrece rendimiento, robustez y claridad para lógica de negocio.
- Supabase reduce complejidad al centralizar DB, autenticación y almacenamiento.
- Next.js con shadcn/ui acelera la construcción del frontend sin sacrificar consistencia.
- El stack permite llegar a producción del MVP con menor carga operativa.

## Consecuencias
Positivas:
- Mayor velocidad de implementación en fases 1-5.
- Menos integración de terceros para auth y archivos.
- Estructura clara para escalar de MVP a producto.

Negativas:
- Dependencia inicial de Supabase.
- Necesidad de definir bien políticas de acceso y seguridad en Auth/Storage.
- Riesgo de dispersión de costos entre proveedores (hosting, correo y observabilidad).

## Mitigaciones
- Aislar acceso a Supabase en capa de infraestructura.
- Definir pruebas de autorización por rol (`inquilino`, `propietario`, `admin`).
- Revisar políticas de seguridad y retención de archivos antes del lanzamiento.
- Definir límites de almacenamiento y políticas de ciclo de vida para archivos.

## Alternativas descartadas
1. NestJS + PostgreSQL + auth propia
- Más piezas a operar para auth y storage.

2. Django + DRF
- Menor alineación con frontend TypeScript elegido.

## Revisión futura
Reevaluar esta decisión al cierre de Fase 5 (piloto/lanzamiento), en función de:
- coste real de operación,
- rendimiento en producción,
- necesidades de escalado y búsqueda avanzada.
