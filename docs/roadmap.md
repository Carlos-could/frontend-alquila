# docs/roadmap.md

## MVP Inmobiliaria Expat Alemania (90 días)

### Fase 1 (Semanas 1-2): Fundaciones
Objetivo: dejar base técnica y funcional mínima para construir rápido sin rehacer.

Entregables:
- Arquitectura base backend/frontend
- Autenticación con roles (`inquilino`, `propietario`, `admin`)
- Modelo de datos inicial
- Entornos `dev` y `staging`
- CI básico (lint + test mínimo + build)

Métrica de salida de fase:
- 1 despliegue funcional en `staging`
- Login/registro operativo
- Esquema de BD versionado con migraciones


### Fase 2 (Semanas 3-4): Oferta de inmuebles
Objetivo: permitir que propietarios publiquen y que inquilinos encuentren inmuebles con filtros básicos.

Entregables:
- Alta/edición de inmueble
- Carga de fotos
- Listado público con filtros
- Detalle de inmueble
- Moderación mínima (`pendiente`, `publicado`, `rechazado`)

Métrica de salida de fase:
- 50 inmuebles publicados en `staging`
- Tiempo de publicación < 10 minutos por inmueble
- Búsqueda con latencia p95 < 500 ms


### Fase 3 (Semanas 5-6): Perfil documental y solicitudes
Objetivo: permitir que el inquilino complete su perfil, suba documentos y postule a un inmueble; que el propietario gestione candidatos.

Entregables:
- Perfil de inquilino
- Subida y estado de documentos
- Flujo de solicitud a inmueble
- Bandeja de candidatos para propietario
- Notificaciones por correo en hitos clave

Métrica de salida de fase:
- 30% de usuarios inquilinos con perfil completo
- 20% de inmuebles con al menos 1 solicitud
- Tiempo medio de primera respuesta del propietario < 24h


### Fase 4 (Semanas 7-8): Mensajería, cierre y cobro
Objetivo: completar el ciclo desde solicitud hasta cierre de alquiler y monetización.

Entregables:
- Mensajería inquilino-propietario por solicitud
- Agenda básica de visita (estado y fecha/hora)
- Flujo de cierre de operación
- Cobro de comisión (manual o semiautomático)
- Panel interno de operaciones e ingresos

Métrica de salida de fase:
- 80% de solicitudes preseleccionadas con al menos 1 mensaje
- 20-30 cierres de prueba en `staging` (o piloto controlado)
- 100% de cierres con registro de comisión y trazabilidad


### Fase 5 (Semanas 9-12): Piloto, optimización y lanzamiento abierto
Objetivo: validar tracción real, corregir cuellos de botella y lanzar públicamente en 1-2 ciudades.

Entregables:
- Piloto cerrado con oferta y demanda reales
- Mejoras de conversión en onboarding y solicitud
- Endurecimiento operativo (soporte, seguridad, calidad)
- Lanzamiento abierto controlado
- Tablero ejecutivo de KPIs del MVP

Métrica de salida de fase:
- 100-150 inmuebles activos
- 800-1,200 usuarios registrados
- 20-30 cierres pagados
- Conversión solicitud -> cierre >= 8-10%
- Tiempo de primera respuesta del propietario < 12h


