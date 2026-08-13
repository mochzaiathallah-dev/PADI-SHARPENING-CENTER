"use client";

import React, { useState, useEffect } from "react";
import { 
  getServices, 
  createService, 
  updateService, 
  deleteService, 
  translateTextAction 
} from "../actions";
import { compressMediaFile } from "../../../lib/compress";
import { Plus, Edit2, Trash2, Globe, Sparkles, Loader2, X, Image as ImageIcon } from "lucide-react";

type ServiceType = {
  id: string;
  name_id: string;
  name_en: string;
  slug: string;
  description_id: string;
  description_en: string;
  price: any;
  originalPrice: any | null;
  features_id: string | null;
  features_en: string | null;
  type: string;
  imageUrl: string | null;
};

export default function ManageServices() {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTranslatingName, setIsTranslatingName] = useState(false);
  const [isTranslatingDesc, setIsTranslatingDesc] = useState(false);
  const [isTranslatingFeatures, setIsTranslatingFeatures] = useState(false);

  // Form Modal States
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [nameId, setNameId] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [slug, setSlug] = useState("");
  const [descriptionId, setDescriptionId] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [featuresId, setFeaturesId] = useState("");
  const [featuresEn, setFeaturesEn] = useState("");
  const [type, setType] = useState("SHARPENING");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getServices();
      setServices(data as unknown as ServiceType[]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleNameIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNameId(val);
    if (!editingId) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
      );
    }
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setNameId("");
    setNameEn("");
    setSlug("");
    setDescriptionId("");
    setDescriptionEn("");
    setPrice("");
    setOriginalPrice("");
    setFeaturesId("");
    setFeaturesEn("");
    setType("SHARPENING");
    setImageUrl(null);
    setIsOpen(true);
  };

  const handleOpenEdit = (s: ServiceType) => {
    setEditingId(s.id);
    setNameId(s.name_id);
    setNameEn(s.name_en);
    setSlug(s.slug);
    setDescriptionId(s.description_id);
    setDescriptionEn(s.description_en);
    setPrice(String(s.price));
    setOriginalPrice(s.originalPrice ? String(s.originalPrice) : "");
    setFeaturesId(s.features_id || "");
    setFeaturesEn(s.features_en || "");
    setType(s.type);
    setImageUrl(s.imageUrl || null);
    setIsOpen(true);
  };

  const handleAutoTranslateName = async () => {
    if (!nameId) return;
    setIsTranslatingName(true);
    try {
      const res = await translateTextAction(nameId);
      if (res) setNameEn(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTranslatingName(false);
    }
  };

  const handleAutoTranslateDesc = async () => {
    if (!descriptionId) return;
    setIsTranslatingDesc(true);
    try {
      const res = await translateTextAction(descriptionId);
      if (res) setDescriptionEn(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTranslatingDesc(false);
    }
  };

  const handleAutoTranslateFeatures = async () => {
    if (!featuresId) return;
    setIsTranslatingFeatures(true);
    try {
      const res = await translateTextAction(featuresId);
      if (res) setFeaturesEn(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTranslatingFeatures(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsCompressing(true);
    try {
      const compressed = await compressMediaFile(file);
      setImageUrl(compressed);
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Gagal mengunggah gambar.");
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus layanan ini?")) {
      try {
        await deleteService(id);
        loadData();
      } catch (err) {
        console.error(err);
        alert("Gagal menghapus layanan.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameId || !nameEn || !slug || !descriptionId || !descriptionEn || !price) {
      alert("Kolom wajib harus diisi!");
      return;
    }

    setIsSaving(true);
    const payload = {
      name_id: nameId,
      name_en: nameEn,
      slug,
      description_id: descriptionId,
      description_en: descriptionEn,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      features_id: featuresId || null,
      features_en: featuresEn || null,
      type,
      imageUrl,
    };

    try {
      if (editingId) {
        await updateService(editingId, payload);
      } else {
        await createService(payload);
      }
      setIsOpen(false);
      loadData();
    } catch (err: any) {
      console.error(err);
      alert("Gagal menyimpan layanan: " + (err.message || "Error"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Kelola jasa asah, sewa pisau kuliner, dan program pengadaan komersial.
        </p>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/95 transition-all gap-1.5 cursor-pointer w-full sm:w-auto shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Layanan</span>
        </button>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        /* Data Table */
        <div className="rounded-2xl border border-border bg-card overflow-x-auto">
          <table className="w-full min-w-212.5 text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20 text-muted-foreground font-semibold">
                <th className="p-4">Nama Layanan (ID / EN)</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Harga Promo / Coret</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {services.length > 0 ? (
                services.map((s) => (
                  <tr key={s.id} className="hover:bg-accent/10 transition-colors">
                    <td className="p-4 space-y-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-10 bg-muted/50 rounded overflow-hidden border border-border flex items-center justify-center">
                          {s.imageUrl ? (
                            <img src={s.imageUrl} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="h-4 w-4 text-muted-foreground/60" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{s.name_id}</p>
                          <p className="text-xs text-muted-foreground italic flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            <span>{s.name_en}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-xs uppercase tracking-wide text-primary">
                      {s.type === "SHARPENING" && "Jasa Asah"}
                      {s.type === "RENTAL" && "Sewa & Peminjaman"}
                      {s.type === "PROCUREMENT" && "Pengadaan Alat"}
                      {s.type !== "SHARPENING" && s.type !== "RENTAL" && s.type !== "PROCUREMENT" && s.type.replace(/_/g, " ").replace(/-/g, " ").toUpperCase()}
                    </td>
                    <td className="p-4 font-semibold text-foreground space-y-0.5">
                      <div>
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(Number(s.price))}
                      </div>
                      {s.originalPrice && (
                        <div className="text-xs text-muted-foreground line-through">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(Number(s.originalPrice))}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleOpenEdit(s)}
                          className="p-2 rounded-md border border-border bg-card text-foreground hover:text-primary hover:bg-accent transition-all"
                          title="Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="p-2 rounded-md border border-border bg-card text-foreground hover:text-rose-600 hover:bg-accent transition-all"
                          title="Hapus"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center p-8 text-muted-foreground">
                    Tidak ada layanan ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* CRUD Form Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col p-6 space-y-4 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">
                {editingId ? "Edit Layanan" : "Tambah Layanan Baru"}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              
              {/* Type Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground uppercase tracking-wide">Kategori Layanan (Ketik Baru / Pilih Tag Di Bawah)</label>
                <input
                  type="text"
                  required
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  placeholder="Contoh: Juru Sembelih Halal, Jasa Aqiqah, SHARPENING, dll"
                  className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
                
                {/* Clickable tags for category recommendations */}
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {Array.from(
                    new Set([
                      "SHARPENING",
                      "RENTAL",
                      "PROCUREMENT",
                      ...services.map((s) => s.type),
                    ])
                  ).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setType(cat)}
                      className={`px-2 py-0.5 rounded text-xs border transition-all cursor-pointer ${
                        type === cat
                          ? "bg-primary text-primary-foreground border-primary font-semibold"
                          : "bg-muted text-muted-foreground border-border hover:bg-accent hover:text-foreground"
                      }`}
                    >
                      {cat.replace(/_/g, " ").replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bahasa Indonesia Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground uppercase tracking-wide">Nama Layanan (Indonesia)</label>
                <input
                  type="text"
                  required
                  value={nameId}
                  onChange={handleNameIdChange}
                  placeholder="Contoh: Jasa Asah Pisau Daging"
                  className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none"
                />
              </div>

              {/* Bahasa Inggris Name with Auto-Translate Button */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wide">Nama Layanan (Inggris)</label>
                  <button
                    type="button"
                    onClick={handleAutoTranslateName}
                    disabled={isTranslatingName || !nameId}
                    className="inline-flex items-center text-xs font-semibold text-primary hover:underline gap-1 disabled:opacity-50"
                  >
                    {isTranslatingName ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Sparkles className="h-3 w-3" />
                    )}
                    <span>Auto-Translate</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="Example: Meat Knife Sharpening Service"
                  className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none"
                />
              </div>

              {/* Slug */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground uppercase tracking-wide">Slug Layanan (Unique URL)</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="jasa-asah-pisau-daging"
                  className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Promo Price */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wide">Harga Promo / Aktif (IDR)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="35000"
                    className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none"
                  />
                </div>

                {/* Original Price */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wide">Harga Coret / Asli (IDR)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="Contoh: 45000"
                    className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground uppercase tracking-wide block">Gambar Layanan (Optional)</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-12 bg-muted/40 rounded border border-border flex items-center justify-center overflow-hidden shrink-0">
                    {isCompressing ? (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    ) : imageUrl ? (
                      <img src={imageUrl} alt="Layanan" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-muted-foreground/60" />
                    )}
                  </div>
                  <label className="px-3 py-1.5 border border-border bg-card hover:bg-accent text-xs font-bold text-foreground rounded-md cursor-pointer transition-colors">
                    Pilih Berkas
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => setImageUrl(null)}
                      className="text-xs font-semibold text-rose-500 hover:underline"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </div>

              {/* Features List ID */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground uppercase tracking-wide">Daftar Fitur / Bullet Points (Indonesia - Pisahkan dengan baris baru)</label>
                <textarea
                  value={featuresId}
                  onChange={(e) => setFeaturesId(e.target.value)}
                  placeholder="Sudut asah 14-16 derajat&#10;Finishing batu alam premium&#10;Stropping kulit"
                  rows={3}
                  className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none"
                />
              </div>

              {/* Features List EN */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wide">Daftar Fitur / Bullet Points (Inggris - Pisahkan dengan baris baru)</label>
                  <button
                    type="button"
                    onClick={handleAutoTranslateFeatures}
                    disabled={isTranslatingFeatures || !featuresId}
                    className="inline-flex items-center text-xs font-semibold text-primary hover:underline gap-1 disabled:opacity-50"
                  >
                    {isTranslatingFeatures ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Sparkles className="h-3 w-3" />
                    )}
                    <span>Auto-Translate</span>
                  </button>
                </div>
                <textarea
                  value={featuresEn}
                  onChange={(e) => setFeaturesEn(e.target.value)}
                  placeholder="14-16 degree sharpening angle&#10;Premium natural whetstone finish&#10;Leather stropping"
                  rows={3}
                  className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none"
                />
              </div>

              {/* Bahasa Indonesia Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground uppercase tracking-wide">Deskripsi Layanan (Indonesia)</label>
                <textarea
                  required
                  value={descriptionId}
                  onChange={(e) => setDescriptionId(e.target.value)}
                  placeholder="Tulis deskripsi dan cakupan layanan..."
                  rows={2}
                  className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none"
                />
              </div>

              {/* Bahasa Inggris Description with Auto-Translate Button */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wide">Deskripsi Layanan (Inggris)</label>
                  <button
                    type="button"
                    onClick={handleAutoTranslateDesc}
                    disabled={isTranslatingDesc || !descriptionId}
                    className="inline-flex items-center text-xs font-semibold text-primary hover:underline gap-1 disabled:opacity-50"
                  >
                    {isTranslatingDesc ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Sparkles className="h-3 w-3" />
                    )}
                    <span>Auto-Translate</span>
                  </button>
                </div>
                <textarea
                  required
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  placeholder="Write service description and scope..."
                  rows={2}
                  className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-semibold rounded-md border border-border bg-card text-foreground hover:bg-accent transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isCompressing}
                  className="px-4 py-2 text-sm font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/95 transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>Simpan</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
