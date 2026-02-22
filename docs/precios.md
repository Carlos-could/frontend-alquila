# Reglas de precios y comisión (MVP)

Fecha: 2026-02-22
Estado: borrador

## Modelo de comisión
Definir una única estrategia por ciudad:
- Tarifa fija por cierre, o
- Porcentaje sobre renta acordada.

## Reglas base
- La comisión no puede ser <= 0, salvo override admin con motivo.
- El cálculo se guarda como snapshot al crear `deal`.
- Estados de comisión: `pendiente`, `pagada`, `fallida`, `anulada`.

## Pendiente por definir
- Valor por defecto de tarifa fija.
- Porcentaje por ciudad.
- Política de devolución/anulación.
