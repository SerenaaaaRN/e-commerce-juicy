# skill.gsap — GSAP Cinematic Reference for Juicy 🍊

Panduan ini berisi teknik dan arsitektur **animasi GSAP premium dan cinematic** yang diimplementasikan khusus untuk estetika mewah, hangat, dan editorial ala **Juicy**.

Semua teknik di bawah ini memprioritaskan kontrol scroll (**scrub**), kedalaman **3D**, timing **organik**, serta standar visual tingkat tinggi yang terisolasi dalam folder modul animasi khusus.

---

## 📂 Struktur Modul Animasi (`@/components/animations/`)

Untuk menghindari kekakuan serta menjaga *reusability* basis kode, semua animasi GSAP premium Juicy diisolasi ke dalam folder `@/components/animations/`. Folder ini menyimpan visual components murni tanpa bercampur dengan logika bisnis:

| Nama Komponen | File Path | Teknik Utama | Efek Visual |
| :--- | :--- | :--- | :--- |
| **DioramaSection** | `.../sections/DioramaSection.tsx` | Box-to-Fullscreen Mask Zoom | Pembukaan portal dari kartu kecil melayang ke tampilan layar penuh (*full-bleed*) dengan tepi tajam minimalis. |
| **AsymmetricParallaxSection** | `.../animations/AsymmetricParallaxSection.tsx` | Vertical Scroll Parallax | Lembaran ubin foto bergaya editorial yang meluncur naik sumbu Y secara asimetris dengan panel teks mengambang. |
| **OrigamiSplitSection** | `.../animations/OrigamiSplitSection.tsx` | Dual-Axis 3D Flipping | Transisi teaterikal di mana satu sisi melipat ke belakang sumbu Y, dan sisi teks turun dari sumbu X. |

---

## 🏛️ Detail Teknik & Director Styles

### 1. Box-to-Fullscreen Zoom Portal (Diorama)
*   **Komponen:** `DioramaSection.tsx`
*   **Teknik GSAP:** `ScrollTrigger Pinning` + `Dual-Direction scale` + `container scale exit`
*   **Efek Visual (Director Style):**
    > *"Kanvas dimulai dengan sebuah kartu tajam minimalis berukuran 70% viewport yang melayang anggun di tengah layar. Di dalam kartu, foto lanskap luar terlihat dizoom dalam (scale: 1.35). Begitu user menscroll, kartu tersebut mekar perlahan memenuhi seluruh layar (100vw, 100vh). Secara simultan, foto di dalamnya ber-zoom mundur berlawanan arah ke 1.05, memberikan ilusi topeng lubang kunci (keyhole mask parallax) yang sangat taktil. Di akhir scroll, wadah diorama menyusut tipis dan memudar halus (fade-out) sebelum pin terlepas."*
*   **Wow Factor:** Membongkar batasan frame foto linier statis. Gerakan berlawanan (*differential zooming*) menyihir mata user seakan sedang menatap teropong arsitektural yang terbuka lebar.

### 2. Asymmetric Parallax Section
*   **Komponen:** `AsymmetricParallaxSection.tsx`
*   **Teknik GSAP:** `ScrollTrigger` + `Relative yPercent offset`
*   **Efek Visual (Director Style):**
    > *"Sebuah ubin kanvas foto bergaya editorial format medium (aspect-ratio 4:5) meluncur tenang secara vertikal. Ketika user melakukan scroll ke bawah, wadah foto luar bergerak statis mengikuti scroll normal, namun gambar foto di dalam wadah meluncur perlahan dengan kecepatan berbeda (yPercent: -12% ke 12%). Ini menghasilkan sapuan kedalaman berpasir yang sangat anggun melintasi panel teks bergaya tipografi serif di sebelahnya."*
*   **Wow Factor:** Sangat ramah performa (60 FPS murni menggunakan translasi GPU), memberikan kesan kemewahan editorial majalah cetak kelas atas yang hidup secara digital.

### 3. Origami Split-Fold Reveal
*   **Komponen:** `OrigamiSplitSection.tsx`
*   **Teknik GSAP:** `ScrollTrigger` + `rotateX / rotateY 3D rotations` + `transformOrigin adjustment`
*   **Efek Visual (Director Style):**
    > *"Split screen asimetris di mana saat scroll dimulai, separuh layar bagian gambar melipat 45 derajat ke belakang pada sumbu Y (rotateY) seakan halaman jurnal kulit tebal yang tertutup. Secara simultan, separuh layar bagian teks berputar turun dari langit-langit virtual (rotateX: 90deg ke 0deg) seolah penutup kotak kado tebal yang terbuka mulus tanpa hambatan."*
*   **Wow Factor:** Transisi 3D taktil non-linear yang mematahkan kebiasaan mata manusia yang terbiasa melihat pergerakan scroll vertikal flat.

---

## 🛠️ Blueprint Implementasi

### A. Asymmetric Parallax Section
Digunakan secara konsisten pada halaman **Atelier** (`/atelier`) untuk menyelimuti 4 section editorial utamanya:

```tsx
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export const AsymmetricParallaxSection = ({
  imgSrc,
  imgAlt,
  badgeText,
  label,
  title,
  paragraphs,
  reverse = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.2,
      },
    });

    // Menghasilkan pergerakan parallax asimetris sumbu Y yang presisi
    tl.fromTo(img, { yPercent: -12 }, { yPercent: 12, ease: "none" });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === container) t.kill();
      });
    };
  }, []);

  return (
    <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24 overflow-hidden">
      <div className={`lg:col-span-7 aspect-[4/5] overflow-hidden relative ${reverse ? "lg:order-last" : ""}`}>
        <img ref={imgRef} src={imgSrc} alt={imgAlt} className="w-full h-[125%] object-cover absolute top-0" />
      </div>
      <div className="lg:col-span-5 flex flex-col gap-4 text-left">
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-terracotta">{badgeText}</span>
        <h3 className="font-playfair text-2xl lg:text-3xl font-normal">{title}</h3>
        {paragraphs.map((p, i) => <p key={i} className="text-xs text-dust">{p}</p>)}
      </div>
    </div>
  );
};
```

### B. Box-to-Fullscreen Zoom Portal
Blueprint teruji yang diintegrasikan langsung pada **DioramaSection** di halaman Home (`/`):

```tsx
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export const DioramaSection = ({ subtitle, title, description, backgroundImg }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const card = cardRef.current;
    const img = imgRef.current;
    const overlay = overlayRef.current;
    const text = textRef.current;

    if (!container || !card || !img || !overlay || !text) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "+=300%",
        scrub: 1.5,
        pin: true,
        anticipatePin: 1,
      },
    });

    // Inisialisasi State Awal Kartu Melayang
    gsap.set(card, { width: "70%", height: "70vh" });
    gsap.set(img, { scale: 1.35 });
    gsap.set(overlay, { opacity: 0 });
    gsap.set(text, { opacity: 0, y: 60 });

    tl.to(card, { width: "100%", height: "100vh", ease: "power2.inOut" }, 0)
      .to(img, { scale: 1.05, ease: "power2.inOut" }, 0)
      .to(overlay, { opacity: 0.45, ease: "power2.inOut" }, 0.1)
      .to(text, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.45)
      // Exit Out: Memudar dan mengecil halus saat scroll berakhir
      .to(container, { opacity: 0, scale: 0.96, ease: "power2.inOut" }, 2.4);

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === container) t.kill();
      });
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      <div ref={cardRef} className="relative overflow-hidden shadow-2xl flex items-center justify-center">
        <img ref={imgRef} src={backgroundImg} className="absolute inset-0 w-full h-full object-cover" />
        <div ref={overlayRef} className="absolute inset-0 bg-[#1e130c]" />
        <div ref={textRef} className="relative max-w-2xl px-6 text-center z-10 flex flex-col items-center gap-6">
          <h2 className="font-playfair text-4xl lg:text-6xl text-chalk">{title}</h2>
          <p className="text-xs text-sand/85 max-w-lg">{description}</p>
        </div>
      </div>
    </div>
  );
};
```

---

*Catatan Kinerja Animasi: Selalu gunakan properti `will-change: transform` pada elemen-elemen paralaks intensif dan pastikan gambar dioptimalkan secara berkala untuk mempertahankan benchmark rendering 60 FPS pada perangkat seluler.*
