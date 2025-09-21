import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Ramein',
  description: 'Panel administrasi untuk mengelola kegiatan dan pengguna',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
