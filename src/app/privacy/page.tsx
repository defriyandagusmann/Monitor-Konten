import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-midnight-950 text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 space-y-6">
        
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-coral-400 hover:text-coral-300 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Aplikasi</span>
        </Link>

        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="p-2.5 rounded-xl bg-coral-500/20 text-coral-400 border border-coral-500/30">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Kebijakan Privasi (Privacy Policy)</h1>
            <p className="text-xs text-slate-400">Monitor Konten Studio - Terakhir diperbarui: 2026</p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <section className="space-y-1.5">
            <h2 className="text-sm font-bold text-white">1. Pendahuluan</h2>
            <p>
              Aplikasi <strong>Monitor Konten</strong> adalah platform manajemen alur kerja konten internal yang digunakan oleh tim kreator. Kami menghargai privasi Anda dan berkomitmen untuk melindungi informasi pribadi pengguna.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-sm font-bold text-white">2. Informasi yang Kami Kumpulkan</h2>
            <p>
              Ketika Anda masuk menggunakan Akun Google (Google OAuth), kami hanya mengakses informasi dasar profil publik Anda:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>Nama lengkap profil Google</li>
              <li>Alamat email Google</li>
              <li>Foto avatar profil Google</li>
            </ul>
            <p className="pt-1">
              Kami <strong>tidak pernah</strong> mengakses password Google Anda, email pribadi di Gmail, file di Google Drive Anda, maupun data pribadi sensitif lainnya.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-sm font-bold text-white">3. Penggunaan Informasi</h2>
            <p>
              Informasi profil Google Anda hanya digunakan secara eksklusif untuk:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>Mengidentifikasi Anda sebagai kolaborator di workspace tim.</li>
              <li>Menampilkan nama dan avatar Anda pada kartu konten yang Anda buat atau ditugaskan kepada Anda.</li>
            </ul>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-sm font-bold text-white">4. Keamanan Data</h2>
            <p>
              Data autentikasi dikelola secara aman oleh infrastruktur <strong>Supabase</strong> yang terenkripsi. Kami tidak membagikan, memperjualbelikan, atau menyebarkan data pengguna kepada pihak ketiga mana pun.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-sm font-bold text-white">5. Kontak</h2>
            <p>
              Jika Anda memiliki pertanyaan seputar kebijakan privasi ini, silakan hubungi administrator tim melalui repositori GitHub aplikasi ini.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}

