'use client';

import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Calendar,
    Award,
    Download,
    AlertCircle,
    RefreshCw,
    TrendingUp,
    Banknote,
    Users,
    Settings,
    ShieldCheck,
    FileSpreadsheet,
    Bell,
    CheckCircle
} from 'lucide-react';
import { MonthlyEventsChart } from './charts/MonthlyEventsChart';
import { MonthlyParticipantsChart } from './charts/MonthlyParticipantsChart';
import { TopEventsChart } from './charts/TopEventsChart';

interface DashboardStats {
    monthlyEvents: Array<{ month: number; count: number }>;
    monthlyParticipants: Array<{ month: number; registrations: number; attendance: number }>;
    topEvents: Array<{
        id: string;
        title: string;
        date: string;
        time: string;
        location: string;
        participantCount: number;
    }>;
    overallStats: {
        totalEvents: number;
        totalParticipants: number;
        totalUsers: number;
        totalAttendance: number;
        attendanceRate: string;
    };
    recentActivities: {
        events: Array<{
            id: string;
            title: string;
            date: string;
            createdAt: string;
        }>;
        participants: Array<{
            id: string;
            user: {
                name: string;
                email: string;
            };
            event: {
                title: string;
            };
            hasAttended: boolean;
            createdAt: string;
        }>;
    };
}

export function AdminDashboard() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<DashboardStats | null>(null);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            setIsLoading(true);
            const adminToken = localStorage.getItem('ramein_admin_token');
            
            const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setStats(data);
            } else {
                setError('Gagal memuat data dashboard');
            }
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error);
            setError('Terjadi kesalahan saat memuat data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportData = async (format: 'xlsx' | 'csv' = 'xlsx') => {
        try {
            const adminToken = localStorage.getItem('ramein_admin_token');
            
            const response = await fetch(`${API_BASE_URL}/admin/dashboard/export?format=${format}`, {
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `dashboard_data_${new Date().getFullYear()}.${format}`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                setError('Gagal mengexport data');
            }
        } catch (error) {
            console.error('Export failed:', error);
            setError('Terjadi kesalahan saat mengexport data');
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="p-6">
                                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                                <div className="h-8 bg-muted rounded w-1/2"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    if (!stats) {
        return (
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Tidak ada data yang tersedia</AlertDescription>
            </Alert>
        );
    }

    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold">Dashboard Overview</h2>
                    <p className="text-sm sm:text-base text-muted-foreground">
                        Statistik dan analisis sistem Ramein
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={() => fetchDashboardStats()} size="sm" className="text-xs sm:text-sm">
                        <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Refresh</span>
                        <span className="sm:hidden">↻</span>
                    </Button>
                    <Button onClick={() => handleExportData('xlsx')} size="sm" className="text-xs sm:text-sm">
                        <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Export Excel</span>
                        <span className="sm:hidden">Excel</span>
                    </Button>
                    <Button variant="outline" onClick={() => handleExportData('csv')} size="sm" className="text-xs sm:text-sm">
                        <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Export CSV</span>
                        <span className="sm:hidden">CSV</span>
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card>
                        <CardContent className="p-3 sm:p-4 md:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                                        Total Kegiatan
                                    </p>
                                    <p className="text-xl sm:text-2xl md:text-3xl font-bold">
                                        {stats.overallStats.totalEvents}
                                    </p>
                                </div>
                                <Calendar className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card>
                        <CardContent className="p-3 sm:p-4 md:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                                        Total Peserta
                                    </p>
                                    <p className="text-xl sm:text-2xl md:text-3xl font-bold">
                                        {stats.overallStats.totalParticipants}
                                    </p>
                                </div>
                                <Users className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card>
                        <CardContent className="p-3 sm:p-4 md:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                                        Kehadiran
                                    </p>
                                    <p className="text-xl sm:text-2xl md:text-3xl font-bold">
                                        {stats.overallStats.totalAttendance}
                                    </p>
                                </div>
                                <Award className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card>
                        <CardContent className="p-3 sm:p-4 md:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                                        Tingkat Kehadiran
                                    </p>
                                    <p className="text-xl sm:text-2xl md:text-3xl font-bold">
                                        {stats.overallStats.attendanceRate}%
                                    </p>
                                </div>
                                <TrendingUp className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="min-h-[360px]">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                                <Button
                                    variant="outline"
                                    className="h-20 sm:h-24 flex flex-col items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                                    onClick={() => router.push('/admin/dashboard?tab=payments')}
                                >
                                    <Banknote className="h-5 w-5 sm:h-6 sm:w-6" />
                                    <span>Pembayaran</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-20 sm:h-24 flex flex-col items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                                    onClick={() => router.push('/admin/dashboard?tab=certificates')}
                                >
                                    <FileSpreadsheet className="h-5 w-5 sm:h-6 sm:w-6" />
                                    <span>Sertifikat</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-20 sm:h-24 flex flex-col items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                                    onClick={() => router.push('/admin/dashboard?tab=users')}
                                >
                                    <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                                    <span>Kelola User</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-20 sm:h-24 flex flex-col items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                                    onClick={() => router.push('/admin/dashboard?tab=settings')}
                                >
                                    <Settings className="h-5 w-5 sm:h-6 sm:w-6" />
                                    <span>Settings</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card className="min-h-[360px]">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-semibold">System Status</CardTitle>
                            <ShieldCheck className="h-5 w-5 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span>Server Status</span>
                                    </div>
                                    <span className="text-sm text-green-500">Operational</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span>Database</span>
                                    </div>
                                    <span className="text-sm text-green-500">Connected</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span>Email Service</span>
                                    </div>
                                    <span className="text-sm text-green-500">Active</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Bell className="h-4 w-4" />
                                        <span>Last Backup</span>
                                    </div>
                                    <span className="text-sm">2 hours ago</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Events Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Kegiatan per Bulan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <MonthlyEventsChart 
                                data={stats.monthlyEvents}
                                monthNames={monthNames}
                            />
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Monthly Participants Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Peserta per Bulan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <MonthlyParticipantsChart 
                                data={stats.monthlyParticipants}
                                monthNames={monthNames}
                            />
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Top 10 Events Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            Top 10 Kegiatan dengan Peserta Terbanyak
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Ranking kegiatan berdasarkan jumlah peserta yang hadir
                        </p>
                    </CardHeader>
                    <CardContent>
                        <TopEventsChart data={stats.topEvents || []} />
                    </CardContent>
                </Card>
            </motion.div>

        </div>
    );
}
