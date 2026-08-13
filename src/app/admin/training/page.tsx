"use client";

import React, { useState, useEffect } from "react";
import { 
  getTrainings, 
  createTraining, 
  updateTraining, 
  deleteTraining, 
  translateTextAction 
} from "../actions";
import { Plus, Edit2, Trash2, Globe, Sparkles, Loader2, Calendar, X, Image as ImageIcon } from "lucide-react";
import { compressMediaFile } from "../../../lib/compress";

type TrainingType = {
  id: string;
  title_id: string;
  title_en: string;
  slug: string;
  description_id: string;
  description_en: string;
  price: any;
  date: any; // Date string/object
  location: string;
  capacity: number;
  registeredCount: number;
  imageUrl?: string | null;
};

export default function ManageTraining() {
  const [trainings, setTrainings] = useState<TrainingType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTranslatingTitle, setIsTranslatingTitle] = useState(false);
  const [isTranslatingDesc, setIsTranslatingDesc] = useState(false);

  // Form Modal States
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [titleId, setTitleId] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [slug, setSlug] = useState("");
  const [descriptionId, setDescriptionId] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [registeredCount, setRegisteredCount] = useState("0");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getTrainings();
      setTrainings(data as any);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTitleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitleId(val);
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
    setTitleId("");
    setTitleEn("");
    setSlug("");
    setDescriptionId("");
    setDescriptionEn("");
    setPrice("");
    setDate("");
    setLocation("Workshop Padi, Surabaya");
    setCapacity("10");
    setRegisteredCount("0");
    setImageUrl(null);
    setIsOpen(true);
  };

  const handleOpenEdit = (t: TrainingType) => {
    // Format date value to YYYY-MM-DD for input element
    const parsedDate = t.date ? new Date(t.date).toISOString().split("T")[0] : "";
    
    setEditingId(t.id);
    setTitleId(t.title_id);
    setTitleEn(t.title_en);
    setSlug(t.slug);
    setDescriptionId(t.description_id);
    setDescriptionEn(t.description_en);
    setPrice(String(t.price));
    setDate(parsedDate);
    setLocation(t.location);
    setCapacity(String(t.capacity));
    setRegisteredCount(String(t.registeredCount));
    setImageUrl(t.imageUrl || null);
    setIsOpen(true);
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

  const handleAutoTranslateTitle = async () => {
    if (!titleId) return;
    setIsTranslatingTitle(true);
    try {
      const res = await translateTextAction(titleId);
      if (res) setTitleEn(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTranslatingTitle(false);
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

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus program pelatihan ini?")) {
      try {
        await deleteTraining(id);
        loadData();
      } catch (err) {
        console.error(err);
        alert("Gagal menghapus program pelatihan.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleId || !titleEn || !slug || !descriptionId || !descriptionEn || !price || !date || !location || !capacity) {
      alert("Semua kolom harus diisi!");
      return;
    }

    const payload = {
      title_id: titleId,
      title_en: titleEn,
      slug,
      description_id: descriptionId,
      description_en: descriptionEn,
      price: parseFloat(price),
      date: new Date(date),
      location,
      capacity: parseInt(capacity, 10),
      registeredCount: parseInt(registeredCount, 10),
      imageUrl,
    };

    try {
      if (editingId) {
        await updateTraining(editingId, payload);
      } else {
        // Exclude registeredCount for create as it defaults to 0
        await createTraining({
          ...payload,
        });
      }
      setIsOpen(false);
      loadData();
    } catch (err: any) {
      console.error(err);
      alert("Gagal menyimpan program pelatihan: " + (err.message || "Error"));
    }
  };

  const formatDate = (dateVal: any) => {
    return new Date(dateVal).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Kelola kelas pelatihan asah pisau presisi dan teknik sembelih profesional.
        </p>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/95 transition-all gap-1.5 w-full sm:w-auto shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Pelatihan</span>
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
                <th className="p-4">Nama Pelatihan (ID / EN)</th>
                <th className="p-4">Tanggal Pelaksanaan</th>
                <th className="p-4">Lokasi</th>
                <th className="p-4">Kapasitas</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {trainings.length > 0 ? (
                trainings.map((t) => (
                  <tr key={t.id} className="hover:bg-accent/10 transition-colors">
                    <td className="p-4 space-y-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-10 bg-muted/50 rounded overflow-hidden border border-border flex items-center justify-center shrink-0">
                          {t.imageUrl ? (
                            <img src={t.imageUrl} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="h-4 w-4 text-muted-foreground/60" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{t.title_id}</p>
                          <p className="text-xs text-muted-foreground italic flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            <span>{t.title_en}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-foreground/80 flex items-center space-x-1.5">
                      <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{formatDate(t.date)}</span>
                    </td>
                    <td className="p-4 text-foreground/80">{t.location}</td>
                    <td className="p-4 text-foreground/80 font-semibold">
                      {t.registeredCount} / {t.capacity}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleOpenEdit(t)}
                          className="p-2 rounded-md border border-border bg-card text-foreground hover:text-primary hover:bg-accent transition-all"
                          title="Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
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
                  <td colSpan={5} className="text-center p-8 text-muted-foreground">
                    Tidak ada kelas pelatihan ditemukan.
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
                {editingId ? "Edit Pelatihan" : "Tambah Pelatihan Baru"}
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
              
              {/* Bahasa Indonesia Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground uppercase tracking-wide">Nama Pelatihan (Indonesia)</label>
                <input
                  type="text"
                  value={titleId}
                  onChange={handleTitleIdChange}
                  placeholder="Contoh: Kelas Asah Pisau Sembelih"
                  className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Bahasa Inggris Title with Auto-Translate Button */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wide">Nama Pelatihan (Inggris)</label>
                  <button
                    type="button"
                    onClick={handleAutoTranslateTitle}
                    disabled={isTranslatingTitle || !titleId}
                    className="inline-flex items-center text-xs font-semibold text-primary hover:underline gap-1 disabled:opacity-50"
                  >
                    {isTranslatingTitle ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Sparkles className="h-3 w-3" />
                    )}
                    <span>Auto-Translate</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="Example: Slaughter Knife Sharpening Masterclass"
                  className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Slug */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground uppercase tracking-wide">Slug Pelatihan (Unique URL)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="kelas-asah-pisau-sembelih"
                  className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Price, Date, Location Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wide">Biaya Pendaftaran (IDR)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="750000"
                    className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wide">Tanggal Pelaksanaan</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wide">Lokasi Kelas</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Workshop Padi, Surabaya"
                    className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wide">Kapasitas (Slots)</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="20"
                    className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              {/* Registered Count (Editable only on Edit) */}
              {editingId && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wide">Peserta Terdaftar</label>
                  <input
                    type="number"
                    value={registeredCount}
                    onChange={(e) => setRegisteredCount(e.target.value)}
                    placeholder="14"
                    className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
              )}

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground uppercase tracking-wide block">Gambar Pelatihan (Optional)</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-12 bg-muted/40 rounded border border-border flex items-center justify-center overflow-hidden shrink-0">
                    {isCompressing ? (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    ) : imageUrl ? (
                      <img src={imageUrl} alt="Pelatihan" className="w-full h-full object-cover" />
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

              {/* Bahasa Indonesia Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground uppercase tracking-wide">Deskripsi Pelatihan (Indonesia)</label>
                <textarea
                  value={descriptionId}
                  onChange={(e) => setDescriptionId(e.target.value)}
                  placeholder="Tulis kurikulum dan deskripsi pelatihan..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Bahasa Inggris Description with Auto-Translate Button */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wide">Deskripsi Pelatihan (Inggris)</label>
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
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  placeholder="Write course syllabus and description..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-semibold rounded-md border border-border bg-card text-foreground hover:bg-accent transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/95 transition-all"
                >
                  Simpan
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
