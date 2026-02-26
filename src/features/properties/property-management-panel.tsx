"use client";

import { FormEvent, useMemo, useState } from "react";
import { createProperty, patchProperty, type PropertyPatchRequest, type PropertyUpsertRequest } from "@/features/properties/api";
import { getErrorMessage } from "@/features/observability/errors";

const CONTRACT_OPTIONS: PropertyUpsertRequest["contractType"][] = ["long_term", "temporary", "monthly"];
const STATUS_OPTIONS: PropertyUpsertRequest["status"][] = ["pendiente", "publicado", "rechazado"];

type CreateFormState = {
  title: string;
  description: string;
  city: string;
  neighborhood: string;
  address: string;
  monthlyPrice: string;
  depositAmount: string;
  bedrooms: string;
  bathrooms: string;
  areaM2: string;
  isFurnished: boolean;
  availableFrom: string;
  contractType: PropertyUpsertRequest["contractType"];
  status: PropertyUpsertRequest["status"];
};

type PatchFormState = {
  id: string;
  title: string;
  description: string;
  city: string;
  neighborhood: string;
  address: string;
  monthlyPrice: string;
  depositAmount: string;
  bedrooms: string;
  bathrooms: string;
  areaM2: string;
  isFurnished: "" | "true" | "false";
  availableFrom: string;
  contractType: "" | PropertyUpsertRequest["contractType"];
  status: "" | PropertyUpsertRequest["status"];
};

function todayIsoDate(): string {
  const now = new Date();
  const timezoneOffsetMs = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - timezoneOffsetMs).toISOString().slice(0, 10);
}

function initialCreateState(): CreateFormState {
  return {
    title: "",
    description: "",
    city: "",
    neighborhood: "",
    address: "",
    monthlyPrice: "",
    depositAmount: "0",
    bedrooms: "0",
    bathrooms: "0",
    areaM2: "",
    isFurnished: false,
    availableFrom: todayIsoDate(),
    contractType: "long_term",
    status: "pendiente",
  };
}

function initialPatchState(): PatchFormState {
  return {
    id: "",
    title: "",
    description: "",
    city: "",
    neighborhood: "",
    address: "",
    monthlyPrice: "",
    depositAmount: "",
    bedrooms: "",
    bathrooms: "",
    areaM2: "",
    isFurnished: "",
    availableFrom: "",
    contractType: "",
    status: "",
  };
}

function maybeNumber(value: string): number | undefined {
  if (value.trim() === "") {
    return undefined;
  }
  return Number(value);
}

function maybeInt(value: string): number | undefined {
  if (value.trim() === "") {
    return undefined;
  }
  return Number.parseInt(value, 10);
}

export function PropertyManagementPanel() {
  const [createForm, setCreateForm] = useState<CreateFormState>(() => initialCreateState());
  const [patchForm, setPatchForm] = useState<PatchFormState>(() => initialPatchState());
  const [createError, setCreateError] = useState<string | null>(null);
  const [patchError, setPatchError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isPatching, setIsPatching] = useState(false);

  const canCreate = useMemo(() => {
    return (
      createForm.title.trim().length > 0 &&
      createForm.city.trim().length > 0 &&
      createForm.monthlyPrice.trim().length > 0 &&
      createForm.areaM2.trim().length > 0 &&
      createForm.availableFrom.trim().length > 0
    );
  }, [createForm]);

  async function handleCreateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreateError(null);
    setSuccessMessage(null);
    setIsCreating(true);

    try {
      const payload: PropertyUpsertRequest = {
        title: createForm.title,
        description: createForm.description,
        city: createForm.city,
        neighborhood: createForm.neighborhood,
        address: createForm.address,
        monthlyPrice: Number(createForm.monthlyPrice),
        depositAmount: Number(createForm.depositAmount),
        bedrooms: Number.parseInt(createForm.bedrooms, 10),
        bathrooms: Number.parseInt(createForm.bathrooms, 10),
        areaM2: Number(createForm.areaM2),
        isFurnished: createForm.isFurnished,
        availableFrom: createForm.availableFrom,
        contractType: createForm.contractType,
        status: createForm.status,
      };

      const created = await createProperty(payload);
      setSuccessMessage(`Inmueble creado: ${created.id}`);
      setCreateForm(initialCreateState());
    } catch (error) {
      setCreateError(getErrorMessage(error, "No se pudo crear el inmueble."));
    } finally {
      setIsCreating(false);
    }
  }

  async function handlePatchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPatchError(null);
    setSuccessMessage(null);
    setIsPatching(true);

    try {
      const payload: PropertyPatchRequest = {
        title: patchForm.title || undefined,
        description: patchForm.description || undefined,
        city: patchForm.city || undefined,
        neighborhood: patchForm.neighborhood || undefined,
        address: patchForm.address || undefined,
        monthlyPrice: maybeNumber(patchForm.monthlyPrice),
        depositAmount: maybeNumber(patchForm.depositAmount),
        bedrooms: maybeInt(patchForm.bedrooms),
        bathrooms: maybeInt(patchForm.bathrooms),
        areaM2: maybeNumber(patchForm.areaM2),
        isFurnished:
          patchForm.isFurnished === "true" ? true : patchForm.isFurnished === "false" ? false : undefined,
        availableFrom: patchForm.availableFrom || undefined,
        contractType: patchForm.contractType || undefined,
        status: patchForm.status || undefined,
      };

      const updated = await patchProperty(patchForm.id.trim(), payload);
      setSuccessMessage(`Inmueble actualizado: ${updated.id}`);
      setPatchForm(initialPatchState());
    } catch (error) {
      setPatchError(getErrorMessage(error, "No se pudo editar el inmueble."));
    } finally {
      setIsPatching(false);
    }
  }

  return (
    <section className="property-management-panel" aria-label="Gestion de inmuebles">
      <header className="property-management-header">
        <h1>Panel propietario</h1>
        <p className="guard-message">Crea y edita inmuebles con los endpoints protegidos del backend.</p>
      </header>

      {successMessage ? <p className="property-success">{successMessage}</p> : null}

      <div className="property-management-grid">
        <form className="property-form" onSubmit={handleCreateSubmit}>
          <h2>Crear inmueble</h2>
          <label>
            Titulo
            <input
              value={createForm.title}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, title: event.target.value }))}
              required
            />
          </label>
          <label>
            Descripcion
            <textarea
              value={createForm.description}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, description: event.target.value }))}
              rows={3}
            />
          </label>
          <label>
            Ciudad
            <input
              value={createForm.city}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, city: event.target.value }))}
              required
            />
          </label>
          <label>
            Barrio
            <input
              value={createForm.neighborhood}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, neighborhood: event.target.value }))}
            />
          </label>
          <label>
            Direccion
            <input
              value={createForm.address}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, address: event.target.value }))}
            />
          </label>
          <div className="property-form-inline">
            <label>
              Precio mensual
              <input
                type="number"
                min={1}
                step="0.01"
                value={createForm.monthlyPrice}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, monthlyPrice: event.target.value }))}
                required
              />
            </label>
            <label>
              Deposito
              <input
                type="number"
                min={0}
                step="0.01"
                value={createForm.depositAmount}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, depositAmount: event.target.value }))}
                required
              />
            </label>
          </div>
          <div className="property-form-inline">
            <label>
              Habitaciones
              <input
                type="number"
                min={0}
                value={createForm.bedrooms}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, bedrooms: event.target.value }))}
                required
              />
            </label>
            <label>
              Banos
              <input
                type="number"
                min={0}
                value={createForm.bathrooms}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, bathrooms: event.target.value }))}
                required
              />
            </label>
            <label>
              m2
              <input
                type="number"
                min={1}
                step="0.1"
                value={createForm.areaM2}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, areaM2: event.target.value }))}
                required
              />
            </label>
          </div>
          <div className="property-form-inline">
            <label>
              Disponible desde
              <input
                type="date"
                value={createForm.availableFrom}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, availableFrom: event.target.value }))}
                required
              />
            </label>
            <label>
              Tipo de contrato
              <select
                value={createForm.contractType}
                onChange={(event) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    contractType: event.target.value as PropertyUpsertRequest["contractType"],
                  }))
                }
              >
                {CONTRACT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Estado
              <select
                value={createForm.status}
                onChange={(event) =>
                  setCreateForm((prev) => ({ ...prev, status: event.target.value as PropertyUpsertRequest["status"] }))
                }
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="property-checkbox">
            <input
              type="checkbox"
              checked={createForm.isFurnished}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, isFurnished: event.target.checked }))}
            />
            Amueblado
          </label>
          {createError ? <p className="property-error">{createError}</p> : null}
          <button className="btn-save" type="submit" disabled={!canCreate || isCreating}>
            {isCreating ? "Creando..." : "Crear inmueble"}
          </button>
        </form>

        <form className="property-form" onSubmit={handlePatchSubmit}>
          <h2>Editar inmueble</h2>
          <label>
            ID del inmueble
            <input
              value={patchForm.id}
              onChange={(event) => setPatchForm((prev) => ({ ...prev, id: event.target.value }))}
              placeholder="UUID"
              required
            />
          </label>
          <p className="guard-message">Solo completa los campos que quieras actualizar.</p>
          <label>
            Titulo
            <input value={patchForm.title} onChange={(event) => setPatchForm((prev) => ({ ...prev, title: event.target.value }))} />
          </label>
          <label>
            Descripcion
            <textarea
              value={patchForm.description}
              onChange={(event) => setPatchForm((prev) => ({ ...prev, description: event.target.value }))}
              rows={3}
            />
          </label>
          <label>
            Ciudad
            <input value={patchForm.city} onChange={(event) => setPatchForm((prev) => ({ ...prev, city: event.target.value }))} />
          </label>
          <label>
            Barrio
            <input
              value={patchForm.neighborhood}
              onChange={(event) => setPatchForm((prev) => ({ ...prev, neighborhood: event.target.value }))}
            />
          </label>
          <label>
            Direccion
            <input value={patchForm.address} onChange={(event) => setPatchForm((prev) => ({ ...prev, address: event.target.value }))} />
          </label>
          <div className="property-form-inline">
            <label>
              Precio mensual
              <input
                type="number"
                min={1}
                step="0.01"
                value={patchForm.monthlyPrice}
                onChange={(event) => setPatchForm((prev) => ({ ...prev, monthlyPrice: event.target.value }))}
              />
            </label>
            <label>
              Deposito
              <input
                type="number"
                min={0}
                step="0.01"
                value={patchForm.depositAmount}
                onChange={(event) => setPatchForm((prev) => ({ ...prev, depositAmount: event.target.value }))}
              />
            </label>
          </div>
          <div className="property-form-inline">
            <label>
              Habitaciones
              <input
                type="number"
                min={0}
                value={patchForm.bedrooms}
                onChange={(event) => setPatchForm((prev) => ({ ...prev, bedrooms: event.target.value }))}
              />
            </label>
            <label>
              Banos
              <input
                type="number"
                min={0}
                value={patchForm.bathrooms}
                onChange={(event) => setPatchForm((prev) => ({ ...prev, bathrooms: event.target.value }))}
              />
            </label>
            <label>
              m2
              <input
                type="number"
                min={1}
                step="0.1"
                value={patchForm.areaM2}
                onChange={(event) => setPatchForm((prev) => ({ ...prev, areaM2: event.target.value }))}
              />
            </label>
          </div>
          <div className="property-form-inline">
            <label>
              Disponible desde
              <input
                type="date"
                value={patchForm.availableFrom}
                onChange={(event) => setPatchForm((prev) => ({ ...prev, availableFrom: event.target.value }))}
              />
            </label>
            <label>
              Tipo de contrato
              <select
                value={patchForm.contractType}
                onChange={(event) =>
                  setPatchForm((prev) => ({
                    ...prev,
                    contractType: event.target.value as PatchFormState["contractType"],
                  }))
                }
              >
                <option value="">Sin cambios</option>
                {CONTRACT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Estado
              <select
                value={patchForm.status}
                onChange={(event) =>
                  setPatchForm((prev) => ({ ...prev, status: event.target.value as PatchFormState["status"] }))
                }
              >
                <option value="">Sin cambios</option>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Amueblado
            <select
              value={patchForm.isFurnished}
              onChange={(event) => setPatchForm((prev) => ({ ...prev, isFurnished: event.target.value as PatchFormState["isFurnished"] }))}
            >
              <option value="">Sin cambios</option>
              <option value="true">Si</option>
              <option value="false">No</option>
            </select>
          </label>
          {patchError ? <p className="property-error">{patchError}</p> : null}
          <button className="btn-save" type="submit" disabled={patchForm.id.trim().length === 0 || isPatching}>
            {isPatching ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </div>
    </section>
  );
}
