import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";
import { RecentSaleItem } from "../components/recent-sales";
import { SalesOverviewPoint } from "../components/overview-chart";

type OrderWithProfile = Tables<"orders"> & {
  profiles?: {
    full_name: string | null;
  } | null;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

function getMonthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * Service layer untuk fitur Dashboard Admin.
 */
export const dashboardService = {
  async getProductCounts(): Promise<{ productCount: number; activeProductCount: number }> {
    const supabase = await createClient();

    const [{ count: productCount }, { count: activeProductCount }] = await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
    ]);

    return {
      productCount: productCount ?? 0,
      activeProductCount: activeProductCount ?? 0,
    };
  },

  /**
   * Fetch 5 order terbaru, join ke profiles untuk nama customer.
   * NOTE: email tidak tersedia di tabel `profiles` pada schema saat ini, jadi `customerEmail` dibiarkan null.
   */
  async getRecentSales(): Promise<RecentSaleItem[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("orders")
      .select("id, created_at, total_price, user_id, profiles(full_name)")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      console.error("[dashboardService.getRecentSales] Error:", error.message);
      return [];
    }

    const rows = (data as unknown as OrderWithProfile[]) ?? [];

    return rows.map((row) => ({
      id: row.id,
      createdAt: row.created_at ?? null,
      totalPrice: row.total_price,
      customerName: row.profiles?.full_name ?? null,
      customerEmail: null,
    }));
  },

  /**
   * Aggregasi revenue order per bulan (12 bulan terakhir).
   * Dilakukan di JS agar tidak perlu SQL group by / RPC.
   */
  async getSalesOverview(): Promise<SalesOverviewPoint[]> {
    const supabase = await createClient();

    // ambil order sejak 12 bulan terakhir
    const now = new Date();
    const start = new Date(now);
    start.setMonth(now.getMonth() - 11);
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("orders")
      .select("created_at, total_price")
      .gte("created_at", start.toISOString())
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[dashboardService.getSalesOverview] Error:", error.message);
      return MONTHS.map((m) => ({ name: m, total: 0 }));
    }

    // build last 12 month buckets
    const months: { key: string; name: string; total: number }[] = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(start);
      d.setMonth(start.getMonth() + i);
      months.push({ key: getMonthKey(d), name: MONTHS[d.getMonth()], total: 0 });
    }

    for (const row of (data ?? []) as { created_at: string | null; total_price: number }[]) {
      if (!row.created_at) continue;
      const d = new Date(row.created_at);
      const key = getMonthKey(d);
      const bucket = months.find((m) => m.key === key);
      if (bucket) bucket.total += row.total_price;
    }

    return months.map(({ name, total }) => ({ name, total }));
  },
};
