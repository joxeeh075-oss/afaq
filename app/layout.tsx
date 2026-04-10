import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Afaq Platform',
  description: 'منصة إدارة الجلسات المباشرة والتعليم الإلكتروني',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
