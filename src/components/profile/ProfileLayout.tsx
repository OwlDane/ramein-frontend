'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    LayoutDashboard,
    Calendar,
    Award,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight,
    User,
    Bell,
    CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';

// Import content components
import { ProfileOverview } from '@/components/profile/ProfileOverview';
import { ProfileEvents } from '@/components/profile/ProfileEvents';
import { ProfileCertificates } from '@/components/profile/ProfileCertificates';
import { ProfileSettings } from '@/components/profile/ProfileSettings';

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

type MenuView = 'overview' | 'events' | 'certificates' | 'settings';

export function ProfileLayout({ user: initialUser }: ProfileLayoutProps) {
    const { logout } = useAuth();
    const router = useRouter();
    const [activeView, setActiveView] = useState<MenuView>('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState(initialUser);
    const [userToken, setUserToken] = useState<string>('');

    useEffect(() => {
        const token = localStorage.getItem('ramein_token');
        if (token) {
            setUserToken(token);
            fetchUserProfile(token);
        }
    }, []);

    const fetchUserProfile = async (token: string) => {
        try {
            const { authAPI } = await import('@/lib/auth');
            const profile = await authAPI.getProfile(token);
            setUser(profile);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        }
    };

    const handleLogout = () => {
        logout();
        toast.success('Berhasil logout');
        router.push('/login');
    };

    const getInitials = (name?: string) => {
        if (!name) return 'U';
        const parts = name.trim().split(' ').filter(Boolean);
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    const menuItems = [
        {
            id: 'overview' as MenuView,
            label: 'Dashboard',
            icon: LayoutDashboard,
            description: 'Ringkasan aktivitas'
        },
        {
            id: 'events' as MenuView,
            label: 'Riwayat Event',
            icon: Calendar,
            description: 'Event yang diikuti',
            badge: 0
        },
        {
            id: 'certificates' as MenuView,
            label: 'Sertifikat',
            icon: Award,
            description: 'Sertifikat Anda'
        },
        {
            id: 'settings' as MenuView,
            label: 'Settings',
            icon: Settings,
            description: 'Pengaturan akun'
        }
    ];

    const renderContent = () => {
        switch (activeView) {
            case 'overview':
                return <ProfileOverview user={user} userToken={userToken} onNavigate={setActiveView} />;
            case 'events':
                return <ProfileEvents userToken={userToken} />;
            case 'certificates':
                return <ProfileCertificates userToken={userToken} />;
            case 'settings':
                return <ProfileSettings user={user} userToken={userToken} onUpdate={setUser} />;
            default:
                return <ProfileOverview user={user} userToken={userToken} onNavigate={setActiveView} />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            {/* Mobile Header */}
            <div className="lg:hidden sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>
                        <h1 className="text-lg font-bold">Profile</h1>
                    </div>
                    <Button variant="ghost" size="icon">
                        <Bell className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 lg:py-8">
                <div className="grid lg:grid-cols-[280px_1fr] gap-6">
                    {/* Sidebar */}
                    <AnimatePresence>
                        {(isSidebarOpen || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
                            <motion.aside
                                initial={{ x: -300, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -300, opacity: 0 }}
                                className="lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] fixed inset-y-0 left-0 z-50 lg:z-auto w-[280px] bg-background lg:bg-transparent"
                            >
                                {/* Mobile Overlay */}
                                <div
                                    className="lg:hidden fixed inset-0 bg-black/50 -z-10"
                                    onClick={() => setIsSidebarOpen(false)}
                                />

                                <div className="h-full overflow-y-auto p-4 lg:p-0 space-y-4">
                                    {/* Profile Card */}
                                    <Card className="border-border/60 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
                                        <CardContent className="p-6">
                                            <div className="text-center space-y-4">
                                                {/* Avatar */}
                                                <div className="relative inline-block">
                                                    <div className="h-20 w-20 rounded-full ring-4 ring-primary/20 shadow-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto">
                                                        {user.avatar ? (
                                                            <ImageWithFallback
                                                                src={user.avatar}
                                                                alt={user.name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-2xl font-bold text-primary">
                                                                {getInitials(user.name)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="absolute -bottom-1 -right-1">
                                                        <Badge className="bg-green-500 text-white border-2 border-background px-2 py-0.5">
                                                            <CheckCircle className="w-3 h-3" />
                                                        </Badge>
                                                    </div>
                                                </div>

                                                {/* User Info */}
                                                <div>
                                                    <p className="text-xs text-muted-foreground mb-1">Selamat Datang,</p>
                                                    <h2 className="font-bold text-lg leading-tight mb-2">{user.name}</h2>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="w-full"
                                                        onClick={() => {
                                                            setActiveView('settings');
                                                            setIsSidebarOpen(false);
                                                        }}
                                                    >
                                                        <User className="w-4 h-4 mr-2" />
                                                        Edit Profile
                                                    </Button>
                                                </div>

                                                {/* Stats Mini */}
                                                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border/50">
                                                    <div className="text-center">
                                                        <div className="text-xl font-bold text-primary">0</div>
                                                        <div className="text-xs text-muted-foreground">Event</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-xl font-bold text-green-500">0</div>
                                                        <div className="text-xs text-muted-foreground">Selesai</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-xl font-bold text-purple-500">0</div>
                                                        <div className="text-xs text-muted-foreground">Sertifikat</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Menu Section */}
                                    <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
                                        <CardContent className="p-3">
                                            <div className="space-y-1">
                                                <p className="text-xs font-semibold text-muted-foreground px-3 py-2">MENU</p>
                                                {menuItems.map((item) => (
                                                    <button
                                                        key={item.id}
                                                        onClick={() => {
                                                            setActiveView(item.id);
                                                            setIsSidebarOpen(false);
                                                        }}
                                                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all group ${
                                                            activeView === item.id
                                                                ? 'bg-primary text-primary-foreground shadow-md'
                                                                : 'hover:bg-muted/50'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <item.icon className={`w-5 h-5 ${activeView === item.id ? '' : 'text-muted-foreground'}`} />
                                                            <div className="text-left">
                                                                <div className="font-medium text-sm">{item.label}</div>
                                                                {activeView !== item.id && (
                                                                    <div className="text-xs text-muted-foreground">{item.description}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {item.badge !== undefined && item.badge > 0 && (
                                                            <Badge variant="secondary" className="ml-auto">
                                                                {item.badge}
                                                            </Badge>
                                                        )}
                                                        {activeView === item.id && (
                                                            <ChevronRight className="w-4 h-4 ml-2" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Logout Button */}
                                    <Button
                                        variant="outline"
                                        className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </Button>
                                </div>
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
                                transition={{ duration: 0.3 }}
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
