"use client";

import React, { useState, useEffect } from "react";
import { 
  getPortfolios, 
  createPortfolio, 
  updatePortfolio, 
  deletePortfolio, 
  translateTextAction 
} from "../actions";
import { compressMediaFile } from "../../../lib/compress";
import { Plus, Pencil, Trash2, Save, X, Sparkles, Loader2, Image, Video, Film } from "lucide-react";

type PortfolioItem = {
  id: string;
  title_id: string;
  title_en: string;
  slug: string;
  description_id: string;
  description_en: string;
  imageUrl: string; // Base64 data url
  category_id: string;
  category_en: string;
  metric_id: string | null;
  metric_en: string | null;
};

export default function AdminPortfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState<Record<string, boolean>>({});
  
  // Form modal state
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [titleId, setTitleId] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descriptionId, setDescriptionId] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [categoryId, setCategoryId] = useState("Restorasi");
  const [categoryEn, setCategoryEn] = useState("Restoration");
  const [metricId, setMetricId] = useState("");
  const [metricEn, setMetricEn] = useState("");
  const [mediaFile, setMediaFile] = useState<string | null>(null); // Base64
  const [isCompressing, setIsCompressing] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getPortfolios();
      setItems(data as unknown as PortfolioItem[]);
    } catch (error) {
      console.error("Failed to load portfolios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setTitleId("");
    setTitleEn("");
    setDescriptionId("");
    setDescriptionEn("");
    setCategoryId("Restorasi");
    setCategoryEn("Restoration");
    setMetricId("");
    setMetricEn("");
    setMediaFile(null);
    setIsOpen(true);
  };

  const openEdit = (item: PortfolioItem) => {
    setEditingId(item.id);
    setTitleId(item.title_id);
    setTitleEn(item.title_en);
    setDescriptionId(item.description_id);
    setDescriptionEn(item.description_en);
    setCategoryId(item.category_id);
    setCategoryEn(item.category_en);
    setMetricId(item.metric_id || "");
    setMetricEn(item.metric_en || "");
    setMediaFile(item.imageUrl);
    setIsOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    try {
      const compressed = await compressMediaFile(file);
      setMediaFile(compressed);
    } catch (error) {
      console.error("Compression failed:", error);
      alert("Gagal mengompresi media. Silakan pilih file lain.");
    } finally {
      setIsCompressing(false);
    }
  };

  const handleTranslate = async (sourceText: string, targetSetter: (val: string) => void, fieldKey: string) => {
    if (!sourceText) return;
    setIsTranslating(prev => ({ ...prev, [fieldKey]: true }));
    try {
      const result = await translateTextAction(sourceText);
      if (result) targetSetter(result);
    } catch (error) {
      console.error("Translation failed:", error);
    } finally {
      setIsTranslating(prev => ({ ...prev, [fieldKey]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaFile) {
      alert("Wajib mengunggah media (gambar/video)!");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        title_id: titleId,
        title_en: titleEn,
        description_id: descriptionId,
        description_en: descriptionEn,
        imageUrl: mediaFile,
        category_id: categoryId,
        category_en: categoryEn,
        metric_id: metricId || null,
        metric_en: metricEn || null,
      };

      if (editingId) {
        await updatePortfolio(editingId, payload);
      } else {
        await createPortfolio(payload);
      }
      
      setIsOpen(false);
      loadData();
    } catch (error) {
      console.error("Failed to save portfolio:", error);
      alert("Gagal menyimpan portofolio.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus portofolio "${title}"?`)) return;
    try {
      await deletePortfolio(id);
      loadData();
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("Gagal menghapus.");
    }
  };

  const isVideoBase64 = (base64Str: string | null) => {
    if (!base64Str) return false;
    return base64Str.startsWith("data:video/") || base64Str.includes("video/mp4");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Kelola Portofolio</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tambah, edit, dan hapus proyek restorasi bilah serta laser grafir nama.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/95 transition-all gap-2 cursor-pointer w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Portofolio</span>
        </button>
      </div>

      {/* Portfolio Table */}
      <div className="rounded-2xl border border-border bg-card overflow-x-auto">
        <table className="w-full min-w-212.5 text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
              <th className="p-4 w-28">Media</th>
              <th className="p-4">Nama Proyek</th>
              <th className="p-4">Kategori</th>
              <th className="p-4">Metrik / Capaian</th>
              <th className="p-4 w-24 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-muted/10 transition-colors text-foreground">
                  <td className="p-4">
                    <div className="w-20 h-14 bg-muted/50 rounded-lg overflow-hidden border border-border flex items-center justify-center relative">
                      {isVideoBase64(item.imageUrl) ? (
                        <>
                          <video
                            src={item.imageUrl}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                          />
                          <div className="absolute bottom-1 right-1 bg-black/70 text-white rounded p-0.5">
                            <Film className="h-3 w-3" />
                          </div>
                        </>
                      ) : (
                        <img
                          src={item.imageUrl}
                          alt={item.title_id}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-semibold">
                    <div>{item.title_id}</div>
                    <div className="text-xs text-muted-foreground italic font-normal">{item.title_en}</div>
                  </td>
                  <td className="p-4">
                    <div>{item.category_id}</div>
                    <div className="text-xs text-muted-foreground italic">{item.category_en}</div>
                  </td>
                  <td className="p-4 font-mono text-xs text-primary font-bold">
                    {item.metric_id || "-"}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(item)}
                        className="p-2 text-muted-foreground hover:text-primary transition-colors rounded hover:bg-accent"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.title_id)}
                        className="p-2 text-muted-foreground hover:text-rose-500 transition-colors rounded hover:bg-accent"
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  Belum ada item portofolio. Silakan tambahkan baru.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CRUD Modal Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg h-full bg-card border-l border-border flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">
                {editingId ? "Edit Item Portofolio" : "Tambah Item Portofolio"}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Media File Upload */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground uppercase tracking-wide">
                  Unggah Media (Gambar / Video Loop)
                </label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-4 bg-muted/20 relative">
                  {isCompressing ? (
                    <div className="flex flex-col items-center justify-center py-6 space-y-2">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="text-xs font-semibold text-muted-foreground">Auto compressing media...</span>
                    </div>
                  ) : mediaFile ? (
                    <div className="w-full relative space-y-2">
                      <div className="w-full h-40 rounded-lg overflow-hidden border border-border flex items-center justify-center bg-black/10">
                        {isVideoBase64(mediaFile) ? (
                          <video
                            src={mediaFile}
                            className="w-full h-full object-contain"
                            controls
                            muted
                          />
                        ) : (
                          <img
                            src={mediaFile}
                            alt="Preview"
                            className="w-full h-full object-contain"
                          />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setMediaFile(null)}
                        className="text-xs font-semibold text-rose-500 hover:underline block text-center w-full"
                      >
                        Hapus & Ganti Berkas
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center py-8 cursor-pointer w-full">
                      <Image className="h-10 w-10 text-muted-foreground mb-2" />
                      <span className="text-xs font-bold text-primary hover:underline">Pilih Gambar atau Video</span>
                      <span className="text-[10px] text-muted-foreground mt-1">Kompresi otomatis WebP dijalankan instan</span>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Title ID */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground uppercase tracking-wide">Nama Proyek (Indonesia)</label>
                <input
                  type="text"
                  required
                  value={titleId}
                  onChange={(e) => setTitleId(e.target.value)}
                  placeholder="Contoh: Restorasi Golok Sembelih Damaskus"
                  className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Title EN */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wide">Nama Proyek (Inggris)</label>
                  <button
                    type="button"
                    onClick={() => handleTranslate(titleId, setTitleEn, "title")}
                    disabled={isTranslating["title"] || !titleId}
                    className="inline-flex items-center text-xs font-semibold text-primary hover:underline gap-1"
                  >
                    {isTranslating["title"] ? (
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
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="Example: Damascus Slaughter Cleaver Restoration"
                  className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Description ID */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground uppercase tracking-wide">Deskripsi (Indonesia)</label>
                <textarea
                  required
                  value={descriptionId}
                  onChange={(e) => setDescriptionId(e.target.value)}
                  rows={3}
                  placeholder="Detail pengerjaan proyek..."
                  className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Description EN */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wide">Deskripsi (Inggris)</label>
                  <button
                    type="button"
                    onClick={() => handleTranslate(descriptionId, setDescriptionEn, "desc")}
                    disabled={isTranslating["desc"] || !descriptionId}
                    className="inline-flex items-center text-xs font-semibold text-primary hover:underline gap-1"
                  >
                    {isTranslating["desc"] ? (
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
                  rows={3}
                  placeholder="Project details description..."
                  className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Category ID */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground uppercase tracking-wide">Kategori (Indonesia)</label>
                <input
                  type="text"
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  placeholder="Contoh: Restorasi, Grafir, Pengadaan"
                  className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Category EN */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wide">Kategori (Inggris)</label>
                  <button
                    type="button"
                    onClick={() => handleTranslate(categoryId, setCategoryEn, "cat")}
                    disabled={isTranslating["cat"] || !categoryId}
                    className="inline-flex items-center text-xs font-semibold text-primary hover:underline gap-1"
                  >
                    {isTranslating["cat"] ? (
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
                  value={categoryEn}
                  onChange={(e) => setCategoryEn(e.target.value)}
                  placeholder="Example: Restoration, Engraving, Procurement"
                  className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Metric ID */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground uppercase tracking-wide">Metrik / Capaian (Indonesia)</label>
                <input
                  type="text"
                  value={metricId}
                  onChange={(e) => setMetricId(e.target.value)}
                  placeholder="Contoh: Grit 8000 Finish, 50+ Bilah"
                  className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Metric EN */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wide">Metrik / Capaian (Inggris)</label>
                  <button
                    type="button"
                    onClick={() => handleTranslate(metricId, setMetricEn, "metric")}
                    disabled={isTranslating["metric"] || !metricId}
                    className="inline-flex items-center text-xs font-semibold text-primary hover:underline gap-1"
                  >
                    {isTranslating["metric"] ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Sparkles className="h-3 w-3" />
                    )}
                    <span>Auto-Translate</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={metricEn}
                  onChange={(e) => setMetricEn(e.target.value)}
                  placeholder="Example: Grit 8000 Finish, 50+ Blades"
                  className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
            </form>

            {/* Footer */}
            <div className="p-6 border-t border-border flex items-center justify-end gap-3 bg-muted/20">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border border-border rounded-lg text-sm font-semibold text-foreground hover:bg-accent"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSaving || isCompressing}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/95 transition-all gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>Simpan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
