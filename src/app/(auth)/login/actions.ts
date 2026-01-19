"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login Error:", error.message);
    return redirect("/login?message=Gagal login: " + error.message);
  }

  revalidatePath("/", "layout");
  // Langsung ke dashboard biar sat-set ngetesnya
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/auth/callback`,
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    console.error("Signup Error:", error.message);
    return redirect("/login?message=Gagal daftar: " + error.message);
  }

  return redirect("/login?message=Cek email untuk konfirmasi akun");
}

/**
 * Server Action untuk mengeluarkan user dari sesi aktif.
 * Menghapus session di Supabase dan mengarahkan kembali ke halaman login.
 */
export async function logout() {
  const supabase = await createClient();

  // 1. Sign out dari Supabase (ini akan membersihkan session)
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout error:", error.message);
    // Kita tetap redirect karena biasanya session lokal sudah bersih
  }

  // 2. Bersihkan cache agar UI berubah (misal nama user di navbar hilang)
  revalidatePath("/", "layout");
  
  // 3. Lempar ke halaman login
  redirect("/login");
}