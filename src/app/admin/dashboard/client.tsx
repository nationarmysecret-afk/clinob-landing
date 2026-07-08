"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";

interface SiteContent {
  id: string;
  section: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
}

interface Doctor {
  id: string;
  sortOrder: number;
  firstName: string;
  lastName: string;
  specialty: string;
  bio: string;
  linkUrl: string;
  photoUrl: string | null;
  isActive: boolean;
}

interface Props {
  content: SiteContent[];
  doctors: Doctor[];
  contacts: Record<string, string>;
}

function ConfirmModal({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-clinob-text">{title}</h3>
        <p className="mt-2 text-sm text-clinob-text-light">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export function DashboardClient({ content: initialContent, doctors: initialDoctors, contacts: initialContacts }: Props) {
  const [content, setContent] = useState(initialContent);
  const [doctors, setDoctors] = useState(initialDoctors);
  const [contacts, setContacts] = useState(initialContacts);
  const [message, setMessage] = useState("");
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingContact, setEditingContact] = useState<string | null>(null);
  const [editingDoctor, setEditingDoctor] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  function CropModal({
  open,
  imageUrl,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  imageUrl: string;
  onConfirm: (croppedArea: Area, croppedAreaPixels: Area) => void;
  onCancel: () => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-clinob-text">Recortar foto</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <p className="mb-4 text-sm text-clinob-text-light">
          Arrastra la imagen para ajustar el recorte. El área de recorte es circular y se redimensionará a 400x400 píxeles.
        </p>

        <div className="relative h-96 w-full overflow-hidden rounded-lg bg-gray-100">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            cropShape="round"
            showGrid={false}
            classes={{
              containerClassName: "relative",
              cropAreaClassName: "border-2 border-white shadow-lg",
            }}
          />
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Zoom:</span>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-32 accent-clinob-green"
              />
              <span className="text-sm text-gray-600">{zoom.toFixed(1)}x</span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              onClick={() => croppedAreaPixels && onConfirm(croppedAreaPixels, croppedAreaPixels)}
              disabled={!croppedAreaPixels}
              className="rounded-lg bg-clinob-green px-5 py-2.5 text-sm font-medium text-white hover:bg-clinob-green-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar recorte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
const [uploadingPhoto, setUploadingPhoto] = useState<string | null>(null);
  const [croppingPhoto, setCroppingPhoto] = useState<{
    doctorId: string;
    tempUrl: string;
  } | null>(null);
  const [croppingLoading, setCroppingLoading] = useState(false);

  async function reload() {
    try {
      const [cr, dr, ctr] = await Promise.all([
        fetch("/api/content"),
        fetch("/api/doctors"),
        fetch("/api/contact"),
      ]);
      if (cr.ok) setContent(await cr.json());
      if (dr.ok) setDoctors(await dr.json());
      if (ctr.ok) setContacts(await ctr.json());
    } catch {
      setMessage("❌ Error al recargar datos");
    }
  }

  async function doFetch(url: string, method: string, body: object) {
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async function saveSection(sectionId: string, e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading("section");
    const fd = new FormData(e.currentTarget);
    const ok = await doFetch("/api/content", "PUT", {
      id: sectionId,
      title: fd.get("title"),
      subtitle: fd.get("subtitle"),
      description: fd.get("description"),
    });
    if (ok) { setMessage("✅ Sección actualizada"); setEditingSection(null); reload(); }
    else setMessage("❌ Error al guardar la sección");
    setLoading(null);
  }

  async function saveContactItem(key: string, e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading("contact");
    const fd = new FormData(e.currentTarget);
    const ok = await doFetch("/api/contact", "PUT", { key, value: fd.get("value") });
    if (ok) { setMessage("✅ Contacto actualizado"); setEditingContact(null); reload(); }
    else setMessage("❌ Error al guardar el contacto");
    setLoading(null);
  }

  async function addNewDoctor(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading("add-doctor");
    const fd = new FormData(e.currentTarget);
    const ok = await doFetch("/api/doctors", "POST", {
      firstName: fd.get("firstName"),
      lastName: fd.get("lastName"),
      specialty: fd.get("specialty"),
      bio: fd.get("bio"),
      linkUrl: fd.get("linkUrl") || "https://google.com",
    });
    if (ok) { setMessage("✅ Doctor agregado"); (e.target as HTMLFormElement).reset(); reload(); }
    else setMessage("❌ Error al agregar doctor");
    setLoading(null);
  }

  async function updateExistingDoctor(doctorId: string, e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(`edit-${doctorId}`);
    const fd = new FormData(e.currentTarget);
    const ok = await doFetch(`/api/doctors/${doctorId}`, "PUT", {
      firstName: fd.get("firstName"),
      lastName: fd.get("lastName"),
      specialty: fd.get("specialty"),
      bio: fd.get("bio"),
      linkUrl: fd.get("linkUrl") || "https://google.com",
    });
    if (ok) { setMessage("✅ Doctor actualizado"); setEditingDoctor(null); reload(); }
    else setMessage("❌ Error al actualizar doctor");
    setLoading(null);
  }

  async function uploadDoctorPhoto(doctorId: string, file: File) {
    if (!file) return;
    
    setUploadingPhoto(doctorId);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al subir la imagen");
      }
      
      const { url } = await response.json();
      
      // Abrir modal de recorte en lugar de actualizar directamente
      setCroppingPhoto({
        doctorId,
        tempUrl: url,
      });
      
    } catch (error) {
      console.error("Error uploading photo:", error);
      setMessage(`❌ ${error instanceof Error ? error.message : "Error al subir la foto"}`);
    } finally {
      setUploadingPhoto(null);
    }
  }

  async function handleCropComplete(croppedAreaPixels: Area) {
    if (!croppingPhoto) return;
    
    setCroppingLoading(true);
    
    try {
      const { doctorId, tempUrl } = croppingPhoto;
      
      // Enviar las coordenadas de recorte al servidor
      const response = await fetch("/api/crop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tempUrl,
          x: Math.round(croppedAreaPixels.x),
          y: Math.round(croppedAreaPixels.y),
          width: Math.round(croppedAreaPixels.width),
          height: Math.round(croppedAreaPixels.height),
        }),
        credentials: "include",
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al procesar el recorte");
      }
      
      const { url } = await response.json();
      
      // Actualizar el doctor con la URL recortada
      const updateResponse = await fetch(`/api/doctors/${doctorId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoUrl: url }),
        credentials: "include",
      });
      
      if (updateResponse.ok) {
        setMessage("✅ Foto recortada y actualizada");
        reload();
        setCroppingPhoto(null);
      } else {
        setMessage("❌ Error al actualizar la foto del doctor");
      }
      
    } catch (error) {
      console.error("Error processing crop:", error);
      setMessage(`❌ ${error instanceof Error ? error.message : "Error al procesar el recorte"}`);
    } finally {
      }

  async function removeDoctor(id: string) {
    setLoading(`delete-${id}`);
    setConfirmDelete(null);
    const ok = await doFetch(`/api/doctors/${id}`, "DELETE", {});
    if (ok) { setMessage("✅ Doctor eliminado"); reload(); }
    else setMessage("❌ Error al eliminar doctor");
    setLoading(null);
  }
    <div className="space-y-10">
      <h1 className="text-2xl font-bold text-clinob-text">Panel de Administración</h1>

      <ConfirmModal
        open={confirmDelete !== null}
        title="Eliminar doctor"
        message="¿Estás seguro de que deseas eliminar este doctor? Esta acción no se puede deshacer."
        onConfirm={() => confirmDelete && removeDoctor(confirmDelete)}
        onCancel={() => { setConfirmDelete(null); setLoading(null); }}
      />

      <CropModal
        open={croppingPhoto !== null}
        imageUrl={croppingPhoto?.tempUrl || ""}
        onConfirm={handleCropComplete}
        onCancel={() => setCroppingPhoto(null)}
      />

      {message && (
        <div className="flex items-center justify-between rounded-xl bg-white px-5 py-3 text-sm font-medium shadow-sm ring-1 ring-gray-200">
          <span>{message}</span>
          <button onClick={() => setMessage("")} className="ml-3 text-gray-400 hover:text-gray-600">✕</button>
        </div>
      )}

      {/* Site Content */}
      <section>
        <h2 className="mb-5 text-xl font-semibold text-clinob-text">Contenido del sitio</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {content.map((s) => (
            <div key={s.id} className="rounded-xl bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-lg font-semibold text-clinob-green-dark capitalize">
                {s.section === "hero" ? "Hero (Portada)" : "Sobre Nosotros"}
              </h3>

              {editingSection === s.id ? (
                <form onSubmit={(e) => saveSection(s.id, e)} className="space-y-3">
                  <input name="title" defaultValue={s.title || ""} className="w-full rounded-lg border px-3 py-2 text-sm border-gray-200" placeholder="Título" />
                  <input name="subtitle" defaultValue={s.subtitle || ""} className="w-full rounded-lg border px-3 py-2 text-sm border-gray-200" placeholder="Subtítulo" />
                  <textarea name="description" defaultValue={s.description || ""} className="w-full rounded-lg border px-3 py-2 text-sm border-gray-200" rows={4} placeholder="Descripción" />
                  <div className="flex gap-2">
                    <button type="submit" disabled={loading === "section"} className="rounded-lg bg-clinob-green px-4 py-2 text-sm font-medium text-white hover:bg-clinob-green-dark disabled:opacity-50">
                      {loading === "section" ? "Guardando..." : "Guardar"}
                    </button>
                    <button type="button" onClick={() => setEditingSection(null)} className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200">Cancelar</button>
                  </div>
                </form>
              ) : (
                <div>
                  {s.title && <p className="text-sm"><span className="font-medium">Título:</span> {s.title}</p>}
                  {s.subtitle && <p className="mt-1 text-sm"><span className="font-medium">Subtítulo:</span> {s.subtitle}</p>}
                  {s.description && <p className="mt-1 text-sm text-clinob-text-light line-clamp-3">{s.description}</p>}
                  <button type="button" onClick={() => setEditingSection(s.id)} className="mt-3 text-sm font-medium text-clinob-blue-dark hover:underline">Editar</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Info */}
      <section>
        <h2 className="mb-5 text-xl font-semibold text-clinob-text">Información de Contacto</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {Object.entries(contacts).map(([key, value]) => (
            <div key={key} className="rounded-xl bg-white p-5 shadow-sm">
              <h3 className="mb-2 font-semibold capitalize text-clinob-text">
                {key === "address" ? "Dirección" : key === "phone" ? "Teléfono" : "Correo"}
              </h3>
              {editingContact === key ? (
                <form onSubmit={(e) => saveContactItem(key, e)} className="space-y-2">
                  <input type="hidden" name="key" value={key} />
                  <input type="text" name="value" defaultValue={value} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" autoFocus />
                  <div className="flex gap-2">
                    <button type="submit" disabled={loading === "contact"} className="rounded-lg bg-clinob-green px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
                      {loading === "contact" ? "Guardando..." : "Guardar"}
                    </button>
                    <button type="button" onClick={() => setEditingContact(null)} className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">Cancelar</button>
                  </div>
                </form>
              ) : (
                <div>
                  <p className="text-sm text-clinob-text-light">{value}</p>
                  <button type="button" onClick={() => setEditingContact(key)} className="mt-2 text-xs font-medium text-clinob-blue-dark hover:underline">Editar</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Doctors */}
      <section>
        <div className="mb-5">
          <h2 className="mb-4 text-xl font-semibold text-clinob-text">Doctores ({doctors.length})</h2>

          <details className="rounded-xl bg-white p-5 shadow-sm">
            <summary className="cursor-pointer font-medium text-clinob-green hover:text-clinob-green-dark">+ Agregar nuevo doctor</summary>
            <form onSubmit={addNewDoctor} className="mt-4 grid gap-4 md:grid-cols-2">
              <input type="text" name="firstName" required placeholder="Nombre" className="rounded-lg border border-gray-200 px-3 py-2 text-sm" />
              <input type="text" name="lastName" required placeholder="Apellido" className="rounded-lg border border-gray-200 px-3 py-2 text-sm" />
              <input type="text" name="specialty" required placeholder="Especialidad" className="rounded-lg border border-gray-200 px-3 py-2 text-sm" />
              <input type="text" name="linkUrl" placeholder="URL de redirección (default: Google)" className="rounded-lg border border-gray-200 px-3 py-2 text-sm" />
              <textarea name="bio" required placeholder="Biografía" className="col-span-full rounded-lg border border-gray-200 px-3 py-2 text-sm" rows={3} />
              <button type="submit" disabled={loading === "add-doctor"} className="col-span-full rounded-lg bg-clinob-green px-5 py-2 text-sm font-medium text-white hover:bg-clinob-green-dark disabled:opacity-50">
                {loading === "add-doctor" ? "Agregando..." : "Agregar doctor"}
              </button>
            </form>
          </details>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doc) => (
            <div key={doc.id} className="rounded-xl bg-white p-5 shadow-sm">
              {editingDoctor === doc.id ? (
                <form onSubmit={(e) => updateExistingDoctor(doc.id, e)} className="space-y-2">
                  {/* Preview de la foto actual */}
                  <div className="flex items-center justify-center mb-3">
                    {doc.photoUrl ? (
                      <div className="relative h-24 w-24 overflow-hidden rounded-full">
                        <img
                          src={doc.photoUrl}
                          alt={`${doc.firstName} ${doc.lastName}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-clinob-green/20 to-clinob-blue/20 text-2xl font-bold text-clinob-green-dark">
                        {doc.firstName[0]}{doc.lastName[0]}
                      </div>
                    )}
                  </div>

                  {/* Input para subir nueva foto */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Subir nueva foto</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        id={`photo-${doc.id}`}
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            uploadDoctorPhoto(doc.id, file);
                          }
                        }}
                      />
                      <label
                        htmlFor={`photo-${doc.id}`}
                        className={`flex-1 text-center rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium cursor-pointer ${
                          uploadingPhoto === doc.id 
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {uploadingPhoto === doc.id ? 'Subiendo...' : 'Seleccionar imagen'}
                      </label>
                      <button
                        type="button"
                        onClick={() => document.getElementById(`photo-${doc.id}`)?.click()}
                        disabled={uploadingPhoto === doc.id}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                          uploadingPhoto === doc.id
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                            : 'bg-clinob-green text-white hover:bg-clinob-green-dark'
                        }`}
                      >
                        {uploadingPhoto === doc.id ? 'Subiendo...' : 'Subir'}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Formatos: JPG, PNG, WebP, GIF • Máx: 5MB
                    </p>
                  </div>

                  <input name="firstName" defaultValue={doc.firstName} className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm" />
                  <input name="lastName" defaultValue={doc.lastName} className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm" />
                  <input name="specialty" defaultValue={doc.specialty} className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm" />
                  <input name="linkUrl" defaultValue={doc.linkUrl} className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm" placeholder="URL" />
                  <textarea name="bio" defaultValue={doc.bio} className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm" rows={3} />
                  <div className="flex gap-2">
                    <button type="submit" disabled={loading === `edit-${doc.id}`} className="rounded-lg bg-clinob-green px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
                      {loading === `edit-${doc.id}` ? "Guardando..." : "Guardar"}
                    </button>
                    <button type="button" onClick={() => setEditingDoctor(null)} className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">Cancelar</button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="mb-2 flex items-center gap-3">
                    {doc.photoUrl ? (
                      <div className="relative h-12 w-12 overflow-hidden rounded-full">
                        <img
                          src={doc.photoUrl}
                          alt={`${doc.firstName} ${doc.lastName}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-clinob-green/20 to-clinob-blue/20 text-sm font-bold text-clinob-green-dark">
                        {doc.firstName[0]}{doc.lastName[0]}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-clinob-text">{doc.firstName} {doc.lastName}</p>
                      <p className="text-xs text-clinob-green-dark">{doc.specialty}</p>
                    </div>
                  </div>
                  <p className="text-xs text-clinob-text-light line-clamp-2">{doc.bio}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <button type="button" onClick={() => setEditingDoctor(doc.id)} className="text-xs font-medium text-clinob-blue-dark hover:underline">Editar</button>
                    <button type="button" onClick={() => { setConfirmDelete(doc.id); }} className="text-xs font-medium text-red-500 hover:underline">
                      {loading === `delete-${doc.id}` ? "Eliminando..." : "Eliminar"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
