import { useEffect, useState } from "react";
import type { Product, ProductVariant, ProductImage } from "@/features/shop/shop.types";
import { Search, Plus, Edit2, Trash2, X, Star, Upload } from "lucide-react";
import { toast } from "sonner";
import { adminApi } from "@/lib/api";
import type { Category } from "@/lib/api/types";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [compareAtPrice, setCompareAtPrice] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  const [newSize, setNewSize] = useState("S");
  const [newColor, setNewColor] = useState("Ivory");
  const [newColorHex, setNewColorHex] = useState("#FAF5E9");
  const [newSku, setNewSku] = useState("");
  const [newStock, setNewStock] = useState(10);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [data, cats] = await Promise.all([
          adminApi.listAdminProducts(),
          adminApi.listAdminCategories(),
        ]);
        setCategories(cats);
        if (data.length > 0) {
          setProducts(data.map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            description: "",
            price: p.price,
            compare_at_price: p.compare_at_price,
            is_featured: p.is_featured,
            is_available: true,
            tags: p.tags || [],
            primary_image: p.primary_image || "",
            category: { id: "", name: p.category_name, slug: "" },
            category_name: p.category_name,
            images: [],
            variants: [],
            reviews: [],
            avg_rating: p.avg_rating || 0,
            review_count: p.review_count || 0,
            display_order: 0,
            created_at: "",
          })));
        }
        if (cats.length > 0 && !categoryId) {
          setCategoryId(cats[0].id);
        }
      } catch {}
    };
    fetch();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName("");
    setSlug("");
    setDescription("");
    setPrice(0);
    setCompareAtPrice(null);
    setCategoryId(categories[0]?.id || "");
    setTags("");
    setIsFeatured(false);
    setIsAvailable(true);
    setImages([]);
    setVariants([]);
    setPanelOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setSlug(product.slug);
    setDescription(product.description);
    setPrice(product.price);
    setCompareAtPrice(product.compare_at_price || null);
    setCategoryId(product.category?.id || categories[0]?.id || "");
    setTags(product.tags?.join(", ") || "");
    setIsFeatured(product.is_featured || false);
    setIsAvailable(product.is_available);
    setImages(product.images || []);
    setVariants(product.variants || []);
    setPanelOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await adminApi.deleteAdminProduct(id);
      setProducts(products.filter((p) => p.id !== id));
      toast.success("Product deleted successfully.");
    } catch {
      toast.error("Failed to delete product.");
    }
  };

  const handleAddImage = () => {
    const url = prompt("Enter image URL:");
    if (!url) return;
    const newImg: ProductImage = {
      id: `img-${Math.random().toString(36).substring(2, 9)}`,
      image_url: url,
      alt_text: name,
      is_primary: images.length === 0,
      display_order: images.length + 1,
    };
    setImages([...images, newImg]);
  };

  const handleSetPrimaryImage = (id: string) => {
    setImages(images.map((img) => ({ ...img, is_primary: img.id === id })));
  };

  const handleRemoveImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id));
  };

  const handleAddVariant = () => {
    if (!newSku) {
      toast.error("Please enter a SKU code.");
      return;
    }
    const newVar: ProductVariant = {
      id: `var-${Math.random().toString(36).substring(2, 9)}`,
      size: newSize as "XS" | "S" | "M" | "L",
      color: newColor,
      color_hex: newColorHex,
      sku: newSku,
      stock: newStock,
      additional_price: 0,
      is_active: true,
    };
    setVariants([...variants, newVar]);
    setNewSku("");
  };

  const handleToggleVariantActive = (id: string) => {
    setVariants(variants.map((v) => (v.id === id ? { ...v, is_active: !v.is_active } : v)));
  };

  const handleRemoveVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) {
      toast.error("Name and slug are required.");
      return;
    }

    const categoryObj = categories.find((c) => c.id === categoryId);
    const tagsArr = tags.split(",").map((t) => t.trim()).filter((t) => t.length > 0);
    const primaryImg = images.find((i) => i.is_primary)?.image_url || images[0]?.image_url || "";

    if (editingProduct) {
      try {
        await adminApi.updateAdminProduct(editingProduct.id, {
          category_id: categoryId,
          name,
          slug,
          description: description || null,
          price,
          compare_at_price: compareAtPrice,
          is_available: isAvailable,
          is_featured: isFeatured,
          tags: tagsArr,
        });
      } catch {
        toast.error("Failed to update product.");
        return;
      }
      const updated = products.map((p) => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name, slug, description, price,
            compare_at_price: compareAtPrice,
            category: { id: categoryId, name: categoryObj?.name || "", slug: categoryObj?.slug || "" },
            category_name: categoryObj?.name || "",
            tags: tagsArr,
            is_featured: isFeatured,
            is_available: isAvailable,
            primary_image: primaryImg,
            images, variants,
          };
        }
        return p;
      });
      setProducts(updated);
      toast.success("Product updated successfully.");
    } else {
      let createdId: string;
      try {
        const created = await adminApi.createAdminProduct({
          category_id: categoryId,
          name, slug,
          description: description || null,
          price,
          compare_at_price: compareAtPrice,
          is_available: isAvailable,
          is_featured: isFeatured,
          tags: tagsArr,
        });
        createdId = created.id;
      } catch {
        toast.error("Failed to create product.");
        return;
      }
      const newProd: Product = {
        id: createdId!,
        name, slug, description, price,
        compare_at_price: compareAtPrice,
        category: { id: categoryId, name: categoryObj?.name || "", slug: categoryObj?.slug || "" },
        category_name: categoryObj?.name || "",
        tags: tagsArr,
        is_featured: isFeatured,
        is_available: isAvailable,
        primary_image: primaryImg,
        images, variants,
        reviews: [],
        avg_rating: 0,
        review_count: 0,
        display_order: products.length + 1,
        created_at: new Date().toISOString().slice(0, 10),
      };
      setProducts([newProd, ...products]);
      toast.success("Product created successfully.");
    }

    setPanelOpen(false);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || p.category?.slug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 font-dm-sans text-soil select-none">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-playfair text-2xl font-bold tracking-wider">Products Inventory</h2>
          <p className="text-xs text-dust tracking-wide mt-1">Manage catalog details, pricing, visuals, and variant parameters.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 border-0 bg-terracotta px-4 py-2.5 text-xs font-semibold tracking-wider text-chalk uppercase hover:bg-[#9a5230] transition-colors rounded-xs cursor-pointer"
        >
          <Plus className="size-4" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border border-sand/40 bg-cream p-4 rounded-xs">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-chalk border border-sand/50 rounded-xs py-2 pl-9 pr-3 text-xs tracking-wide placeholder:text-dust/50 focus:outline-none focus:border-terracotta transition-all"
          />
          <Search className="absolute left-3 top-2.5 size-4 text-dust/60" />
        </div>

        <div className="flex items-center gap-3">
          <label className="text-[10px] font-bold tracking-widest uppercase text-dust">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-chalk border border-sand/50 rounded-xs px-3 py-1.5 text-xs focus:outline-none focus:border-terracotta cursor-pointer font-medium"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="border border-sand/40 rounded-xs bg-cream overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-sand/30 bg-sand/10 text-[10px] font-bold tracking-wider uppercase text-dust">
              <th className="p-4">Product Info</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Variants</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand/20">
            {filteredProducts.map((p) => {
              const activeVariantsCount = (p.variants || []).filter((v: ProductVariant) => v.is_active).length;
              const totalStock = (p.variants || []).reduce((sum: number, v: ProductVariant) => sum + (v.is_active ? v.stock : 0), 0);

              return (
                <tr key={p.id} className="hover:bg-sand/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.primary_image || "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=100&q=80"}
                        alt={p.name}
                        className="size-12 object-cover rounded-xs border border-sand/40"
                      />
                      <div>
                        <div className="font-bold text-soil">{p.name}</div>
                        <div className="text-[10px] text-dust/80 font-medium tracking-wide mt-0.5">{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-soil/80">{p.category_name}</td>
                  <td className="p-4">
                    <div className="font-bold">Rp {p.price.toLocaleString("id-ID")}</div>
                    {p.compare_at_price && (
                      <div className="text-[10px] text-dust/60 line-through">
                        Rp {p.compare_at_price.toLocaleString("id-ID")}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-soil/80">
                      {activeVariantsCount} types
                    </span>
                    <span className={`block text-[10px] font-medium tracking-wide mt-0.5 ${totalStock === 0 ? "text-terracotta font-bold" : "text-dust/70"}`}>
                      {totalStock} in stock
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex rounded-xs px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                      p.is_available
                        ? "bg-[#e2f0d9] text-[#385723]"
                        : "bg-sand/35 text-dust"
                    }`}>
                      {p.is_available ? "Available" : "Draft"}
                    </span>
                    {p.is_featured && (
                      <span className="ml-2 inline-flex bg-[#fff2cc] text-[#7f6000] rounded-xs px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1 hover:text-terracotta transition-colors border-0 bg-transparent cursor-pointer"
                        title="Edit details"
                      >
                        <Edit2 className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1 hover:text-terracotta transition-colors border-0 bg-transparent cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-xs text-dust tracking-wider font-medium">
                  No products matching search parameters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {panelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-soil/45 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setPanelOpen(false)}
          />
          <div className="relative w-full max-w-2xl bg-chalk p-6 shadow-xl border-l border-sand/40 overflow-y-auto h-screen flex flex-col justify-between transition-transform duration-300">
            <div>
              <div className="flex items-center justify-between border-b border-sand/30 pb-4 mb-6">
                <h3 className="font-playfair text-xl font-bold tracking-wider">
                  {editingProduct ? "Edit Product Profile" : "Create New Product"}
                </h3>
                <button
                  onClick={() => setPanelOpen(false)}
                  className="p-1 hover:text-terracotta transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-soil uppercase mb-1.5">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (!editingProduct) {
                          setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                        }
                      }}
                      className="w-full bg-cream border border-sand/50 rounded-xs py-2 px-3 text-xs tracking-wide focus:outline-none focus:border-terracotta"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-soil uppercase mb-1.5">
                      Slug Handler
                    </label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full bg-cream border border-sand/50 rounded-xs py-2 px-3 text-xs tracking-wide focus:outline-none focus:border-terracotta"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-soil uppercase mb-1.5">
                      Base Price (Rp)
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full bg-cream border border-sand/50 rounded-xs py-2 px-3 text-xs tracking-wide focus:outline-none focus:border-terracotta"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-soil uppercase mb-1.5">
                      Compare Price (Rp)
                    </label>
                    <input
                      type="number"
                      value={compareAtPrice || ""}
                      onChange={(e) => setCompareAtPrice(e.target.value ? Number(e.target.value) : null)}
                      className="w-full bg-cream border border-sand/50 rounded-xs py-2 px-3 text-xs tracking-wide focus:outline-none focus:border-terracotta"
                      placeholder="Optional markup"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-soil uppercase mb-1.5">
                      Category
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full bg-cream border border-sand/50 rounded-xs py-2 px-3 text-xs tracking-wide focus:outline-none focus:border-terracotta cursor-pointer font-medium"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-soil uppercase mb-1.5">
                    Product Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-24 bg-cream border border-sand/50 rounded-xs py-2 px-3 text-xs tracking-wide focus:outline-none focus:border-terracotta resize-none"
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-soil uppercase mb-1.5">
                      Product Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      className="w-full bg-cream border border-sand/50 rounded-xs py-2 px-3 text-xs tracking-wide focus:outline-none focus:border-terracotta"
                      placeholder="new-arrival, sale, bestseller"
                    />
                  </div>

                  <div className="flex items-center gap-6 pt-4">
                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAvailable}
                        onChange={(e) => setIsAvailable(e.target.checked)}
                        className="accent-terracotta size-4 rounded-xs"
                      />
                      <span>Available for Purchase</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="accent-terracotta size-4 rounded-xs"
                      />
                      <span>Feature in Carousel</span>
                    </label>
                  </div>
                </div>

                <div className="border border-sand/40 p-4 rounded-xs bg-cream/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-sand/30 pb-2">
                    <span className="text-[10px] font-bold tracking-wider text-soil uppercase">
                      Product Imagery ({images.length})
                    </span>
                    <button
                      type="button"
                      onClick={handleAddImage}
                      className="flex items-center gap-1 border border-sand px-2 py-1 text-[9px] font-bold tracking-widest text-soil uppercase bg-chalk hover:bg-cream rounded-xs cursor-pointer transition-colors"
                    >
                      <Plus className="size-3" />
                      <span>Add Image URL</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    {images.map((img) => (
                      <div key={img.id} className="relative group border border-sand/50 p-1 bg-chalk rounded-xs">
                        <img
                          src={img.image_url}
                          alt="preview"
                          className="aspect-square w-full object-cover rounded-xs"
                        />
                        <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(img.id)}
                            className={`p-1 rounded-xs border-0 cursor-pointer ${
                              img.is_primary ? "bg-terracotta text-chalk" : "bg-chalk text-dust hover:text-terracotta"
                            }`}
                            title="Set primary"
                          >
                            <Star className="size-3 fill-current" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(img.id)}
                            className="p-1 rounded-xs border-0 bg-chalk text-dust hover:text-terracotta cursor-pointer"
                            title="Remove"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                        {img.is_primary && (
                          <span className="absolute bottom-1.5 left-1.5 bg-terracotta text-chalk text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-[1px]">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}
                    {images.length === 0 && (
                      <div className="col-span-4 border border-dashed border-sand/75 rounded-xs p-6 flex flex-col items-center justify-center text-dust/60">
                        <Upload className="size-6 stroke-[1.5] mb-2" />
                        <span className="text-[10px] font-semibold tracking-wider uppercase">No visuals configured.</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border border-sand/40 p-4 rounded-xs bg-cream/30 space-y-4">
                  <div className="border-b border-sand/30 pb-2">
                    <span className="text-[10px] font-bold tracking-wider text-soil uppercase">
                      Stock Variants ({variants.length})
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-6 items-end bg-chalk/60 border border-sand/35 p-3 rounded-xs">
                    <div>
                      <label className="block text-[9px] font-bold tracking-wider text-dust uppercase mb-1">Size</label>
                      <select
                        value={newSize}
                        onChange={(e) => setNewSize(e.target.value)}
                        className="w-full bg-cream border border-sand/50 rounded-xs py-1.5 px-2 text-[11px] focus:outline-none"
                      >
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="One Size">One Size</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold tracking-wider text-dust uppercase mb-1">Color</label>
                      <input
                        type="text"
                        value={newColor}
                        onChange={(e) => setNewColor(e.target.value)}
                        className="w-full bg-cream border border-sand/50 rounded-xs py-1 px-2 text-[11px] focus:outline-none"
                        placeholder="Ivory"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold tracking-wider text-dust uppercase mb-1">Hex Code</label>
                      <input
                        type="text"
                        value={newColorHex}
                        onChange={(e) => setNewColorHex(e.target.value)}
                        className="w-full bg-cream border border-sand/50 rounded-xs py-1 px-2 text-[11px] focus:outline-none"
                        placeholder="#FAF5E9"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold tracking-wider text-dust uppercase mb-1">SKU</label>
                      <input
                        type="text"
                        value={newSku}
                        onChange={(e) => setNewSku(e.target.value)}
                        className="w-full bg-cream border border-sand/50 rounded-xs py-1 px-2 text-[11px] focus:outline-none"
                        placeholder="LRB-IV-S"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold tracking-wider text-dust uppercase mb-1">Stock</label>
                      <input
                        type="number"
                        value={newStock}
                        onChange={(e) => setNewStock(Number(e.target.value))}
                        className="w-full bg-cream border border-sand/50 rounded-xs py-1 px-2 text-[11px] focus:outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleAddVariant}
                      className="border-0 bg-soil hover:bg-soil/90 text-chalk text-[9px] font-bold tracking-wider uppercase py-2.5 px-3 rounded-xs cursor-pointer transition-colors"
                    >
                      Add Variant
                    </button>
                  </div>

                  <div className="overflow-x-auto border border-sand/30 rounded-xs bg-chalk">
                    <table className="w-full text-left text-[11px]">
                      <thead>
                        <tr className="border-b border-sand/30 bg-sand/10 text-[9px] font-bold tracking-wider uppercase text-dust">
                          <th className="p-2.5">Variant Specs</th>
                          <th className="p-2.5">SKU</th>
                          <th className="p-2.5">Stock</th>
                          <th className="p-2.5">Pricing Markup</th>
                          <th className="p-2.5">Status</th>
                          <th className="p-2.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-sand/20">
                        {variants.map((v) => (
                          <tr key={v.id} className="hover:bg-sand/5">
                            <td className="p-2.5">
                              <div className="flex items-center gap-2">
                                <span
                                  className="size-3.5 rounded-full border border-sand/55"
                                  style={{ backgroundColor: v.color_hex }}
                                  title={v.color}
                                />
                                <span className="font-bold">{v.size}</span>
                                <span className="text-[10px] text-dust">({v.color})</span>
                              </div>
                            </td>
                            <td className="p-2.5 font-semibold text-soil/85">{v.sku}</td>
                            <td className="p-2.5 font-bold">{v.stock}</td>
                            <td className="p-2.5 font-semibold">
                              {v.additional_price > 0 ? `+Rp ${v.additional_price.toLocaleString("id-ID")}` : "Base price"}
                            </td>
                            <td className="p-2.5">
                              <span className={`inline-flex rounded-[1px] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest ${
                                v.is_active ? "bg-[#e2f0d9] text-[#385723]" : "bg-sand/35 text-dust"
                              }`}>
                                {v.is_active ? "Active" : "Disabled"}
                              </span>
                            </td>
                            <td className="p-2.5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleToggleVariantActive(v.id)}
                                  className="text-[9px] font-bold tracking-widest uppercase hover:text-terracotta border-0 bg-transparent cursor-pointer"
                                >
                                  {v.is_active ? "Disable" : "Enable"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveVariant(v.id)}
                                  className="p-1 text-dust hover:text-terracotta border-0 bg-transparent cursor-pointer"
                                >
                                  <X className="size-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {variants.length === 0 && (
                          <tr>
                            <td colSpan={6} className="p-4 text-center text-[10px] text-dust/60 tracking-wider font-semibold">
                              No sizes/colors configured. Product requires at least one variant.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-sand/30 pt-6 mt-6">
                  <button
                    type="button"
                    onClick={() => setPanelOpen(false)}
                    className="border border-sand bg-transparent px-5 py-2.5 text-xs font-semibold tracking-wider text-soil uppercase hover:bg-cream rounded-xs cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="border-0 bg-terracotta px-5 py-2.5 text-xs font-semibold tracking-wider text-chalk uppercase hover:bg-[#9a5230] rounded-xs cursor-pointer transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
