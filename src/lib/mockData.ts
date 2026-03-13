import type { Product, Category } from "@/features/shop/types/shop.types";

export const MOCK_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Tops", slug: "tops", display_order: 1, is_active: true },
  { id: "cat-2", name: "Bottoms", slug: "bottoms", display_order: 2, is_active: true },
  { id: "cat-3", name: "Dresses", slug: "dresses", display_order: 3, is_active: true },
  { id: "cat-4", name: "Outerwear", slug: "outerwear", display_order: 4, is_active: true },
  { id: "cat-5", name: "Accessories", slug: "accessories", display_order: 5, is_active: true },
  { id: "cat-6", name: "Sets", slug: "sets", display_order: 6, is_active: true }
];

export const MOCK_PRODUCTS: Product[] = [
  // --- DRESSES ---
  {
    id: "prod-bahia",
    name: "La Robe Bahia",
    slug: "la-robe-bahia",
    description: "An elegant, sun-drenched linen wrap dress featuring a playfully draped front and open back. Cut from airy, lightweight French linen, it embodies relaxed Mediterranean luxury. Fully adjustable knot detailing at the waist allows for a custom, figure-sculpting silhouette. Perfect for golden hour soirées.",
    price: 1250000,
    compare_at_price: 1800000,
    is_featured: true,
    is_available: true,
    tags: ["new-arrival", "sale"],
    primary_image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
    category: { id: "cat-3", name: "Dresses", slug: "dresses" },
    category_name: "Dresses",
    images: [
      { id: "img-bahia-1", image_url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80", alt_text: "La Robe Bahia front view", is_primary: true, display_order: 1 },
      { id: "img-bahia-2", image_url: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80", alt_text: "La Robe Bahia detail view", is_primary: false, display_order: 2 },
      { id: "img-bahia-3", image_url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80", alt_text: "La Robe Bahia editorial view", is_primary: false, display_order: 3 }
    ],
    variants: [
      { id: "v-bahia-iv-s", size: "S", color: "Ivory", color_hex: "#FAF5E9", sku: "LRB-IV-S", stock: 5, additional_price: 0, is_active: true },
      { id: "v-bahia-iv-m", size: "M", color: "Ivory", color_hex: "#FAF5E9", sku: "LRB-IV-M", stock: 8, additional_price: 0, is_active: true },
      { id: "v-bahia-iv-l", size: "L", color: "Ivory", color_hex: "#FAF5E9", sku: "LRB-IV-L", stock: 0, additional_price: 0, is_active: true }, // Out of stock to test UI
      { id: "v-bahia-tc-s", size: "S", color: "Terracotta", color_hex: "#B5633A", sku: "LRB-TC-S", stock: 3, additional_price: 50000, is_active: true },
      { id: "v-bahia-tc-m", size: "M", color: "Terracotta", color_hex: "#B5633A", sku: "LRB-TC-M", stock: 6, additional_price: 50000, is_active: true }
    ],
    reviews: [
      { id: "rev-bahia-1", rating: 5, body: "Absolutely breathtaking. The drape is so flattering and the French linen is premium and heavy enough to hold the shape beautifully.", customer_name: "Isabella G.", created_at: "2026-05-10" },
      { id: "rev-bahia-2", rating: 4, body: "Beautiful dress. Make sure to size down if you are in between sizes, as the wrap is quite adjustable.", customer_name: "Camille R.", created_at: "2026-05-18" }
    ],
    avg_rating: 4.5,
    review_count: 2,
    display_order: 1,
    created_at: "2026-04-10"
  },
  {
    id: "prod-novio",
    name: "La Robe Novio",
    slug: "la-robe-novio",
    description: "A sensuous backless halter dress sculpted in structured sand silk. Features an asymmetrical hem, high neckline, and delicate fabric-covered button fastenings down the lower back. Radiates minimal effort but maximum elegance.",
    price: 1950000,
    compare_at_price: null,
    is_featured: false,
    is_available: true,
    tags: ["new-arrival"],
    primary_image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80",
    category: { id: "cat-3", name: "Dresses", slug: "dresses" },
    category_name: "Dresses",
    images: [
      { id: "img-novio-1", image_url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80", alt_text: "La Robe Novio front view", is_primary: true, display_order: 1 }
    ],
    variants: [
      { id: "v-novio-sd-s", size: "S", color: "Sand", color_hex: "#C9B99A", sku: "LRN-SD-S", stock: 4, additional_price: 0, is_active: true },
      { id: "v-novio-sd-m", size: "M", color: "Sand", color_hex: "#C9B99A", sku: "LRN-SD-M", stock: 6, additional_price: 0, is_active: true },
      { id: "v-novio-sd-l", size: "L", color: "Sand", color_hex: "#C9B99A", sku: "LRN-SD-L", stock: 3, additional_price: 0, is_active: true }
    ],
    reviews: [],
    avg_rating: 0,
    review_count: 0,
    display_order: 2,
    created_at: "2026-05-01"
  },
  {
    id: "prod-saudade",
    name: "La Robe Saudade",
    slug: "la-robe-saudade",
    description: "An editorial midi dress with asymmetric gathering, featuring delicate spaghetti straps and a thigh-high slit. Styled in an ultra-refined, warm clay terracotta shade, it is designed to turn heads.",
    price: 1550000,
    compare_at_price: null,
    is_featured: true,
    is_available: true,
    tags: ["bestseller"],
    primary_image: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=800&q=80",
    category: { id: "cat-3", name: "Dresses", slug: "dresses" },
    category_name: "Dresses",
    images: [
      { id: "img-saudade-1", image_url: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=800&q=80", alt_text: "La Robe Saudade campaign view", is_primary: true, display_order: 1 }
    ],
    variants: [
      { id: "v-saudade-tc-xs", size: "XS", color: "Terracotta", color_hex: "#B5633A", sku: "LRS-TC-XS", stock: 2, additional_price: 0, is_active: true },
      { id: "v-saudade-tc-s", size: "S", color: "Terracotta", color_hex: "#B5633A", sku: "LRS-TC-S", stock: 4, additional_price: 0, is_active: true },
      { id: "v-saudade-tc-m", size: "M", color: "Terracotta", color_hex: "#B5633A", sku: "LRS-TC-M", stock: 5, additional_price: 0, is_active: true }
    ],
    reviews: [
      { id: "rev-saudade-1", rating: 5, body: "Stunning color, fabric feels extremely high-end. Got compliments all night long.", customer_name: "Elena P.", created_at: "2026-05-15" }
    ],
    avg_rating: 5.0,
    review_count: 1,
    display_order: 3,
    created_at: "2026-03-20"
  },

  // --- TOPS ---
  {
    id: "prod-moisson",
    name: "La Chemise Moisson",
    slug: "la-chemise-moisson",
    description: "A signature cropped off-shoulder shirt in premium organic linen. Features oversized cuffs, a structured collar neckline, and an elasticated asymmetric wrap-around tie at the lower waist. Airy, artistic, and deeply sun-soaked.",
    price: 890000,
    compare_at_price: null,
    is_featured: true,
    is_available: true,
    tags: ["new-arrival"],
    primary_image: "https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=800&q=80",
    category: { id: "cat-1", name: "Tops", slug: "tops" },
    category_name: "Tops",
    images: [
      { id: "img-moisson-1", image_url: "https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=800&q=80", alt_text: "La Chemise Moisson crop shirt", is_primary: true, display_order: 1 }
    ],
    variants: [
      { id: "v-moisson-iv-s", size: "S", color: "Ivory", color_hex: "#FAF5E9", sku: "LCM-IV-S", stock: 8, additional_price: 0, is_active: true },
      { id: "v-moisson-iv-m", size: "M", color: "Ivory", color_hex: "#FAF5E9", sku: "LCM-IV-M", stock: 10, additional_price: 0, is_active: true },
      { id: "v-moisson-sd-s", size: "S", color: "Sand", color_hex: "#C9B99A", sku: "LCM-SD-S", stock: 5, additional_price: 0, is_active: true }
    ],
    reviews: [],
    avg_rating: 0,
    review_count: 0,
    display_order: 4,
    created_at: "2026-05-10"
  },
  {
    id: "prod-tee-signature",
    name: "Le T-Shirt Signature",
    slug: "le-t-shirt-signature",
    description: "A luxury wardrobe staple. Heavyweight organic cotton jersey t-shirt with our signature subtle 'Juicy' sun emblem embroidered in terracotta silk at the chest. Designed with a perfect relaxed unisex boxy fit.",
    price: 490000,
    compare_at_price: 650000,
    is_featured: false,
    is_available: true,
    tags: ["sale"],
    primary_image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    category: { id: "cat-1", name: "Tops", slug: "tops" },
    category_name: "Tops",
    images: [
      { id: "img-tee-1", image_url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80", alt_text: "Le T-Shirt Signature shirt", is_primary: true, display_order: 1 }
    ],
    variants: [
      { id: "v-tee-iv-s", size: "S", color: "Ivory", color_hex: "#FAF5E9", sku: "LTS-IV-S", stock: 15, additional_price: 0, is_active: true },
      { id: "v-tee-iv-m", size: "M", color: "Ivory", color_hex: "#FAF5E9", sku: "LTS-IV-M", stock: 20, additional_price: 0, is_active: true },
      { id: "v-tee-iv-l", size: "L", color: "Ivory", color_hex: "#FAF5E9", sku: "LTS-IV-L", stock: 12, additional_price: 0, is_active: true }
    ],
    reviews: [
      { id: "rev-tee-1", rating: 4, body: "Perfect fit, organic cotton is super soft. Embroided detail is very elegant.", customer_name: "Marcus L.", created_at: "2026-05-02" }
    ],
    avg_rating: 4.0,
    review_count: 1,
    display_order: 5,
    created_at: "2026-02-15"
  },
  {
    id: "prod-valen-top",
    name: "La Chemise Valensole",
    slug: "la-chemise-valensole",
    description: "An architectural silk blouse featuring asymmetrical sleeves, an open neck, and beautiful gathered detailing along the hem. Cuts a striking profile, designed in a warm oatmeal sand hue.",
    price: 980000,
    compare_at_price: null,
    is_featured: false,
    is_available: true,
    tags: [],
    primary_image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80",
    category: { id: "cat-1", name: "Tops", slug: "tops" },
    category_name: "Tops",
    images: [
      { id: "img-valen-1", image_url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80", alt_text: "La Chemise Valensole view", is_primary: true, display_order: 1 }
    ],
    variants: [
      { id: "v-valen-sd-s", size: "S", color: "Sand", color_hex: "#C9B99A", sku: "LCV-SD-S", stock: 6, additional_price: 0, is_active: true },
      { id: "v-valen-sd-m", size: "M", color: "Sand", color_hex: "#C9B99A", sku: "LCV-SD-M", stock: 5, additional_price: 0, is_active: true }
    ],
    reviews: [],
    avg_rating: 0,
    review_count: 0,
    display_order: 6,
    created_at: "2026-04-22"
  },

  // --- BOTTOMS ---
  {
    id: "prod-sauge",
    name: "Le Pantalon Sauge",
    slug: "le-pantalon-sauge",
    description: "High-waisted, wide-leg trousers draped in a luxurious sand-colored linen-blend. Features double-pleated fronts, elegant split cuffs, and an adjustable side-buckle tab. It moves with a gorgeous fluid weight.",
    price: 1100000,
    compare_at_price: null,
    is_featured: true,
    is_available: true,
    tags: ["bestseller"],
    primary_image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80",
    category: { id: "cat-2", name: "Bottoms", slug: "bottoms" },
    category_name: "Bottoms",
    images: [
      { id: "img-sauge-1", image_url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80", alt_text: "Le Pantalon Sauge visual", is_primary: true, display_order: 1 }
    ],
    variants: [
      { id: "v-sauge-sd-xs", size: "XS", color: "Sand", color_hex: "#C9B99A", sku: "LPS-SD-XS", stock: 4, additional_price: 0, is_active: true },
      { id: "v-sauge-sd-s", size: "S", color: "Sand", color_hex: "#C9B99A", sku: "LPS-SD-S", stock: 8, additional_price: 0, is_active: true },
      { id: "v-sauge-sd-m", size: "M", color: "Sand", color_hex: "#C9B99A", sku: "LPS-SD-M", stock: 6, additional_price: 0, is_active: true }
    ],
    reviews: [
      { id: "rev-sauge-1", rating: 5, body: "Unbelievable quality. The fluid drape of the linen-blend makes these the most elegant trousers I own.", customer_name: "Sarah V.", created_at: "2026-05-14" }
    ],
    avg_rating: 5.0,
    review_count: 1,
    display_order: 7,
    created_at: "2026-03-05"
  },
  {
    id: "prod-terra-short",
    name: "Le Short Terra",
    slug: "le-short-terra",
    description: "High-waisted tailoring in a warm terracotta linen weave. Features belt loops, pressed pleats, and clean side pockets. Perfect for summer capsule wardrobes.",
    price: 690000,
    compare_at_price: 850000,
    is_featured: false,
    is_available: true,
    tags: ["sale"],
    primary_image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80",
    category: { id: "cat-2", name: "Bottoms", slug: "bottoms" },
    category_name: "Bottoms",
    images: [
      { id: "img-terra-1", image_url: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80", alt_text: "Le Short Terra shorts", is_primary: true, display_order: 1 }
    ],
    variants: [
      { id: "v-terra-tc-s", size: "S", color: "Terracotta", color_hex: "#B5633A", sku: "LST-TC-S", stock: 6, additional_price: 0, is_active: true },
      { id: "v-terra-tc-m", size: "M", color: "Terracotta", color_hex: "#B5633A", sku: "LST-TC-M", stock: 8, additional_price: 0, is_active: true }
    ],
    reviews: [],
    avg_rating: 0,
    review_count: 0,
    display_order: 8,
    created_at: "2026-04-18"
  },
  {
    id: "prod-drapee",
    name: "La Jupe Drapee",
    slug: "la-jupe-drapee",
    description: "A structural wrap midi skirt in sun-soaked sand. Gathering details at the hip create a elegant, asymmetric cascade that flows seamlessly as you walk.",
    price: 850000,
    compare_at_price: null,
    is_featured: false,
    is_available: true,
    tags: [],
    primary_image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    category: { id: "cat-2", name: "Bottoms", slug: "bottoms" },
    category_name: "Bottoms",
    images: [
      { id: "img-drapee-1", image_url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80", alt_text: "La Jupe Drapee skirt", is_primary: true, display_order: 1 }
    ],
    variants: [
      { id: "v-drapee-sd-s", size: "S", color: "Sand", color_hex: "#C9B99A", sku: "LJD-SD-S", stock: 4, additional_price: 0, is_active: true },
      { id: "v-drapee-sd-m", size: "M", color: "Sand", color_hex: "#C9B99A", sku: "LJD-SD-M", stock: 5, additional_price: 0, is_active: true }
    ],
    reviews: [],
    avg_rating: 0,
    review_count: 0,
    display_order: 9,
    created_at: "2026-04-20"
  },

  // --- OUTERWEAR ---
  {
    id: "prod-dhomme",
    name: "La Veste D'Homme",
    slug: "la-veste-dhomme",
    description: "Our signature oversized menswear-inspired blazer. Expertly structured in a heavy, luxury warm sand wool-blend. Features double-breasted horn button fastenings, sharp notched lapels, and exaggerated shoulder panels that frame the figure. Elegant but relaxed, it represents the ultimate editorial power piece.",
    price: 2450000,
    compare_at_price: null,
    is_featured: true,
    is_available: true,
    tags: ["bestseller"],
    primary_image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80",
    category: { id: "cat-4", name: "Outerwear", slug: "outerwear" },
    category_name: "Outerwear",
    images: [
      { id: "img-dhomme-1", image_url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80", alt_text: "La Veste D'Homme front view", is_primary: true, display_order: 1 }
    ],
    variants: [
      { id: "v-dhomme-sd-s", size: "S", color: "Sand", color_hex: "#C9B99A", sku: "LVD-SD-S", stock: 4, additional_price: 0, is_active: true },
      { id: "v-dhomme-sd-m", size: "M", color: "Sand", color_hex: "#C9B99A", sku: "LVD-SD-M", stock: 6, additional_price: 0, is_active: true },
      { id: "v-dhomme-sd-l", size: "L", color: "Sand", color_hex: "#C9B99A", sku: "LVD-SD-L", stock: 2, additional_price: 0, is_active: true }
    ],
    reviews: [
      { id: "rev-dhomme-1", rating: 5, body: "Simply extraordinary. Fits perfectly oversized, the horn buttons feel extremely high quality and heavy.", customer_name: "Victoria K.", created_at: "2026-05-08" }
    ],
    avg_rating: 5.0,
    review_count: 1,
    display_order: 10,
    created_at: "2026-03-12"
  },
  {
    id: "prod-alzou",
    name: "Le Cardigan Alzou",
    slug: "le-cardigan-alzou",
    description: "A beautifully cropped cardigan knitted in a super soft mohair-blend loop. Features a plunging front V-neckline, terracotta-covered buttons, and rib-knit cuffs. Playful and cozy.",
    price: 950000,
    compare_at_price: 1250000,
    is_featured: false,
    is_available: true,
    tags: ["sale"],
    primary_image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80",
    category: { id: "cat-4", name: "Outerwear", slug: "outerwear" },
    category_name: "Outerwear",
    images: [
      { id: "img-alzou-1", image_url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80", alt_text: "Le Cardigan Alzou look", is_primary: true, display_order: 1 }
    ],
    variants: [
      { id: "v-alzou-tc-s", size: "S", color: "Terracotta", color_hex: "#B5633A", sku: "LCA-TC-S", stock: 8, additional_price: 0, is_active: true },
      { id: "v-alzou-tc-m", size: "M", color: "Terracotta", color_hex: "#B5633A", sku: "LCA-TC-M", stock: 10, additional_price: 0, is_active: true }
    ],
    reviews: [],
    avg_rating: 0,
    review_count: 0,
    display_order: 11,
    created_at: "2026-04-05"
  },
  {
    id: "prod-trench",
    name: "Le Manteau Sable",
    slug: "le-manteau-sable",
    description: "An unstructured, ankle-length trench coat tailored in a lightweight, breathable sand linen. Includes a relaxed storm flap, side pockets, and an extra wide waist belt. Ideal for layering in sun-soaked afternoons.",
    price: 1890000,
    compare_at_price: null,
    is_featured: false,
    is_available: true,
    tags: [],
    primary_image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80", // re-use but stylized
    category: { id: "cat-4", name: "Outerwear", slug: "outerwear" },
    category_name: "Outerwear",
    images: [
      { id: "img-trench-1", image_url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80", alt_text: "Le Manteau Sable layout", is_primary: true, display_order: 1 }
    ],
    variants: [
      { id: "v-trench-sd-s", size: "S", color: "Sand", color_hex: "#C9B99A", sku: "LMS-SD-S", stock: 4, additional_price: 0, is_active: true },
      { id: "v-trench-sd-m", size: "M", color: "Sand", color_hex: "#C9B99A", sku: "LMS-SD-M", stock: 6, additional_price: 0, is_active: true }
    ],
    reviews: [],
    avg_rating: 0,
    review_count: 0,
    display_order: 12,
    created_at: "2026-05-02"
  },

  // --- ACCESSORIES ---
  {
    id: "prod-chiquito",
    name: "Le Chiquito Bag",
    slug: "le-chiquito-bag",
    description: "The ultimate brand emblem. A structured micro handbag featuring a reinforced circular handle, a detachable crossbody strap, and our gold-plated signature 'Juicy' sun logo lettering at the corner. Crafted in a gorgeous terracotta-toned textured cow leather.",
    price: 2100000,
    compare_at_price: null,
    is_featured: true,
    is_available: true,
    tags: ["bestseller", "new-arrival"],
    primary_image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    category: { id: "cat-5", name: "Accessories", slug: "accessories" },
    category_name: "Accessories",
    images: [
      { id: "img-chiquito-1", image_url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80", alt_text: "Le Chiquito Bag view", is_primary: true, display_order: 1 }
    ],
    variants: [
      { id: "v-chiquito-tc-s", size: "S", color: "Terracotta", color_hex: "#B5633A", sku: "LCB-TC-S", stock: 3, additional_price: 0, is_active: true },
      { id: "v-chiquito-sd-s", size: "S", color: "Sand", color_hex: "#C9B99A", sku: "LCB-SD-S", stock: 5, additional_price: 0, is_active: true }
    ],
    reviews: [
      { id: "rev-chiquito-1", rating: 5, body: "A literal work of art. Fits just my keys and lipstick but the aesthetic factor is off the charts.", customer_name: "Amelie B.", created_at: "2026-05-12" }
    ],
    avg_rating: 5.0,
    review_count: 1,
    display_order: 13,
    created_at: "2026-03-28"
  },
  {
    id: "prod-bambino",
    name: "Le Bambino Bag",
    slug: "le-bambino-bag",
    description: "A rectangular, envelope-style shoulder handbag sculpted in warm ivory smooth leather. Detailed with a magnetic flap closure, back patch pocket, and sleek thin shoulder straps.",
    price: 2600000,
    compare_at_price: null,
    is_featured: false,
    is_available: true,
    tags: ["bestseller"],
    primary_image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
    category: { id: "cat-5", name: "Accessories", slug: "accessories" },
    category_name: "Accessories",
    images: [
      { id: "img-bambino-1", image_url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80", alt_text: "Le Bambino Bag view", is_primary: true, display_order: 1 }
    ],
    variants: [
      { id: "v-bambino-iv-s", size: "S", color: "Ivory", color_hex: "#FAF5E9", sku: "LBB-IV-S", stock: 4, additional_price: 0, is_active: true }
    ],
    reviews: [],
    avg_rating: 0,
    review_count: 0,
    display_order: 14,
    created_at: "2026-04-10"
  },
  {
    id: "prod-hat",
    name: "Le Chapeau Valensole",
    slug: "le-chapeau-valensole",
    description: "An iconic, oversized sun hat beautifully handwoven in natural straw. Features an extra wide, floppy brim and delicate black cotton grosgrain ribbon ties to knot under the chin. A striking editorial statement.",
    price: 750000,
    compare_at_price: 990000,
    is_featured: false,
    is_available: true,
    tags: ["sale"],
    primary_image: "https://images.unsplash.com/photo-1572426428784-06ba75d40a23?auto=format&fit=crop&w=800&q=80",
    category: { id: "cat-5", name: "Accessories", slug: "accessories" },
    category_name: "Accessories",
    images: [
      { id: "img-hat-1", image_url: "https://images.unsplash.com/photo-1572426428784-06ba75d40a23?auto=format&fit=crop&w=800&q=80", alt_text: "Le Chapeau Valensole straw hat", is_primary: true, display_order: 1 }
    ],
    variants: [
      { id: "v-hat-nt-s", size: "S", color: "Natural", color_hex: "#E8D8C8", sku: "LCV-NT-S", stock: 8, additional_price: 0, is_active: true }
    ],
    reviews: [],
    avg_rating: 0,
    review_count: 0,
    display_order: 15,
    created_at: "2026-05-04"
  },
  {
    id: "prod-earrings",
    name: "L'Accessoire Tournesol",
    slug: "laccessoire-tournesol",
    description: "Oversized, hand-hammered hoop earrings heavily electroplated in 24k gold. Embedded with a central sunburst emblem that captures the warm Mediterranean light with every movement.",
    price: 590000,
    compare_at_price: null,
    is_featured: false,
    is_available: true,
    tags: [],
    primary_image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    category: { id: "cat-5", name: "Accessories", slug: "accessories" },
    category_name: "Accessories",
    images: [
      { id: "img-earrings-1", image_url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80", alt_text: "L'Accessoire Tournesol earrings", is_primary: true, display_order: 1 }
    ],
    variants: [
      { id: "v-earrings-gd-s", size: "S", color: "Gold", color_hex: "#D4AF37", sku: "LAT-GD-S", stock: 12, additional_price: 0, is_active: true }
    ],
    reviews: [],
    avg_rating: 0,
    review_count: 0,
    display_order: 16,
    created_at: "2026-04-25"
  },

  // --- SETS ---
  {
    id: "prod-ens-lin",
    name: "L'Ensemble Lin",
    slug: "lensemble-lin",
    description: "A two-piece summer set consisting of a fitted, structured asymmetrical crop vest and relaxed, high-waisted wide-leg trousers. Sculpted in a raw, natural linen canvas, this set exudes effortless luxury and modern editorial chic.",
    price: 1850000,
    compare_at_price: 2300000,
    is_featured: true,
    is_available: true,
    tags: ["new-arrival", "sale"],
    primary_image: "https://images.unsplash.com/photo-1608234807905-4465857986fd?auto=format&fit=crop&w=800&q=80",
    category: { id: "cat-6", name: "Sets", slug: "sets" },
    category_name: "Sets",
    images: [
      { id: "img-ens-lin-1", image_url: "https://images.unsplash.com/photo-1608234807905-4465857986fd?auto=format&fit=crop&w=800&q=80", alt_text: "L'Ensemble Lin canvas view", is_primary: true, display_order: 1 }
    ],
    variants: [
      { id: "v-enslin-nt-s", size: "S", color: "Natural", color_hex: "#E5DEC9", sku: "LEL-NT-S", stock: 5, additional_price: 0, is_active: true },
      { id: "v-enslin-nt-m", size: "M", color: "Natural", color_hex: "#E5DEC9", sku: "LEL-NT-M", stock: 7, additional_price: 0, is_active: true }
    ],
    reviews: [
      { id: "rev-enslin-1", rating: 5, body: "Absolutely stunning two-piece. Fitting is extremely chic and the raw linen material is outstanding.", customer_name: "Charlotte D.", created_at: "2026-05-16" }
    ],
    avg_rating: 5.0,
    review_count: 1,
    display_order: 17,
    created_at: "2026-04-12"
  },
  {
    id: "prod-ens-soleil",
    name: "L'Ensemble Soleil",
    slug: "lensemble-soleil",
    description: "The perfect sun-soaked ensemble. Comprises a short-sleeved cropped tailored linen blazer and matching double-pleated, high-waisted shorts in our signature terracotta. A striking profile.",
    price: 1650000,
    compare_at_price: null,
    is_featured: false,
    is_available: true,
    tags: [],
    primary_image: "https://images.unsplash.com/photo-1549064482-6779ba3292fe?auto=format&fit=crop&w=800&q=80",
    category: { id: "cat-6", name: "Sets", slug: "sets" },
    category_name: "Sets",
    images: [
      { id: "img-soleil-1", image_url: "https://images.unsplash.com/photo-1549064482-6779ba3292fe?auto=format&fit=crop&w=800&q=80", alt_text: "L'Ensemble Soleil layout", is_primary: true, display_order: 1 }
    ],
    variants: [
      { id: "v-enssol-tc-s", size: "S", color: "Terracotta", color_hex: "#B5633A", sku: "LES-TC-S", stock: 4, additional_price: 0, is_active: true },
      { id: "v-enssol-tc-m", size: "M", color: "Terracotta", color_hex: "#B5633A", sku: "LES-TC-M", stock: 6, additional_price: 0, is_active: true }
    ],
    reviews: [],
    avg_rating: 0,
    review_count: 0,
    display_order: 18,
    created_at: "2026-05-08"
  }
];
