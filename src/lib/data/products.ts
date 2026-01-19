import { createClient } from "@/utils/supabase/server";

const getProducts = async (query: string = "") => {
  const supabase = await createClient();

  let supabaseQuery = supabase.from("products").select("*, categories(name)").order("created_at", { ascending: false });

  if (query) {
    supabaseQuery = supabaseQuery.ilike("name", `%${query}%`);
  }

  const { data, error } = await supabaseQuery;

  if (error) {
    console.error("Error fetching products:", error);
    throw new Error("Gagal memuat data produk");
  }

  return data;
};

export { getProducts };
