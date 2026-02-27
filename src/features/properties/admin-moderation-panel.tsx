"use client";

import { FormEvent, useState } from "react";
import { getErrorMessage } from "@/features/observability/errors";
import { listPendingModeration, moderatePropertyStatus, type PropertyModerationQueueItem } from "@/features/properties/api";

export function AdminModerationPanel() {
  const [items, setItems] = useState<PropertyModerationQueueItem[]>([]);
  const [reasonById, setReasonById] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  async function loadPending() {
    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      const pending = await listPendingModeration();
      setItems(pending);
    } catch (nextError) {
      setError(getErrorMessage(nextError, "No se pudo cargar la moderacion."));
    } finally {
      setIsLoading(false);
    }
  }

  async function onModerate(propertyId: string, status: "publicado" | "rechazado") {
    setError(null);
    setMessage(null);
    setProcessingId(propertyId);

    try {
      await moderatePropertyStatus(propertyId, status, reasonById[propertyId]?.trim() || undefined);
      setItems((prev) => prev.filter((item) => item.id !== propertyId));
      setMessage(`Inmueble ${status === "publicado" ? "aprobado" : "rechazado"} correctamente.`);
    } catch (nextError) {
      setError(getErrorMessage(nextError, "No se pudo actualizar el estado."));
    } finally {
      setProcessingId(null);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void loadPending();
  }

  return (
    <section className="property-management-panel" aria-label="Moderacion de inmuebles">
      <header className="property-management-header">
        <h1>Panel admin</h1>
        <p className="guard-message">Aprueba o rechaza inmuebles en estado pendiente.</p>
      </header>

      <form className="property-image-controls" onSubmit={handleSubmit}>
        <button className="btn-save" type="submit" disabled={isLoading}>
          {isLoading ? "Cargando..." : "Cargar pendientes"}
        </button>
      </form>

      {message ? <p className="property-success">{message}</p> : null}
      {error ? <p className="property-error">{error}</p> : null}

      {items.length === 0 ? (
        <p className="guard-message">No hay inmuebles pendientes.</p>
      ) : (
        <div className="property-gallery-grid">
          {items.map((item) => (
            <article key={item.id} className="property-gallery-item">
              <strong>{item.title}</strong>
              <span className="guard-message">
                {item.city} · {item.status}
              </span>
              <code>{item.id}</code>
              <label>
                Motivo (opcional)
                <input
                  value={reasonById[item.id] ?? ""}
                  onChange={(event) => setReasonById((prev) => ({ ...prev, [item.id]: event.target.value }))}
                  placeholder="Motivo de decision"
                />
              </label>
              <div className="property-image-actions">
                <button
                  className="btn-save"
                  type="button"
                  disabled={processingId === item.id}
                  onClick={() => void onModerate(item.id, "publicado")}
                >
                  Aprobar
                </button>
                <button
                  className="btn-link"
                  type="button"
                  disabled={processingId === item.id}
                  onClick={() => void onModerate(item.id, "rechazado")}
                >
                  Rechazar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
