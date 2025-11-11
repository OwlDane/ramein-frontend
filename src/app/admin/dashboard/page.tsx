"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  BarChart3,
  LogOut,
  AlertCircle,
  Clock,
  Calendar,
  Users,
  Award,
  Settings,
  Banknote,
  FileText,
} from "lucide-react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminEventManagement } from "@/components/admin/AdminEventManagement";
import { AdminUserManagement } from "@/components/admin/AdminUserManagement";
import { AdminCertificateManagementNew as AdminCertificateManagement } from "@/components/admin/AdminCertificateManagementNew";
import { AdminPaymentManagement } from "@/components/admin/AdminPaymentManagement";
import { AdminArticleManagement } from "@/components/admin/AdminArticleManagement";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  isAdmin: boolean;
}

function AdminDashboardContent() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // const [error] = useState('');
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const searchParams = useSearchParams();
  useEffect(() => {
    // Sinkronkan tab aktif dengan query param setiap kali berubah
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(300); // 5 minutes in seconds
  const router = useRouter();

  const checkAdminAuth = useCallback(async () => {
    try {
      const adminToken = localStorage.getItem("ramein_admin_token");
      if (!adminToken) {
        router.push("/admin/login");
        return;
      }

      const response = await fetch(
        "http://localhost:3001/api/admin/auth/verify",
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setAdmin(data.admin);
        setSessionTimeLeft(300); // Reset session timer
      } else {
        localStorage.removeItem("ramein_admin_token");
        router.push("/admin/login");
      }
    } catch (error) {
      console.error("Admin auth check failed:", error);
      localStorage.removeItem("ramein_admin_token");
      router.push("/admin/login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("ramein_admin_token");
    router.push("/admin/login");
  }, [router]);

  useEffect(() => {
    checkAdminAuth();
  }, [checkAdminAuth]);

  useEffect(() => {
    if (sessionTimeLeft > 0) {
      const timer = setTimeout(() => {
        setSessionTimeLeft(sessionTimeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      handleLogout();
    }
  }, [sessionTimeLeft, handleLogout]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="h-14 w-14 rounded-full shadow-lg"
        >
          <Settings className="w-6 h-6" />
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Left Sidebar Navigation - Responsive */}
      <aside
        className={`
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
                lg:translate-x-0
                fixed lg:sticky
                top-0 left-0
                w-64 h-screen
                bg-card border-r border-border
                flex flex-col
                transition-transform duration-300 ease-in-out
                z-50 lg:z-auto
            `}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Ramein</h1>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              OVERVIEW
            </p>
            <Button
              variant={activeTab === "overview" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                setActiveTab("overview");
                setIsMobileMenuOpen(false);
              }}
            >
              <BarChart3 className="w-4 h-4 mr-3" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "events" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                setActiveTab("events");
                setIsMobileMenuOpen(false);
              }}
            >
              <Calendar className="w-4 h-4 mr-3" />
              Kegiatan
            </Button>
            <Button
              variant={activeTab === "users" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                setActiveTab("users");
                setIsMobileMenuOpen(false);
              }}
            >
              <Users className="w-4 h-4 mr-3" />
              Pengguna
            </Button>
          </div>

          <div className="space-y-1 pt-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              MANAGEMENT
            </p>
            <Button
              variant={activeTab === "payments" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                setActiveTab("payments");
                setIsMobileMenuOpen(false);
              }}
            >
              <Banknote className="w-4 h-4 mr-3" />
              Pembayaran
            </Button>
            <Button
              variant={activeTab === "certificates" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                setActiveTab("certificates");
                setIsMobileMenuOpen(false);
              }}
            >
              <Award className="w-4 h-4 mr-3" />
              Sertifikat
            </Button>
            <Button
              variant={activeTab === "articles" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                setActiveTab("articles");
                setIsMobileMenuOpen(false);
              }}
            >
              <FileText className="w-4 h-4 mr-3" />
              Artikel
            </Button>
            <Button
              variant={activeTab === "settings" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                setActiveTab("settings");
                setIsMobileMenuOpen(false);
              }}
            >
              <Settings className="w-4 h-4 mr-3" />
              Pengaturan
            </Button>
          </div>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary">
                {admin.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{admin.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {admin.email}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span className={sessionTimeLeft < 60 ? "text-destructive" : ""}>
                {formatTime(sessionTimeLeft)}
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col w-full">
        {/* Top Header */}
        <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">
                {activeTab === "overview" && "Dashboard"}
                {activeTab === "events" && "Manajemen Kegiatan"}
                {activeTab === "users" && "Manajemen Pengguna"}
                {activeTab === "payments" && "Manajemen Pembayaran"}
                {activeTab === "certificates" && "Manajemen Sertifikat"}
                {activeTab === "articles" && "Manajemen Artikel"}
                {activeTab === "settings" && "Pengaturan"}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {activeTab === "overview" &&
                  "Ringkasan statistik dan aktivitas sistem"}
                {activeTab === "events" && "Kelola kegiatan dan event"}
                {activeTab === "users" && "Kelola pengguna dan peserta"}
                {activeTab === "payments" &&
                  "Monitor dan kelola transaksi pembayaran"}
                {activeTab === "certificates" &&
                  "Generate dan kelola sertifikat"}
                {activeTab === "articles" &&
                  "Kelola artikel dan konten blog"}
                {activeTab === "settings" &&
                  "Konfigurasi sistem dan pengaturan"}
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6">
          {sessionTimeLeft < 60 && (
            <Alert className="mb-4 sm:mb-6" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs sm:text-sm">
                Session akan berakhir dalam {formatTime(sessionTimeLeft)}.
                Silakan refresh halaman untuk memperpanjang session.
              </AlertDescription>
            </Alert>
          )}

          {/* Tab Content */}
          {activeTab === "overview" && <AdminDashboard />}
          {activeTab === "events" && <AdminEventManagement />}
          {activeTab === "users" && <AdminUserManagement />}
          {activeTab === "certificates" && <AdminCertificateManagement />}
          {activeTab === "payments" && <AdminPaymentManagement />}
          {activeTab === "articles" && (
            <AdminArticleManagement token={localStorage.getItem("ramein_admin_token") || ""} />
          )}
          {activeTab === "settings" && (
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Admin</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Pengaturan admin akan tersedia di versi selanjutnya.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}
