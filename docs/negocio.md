# Reglas de negocio (MVP)

Fecha: 2026-02-22
Estado: borrador

## Objetivo
Centralizar reglas funcionales que afectan validaciones y elegibilidad del flujo principal.

## Reglas iniciales
- Un inquilino debe tener perfil `completo` para enviar solicitud.
- No se permite más de una solicitud activa por `inquilino + inmueble`.
- Solo propiedades en estado `publicado` aceptan solicitudes.
- Solo el propietario del inmueble o un admin puede cambiar estado de la solicitud.

## Pendiente por definir
- Reglas de scoring/priorización de candidatos.
- Condiciones de bloqueo por documentación incompleta.
- Ventana máxima de respuesta del propietario.
