# DoD Técnica por Ticket

Fecha: 2026-02-22
Estado: vigente

Usar este checklist en cada ticket de implementación.

## 1) Diseño y contrato

- [ ] Endpoint/evento/flujo definido con contrato de entrada/salida.
- [ ] DTOs separados de modelos de persistencia.
- [ ] Reglas de negocio afectadas documentadas (si cambia comportamiento).

## 2) Seguridad y permisos

- [ ] Ruta protegida con auth/autorización según rol.
- [ ] Cobertura de caso permitido y denegado.
- [ ] RLS/policies revisadas si hay cambio en tablas de usuario.

## 3) Calidad de código

- [ ] Sin `any` nuevo en frontend (salvo excepción documentada).
- [ ] Manejo de errores consistente (backend y frontend).
- [ ] Sin N+1 evidente en llamadas de red o acceso a datos.
- [ ] Cumplimiento de ADR-001 en frontend: Tailwind/shadcn y RHF+Zod en formularios.

## 4) Configuración y entorno

- [ ] Variables nuevas declaradas en `.env.example`.
- [ ] Validación de variables al iniciar.
- [ ] Dependencias externas opcionales en `dev` o con fallback explícito.

## 5) Validación

- [ ] Backend build/test en verde.
- [ ] Frontend type-check/build en verde.
- [ ] Prueba funcional del flujo principal afectado.

## 6) Documentación

- [ ] README/docs actualizados si cambió setup o comportamiento.
- [ ] Si apareció bug nuevo de proveedor/librería, registrado en `docs/known-issues.md`.
- [ ] Ticket/PR incluye evidencia breve de verificación.
