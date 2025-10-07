'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Calendar,
    Clock,
    CheckCircle,
    Award,
    User,
    Mail,
    Phone,
    MapPin,
    GraduationCap,
    Edit2,
    Camera,
    Settings,
    Bell,
    Activity,
    Save,
    Zap,
    ChevronRight,
    Target,
    X,
    Loader2,
    LogOut,
    Star
} from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { EventHistory } from './event/EventHistory';
import { CertificateList } from './event/CertificateList';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface UserDashboardProps {
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

export function UserDashboardNew({ user: initialUser }: UserDashboardProps) {
    const { logout } = useAuth();
    const router = useRouter();
    const [userToken, setUserToken] = useState<string>('');
    const [activeTab, setActiveTab] = useState('overview');
    const [profileOpen, setProfileOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    
    // Profile form state
    const [user, setUser] = useState(initialUser);
    const [formData, setFormData] = useState({
        name: initialUser.name || '',
        phone: initialUser.phone || '',
        address: initialUser.address || '',
        education: initialUser.education || ''
    });
    const [saving, setSaving] = useState(false);
    const [, setProfileLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('ramein_token');
        if (token) {
            setUserToken(token);
            fetchUserProfile(token);
        }
    }, []);

    const fetchUserProfile = useCallback(async (token: string) => {
        try {
            setProfileLoading(true);
            const { authAPI } = await import('@/lib/auth');
            const profile = await authAPI.getProfile(token);
            setUser(profile as typeof user);
            setFormData({
                name: profile.name || '',
                phone: profile.phone || '',
                address: profile.address || '',
                education: profile.education || ''
            });
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            toast.error('Gagal memuat profil');
        } finally {
            setProfileLoading(false);
        }
    }, []);

    const handleSaveProfile = async () => {
        if (!userToken) return;
        
        try {
            setSaving(true);
            const { authAPI } = await import('@/lib/auth');
            const updated = await authAPI.updateProfile(userToken, formData);
            setUser(updated as typeof user);
            setProfileOpen(false);
            toast.success('Profil berhasil diperbarui!');
        } catch {
            toast.error('Gagal memperbarui profil');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        logout();
        toast.success('Berhasil logout');
        router.push('/login');
    };

    const stats = {
        totalEvents: 0,
        completedEvents: 0,
        upcomingEvents: 0,
        certificates: 0
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" as const }
        }
    };

    const getInitials = (name?: string) => {
        if (!name) return 'U';
        const parts = name.trim().split(' ').filter(Boolean);
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    const getCompletionPercentage = () => {
        const fields = [user.name, user.phone, user.address, user.education];
        const filled = fields.filter(f => f && f.trim()).length;
        return Math.round((filled / fields.length) * 100);
    };

    if (!userToken) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30">
                <Card className="max-w-md w-full mx-4">
                    <CardContent className="pt-6 text-center">
                        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <X className="w-8 h-8 text-destructive" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Sesi Berakhir</h3>
                        <p className="text-muted-foreground mb-4">Token tidak ditemukan. Silakan login ulang.</p>
                        <Button onClick={() => router.push('/login')} className="w-full">
                            Login Ulang
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const completionPercentage = getCompletionPercentage();

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
            {/* Enhanced decorative background */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-purple-500/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-blue-500/3 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="container mx-auto px-4 py-6 md:py-8 relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                >
                    {/* Enhanced Header with Actions */}
                    <motion.div variants={itemVariants} className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                Dashboard
                            </h1>
                            <p className="text-muted-foreground mt-1">Kelola event dan sertifikat Anda</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)}>
                                <Settings className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-destructive hover:text-destructive">
                                <LogOut className="w-5 h-5" />
                            </Button>
                        </div>
                    </motion.div>

                    {/* Enhanced Profile Card */}
                    <motion.div variants={itemVariants}>
                        <Card className="border-border/60 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl shadow-xl overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
                            <CardContent className="p-6 md:p-8 relative">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Avatar Section */}
                                    <div className="flex flex-col items-center md:items-start gap-4">
                                        <div className="relative group">
                                            <div className="h-24 w-24 md:h-28 md:w-28 rounded-2xl ring-4 ring-primary/20 shadow-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center transition-all group-hover:ring-primary/40">
                                                {user.avatar ? (
                                                    <ImageWithFallback
                                                        src={user.avatar}
                                                        alt={user.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-3xl md:text-4xl font-bold text-primary">
                                                        {getInitials(user.name)}
                                                    </span>
                                                )}
                                            </div>
                                            <button className="absolute -bottom-2 -right-2 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform">
                                                <Camera className="w-4 h-4" />
                                            </button>
                                            <div className="absolute -top-2 -right-2">
                                                <Badge className="bg-green-500 text-white border-0 shadow-lg">
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Verified
                                                </Badge>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => setProfileOpen(true)}
                                            variant="outline"
                                            size="sm"
                                            className="w-full md:w-auto"
                                        >
                                            <Edit2 className="w-4 h-4 mr-2" />
                                            Edit Profile
                                        </Button>
                                    </div>

                                    {/* User Info */}
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <h2 className="text-2xl md:text-3xl font-bold mb-1">{user.name || 'User'}</h2>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Badge variant="secondary" className="font-mono text-xs">
                                                    ID: {user.id.slice(0, 8)}...
                                                </Badge>
                                                <Badge variant="outline" className="gap-1">
                                                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                                    Member
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Contact Info Grid */}
                                        <div className="grid md:grid-cols-2 gap-3">
                                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    <Mail className="w-4 h-4 text-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-muted-foreground">Email</p>
                                                    <p className="text-sm font-medium truncate">{user.email}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    <Phone className="w-4 h-4 text-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-muted-foreground">Telepon</p>
                                                    <p className="text-sm font-medium truncate">{user.phone || 'Belum diisi'}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    <MapPin className="w-4 h-4 text-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-muted-foreground">Alamat</p>
                                                    <p className="text-sm font-medium truncate">{user.address || 'Belum diisi'}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    <GraduationCap className="w-4 h-4 text-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-muted-foreground">Pendidikan</p>
                                                    <p className="text-sm font-medium truncate">{user.education || 'Belum diisi'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Profile Completion */}
                                        <div className="pt-2">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium">Kelengkapan Profil</span>
                                                <span className="text-sm font-bold text-primary">{completionPercentage}%</span>
                                            </div>
                                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-gradient-to-r from-primary to-primary/80"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${completionPercentage}%` }}
                                                    transition={{ duration: 1, delay: 0.5 }}
                                                />
                                            </div>
                                            {completionPercentage < 100 && (
                                                <p className="text-xs text-muted-foreground mt-2">
                                                    Lengkapi profil Anda untuk pengalaman yang lebih baik
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Stats Grid - Single Row */}
                    <motion.div variants={itemVariants}>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { 
                                    label: 'Total Event', 
                                    value: stats.totalEvents, 
                                    icon: Calendar, 
                                    gradient: 'from-blue-500 to-blue-600',
                                    bgGradient: 'from-blue-500/10 to-blue-600/5'
                                },
                                { 
                                    label: 'Event Selesai', 
                                    value: stats.completedEvents, 
                                    icon: CheckCircle, 
                                    gradient: 'from-green-500 to-green-600',
                                    bgGradient: 'from-green-500/10 to-green-600/5'
                                },
                                { 
                                    label: 'Event Akan Datang', 
                                    value: stats.upcomingEvents, 
                                    icon: Clock, 
                                    gradient: 'from-yellow-500 to-orange-500',
                                    bgGradient: 'from-yellow-500/10 to-orange-500/5'
                                },
                                { 
                                    label: 'Sertifikat', 
                                    value: stats.certificates, 
                                    icon: Award, 
                                    gradient: 'from-purple-500 to-purple-600',
                                    bgGradient: 'from-purple-500/10 to-purple-600/5'
                                }
                            ].map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    whileHover={{ scale: 1.03, y: -5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Card className={`relative overflow-hidden border-border/60 bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm hover:shadow-xl transition-all duration-300`}>
                                        <CardContent className="p-5">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                                                    <stat.icon className="w-5 h-5 text-white" />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <motion.div
                                                    className="text-3xl font-bold"
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.2 + index * 0.1 }}
                                                >
                                                    {stat.value}
                                                </motion.div>
                                                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                                            </div>
                                        </CardContent>
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl" />
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Enhanced Tabs */}
                    <motion.div variants={itemVariants}>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-3 h-14 bg-muted/50 rounded-2xl p-1 backdrop-blur-sm">
                                <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-md transition-all">
                                    <Activity className="w-4 h-4 mr-2" />
                                    <span className="hidden sm:inline">Overview</span>
                                </TabsTrigger>
                                <TabsTrigger value="events" className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-md transition-all">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <span className="hidden sm:inline">Riwayat Event</span>
                                </TabsTrigger>
                                <TabsTrigger value="certificates" className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-md transition-all">
                                    <Award className="w-4 h-4 mr-2" />
                                    <span className="hidden sm:inline">Sertifikat</span>
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="mt-6 space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Quick Actions Card */}
                                    <Card className="border-border/60 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:shadow-lg transition-all">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Zap className="w-5 h-5 text-primary" />
                                                Aksi Cepat
                                            </CardTitle>
                                            <CardDescription>Navigasi cepat ke fitur utama</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <Button
                                                onClick={() => router.push('/events')}
                                                variant="outline"
                                                className="w-full justify-between group hover:bg-primary hover:text-primary-foreground transition-all"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    Jelajahi Event
                                                </span>
                                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                            <Button
                                                onClick={() => setActiveTab('events')}
                                                variant="outline"
                                                className="w-full justify-between group hover:bg-primary hover:text-primary-foreground transition-all"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <Activity className="w-4 h-4" />
                                                    Lihat Riwayat
                                                </span>
                                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                            <Button
                                                onClick={() => setActiveTab('certificates')}
                                                variant="outline"
                                                className="w-full justify-between group hover:bg-primary hover:text-primary-foreground transition-all"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <Award className="w-4 h-4" />
                                                    Sertifikat Saya
                                                </span>
                                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </CardContent>
                                    </Card>

                                    {/* Activity Summary */}
                                    <Card className="border-border/60 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:shadow-lg transition-all">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Target className="w-5 h-5 text-primary" />
                                                Ringkasan Aktivitas
                                            </CardTitle>
                                            <CardDescription>Pencapaian Anda bulan ini</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                                    <span className="text-sm font-medium">Event Diikuti</span>
                                                    <Badge variant="secondary">{stats.totalEvents} event</Badge>
                                                </div>
                                                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                                    <span className="text-sm font-medium">Sertifikat Diperoleh</span>
                                                    <Badge variant="secondary">{stats.certificates} sertifikat</Badge>
                                                </div>
                                                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                                    <span className="text-sm font-medium">Tingkat Partisipasi</span>
                                                    <Badge className="bg-green-500">Sangat Aktif</Badge>
                                                </div>
                                            </div>
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

            {/* Enhanced Profile Edit Dialog */}
            <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl flex items-center gap-2">
                            <User className="w-6 h-6 text-primary" />
                            Edit Profil
                        </DialogTitle>
                        <DialogDescription>
                            Perbarui informasi profil Anda. Pastikan data yang diisi akurat.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6 py-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                    Nama Lengkap
                                </Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Masukkan nama lengkap"
                                    className="h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone" className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                    Nomor Telepon
                                </Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="08xxxxxxxxxx"
                                    className="h-11"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="address" className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-muted-foreground" />
                                    Alamat
                                </Label>
                                <Input
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="Alamat lengkap domisili"
                                    className="h-11"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="education" className="flex items-center gap-2">
                                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                                    Pendidikan Terakhir
                                </Label>
                                <Input
                                    id="education"
                                    value={formData.education}
                                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                                    placeholder="Contoh: S1 Teknik Informatika"
                                    className="h-11"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                            <p className="text-sm text-muted-foreground">
                                Kelengkapan: <span className="font-semibold text-primary">{completionPercentage}%</span>
                            </p>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setProfileOpen(false)}
                                    disabled={saving}
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Batal
                                </Button>
                                <Button
                                    onClick={handleSaveProfile}
                                    disabled={saving}
                                    className="min-w-[120px]"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Simpan
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Settings Dialog */}
            <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Settings className="w-5 h-5 text-primary" />
                            Pengaturan
                        </DialogTitle>
                        <DialogDescription>
                            Kelola preferensi akun Anda
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <Button variant="outline" className="w-full justify-start" onClick={() => setProfileOpen(true)}>
                            <User className="w-4 h-4 mr-2" />
                            Edit Profil
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                            <Bell className="w-4 h-4 mr-2" />
                            Notifikasi
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive" onClick={handleLogout}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
