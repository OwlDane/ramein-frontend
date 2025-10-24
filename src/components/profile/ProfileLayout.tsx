"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Calendar,
  Award,
  CreditCard,
  Lock,
  Shield,
  Heart,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

// Import content components
import { ProfileSettings } from "@/components/profile/ProfileSettings";
import { ProfileEvents } from "@/components/profile/ProfileEvents";
import { ProfileCertificates } from "@/components/profile/ProfileCertificates";
import { ProfileTransactions } from "@/components/profile/ProfileTransactions";

interface ProfileLayoutProps {
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    education?: string;
    avatar?: string | null;
  };
}

type MenuView =
  | "settings"
  | "events"
  | "transactions"
  | "certificates"
  | "password"
  | "privacy"
  | "wishlist";

export function ProfileLayout({ user: initialUser }: ProfileLayoutProps) {
  const { logout } = useAuth();
  const router = useRouter();
  const [activeView, setActiveView] = useState<MenuView>("settings");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(initialUser);
  const [userToken, setUserToken] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("ramein_token");
    if (token) {
      setUserToken(token);
      fetchUserProfile(token);
    }
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      const { authAPI } = await import("@/lib/auth");
      const profile = await authAPI.getProfile(token);
      setUser(profile);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Berhasil logout");
    router.push("/login");
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  const menuItems = [
    {
      id: "settings" as MenuView,
      label: "Pengaturan Akun",
      icon: User,
    },
    {
      id: "events" as MenuView,
      label: "Riwayat Event",
      icon: Calendar,
    },
    {
      id: "transactions" as MenuView,
      label: "Transaksi Pembayaran",
      icon: CreditCard,
    },
    {
      id: "certificates" as MenuView,
      label: "Sertifikat Saya",
      icon: Award,
    },
    {
      id: "password" as MenuView,
      label: "Atur Kata Sandi",
      icon: Lock,
    },
    {
      id: "privacy" as MenuView,
      label: "Privasi Akun",
      icon: Shield,
    },
    {
      id: "wishlist" as MenuView,
      label: "Wishlist",
      icon: Heart,
    },
  ];

  const renderContent = () => {
    switch (activeView) {
      case "settings":
        return (
          <ProfileSettings
            user={user}
            userToken={userToken}
            onUpdate={setUser}
          />
        );
      case "events":
        return <ProfileEvents userToken={userToken} />;
      case "transactions":
        return <ProfileTransactions userToken={userToken} />;
      case "certificates":
        return <ProfileCertificates userToken={userToken} />;
      case "password":
        return <ChangePassword userToken={userToken} />;
      case "privacy":
        return <PrivacySettings userToken={userToken} />;
      case "wishlist":
        return <Wishlist userToken={userToken} />;
      default:
        return (
          <ProfileSettings
            user={user}
            userToken={userToken}
            onUpdate={setUser}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
            <h1 className="text-lg font-semibold">Profil</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 lg:py-8">        
        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar */}
          <AnimatePresence>
            {(isSidebarOpen ||
              (typeof window !== "undefined" && window.innerWidth >= 1024)) && (
              <motion.aside
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                className="lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] fixed inset-y-0 left-0 z-50 lg:z-auto w-[280px] bg-white lg:bg-transparent"
              >
                {/* Mobile Overlay */}
                <div
                  className="lg:hidden fixed inset-0 bg-black/50 -z-10"
                  onClick={() => setIsSidebarOpen(false)}
                />

                <Card className="h-full overflow-hidden border shadow-sm">
                  <div className="h-full overflow-y-auto">
                    {/* User Profile Header */}
                    <div className="p-6 border-b bg-gradient-to-br from-primary/5 to-primary/10">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="relative">
                          <div className="h-16 w-16 rounded-full ring-2 ring-primary/20 overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            {user.avatar ? (
                              <Image
                                src={user.avatar}
                                alt={user.name}
                                width={64}
                                height={64}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-xl font-bold text-primary">
                                {getInitials(user.name)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Hai,
                          </p>
                          <h3 className="font-semibold text-base">
                            {user.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Back Button */}
                    <div className="px-3 pt-3 pb-2 border-b">
                      <button
                        onClick={() => router.back()}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="flex-1 text-left font-medium">Kembali</span>
                      </button>
                    </div>

                    {/* Menu Items */}
                    <div className="p-3">
                      {menuItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveView(item.id);
                            setIsSidebarOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm ${
                            activeView === item.id
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <item.icon className="w-4 h-4" />
                          <span className="flex-1 text-left">{item.label}</span>
                          {activeView === item.id && (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                      ))}

                      {/* Logout Button */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm text-red-600 hover:bg-red-50 mt-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="flex-1 text-left">Log Out</span>
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <main className="min-h-[600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

// Placeholder Components for other features

function ChangePassword({}: { userToken: string }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-6">Atur Kata Sandi</h2>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium mb-2">
              Kata Sandi Lama
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Masukkan kata sandi lama"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Kata Sandi Baru
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Masukkan kata sandi baru"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Konfirmasi Kata Sandi Baru
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Konfirmasi kata sandi baru"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="outline">Batal</Button>
            <Button>Simpan Perubahan</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PrivacySettings({}: { userToken: string }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-6">Privasi Akun</h2>
        <div className="space-y-6 max-w-2xl">

          <div className="flex items-center justify-between py-4 border-b">
            <div>
              <h3 className="font-medium">Email Notifikasi</h3>
              <p className="text-sm text-muted-foreground">
                Terima notifikasi event via email
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <div className="flex items-center justify-between py-4">
            <div>
              <h3 className="font-medium">Tampilkan Aktivitas</h3>
              <p className="text-sm text-muted-foreground">
                Perlihatkan event yang Anda ikuti
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Wishlist({}: { userToken: string }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Wishlist</h2>
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
            <Heart className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-base font-medium mb-2">Wishlist Kosong</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Event yang Anda simpan akan muncul di sini
          </p>
          <Button onClick={() => (window.location.href = "/")}>
            Jelajahi Event
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
