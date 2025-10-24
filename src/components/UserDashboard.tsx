import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, CheckCircle, Award } from "lucide-react";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { EventHistory } from "./event/EventHistory";
import { CertificateList } from "./event/CertificateList";

interface UserDashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
  };
}

export function UserDashboard({ user }: UserDashboardProps) {
  const [userToken, setUserToken] = useState<string>("");
  const [activeTab, setActiveTab] = useState("overview");
  const [profileOpen, setProfileOpen] = useState(false);
  const [name, setName] = useState(user.name || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [education, setEducation] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Get user token from localStorage (aligned with AuthContext key)
    const token = localStorage.getItem("ramein_token");
    if (token) {
      setUserToken(token);
    }
  }, []);

  useEffect(() => {
    setName(user.name || "");
  }, [user.name]);

  const stats = {
    totalEvents: 0, // Will be updated by EventHistory component
    completedEvents: 0,
    upcomingEvents: 0,
    certificates: 0,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  if (!userToken) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          Token tidak ditemukan. Silakan login ulang.
        </p>
        <Button onClick={() => window.location.reload()}>
          Refresh Halaman
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 relative overflow-hidden">
      {/* Decorative background accents */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="container mx-auto px-4 py-8 relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Profile hero */}
          <motion.div variants={itemVariants}>
            <Card className="border-border/60 bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/60">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div
                      className="relative group cursor-pointer"
                      onClick={() => setProfileOpen(true)}
                    >
                      <div className="h-16 w-16 md:h-20 md:w-20 rounded-full ring-4 ring-primary/15 shadow-sm overflow-hidden bg-muted flex items-center justify-center">
                        {user.avatar ? (
                          <ImageWithFallback
                            src={user.avatar}
                            alt={user.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xl md:text-2xl font-semibold text-primary">
                            {getInitials(user.name)}
                          </span>
                        )}
                      </div>
                      <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-6 h-6 text-white"
                        >
                          <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM3 21a.75.75 0 0 0 .75.75H6a.75.75 0 0 0 .53-.22l11.47-11.47-3.712-3.712L2.818 17.818A.75.75 0 0 0 2.6 18.07l-.6 3a.75.75 0 0 0 .9.88L5 21.4a.75.75 0 0 0 .252-.218L3 21Z" />
                        </svg>
                      </div>
                      <span className="absolute -bottom-1 -right-1 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground shadow-sm">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Aktif
                      </span>
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                        Halo {user.name || "User"}
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3">
                    <Badge
                      variant="outline"
                      className="h-8 px-3 text-xs sm:text-sm"
                    >
                      Member
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="h-8 px-3 text-xs sm:text-sm"
                    >
                      ID: {user.id}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: "Total Event",
                  value: stats.totalEvents,
                  icon: Calendar,
                  color: "bg-blue-500",
                },
                {
                  label: "Event Selesai",
                  value: stats.completedEvents,
                  icon: CheckCircle,
                  color: "bg-green-500",
                },
                {
                  label: "Event Akan Datang",
                  value: stats.upcomingEvents,
                  icon: Clock,
                  color: "bg-yellow-500",
                },
                {
                  label: "Sertifikat",
                  value: stats.certificates,
                  icon: Award,
                  color: "bg-purple-500",
                },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="text-center border-border hover:shadow-lg transition-all duration-200 bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/60">
                    <CardContent className="p-4">
                      <div
                        className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-2`}
                      >
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-foreground mb-1">
                        {stat.value}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Main Content Tabs */}
          <motion.div variants={itemVariants}>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 h-12 bg-muted/50 rounded-xl">
                <TabsTrigger value="overview" className="text-base">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="events" className="text-base">
                  Riwayat Event
                </TabsTrigger>
                <TabsTrigger value="certificates" className="text-base">
                  Sertifikat
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Recent Events */}
                  <Card className="border-border bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/60">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        Event Terbaru
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">
                        Lihat event terbaru yang Anda ikuti di tab
                        &ldquo;Riwayat Event&rdquo;
                      </p>
                      <Button
                        onClick={() => setActiveTab("events")}
                        variant="outline"
                        className="mt-4"
                      >
                        Lihat Semua Event
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Recent Certificates */}
                  <Card className="border-border bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/60">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-primary" />
                        Sertifikat Terbaru
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">
                        Lihat sertifikat terbaru yang Anda dapatkan di tab
                        &ldquo;Sertifikat&rdquo;
                      </p>
                      <Button
                        onClick={() => setActiveTab("certificates")}
                        variant="outline"
                        className="mt-4"
                      >
                        Lihat Semua Sertifikat
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="events" className="mt-6">
                <EventHistory userToken={userToken} />
              </TabsContent>

              <TabsContent value="certificates" className="mt-6">
                <CertificateList userToken={userToken} />
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </div>

      {/* Profile Edit Dialog */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit profil</DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Isi nama kamu"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">No. HP</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08xxxxxxxxxx"
              />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="address">Alamat</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Alamat domisili"
              />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="education">Pendidikan</Label>
              <Input
                id="education"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="Contoh: S1 Teknik Informatika"
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setProfileOpen(false)}>
                Batal
              </Button>
              <Button
                disabled={saving}
                onClick={async () => {
                  if (!userToken) return;
                  try {
                    setSaving(true);
                    const { authAPI } = await import("@/lib/auth");
                    await authAPI.updateProfile(userToken, {
                      name,
                      phone,
                      address,
                      education,
                    });
                    setProfileOpen(false);
                  } catch {
                    // noop; toast could be added if available
                  } finally {
                    setSaving(false);
                  }
                }}
              >
                {saving ? "Nyimpen..." : "Simpan"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
