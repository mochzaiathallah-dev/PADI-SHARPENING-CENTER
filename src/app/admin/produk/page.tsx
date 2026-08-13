"use client";

import React, { useState, useEffect, startTransition, useActionState } from "react";
import { 
  getProducts, 
  getCategories, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  translateTextAction,
  createCategory,
  deleteCategory
} from "../actions";
import { Plus, Edit2, Trash2, Globe, Sparkles, Loader2, ArrowRight, X, ShoppingBag } from "lucide-react";
import { compressMediaFile } from "../../../lib/compress";

type ProductType = {
  id: string;
  name_id: string;
  name_en: string;
  slug: string;
  description_id: string;
  description_en: string;
  price: any; // Decimal type from Prisma
  originalPrice?: any; // Decimal type from Prisma
  imageUrl?: string | null;
  stock: number | null;
  categoryId: string;
  category: {
    name: string;
  };
};

type CategoryType = {
  id: string;
  name: string;
  slug: string;
};

export default function ManageProducts() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTranslatingName, setIsTranslatingName] = useState(false);
  const [isTranslatingDesc, setIsTranslatingDesc] = useState(false);

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
  const [imageUrl, setImageUrl] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Category Modal States
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prodData, catData] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prodData as any);
      setCategories(catData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Auto-generate slug on Indonesian Name change
  const handleNameIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNameId(val);
    if (!editingId) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
          .replace(/\s+/g, "-") // collapse whitespace and replace by -
          .replace(/-+/g, "-") // collapse dashes
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
    setImageUrl("");
    setStock("");
    setCategoryId(categories[0]?.id || "");
    setIsOpen(true);
  };

  const handleOpenEdit = (p: ProductType) => {
    setEditingId(p.id);
    setNameId(p.name_id);
    setNameEn(p.name_en);
    setSlug(p.slug);
    setDescriptionId(p.description_id);
    setDescriptionEn(p.description_en);
    setPrice(String(p.price));
    setOriginalPrice(p.originalPrice ? String(p.originalPrice) : "");
    setImageUrl(p.imageUrl || "");
    setStock(p.stock !== null && p.stock !== undefined ? String(p.stock) : "");
    setCategoryId(p.categoryId);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const base64 = await compressMediaFile(file);
      setImageUrl(base64);
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Gagal memproses gambar produk.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      alert("Nama kategori harus diisi!");
      return;
    }
    setIsSavingCategory(true);
    try {
      await createCategory(newCategoryName, newCategoryDesc);
      setNewCategoryName("");
      setNewCategoryDesc("");
      const catData = await getCategories();
      setCategories(catData);
      alert("Kategori berhasil ditambahkan!");
    } catch (err: any) {
      console.error(err);
      alert("Gagal menambahkan kategori: " + (err.message || "Error"));
    } finally {
      setIsSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
      try {
        await deleteCategory(catId);
        const catData = await getCategories();
        setCategories(catData);
        if (categoryId === catId) {
          setCategoryId(catData[0]?.id || "");
        }
        alert("Kategori berhasil dihapus!");
      } catch (err: any) {
        console.error(err);
        alert(err.message || "Gagal menghapus kategori.");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      try {
        await deleteProduct(id);
        loadData();
      } catch (err) {
        console.error(err);
        alert("Gagal menghapus produk.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameId || !nameEn || !slug || !descriptionId || !descriptionEn || !price || !categoryId) {
      alert("Semua kolom harus diisi!");
      return;
    }

    const payload = {
      name_id: nameId,
      name_en: nameEn,
      slug,
      description_id: descriptionId,
      description_en: descriptionEn,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      imageUrl: imageUrl || null,
      stock: stock ? parseInt(stock, 10) : null,
      categoryId,
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }
      setIsOpen(false);
      loadData();
    } catch (err: any) {
      console.error(err);
      alert("Gagal menyimpan produk: " + (err.message || "Error"));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Kelola katalog pisau, alat pengasah, dan aksesoris.
        </p>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-sm hover:bg-accent transition-all gap-1.5"
          >
            <span>Kelola Kategori</span>
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/95 transition-all gap-1.5"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Produk</span>
          </button>
        </div>
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
                <th className="p-4">Nama Produk (ID / EN)</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Harga</th>
                <th className="p-4">Stok</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.length > 0 ? (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-accent/10 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name_id} className="w-10 h-10 object-cover rounded-lg border border-border bg-muted/30" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center border border-border text-muted-foreground/60">
                          <ShoppingBag className="h-4 w-4" />
                        </div>
                      )}
                      <div className="space-y-0.5">
                        <p className="font-bold text-foreground">{p.name_id}</p>
                        <p className="text-xs text-muted-foreground italic flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          <span>{p.name_en}</span>
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-foreground/80">{p.category?.name}</td>
                    <td className="p-4 font-semibold text-foreground">
                      <div className="space-y-0.5">
                        <p>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(Number(p.price))}
                        </p>
                        {p.originalPrice && (
                          <p className="text-xs text-muted-foreground line-through">
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 0,
                            }).format(Number(p.originalPrice))}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-foreground/80">
                      {p.stock !== null && p.stock !== undefined ? (
                        p.stock
                      ) : (
                        <span className="inline-flex items-center text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-950/40 dark:text-green-400 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-900">
                          Selalu Ready
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-2 rounded-md border border-border bg-card text-foreground hover:text-primary hover:bg-accent transition-all"
                          title="Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
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
                    Tidak ada produk ditemukan.
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
                {editingId ? "Edit Produk" : "Tambah Produk Baru"}
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
              
              {/* Bahasa Indonesia Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground uppercase tracking-wide">Nama Produk (Indonesia)</label>
                <input
                  type="text"
                  value={nameId}
                  onChange={handleNameIdChange}
                  placeholder="Contoh: Pisau Sembelih Jerman"
                  className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Bahasa Inggris Name with Auto-Translate Button */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wide">Nama Produk (Inggris)</label>
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
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="Example: German Slaughter Knife"
                  className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Slug */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground uppercase tracking-wide">Slug Bilah (Unique URL)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="pisau-sembelih-jerman"
                  className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Product Image Upload */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground uppercase tracking-wide">Foto Produk / Image</label>
                <div className="flex items-center gap-4">
                  {imageUrl ? (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center">
                      <img src={imageUrl} alt="Preview" className="object-cover w-full h-full" />
                      <button
                        type="button"
                        onClick={() => setImageUrl("")}
                        className="absolute top-0.5 right-0.5 bg-background/80 hover:bg-background text-rose-500 rounded-full p-0.5 shadow-sm"
                        title="Hapus Foto"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg border border-dashed border-border bg-muted/20 flex flex-col items-center justify-center text-muted-foreground">
                      <ShoppingBag className="h-5 w-5 opacity-40" />
                      <span className="text-[9px]">No Image</span>
                    </div>
                  )}
                  <div className="grow">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="product-image-upload"
                    />
                    <label
                      htmlFor="product-image-upload"
                      className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-md border border-border bg-card text-foreground hover:bg-accent cursor-pointer gap-1.5"
                    >
                      {isUploadingImage ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-3 w-3" />
                          <span>Pilih Foto</span>
                        </>
                      )}
                    </label>
                    <p className="text-[10px] text-muted-foreground mt-1">Format JPG, PNG, WEBP. Maks 5MB.</p>
                  </div>
                </div>
              </div>

              {/* Category and Stock Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground uppercase tracking-wide">Kategori</label>
                    <button
                      type="button"
                      onClick={() => setIsCategoryModalOpen(true)}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      + Kelola
                    </button>
                  </div>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wide">Stok</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="10"
                    className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              {/* Price and Original Price Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wide">Harga Jual / Diskon (IDR)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="850000"
                    className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wide">Harga Coret / Sebelum Diskon (IDR - Opsional)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="Contoh: 1000000"
                    className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              {/* Bahasa Indonesia Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground uppercase tracking-wide">Deskripsi (Indonesia)</label>
                <textarea
                  value={descriptionId}
                  onChange={(e) => setDescriptionId(e.target.value)}
                  placeholder="Tulis spesifikasi bilah..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Bahasa Inggris Description with Auto-Translate Button */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wide">Deskripsi (Inggris)</label>
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
                  placeholder="Write blade specification..."
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

      {/* Category Management Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col p-6 space-y-4 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">Kelola Kategori Produk</h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* List of existing categories */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              <label className="text-xs font-bold text-foreground uppercase tracking-wide">Daftar Kategori</label>
              {categories.length > 0 ? (
                <div className="divide-y divide-border border border-border rounded-lg bg-muted/20">
                  {categories.map((c) => (
                    <div key={c.id} className="flex items-center justify-between p-3 text-sm">
                      <div className="space-y-0.5">
                        <p className="font-bold text-foreground">{c.name}</p>
                        <p className="text-xs text-muted-foreground">slug: {c.slug}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(c.id)}
                        className="text-rose-500 hover:text-rose-700 p-1 hover:bg-rose-500/10 rounded transition-all flex items-center justify-center"
                        title="Hapus Kategori"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">Belum ada kategori.</p>
              )}
            </div>

            {/* Add New Category Form */}
            <form onSubmit={handleCreateCategory} className="space-y-3 pt-3 border-t border-border">
              <label className="text-xs font-bold text-foreground uppercase tracking-wide block">Tambah Kategori Baru</label>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Nama Kategori (contoh: Jasa Asah)"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  required
                />
                <input
                  type="text"
                  placeholder="Deskripsi Singkat (Opsional)"
                  value={newCategoryDesc}
                  onChange={(e) => setNewCategoryDesc(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
              <button
                type="submit"
                disabled={isSavingCategory}
                className="w-full py-2 text-sm font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/95 transition-all flex items-center justify-center gap-1"
              >
                {isSavingCategory ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5" />
                    <span>Tambah Kategori</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
