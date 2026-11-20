# 🎬 Monitor Konten - Studio Pipeline Skrip ke Posting

Aplikasi monitoring konten modern dan kolaboratif dari tahap perumusan ide, penulisan skrip terstruktur (Hook 3 Detik, Body, Call to Action, Visual B-Roll), proses syuting/produksi, video editing, persetujuan (review & approval), hingga jadwal posting multi-platform (TikTok, Instagram Reels, YouTube Shorts, YouTube Video).

---

## ✨ Fitur Unggulan

- **6 Tahap Pipeline Alur Konten (Kanban Board)**:
  1. 💡 **Ide & Riset**: Brainstorming ide topik & referensi.
  2. 📝 **Penulisan Skrip**: Struktur naskah video 3 bagian (Hook, Body, CTA) + Catatan B-roll.
  3. 🎬 **Produksi & Take**: Syuting, checklist talent, dan rekaman audio.
  4. ✂️ **Editing Video**: Link folder footage (Google Drive/Dropbox), preview draft & revisi.
  5. 🔍 **Review & Approval**: Persetujuan tim dengan 1-klik Approve atau Minta Revisi.
  6. 🚀 **Terjadwal & Posted**: Penjadwalan tanggal tayang dan tracking link postingan live.

- **Mode Teleprompter**:
  - Tampilan teks berjalan tanpa distraksi untuk presenter/talent saat rekaman video.
  - Pengaturan kecepatan scroll otomatis dan ukuran font.

- **Kalender Publikasi**:
  - Memvisualisasikan slot postingan bulanan dan mingguan secara jelas.

- **Formula Hook Viral (Script Lab)**:
  - Bank formula hook berretensi tinggi (The Contrarian, The Immediate Value, The Costly Mistake, Story Behind the Scenes) dengan tombol 1-klik salin.

- **Desain Dual-Harmony (Maskulin & Feminin)**:
  - Menggabungkan ketegasan profesional (*Deep Midnight Slate* & *Crisp Steel*) dengan kehangatan kreatif (*Warm Rose*, *Soft Coral*, dan *Champagne Amber*).

- **Multi-User Real-time Sync & Google OAuth**:
  - Kolaborasi tim dengan Supabase PostgreSQL gratis.
  - Siap dihubungkan ke Google Login via Supabase Auth.
  - Didukung mode simulasi (demo mode) otomatis jika belum menginput kredensial database.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router, React 19, TypeScript)
- **Styling**: Tailwind CSS + Lucide Icons + Glassmorphism Modern
- **Database & Auth**: Supabase (PostgreSQL, Supabase Auth, Realtime WebSocket)

---

## 🚀 Cara Menjalankan

1. **Jalankan Aplikasi**:
   ```bash
   npm run dev
   ```
2. Buka browser di [http://localhost:3000](http://localhost:3000).

---

## 🔐 Setup Supabase & Google Login (Database Online Gratis)

1. Buat proyek gratis di [supabase.com](https://supabase.com).
2. Buka menu **SQL Editor** di Supabase, lalu jalankan seluruh isi file `supabase/schema.sql`.
3. Buka menu **Project Settings -> API** di Supabase, salin URL dan Anon Key ke file `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
   ```
4. Untuk mengaktifkan login Google, buka **Authentication -> Providers -> Google** di Supabase dan masukkan Google OAuth Client ID & Secret dari Google Cloud Console.

