'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    BarChart3,
    LogOut,
    AlertCircle,
    Clock
} from 'lucide-react';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AdminEventManagement } from '@/components/admin/AdminEventManagement';
import { AdminUserManagement } from '@/components/admin/AdminUserManagement';

interface AdminUser {
    id: string;
    email: string;
    name: string;
    role: string;
    isAdmin: boolean;
}

export default function AdminDashboardPage() {
    const [admin, setAdmin] = useState<AdminUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    // const [error] = useState('');
    const [activeTab, setActiveTab] = useState('overview');
    const [sessionTimeLeft, setSessionTimeLeft] = useState(300); // 5 minutes in seconds
    const router = useRouter();

    const checkAdminAuth = useCallback(async () => {
        try {
            const adminToken = localStorage.getItem('ramein_admin_token');
            if (!adminToken) {
                router.push('/admin/login');
                return;
            }

            const response = await fetch('/api/admin/auth/verify', {
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setAdmin(data.admin);
                setSessionTimeLeft(300); // Reset session timer
            } else {
                localStorage.removeItem('ramein_admin_token');
                router.push('/admin/login');
            }
        } catch (error) {
            console.error('Admin auth check failed:', error);
            localStorage.removeItem('ramein_admin_token');
            router.push('/admin/login');
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('ramein_admin_token');
        router.push('/admin/login');
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
        return `${mins}:${secs.toString().padStart(2, '0')}`;
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
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <BarChart3 className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                                <p className="text-sm text-muted-foreground">
                                    Panel administrasi Ramein
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Session Timer */}
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4" />
                                <span className={sessionTimeLeft < 60 ? 'text-destructive' : 'text-muted-foreground'}>
                                    {formatTime(sessionTimeLeft)}
                                </span>
                            </div>

                            {/* Admin Info */}
                            <div className="text-right">
                                <p className="font-medium">{admin.name}</p>
                                <p className="text-sm text-muted-foreground">{admin.email}</p>
                            </div>

                            <Button variant="outline" onClick={handleLogout}>
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-6">
                {sessionTimeLeft < 60 && (
                    <Alert className="mb-6" variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Session akan berakhir dalam {formatTime(sessionTimeLeft)}. 
                            Silakan refresh halaman untuk memperpanjang session.
                        </AlertDescription>
                    </Alert>
                )}

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="events">Kegiatan</TabsTrigger>
                        <TabsTrigger value="users">Pengguna</TabsTrigger>
                        <TabsTrigger value="settings">Pengaturan</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <AdminDashboard />
                    </TabsContent>

                    <TabsContent value="events">
                        <AdminEventManagement />
                    </TabsContent>

                    <TabsContent value="users">
                        <AdminUserManagement />
                    </TabsContent>

                    <TabsContent value="settings">
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
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
