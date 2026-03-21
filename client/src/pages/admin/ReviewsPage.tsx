import { useState } from "react";
import { Star, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

type Review = {
  id: string;
  product_id: string;
  product_name: string;
  customer_name: string;
  rating: number;
  body: string;
  is_published: boolean;
  created_at: string;
};

const MOCK_REVIEWS: Review[] = [
  {
    id: "rev-1",
    product_id: "prod-bahia",
    product_name: "La Robe Bahia",
    customer_name: "Isabella G.",
    rating: 5,
    body: "Absolutely breathtaking. The drape is so flattering and the French linen is premium and heavy enough to hold the shape beautifully.",
    is_published: true,
    created_at: "2026-05-10",
  },
  {
    id: "rev-2",
    product_id: "prod-bahia",
    product_name: "La Robe Bahia",
    customer_name: "Camille R.",
    rating: 4,
    body: "Beautiful dress. Make sure to size down if you are in between sizes, as the wrap is quite adjustable.",
    is_published: true,
    created_at: "2026-05-18",
  },
  {
    id: "rev-3",
    product_id: "prod-sauge",
    product_name: "Le Pantalon Sauge",
    customer_name: "Sarah V.",
    rating: 5,
    body: "Unbelievable quality. The fluid drape of the linen-blend makes these the most elegant trousers I own.",
    is_published: false,
    created_at: "2026-05-14",
  },
];

const ReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [publishedFilter, setPublishedFilter] = useState("all");
  const [productFilter, setProductFilter] = useState("all");

  const handleTogglePublish = (id: string) => {
    const updated = reviews.map((r) => {
      if (r.id === id) {
        const nextState = !r.is_published;
        toast.success(`Review ${nextState ? "published" : "hidden from storefront"}.`);
        return { ...r, is_published: nextState };
      }
      return r;
    });
    setReviews(updated);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      setReviews(reviews.filter((r) => r.id !== id));
      toast.success("Review deleted successfully.");
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesPublish =
      publishedFilter === "all" ||
      (publishedFilter === "published" && r.is_published) ||
      (publishedFilter === "hidden" && !r.is_published);
    
    const matchesProduct =
      productFilter === "all" || r.product_id === productFilter;

    return matchesPublish && matchesProduct;
  });

  const uniqueProducts = Array.from(
    new Map(reviews.map((r) => [r.product_id, r.product_name])).entries()
  );

  return (
    <div className="space-y-6 font-dm-sans text-soil select-none">
      <div>
        <h2 className="font-playfair text-2xl font-bold tracking-wider">Product Reviews Audit</h2>
        <p className="text-xs text-dust tracking-wide mt-1">Audit customer feedback logs, toggle visibility states, and clear spam.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border border-sand/40 bg-cream p-4 rounded-xs">
        <div className="flex items-center gap-3">
          <label className="text-[10px] font-bold tracking-widest uppercase text-dust">Product Filter:</label>
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="bg-chalk border border-sand/50 rounded-xs px-3 py-1.5 text-xs focus:outline-none focus:border-terracotta cursor-pointer font-medium"
          >
            <option value="all">All Products</option>
            {uniqueProducts.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          {[
            { key: "all", label: "All Reviews" },
            { key: "published", label: "Published" },
            { key: "hidden", label: "Hidden" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setPublishedFilter(tab.key)}
              className={`rounded-xs px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-colors cursor-pointer border ${
                publishedFilter === tab.key
                  ? "bg-soil text-chalk border-soil"
                  : "bg-chalk text-soil border-sand/55 hover:bg-cream"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-sand/40 rounded-xs bg-cream overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-sand/30 bg-sand/10 text-[10px] font-bold tracking-wider uppercase text-dust">
              <th className="p-4">Customer</th>
              <th className="p-4">Target Product</th>
              <th className="p-4">Rating</th>
              <th className="p-4 w-96">Feedback Comment</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand/20">
            {filteredReviews.map((r) => (
              <tr key={r.id} className="hover:bg-sand/5 transition-colors">
                <td className="p-4 font-bold text-soil">{r.customer_name}</td>
                <td className="p-4 font-semibold text-soil/85">{r.product_name}</td>
                <td className="p-4">
                  <div className="flex items-center gap-0.5 text-terracotta">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`size-3.5 ${i < r.rating ? "fill-current" : "opacity-30"}`}
                      />
                    ))}
                  </div>
                </td>
                <td className="p-4 text-dust font-medium italic">"{r.body}"</td>
                <td className="p-4 font-semibold text-dust/80">{r.created_at}</td>
                <td className="p-4">
                  <span className={`inline-flex rounded-xs px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                    r.is_published
                      ? "bg-[#e2f0d9] text-[#385723]"
                      : "bg-[#fce4d6] text-[#c65911]"
                  }`}>
                    {r.is_published ? "Published" : "Hidden"}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => handleTogglePublish(r.id)}
                      className="p-1 hover:text-terracotta transition-colors border-0 bg-transparent cursor-pointer"
                      title={r.is_published ? "Hide from shop" : "Publish on shop"}
                    >
                      {r.is_published ? (
                        <EyeOff className="size-4.5 text-dust" />
                      ) : (
                        <Eye className="size-4.5 text-terracotta" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="p-1 hover:text-terracotta transition-colors border-0 bg-transparent cursor-pointer"
                      title="Delete review"
                    >
                      <Trash2 className="size-4.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredReviews.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-xs text-dust tracking-wider font-medium">
                  No product reviews currently available for these configurations.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewsPage;
