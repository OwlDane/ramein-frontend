"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Calendar,
  Award,
  CreditCard,
  Shield,
  Heart,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ArrowLeft,
  Ticket,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Import content components
import { ProfileSettings } from "@/components/profile/ProfileSettings";
import { ProfileEvents } from "@/components/profile/ProfileEvents";
import { ProfileCertificates } from "@/components/profile/ProfileCertificates";
import { ProfileTransactions } from "@/components/profile/ProfileTransactions";
import { PrivacySettings } from "@/components/profile/PrivacySettings";
import { Wishlist } from "@/components/profile/Wishlist";
import { MyTickets } from "@/components/ticket/MyTickets";

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
  | "tickets"
  | "events"
  | "transactions"
  | "certificates"
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

    // Check URL query parameter for view
    const searchParams = new URLSearchParams(window.location.search);
    const viewParam = searchParams.get('view');
    if (viewParam && ['settings', 'tickets', 'events', 'transactions', 'certificates', 'privacy', 'wishlist'].includes(viewParam)) {
      setActiveView(viewParam as MenuView);
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
      id: "tickets" as MenuView,
      label: "Tiket Saya",
      icon: Ticket,
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
      id: "privacy" as MenuView,
      label: "Privasi & Keamanan",
      icon: Shield,
    },
    {
      id: "wishlist" as MenuView,
      label: "Wishlist",
      icon: Heart,
    },
  ];

  // Animation variants - same as other pages
  const contentVariants = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    in: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
    out: {
      opacity: 0,
      y: -20,
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeIn" as const },
    },
  };

  const contentTransition = {
    type: "tween" as const,
    ease: "anticipate" as const,
    duration: 0.4,
  };

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
      case "tickets":
        return <MyTickets userToken={userToken} />;
      case "events":
        return <ProfileEvents userToken={userToken} />;
      case "transactions":
        return <ProfileTransactions userToken={userToken} />;
      case "certificates":
        return <ProfileCertificates userToken={userToken} />;
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

  // Page load animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    duration: 0.5,
    ease: "easeOut" as const,
  };

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      {/* Header - Consistent dengan pages lainnya */}
      <Header currentView="profile" />

      {/* Mobile Menu Button for Sidebar - Fixed position */}
      <div className="lg:hidden fixed top-20 left-4 z-40">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-background/95 backdrop-blur-sm shadow-lg border-2"
        >
          {isSidebarOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
      </div>

      <div className="container mx-auto px-4 py-6 lg:py-8 pt-24 lg:pt-28">        
        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar */}
          <AnimatePresence>
            {(isSidebarOpen ||
              (typeof window !== "undefined" && window.innerWidth >= 1024)) && (
              <motion.aside
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] fixed inset-y-0 left-0 z-50 lg:z-auto w-[280px] bg-card lg:bg-transparent"
              >
                {/* Mobile Overlay */}
                <div
                  className="lg:hidden fixed inset-0 bg-black/50 -z-10"
                  onClick={() => setIsSidebarOpen(false)}
                />

                <Card className="h-full overflow-hidden border border-border shadow-soft">
                  <div className="h-full overflow-y-auto">
                    {/* User Profile Header */}
                    <div className="p-6 border-b border-border bg-gradient-to-br from-primary/5 to-primary/10">
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
                    <div className="px-3 pt-3 pb-2 border-b border-border">
                      <button
                        onClick={() => router.push('/')}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm text-foreground hover:bg-accent hover:text-foreground"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="flex-1 text-left font-medium">Kembali ke Home</span>
                      </button>
                    </div>

                    {/* Menu Items */}
                    <div className="p-3">
                      {menuItems.map((item, index) => (
                        <motion.button
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setActiveView(item.id);
                            setIsSidebarOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm ${
                            activeView === item.id
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-foreground hover:bg-accent"
                          }`}
                        >
                          <item.icon className="w-4 h-4" />
                          <span className="flex-1 text-left">{item.label}</span>
                          {activeView === item.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <ChevronRight className="w-4 h-4" />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}

                      {/* Logout Button */}
                      <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: menuItems.length * 0.05, duration: 0.3 }}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm text-red-600 hover:bg-red-50 mt-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="flex-1 text-left">Log Out</span>
                      </motion.button>
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
                initial="initial"
                animate="in"
                exit="out"
                variants={contentVariants}
                transition={contentTransition}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Footer - Consistent dengan pages lainnya */}
      <Footer />
    </motion.div>
  );
}

