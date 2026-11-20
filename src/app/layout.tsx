import type { Metadata } from 'next';
import './globals.css';
import { ContentProvider } from '@/context/ContentContext';

export const metadata: Metadata = {
  title: 'Monitor Konten - Studio Pipeline Skrip ke Posting',
  description: 'Aplikasi Kolaborasi Monitoring Konten Multi-User Realtime dari Skrip hingga Posting',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className="antialiased selection:bg-coral-500/30 selection:text-coral-200">
        <ContentProvider>
          {children}
        </ContentProvider>
      </body>
    </html>
  );
}

