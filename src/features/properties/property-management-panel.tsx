"use client";

import { useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { env } from "@/config/env";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createProperty,
  listPropertyImages,
  patchProperty,
  reorderPropertyImages,
  uploadPropertyImages,
  type PropertyImageResponse,
  type PropertyPatchRequest,
  type PropertyUpsertRequest,
} from "@/features/properties/api";
import { getErrorMessage } from "@/features/observability/errors";

const CONTRACT_OPTIONS: PropertyUpsertRequest["contractType"][] = ["long_term", "temporary", "monthly"];
const STATUS_OPTIONS: PropertyUpsertRequest["status"][] = ["pendiente", "publicado", "rechazado"];

const createPropertySchema = z.object({
  title: z.string().trim().min(1, "Titulo obligatorio."),
  description: z.string().trim().optional(),
  city: z.string().trim().min(1, "Ciudad obligatoria."),
  neighborhood: z.string().trim().optional(),
  address: z.string().trim().optional(),
  monthlyPrice: z.number().positive("El precio mensual debe ser mayor a 0."),
  depositAmount: z.number().min(0, "El deposito no puede ser negativo."),
  bedrooms: z.number().int().min(0, "Habitaciones invalidas."),
  bathrooms: z.number().int().min(0, "Banos invalidos."),
  areaM2: z.number().positive("El area debe ser mayor a 0."),
  isFurnished: z.boolean(),
  availableFrom: z.string().min(1, "Fecha obligatoria."),
  contractType: z.enum(["long_term", "temporary", "monthly"]),
  status: z.enum(["pendiente", "publicado", "rechazado"]),
});

const patchPropertySchema = z.object({
  id: z.string().trim().min(1, "ID obligatorio."),
  title: z.string().optional(),
  description: z.string().optional(),
  city: z.string().optional(),
  neighborhood: z.string().optional(),
  address: z.string().optional(),
  monthlyPrice: z.union([z.number(), z.nan()]).optional(),
  depositAmount: z.union([z.number(), z.nan()]).optional(),
  bedrooms: z.union([z.number(), z.nan()]).optional(),
  bathrooms: z.union([z.number(), z.nan()]).optional(),
  areaM2: z.union([z.number(), z.nan()]).optional(),
  isFurnished: z.enum(["", "true", "false"]),
  availableFrom: z.string().optional(),
  contractType: z.enum(["", "long_term", "temporary", "monthly"]),
  status: z.enum(["", "pendiente", "publicado", "rechazado"]),
});

const gallerySchema = z.object({
  propertyId: z.string().trim().min(1, "ID del inmueble obligatorio."),
  files: z.array(z.instanceof(File)).min(1, "Selecciona al menos una imagen.").max(15, "Maximo 15 imagenes."),
});

type CreatePropertyFormValues = z.infer<typeof createPropertySchema>;
type PatchPropertyFormValues = z.infer<typeof patchPropertySchema>;
type GalleryFormValues = z.infer<typeof gallerySchema>;

function todayIsoDate(): string {
  const now = new Date();
  const timezoneOffsetMs = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - timezoneOffsetMs).toISOString().slice(0, 10);
}

function initialCreateValues(): CreatePropertyFormValues {
  return {
    title: "",
    description: undefined,
    city: "",
    neighborhood: undefined,
    address: undefined,
    monthlyPrice: 0,
    depositAmount: 0,
    bedrooms: 0,
    bathrooms: 0,
    areaM2: 0,
    isFurnished: false,
    availableFrom: todayIsoDate(),
    contractType: "long_term",
    status: "pendiente",
  };
}

function initialPatchValues(): PatchPropertyFormValues {
  return {
    id: "",
    title: "",
    description: "",
    city: "",
    neighborhood: "",
    address: "",
    monthlyPrice: Number.NaN,
    depositAmount: Number.NaN,
    bedrooms: Number.NaN,
    bathrooms: Number.NaN,
    areaM2: Number.NaN,
    isFurnished: "",
    availableFrom: "",
    contractType: "",
    status: "",
  };
}

function initialGalleryValues(): GalleryFormValues {
  return {
    propertyId: "",
    files: [],
  };
}

function maybeNumber(value: number | undefined): number | undefined {
  if (value === undefined || Number.isNaN(value)) {
    return undefined;
  }
  return value;
}

function maybeInt(value: number | undefined): number | undefined {
  if (value === undefined || Number.isNaN(value)) {
    return undefined;
  }
  return Number.parseInt(String(value), 10);
}

function maybeText(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function PropertyManagementPanel() {
  const [createError, setCreateError] = useState<string | null>(null);
  const [patchError, setPatchError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [gallery, setGallery] = useState<PropertyImageResponse[]>([]);
  const [imagesError, setImagesError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isPatching, setIsPatching] = useState(false);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  const createForm = useForm<CreatePropertyFormValues>({
    resolver: zodResolver(createPropertySchema),
    mode: "onChange",
    defaultValues: initialCreateValues(),
  });
  const patchForm = useForm<PatchPropertyFormValues>({
    resolver: zodResolver(patchPropertySchema),
    mode: "onChange",
    defaultValues: initialPatchValues(),
  });
  const galleryForm = useForm<GalleryFormValues>({
    resolver: zodResolver(gallerySchema),
    mode: "onChange",
    defaultValues: initialGalleryValues(),
  });

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: createFormErrors, isValid: isCreateValid },
  } = createForm;
  const {
    register: registerPatch,
    handleSubmit: handleSubmitPatch,
    reset: resetPatch,
    setValue: setPatchValue,
    formState: { errors: patchFormErrors, isValid: isPatchValid },
  } = patchForm;
  const {
    register: registerGallery,
    handleSubmit: handleSubmitGallery,
    reset: resetGallery,
    setValue: setGalleryValue,
    getValues: getGalleryValues,
    formState: { errors: galleryFormErrors, isValid: isGalleryValid },
  } = galleryForm;

  const galleryPropertyId = getGalleryValues("propertyId");
  const galleryPropertyIdField = registerGallery("propertyId");
  const galleryFilesField = registerGallery("files", {
    setValueAs: (value: FileList | null) => Array.from(value ?? []),
  });

  async function handleCreateSubmit(values: CreatePropertyFormValues) {
    setCreateError(null);
    setSuccessMessage(null);
    setIsCreating(true);

    try {
      const payload: PropertyUpsertRequest = {
        title: values.title,
        description: values.description ?? "",
        city: values.city,
        neighborhood: values.neighborhood ?? "",
        address: values.address ?? "",
        monthlyPrice: values.monthlyPrice,
        depositAmount: values.depositAmount,
        bedrooms: values.bedrooms,
        bathrooms: values.bathrooms,
        areaM2: values.areaM2,
        isFurnished: values.isFurnished,
        availableFrom: values.availableFrom,
        contractType: values.contractType,
        status: values.status,
      };

      const created = await createProperty(payload);
      setSuccessMessage(`Inmueble creado: ${created.id}`);
      resetCreate(initialCreateValues());
    } catch (error) {
      setCreateError(getErrorMessage(error, "No se pudo crear el inmueble."));
    } finally {
      setIsCreating(false);
    }
  }

  async function handlePatchSubmit(values: PatchPropertyFormValues) {
    setPatchError(null);
    setSuccessMessage(null);
    setIsPatching(true);

    try {
      const payload: PropertyPatchRequest = {
        title: maybeText(values.title),
        description: maybeText(values.description),
        city: maybeText(values.city),
        neighborhood: maybeText(values.neighborhood),
        address: maybeText(values.address),
        monthlyPrice: maybeNumber(values.monthlyPrice),
        depositAmount: maybeNumber(values.depositAmount),
        bedrooms: maybeInt(values.bedrooms),
        bathrooms: maybeInt(values.bathrooms),
        areaM2: maybeNumber(values.areaM2),
        isFurnished: values.isFurnished === "true" ? true : values.isFurnished === "false" ? false : undefined,
        availableFrom: maybeText(values.availableFrom),
        contractType: values.contractType || undefined,
        status: values.status || undefined,
      };

      const updated = await patchProperty(values.id.trim(), payload);
      setSuccessMessage(`Inmueble actualizado: ${updated.id}`);
      setGalleryValue("propertyId", values.id.trim(), { shouldValidate: true });
      resetPatch(initialPatchValues());
    } catch (error) {
      setPatchError(getErrorMessage(error, "No se pudo editar el inmueble."));
    } finally {
      setIsPatching(false);
    }
  }

  async function loadGallery(propertyId: string) {
    setImagesError(null);
    setIsLoadingGallery(true);

    try {
      const loaded = await listPropertyImages(propertyId);
      setGallery(loaded.sort((a, b) => a.displayOrder - b.displayOrder));
    } catch (error) {
      setImagesError(getErrorMessage(error, "No se pudo cargar la galeria."));
    } finally {
      setIsLoadingGallery(false);
    }
  }

  async function handleUploadImages(values: GalleryFormValues) {
    setImagesError(null);
    setSuccessMessage(null);
    setIsUploadingImages(true);

    try {
      await uploadPropertyImages(values.propertyId.trim(), values.files);
      await loadGallery(values.propertyId.trim());
      resetGallery({ propertyId: values.propertyId.trim(), files: [] });
      setSuccessMessage("Imagenes subidas correctamente.");
    } catch (error) {
      setImagesError(getErrorMessage(error, "No se pudieron subir las imagenes."));
    } finally {
      setIsUploadingImages(false);
    }
  }

  async function handleSaveImageOrder(propertyId: string) {
    if (propertyId.trim().length === 0) {
      setImagesError("Ingresa el ID del inmueble para guardar el orden.");
      return;
    }

    setImagesError(null);
    setSuccessMessage(null);
    setIsSavingOrder(true);

    try {
      const payload = gallery.map((image) => ({ imageId: image.id, displayOrder: image.displayOrder }));
      const reordered = await reorderPropertyImages(propertyId.trim(), payload);
      setGallery(reordered.sort((a, b) => a.displayOrder - b.displayOrder));
      setSuccessMessage("Orden de imagenes actualizado.");
    } catch (error) {
      setImagesError(getErrorMessage(error, "No se pudo guardar el orden de imagenes."));
    } finally {
      setIsSavingOrder(false);
    }
  }

  function updateDisplayOrder(imageId: string, displayOrder: number) {
    setGallery((prev) =>
      prev
        .map((image) => (image.id === imageId ? { ...image, displayOrder } : image))
        .sort((a, b) => a.displayOrder - b.displayOrder)
    );
  }

  function buildImageUrl(publicUrl: string): string {
    const baseUrl = env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
    return publicUrl.startsWith("http") ? publicUrl : `${baseUrl}${publicUrl}`;
  }

  return (
    <section className="property-management-panel" aria-label="Gestion de inmuebles">
      <header className="property-management-header">
        <h1>Panel propietario</h1>
        <p className="guard-message">Crea y edita inmuebles con los endpoints protegidos del backend.</p>
      </header>

      {successMessage ? <p className="property-success">{successMessage}</p> : null}

      <div className="property-management-grid">
        <form className="property-form" onSubmit={handleSubmitCreate(handleCreateSubmit)}>
          <h2>Crear inmueble</h2>
          <Label>
            Titulo
            <Input {...registerCreate("title")} />
          </Label>
          {createFormErrors.title ? <p className="property-error">{createFormErrors.title.message}</p> : null}
          <Label>
            Descripcion
            <Textarea rows={3} {...registerCreate("description")} />
          </Label>
          <Label>
            Ciudad
            <Input {...registerCreate("city")} />
          </Label>
          {createFormErrors.city ? <p className="property-error">{createFormErrors.city.message}</p> : null}
          <Label>
            Barrio
            <Input {...registerCreate("neighborhood")} />
          </Label>
          <Label>
            Direccion
            <Input {...registerCreate("address")} />
          </Label>
          <div className="property-form-inline">
            <Label>
              Precio mensual
              <Input type="number" min={1} step="0.01" {...registerCreate("monthlyPrice", { valueAsNumber: true })} />
            </Label>
            <Label>
              Deposito
              <Input type="number" min={0} step="0.01" {...registerCreate("depositAmount", { valueAsNumber: true })} />
            </Label>
          </div>
          {createFormErrors.monthlyPrice ? <p className="property-error">{createFormErrors.monthlyPrice.message}</p> : null}
          {createFormErrors.depositAmount ? <p className="property-error">{createFormErrors.depositAmount.message}</p> : null}
          <div className="property-form-inline">
            <Label>
              Habitaciones
              <Input type="number" min={0} {...registerCreate("bedrooms", { valueAsNumber: true })} />
            </Label>
            <Label>
              Banos
              <Input type="number" min={0} {...registerCreate("bathrooms", { valueAsNumber: true })} />
            </Label>
            <Label>
              m2
              <Input type="number" min={1} step="0.1" {...registerCreate("areaM2", { valueAsNumber: true })} />
            </Label>
          </div>
          {createFormErrors.bedrooms ? <p className="property-error">{createFormErrors.bedrooms.message}</p> : null}
          {createFormErrors.bathrooms ? <p className="property-error">{createFormErrors.bathrooms.message}</p> : null}
          {createFormErrors.areaM2 ? <p className="property-error">{createFormErrors.areaM2.message}</p> : null}
          <div className="property-form-inline">
            <Label>
              Disponible desde
              <Input type="date" {...registerCreate("availableFrom")} />
            </Label>
            <Label>
              Tipo de contrato
              <select {...registerCreate("contractType")}>
                {CONTRACT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Label>
            <Label>
              Estado
              <select {...registerCreate("status")}>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Label>
          </div>
          {createFormErrors.availableFrom ? <p className="property-error">{createFormErrors.availableFrom.message}</p> : null}
          <Label className="property-checkbox">
            <Checkbox {...registerCreate("isFurnished")} />
            Amueblado
          </Label>
          {createError ? <p className="property-error">{createError}</p> : null}
          <Button className="btn-save" type="submit" disabled={!isCreateValid || isCreating}>
            {isCreating ? "Creando..." : "Crear inmueble"}
          </Button>
        </form>

        <form className="property-form" onSubmit={handleSubmitPatch(handlePatchSubmit)}>
          <h2>Editar inmueble</h2>
          <Label>
            ID del inmueble
            <Input placeholder="UUID" {...registerPatch("id")} />
          </Label>
          {patchFormErrors.id ? <p className="property-error">{patchFormErrors.id.message}</p> : null}
          <p className="guard-message">Solo completa los campos que quieras actualizar.</p>
          <Label>
            Titulo
            <Input {...registerPatch("title")} />
          </Label>
          <Label>
            Descripcion
            <Textarea rows={3} {...registerPatch("description")} />
          </Label>
          <Label>
            Ciudad
            <Input {...registerPatch("city")} />
          </Label>
          <Label>
            Barrio
            <Input {...registerPatch("neighborhood")} />
          </Label>
          <Label>
            Direccion
            <Input {...registerPatch("address")} />
          </Label>
          <div className="property-form-inline">
            <Label>
              Precio mensual
              <Input type="number" min={1} step="0.01" {...registerPatch("monthlyPrice", { valueAsNumber: true })} />
            </Label>
            <Label>
              Deposito
              <Input type="number" min={0} step="0.01" {...registerPatch("depositAmount", { valueAsNumber: true })} />
            </Label>
          </div>
          <div className="property-form-inline">
            <Label>
              Habitaciones
              <Input type="number" min={0} {...registerPatch("bedrooms", { valueAsNumber: true })} />
            </Label>
            <Label>
              Banos
              <Input type="number" min={0} {...registerPatch("bathrooms", { valueAsNumber: true })} />
            </Label>
            <Label>
              m2
              <Input type="number" min={1} step="0.1" {...registerPatch("areaM2", { valueAsNumber: true })} />
            </Label>
          </div>
          <div className="property-form-inline">
            <Label>
              Disponible desde
              <Input type="date" {...registerPatch("availableFrom")} />
            </Label>
            <Label>
              Tipo de contrato
              <select {...registerPatch("contractType")}>
                <option value="">Sin cambios</option>
                {CONTRACT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Label>
            <Label>
              Estado
              <select {...registerPatch("status")}>
                <option value="">Sin cambios</option>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Label>
          </div>
          <Label>
            Amueblado
            <select {...registerPatch("isFurnished")}>
              <option value="">Sin cambios</option>
              <option value="true">Si</option>
              <option value="false">No</option>
            </select>
          </Label>
          {patchError ? <p className="property-error">{patchError}</p> : null}
          <Button className="btn-save" type="submit" disabled={!isPatchValid || isPatching}>
            {isPatching ? "Guardando..." : "Guardar cambios"}
          </Button>
        </form>
      </div>

      <section className="property-form">
        <h2>Galeria del inmueble</h2>
        <p className="guard-message">Subida multiple (maximo 15), validacion de formato y tamano, y orden manual.</p>

        <form className="property-image-controls" onSubmit={handleSubmitGallery(handleUploadImages)}>
          <Label>
            ID del inmueble
            <Input
              placeholder="UUID"
              {...galleryPropertyIdField}
              onChange={(event) => {
                galleryPropertyIdField.onChange(event);
                setPatchValue("id", event.target.value, { shouldValidate: true });
              }}
            />
          </Label>
          {galleryFormErrors.propertyId ? <p className="property-error">{galleryFormErrors.propertyId.message}</p> : null}

          <Label>
            Imagenes
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              {...galleryFilesField}
            />
          </Label>
          {galleryFormErrors.files ? <p className="property-error">{galleryFormErrors.files.message}</p> : null}

          <div className="property-image-actions">
            <Button className="btn-save" type="submit" disabled={!isGalleryValid || isUploadingImages}>
              {isUploadingImages ? "Subiendo..." : "Subir imagenes"}
            </Button>
            <Button
              className="btn-link"
              variant="outline"
              type="button"
              onClick={() => void loadGallery(galleryPropertyId)}
              disabled={galleryPropertyId.trim().length === 0 || isLoadingGallery}
            >
              {isLoadingGallery ? "Cargando..." : "Cargar galeria"}
            </Button>
            <Button
              className="btn-link"
              variant="outline"
              type="button"
              onClick={() => void handleSaveImageOrder(galleryPropertyId)}
              disabled={gallery.length === 0 || isSavingOrder}
            >
              {isSavingOrder ? "Guardando..." : "Guardar orden"}
            </Button>
          </div>
        </form>

        {imagesError ? <p className="property-error">{imagesError}</p> : null}

        {gallery.length > 0 ? (
          <div className="property-gallery-grid">
            {gallery.map((image) => (
              <article key={image.id} className="property-gallery-item">
                <Image
                  src={buildImageUrl(image.publicUrl)}
                  alt="Imagen del inmueble"
                  className="property-gallery-image"
                  width={360}
                  height={220}
                />
                <div className="property-gallery-meta">
                  <span>{image.mimeType}</span>
                  <span>{Math.round(image.fileSizeBytes / 1024)} KB</span>
                </div>
                <Label>
                  Orden
                  <Input
                    type="number"
                    min={0}
                    value={image.displayOrder}
                    onChange={(event) => updateDisplayOrder(image.id, Number(event.target.value))}
                  />
                </Label>
              </article>
            ))}
          </div>
        ) : (
          <p className="guard-message">No hay imagenes cargadas para este inmueble.</p>
        )}
      </section>
    </section>
  );
}
