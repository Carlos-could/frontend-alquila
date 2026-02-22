# docs/tickets.md

## Convención de ejecución técnica (obligatoria)

Antes de iniciar cualquier ticket, aplicar el checklist de `docs/dod-tecnica.md`.
Reglas técnicas base: `docs/core-development-rules.md`.
Incidentes y workarounds: `docs/known-issues.md`.

## Épica F1: Fundaciones
Estado por ticket:
- `Pendiente`: no iniciado
- `En progreso`: implementación activa
- `Done`: implementado + evidencia técnica registrada

### F1-T01 - Inicializar repositorio y estructura
Prioridad: P0
Objetivo: estructura base mantenible.
Alcance:
- Crear carpetas por dominio (auth, properties, applications, messaging)
- Configurar `.editorconfig`, `.gitignore`, `README`
Criterios de aceptación:
- Proyecto arranca localmente con un comando
- Estructura documentada en README
Dependencias: ninguna
Definición de hecho:
- PR aprobado + build verde
Estado: Done
Evidencia:
- `README.md` documenta ejecución en 1 comando y estructura inicial.
- Archivos base presentes: `.editorconfig`, `.gitignore`, `README.md`.
- Dominios base presentes en `src/features`: `auth`, `properties`, `applications`, `messaging`.

### F1-T02 - Configurar entorno y variables
Prioridad: P0
Objetivo: estandarizar ejecución en `dev` y `staging`.
Alcance:
- `.env.example`
- Carga segura de variables
- Validación al iniciar
Criterios de aceptación:
- Si falta variable crítica, el sistema falla con mensaje claro
Dependencias: F1-T01
Definición de hecho:
- Documentación de variables actualizada
Estado: Done
Evidencia:
- `.env.example` creado con variables públicas críticas.
- `src/config/env.ts` valida variables requeridas y falla con mensaje claro si faltan.
- `README.md` incluye sección de variables y comportamiento de fallo al iniciar.

### F1-T03 - Autenticación base
Prioridad: P0
Objetivo: registro/login seguro.
Alcance:
- Registro con email + contraseña
- Login y cierre de sesión
- Hash seguro de contraseña
Criterios de aceptación:
- Usuario puede registrarse e iniciar sesión
- Contraseñas nunca se guardan en texto plano
Dependencias: F1-T02
Definición de hecho:
- Tests básicos de auth pasando
Estado: Done
Evidencia:
- Registro/login/logout implementados contra Supabase Auth.
- Cliente Supabase en `src/features/auth/supabase-client.ts`.
- Operaciones auth (`signUp`, `signInWithPassword`, `signOut`) en `src/features/auth/storage.ts`.
- Contraseñas gestionadas por Supabase Auth (no se almacenan ni hashean en frontend).
- Flujo UI integrado en `src/components/top-nav.tsx` y `src/components/auth-dialog.tsx`.
- Verificación técnica local: `npm run lint`, `npm run typecheck`, `npm run build`.

### F1-T04 - Roles y autorización
Prioridad: P0
Objetivo: controlar acceso por tipo de usuario.
Alcance:
- Roles: `inquilino`, `propietario`, `admin`
- Middleware/guard para rutas protegidas
Criterios de aceptación:
- Un `inquilino` no puede acceder a rutas de `admin`
Dependencias: F1-T03
Definición de hecho:
- Matriz de permisos documentada
Estado: Done
Evidencia:
- Roles tipados y permisos por ruta en `src/features/auth/roles.ts`.
- Guard de autorización reutilizable en `src/features/auth/route-guard.tsx`.
- Rutas protegidas implementadas: `src/app/admin/page.tsx`, `src/app/propietario/page.tsx`.
- Sesión de auth extendida con `role` en `src/features/auth/storage.ts` (desde metadata de Supabase).
- Matriz de permisos documentada en `docs/security/permissions-matrix.md`.

### F1-T05 - Modelo de datos inicial + migraciones
Prioridad: P0
Objetivo: base de datos preparada para siguientes fases.
Alcance:
- Tablas: `users`, `properties`, `applications`, `documents`, `messages`, `deals`
- Migraciones versionadas
Criterios de aceptación:
- Migración `up/down` funciona sin errores
Dependencias: F1-T02
Definición de hecho:
- Diagrama simple de entidades en docs
Estado: Pendiente
Evidencia:
- Pendiente de implementación y verificación DoD.

### F1-T06 - CI básico
Prioridad: P1
Objetivo: evitar regresiones tempranas.
Alcance:
- Pipeline de lint
- Pipeline de test
- Pipeline de build
Criterios de aceptación:
- Cada PR ejecuta CI automáticamente
Dependencias: F1-T01
Definición de hecho:
- Estado CI visible en repositorio
Estado: Pendiente
Evidencia:
- Pendiente de implementación y verificación DoD.

### F1-T07 - Despliegue staging mínimo
Prioridad: P1
Objetivo: validar flujo real fuera de local.
Alcance:
- Despliegue automático a `staging`
- Healthcheck
Criterios de aceptación:
- URL de staging accesible
- Endpoint `/health` responde OK
Dependencias: F1-T06
Definición de hecho:
- Runbook corto de despliegue en docs
Estado: Pendiente
Evidencia:
- Pendiente de implementación y verificación DoD.

### F1-T08 - Observabilidad mínima
Prioridad: P2
Objetivo: detectar fallos temprano.
Alcance:
- Logging estructurado
- Manejo central de errores
Criterios de aceptación:
- Errores críticos quedan registrados con contexto
Dependencias: F1-T01
Definición de hecho:
- Guía breve de troubleshooting
Estado: Pendiente
Evidencia:
- Pendiente de implementación y verificación DoD.



## Épica F2: Publicación y búsqueda de inmuebles

### F2-T01 - Entidad `properties` completa
Prioridad: P0
Objetivo: almacenar datos de inmueble de forma consistente.
Alcance:
- Campos: título, descripción, ciudad, barrio, dirección, precio, depósito, habitaciones, baños, m2, amueblado, disponibilidad, tipo de contrato, estado
- Índices para búsqueda por ciudad y precio
Criterios de aceptación:
- Se puede crear/actualizar inmueble con validación
Dependencias: F1-T05
Definición de hecho:
- Migración aplicada y documentada

### F2-T02 - API crear/editar inmueble (propietario)
Prioridad: P0
Objetivo: que propietarios gestionen sus anuncios.
Alcance:
- `POST /properties`
- `PATCH /properties/:id`
- Permisos por rol y dueño del inmueble
Criterios de aceptación:
- Solo propietario creador o admin puede editar
Dependencias: F2-T01, F1-T04
Definición de hecho:
- Pruebas de autorización incluidas

### F2-T03 - Carga de imágenes
Prioridad: P0
Objetivo: permitir fotos en publicación.
Alcance:
- Subida múltiple (hasta 15)
- Validación de formato y tamaño
- Orden de imágenes
Criterios de aceptación:
- El inmueble muestra galería sin romper diseño
Dependencias: F2-T02
Definición de hecho:
- Manejo de errores de subida implementado

### F2-T04 - Moderación básica de anuncios
Prioridad: P1
Objetivo: controlar calidad mínima del inventario.
Alcance:
- Estados: `pendiente`, `publicado`, `rechazado`
- Acción admin para aprobar/rechazar
Criterios de aceptación:
- Solo inmuebles `publicado` aparecen en listado público
Dependencias: F2-T02
Definición de hecho:
- Historial de cambios de estado registrado

### F2-T05 - Listado público con filtros
Prioridad: P0
Objetivo: que inquilinos encuentren inmuebles rápido.
Alcance:
- Filtros: ciudad, precio mínimo/máximo, habitaciones, amueblado
- Orden: más recientes, menor precio, mayor precio
- Paginación
Criterios de aceptación:
- Filtros combinados devuelven resultados correctos
Dependencias: F2-T01
Definición de hecho:
- Pruebas de API de búsqueda pasando

### F2-T06 - Detalle de inmueble
Prioridad: P0
Objetivo: mostrar información completa para decisión.
Alcance:
- Datos del inmueble + galería + disponibilidad + CTA “Solicitar”
- Inmuebles relacionados por ciudad
Criterios de aceptación:
- Carga sin errores para inmuebles válidos y 404 para inexistentes
Dependencias: F2-T05, F2-T03
Definición de hecho:
- Eventos analíticos de vista de detalle

### F2-T07 - Validaciones y reglas de negocio
Prioridad: P1
Objetivo: evitar datos inválidos.
Alcance:
- Reglas: precio > 0, m2 > 0, habitaciones >= 0, disponibilidad válida
- Sanitización de texto
Criterios de aceptación:
- Respuestas de error claras y consistentes
Dependencias: F2-T02
Definición de hecho:
- Catálogo de errores documentado

### F2-T08 - Analítica mínima de oferta
Prioridad: P2
Objetivo: medir uso de inventario.
Alcance:
- Eventos: inmueble creado, publicado, visto, filtrado
- Panel básico interno
Criterios de aceptación:
- Métricas visibles por día y ciudad
Dependencias: F2-T05, F2-T06
Definición de hecho:
- Dashboard accesible para admin


## Épica F3: Perfil documental y solicitudes

### F3-T01 - Perfil de inquilino
Prioridad: P0
Objetivo: capturar datos mínimos para evaluar candidatos.
Alcance:
- Campos: nombre, nacionalidad, situación laboral, ingresos mensuales, fecha de entrada, duración estimada, mascotas, fumador
- Estado de perfil: `incompleto`, `completo`
Criterios de aceptación:
- Un inquilino puede guardar y actualizar su perfil sin perder datos
Dependencias: F1-T03, F1-T04
Definición de hecho:
- Validaciones de formulario y pruebas básicas implementadas

### F3-T02 - Entidad y API de documentos
Prioridad: P0
Objetivo: gestionar documentación del candidato.
Alcance:
- Tipos: identificación, contrato laboral/carta, comprobante de ingresos
- Estados: `subido`, `en_revision`, `verificado`, `rechazado`
- Carga segura de archivos y metadatos
Criterios de aceptación:
- El inquilino ve el estado de cada documento
Dependencias: F1-T05, F3-T01
Definición de hecho:
- Política de tamaño/formato y errores claros documentados

### F3-T03 - Flujo de solicitud a inmueble
Prioridad: P0
Objetivo: convertir interés en candidatura formal.
Alcance:
- `POST /applications` desde detalle del inmueble
- Estados: `enviada`, `revisada`, `preseleccionada`, `rechazada`, `aceptada`
- Evitar solicitudes duplicadas al mismo inmueble por mismo usuario
Criterios de aceptación:
- Solicitud creada correctamente y visible para propietario
Dependencias: F2-T06, F3-T01
Definición de hecho:
- Pruebas de creación y transición de estado

### F3-T04 - Bandeja de candidatos para propietario
Prioridad: P0
Objetivo: facilitar revisión y decisión.
Alcance:
- Lista de solicitudes por inmueble
- Vista resumida de perfil + estado documental
- Acciones: revisar, preseleccionar, rechazar
Criterios de aceptación:
- El propietario puede cambiar estado sin salir del panel
Dependencias: F3-T03, F3-T02
Definición de hecho:
- Ordenación por fecha y estado disponible

### F3-T05 - Reglas de elegibilidad de solicitud
Prioridad: P1
Objetivo: mejorar calidad de candidaturas.
Alcance:
- Requisito mínimo configurable (ejemplo: perfil completo)
- Mensajes de bloqueo con instrucciones
Criterios de aceptación:
- Usuario entiende por qué no puede solicitar y cómo corregirlo
Dependencias: F3-T01, F3-T03
Definición de hecho:
- Reglas documentadas en `docs/negocio.md`

### F3-T06 - Notificaciones por correo
Prioridad: P1
Objetivo: acelerar tiempos de respuesta.
Alcance:
- Eventos: solicitud enviada, solicitud revisada, preselección, rechazo, aceptación
- Plantillas de correo en español
Criterios de aceptación:
- Se envían correos en cada evento crítico sin duplicados
Dependencias: F3-T03, F3-T04
Definición de hecho:
- Registro de envíos y manejo de fallos implementado

### F3-T07 - Auditoría de cambios en solicitudes
Prioridad: P2
Objetivo: trazabilidad y soporte.
Alcance:
- Guardar quién cambió estado, cuándo y desde qué rol
Criterios de aceptación:
- Admin puede consultar historial por solicitud
Dependencias: F3-T03
Definición de hecho:
- Endpoint de historial disponible para admin

### F3-T08 - Métricas de embudo de solicitud
Prioridad: P2
Objetivo: medir conversión del proceso.
Alcance:
- Eventos: perfil completado, documento subido, solicitud enviada, solicitud aceptada
- Embudo por ciudad e inmueble
Criterios de aceptación:
- Dashboard muestra conversión por etapa semanal
Dependencias: F3-T01, F3-T02, F3-T03
Definición de hecho:
- Reporte básico exportable a CSV


## Épica F4: Mensajería, cierre y cobro

### F4-T01 - Entidad y API de mensajería por solicitud
Prioridad: P0
Objetivo: habilitar comunicación dentro de la plataforma.
Alcance:
- `messages` ligados a `application_id`
- `POST /applications/:id/messages`
- `GET /applications/:id/messages` con paginación
- Permisos: solo inquilino postulante, propietario del inmueble y admin
Criterios de aceptación:
- No se pueden enviar mensajes fuera de una solicitud válida
Dependencias: F3-T03, F1-T04
Definición de hecho:
- Pruebas de permisos y paginación pasando

### F4-T02 - Estados de coordinación de visita
Prioridad: P1
Objetivo: ordenar el avance previo al cierre.
Alcance:
- Campos en solicitud: `visita_propuesta`, `visita_confirmada`, `visita_realizada`
- Fecha/hora y notas opcionales
Criterios de aceptación:
- Ambas partes ven el estado actualizado en tiempo real de backend
Dependencias: F4-T01, F3-T04
Definición de hecho:
- Historial de cambios de estado guardado

### F4-T03 - Flujo de cierre de operación
Prioridad: P0
Objetivo: marcar de forma formal la operación ganada.
Alcance:
- Acción de propietario: `marcar_como_cerrada`
- Confirmación opcional por inquilino
- Creación de registro en `deals`
Criterios de aceptación:
- Cada cierre genera un `deal` único y auditable
Dependencias: F3-T03, F3-T07
Definición de hecho:
- Endpoint de cierre y validaciones implementadas

### F4-T04 - Cálculo de comisión
Prioridad: P0
Objetivo: monetizar cierres con reglas claras.
Alcance:
- Reglas configurables: tarifa fija o porcentaje
- Snapshot del cálculo al cerrar (para no cambiar retroactivamente)
- Estado de comisión: `pendiente`, `pagada`, `fallida`, `anulada`
Criterios de aceptación:
- El monto queda fijado y visible en el detalle del `deal`
Dependencias: F4-T03
Definición de hecho:
- Tabla/documentación de reglas en `docs/precios.md`

### F4-T05 - Cobro de comisión (modo MVP)
Prioridad: P1
Objetivo: cobrar sin bloquear el lanzamiento.
Alcance:
- Opción A: registro de pago manual (transferencia)
- Opción B: integración simple con pasarela (si está disponible)
- Comprobante básico y fecha de pago
Criterios de aceptación:
- Operaciones puede marcar y reconciliar pagos correctamente
Dependencias: F4-T04
Definición de hecho:
- Reporte de pagos por rango de fechas

### F4-T06 - Notificaciones de mensajería y cierre
Prioridad: P1
Objetivo: mejorar velocidad de respuesta y conversión.
Alcance:
- Eventos: nuevo mensaje, visita confirmada, cierre, comisión pendiente/pagada
- Plantillas de correo en español
Criterios de aceptación:
- Se envía 1 notificación por evento sin duplicados
Dependencias: F4-T01, F4-T03, F4-T05, F3-T06
Definición de hecho:
- Logs de envío y reintento básico implementados

### F4-T07 - Panel interno de operaciones
Prioridad: P1
Objetivo: controlar negocio día a día.
Alcance:
- Listado de `deals` y comisiones
- Filtros por ciudad, estado y rango de fechas
- Vista de incidencias (pagos fallidos o anulados)
Criterios de aceptación:
- Equipo interno puede operar sin acceso a base de datos
Dependencias: F4-T03, F4-T05
Definición de hecho:
- Permisos de `admin/ops` aplicados

### F4-T08 - Métricas de monetización
Prioridad: P2
Objetivo: medir rendimiento del modelo.
Alcance:
- KPIs: cierres, ingreso bruto, comisión media, días a cierre, tasa de pago
- Corte semanal por ciudad
Criterios de aceptación:
- Dashboard muestra evolución semanal y comparativo simple
Dependencias: F4-T03, F4-T05
Definición de hecho:
- Exportación CSV disponible para finanzas

### F4-T09 - Reglas antifraude mínimas en cierre/pago
Prioridad: P2
Objetivo: reducir errores y abuso operativo.
Alcance:
- Bloquear doble cierre del mismo inmueble en mismo periodo
- Bloquear comisión negativa o cero salvo excepciones admin
- Registro de override administrativo con motivo
Criterios de aceptación:
- Casos inválidos rechazados con error claro
Dependencias: F4-T03, F4-T04
Definición de hecho:
- Casos de prueba de fraude básico pasando


## Épica F5: Piloto, optimización y lanzamiento

### F5-T01 - Piloto cerrado (oferta)
Prioridad: P0
Objetivo: asegurar inventario inicial de calidad.
Alcance:
- Onboarding manual de 20-30 propietarios
- Checklist de calidad por inmueble (fotos, precio, disponibilidad, datos completos)
- Seguimiento de inmuebles no publicados
Criterios de aceptación:
- Al menos 80 inmuebles `publicado` al final del piloto
Dependencias: F2-T04, F3-T04
Definición de hecho:
- Reporte semanal de captación compartido en docs

### F5-T02 - Piloto cerrado (demanda)
Prioridad: P0
Objetivo: activar inquilinos objetivo del nicho expat.
Alcance:
- Campañas iniciales de adquisición (canales de bajo costo)
- Landing por ciudad con propuesta clara
- Flujo de registro y solicitud medido extremo a extremo
Criterios de aceptación:
- 300+ registros cualificados durante piloto
Dependencias: F2-T05, F3-T03
Definición de hecho:
- CAC preliminar por canal documentado

### F5-T03 - Optimización de onboarding
Prioridad: P0
Objetivo: reducir abandono en registro/perfil/documentos.
Alcance:
- Simplificar formularios de alta
- Guardado automático de progreso
- Mensajes de error y ayuda contextual en español
Criterios de aceptación:
- Mejora >= 20% en finalización de perfil
Dependencias: F3-T01, F3-T02, F5-T02
Definición de hecho:
- Comparativa antes/después con cohorte semanal

### F5-T04 - Optimización del embudo de solicitud
Prioridad: P0
Objetivo: aumentar solicitudes efectivas por inmueble.
Alcance:
- Ajustar CTA y orden de información en detalle
- Mejorar filtros más usados
- Recordatorios automáticos para solicitudes incompletas
Criterios de aceptación:
- Mejora >= 15% en tasa vista -> solicitud
Dependencias: F2-T06, F3-T03, F4-T06
Definición de hecho:
- Dashboard de embudo actualizado

### F5-T05 - SLA operativo y soporte
Prioridad: P1
Objetivo: asegurar respuesta rápida y confianza.
Alcance:
- Definir SLA: primera respuesta < 12h
- Bandeja interna de incidencias
- Macros de respuesta y clasificación de tickets
Criterios de aceptación:
- 90% de incidencias dentro del SLA
Dependencias: F4-T07
Definición de hecho:
- Runbook de soporte en `docs/soporte.md`

### F5-T06 - Seguridad y cumplimiento mínimo pre-lanzamiento
Prioridad: P0
Objetivo: reducir riesgo operativo y legal.
Alcance:
- Revisión de permisos por rol
- Política de retención y borrado de documentos
- Términos, privacidad y consentimientos visibles
Criterios de aceptación:
- Checklist legal/técnico marcado como completo
Dependencias: F1-T04, F3-T02, F4-T09
Definición de hecho:
- Evidencia de revisión en `docs/compliance-checklist.md`

### F5-T07 - Pruebas E2E de rutas críticas
Prioridad: P1
Objetivo: evitar regresiones en lanzamiento.
Alcance:
- E2E: publicar inmueble, solicitar, mensajear, cerrar, registrar pago
- Suite automática en CI para rutas críticas
Criterios de aceptación:
- 100% de rutas críticas en verde en staging
Dependencias: F4-T05, F4-T01, F2-T02, F3-T03
Definición de hecho:
- Pipeline de release bloquea si falla E2E crítico

### F5-T08 - Lanzamiento abierto en 1-2 ciudades
Prioridad: P0
Objetivo: pasar de piloto a mercado real controlado.
Alcance:
- Activar alta pública
- Limitar ciudades iniciales
- Monitoreo diario de KPIs y errores
Criterios de aceptación:
- Sistema estable durante 2 semanas post-lanzamiento
Dependencias: F5-T03, F5-T04, F5-T06, F5-T07
Definición de hecho:
- Acta de lanzamiento con incidencias y acciones

### F5-T09 - Tablero ejecutivo de KPIs MVP
Prioridad: P1
Objetivo: tomar decisiones semanales con datos.
Alcance:
- KPIs: inmuebles activos, registros, solicitudes, cierres, ingresos, CAC, tiempo a cierre, tasa de pago
- Vista semanal y acumulada
Criterios de aceptación:
- Dirección puede revisar salud del negocio en un único panel
Dependencias: F4-T08, F5-T02
Definición de hecho:
- Diccionario de métricas en `docs/kpis.md`

### F5-T10 - Decisión Go/No-Go para Fase 6
Prioridad: P1
Objetivo: decidir expansión o ajuste con criterios objetivos.
Alcance:
- Umbrales de éxito/fracaso del MVP
- Escenarios: escalar ciudades, ajustar pricing, pivot parcial
- Plan de 60 días posterior
Criterios de aceptación:
- Decisión formal documentada con datos
Dependencias: F5-T08, F5-T09
Definición de hecho:
- Documento `docs/go-no-go.md` aprobado






