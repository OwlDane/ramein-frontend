'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Users,
    Calendar,
    Award,
    Download,
    AlertCircle,
    RefreshCw,
    TrendingUp
} from 'lucide-react';

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
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            setIsLoading(true);
            const adminToken = localStorage.getItem('ramein_admin_token');
            
            const response = await fetch('/api/admin/dashboard/stats', {
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
            
            const response = await fetch(`/api/admin/dashboard/export?format=${format}`, {
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
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold">Dashboard Overview</h2>
                    <p className="text-muted-foreground">
                        Statistik dan analisis sistem Ramein
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => fetchDashboardStats()}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                    <Button onClick={() => handleExportData('xlsx')}>
                        <Download className="w-4 h-4 mr-2" />
                        Export Excel
                    </Button>
                    <Button variant="outline" onClick={() => handleExportData('csv')}>
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Total Kegiatan
                                    </p>
                                    <p className="text-3xl font-bold">
                                        {stats.overallStats.totalEvents}
                                    </p>
                                </div>
                                <Calendar className="h-8 w-8 text-primary" />
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
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Total Peserta
                                    </p>
                                    <p className="text-3xl font-bold">
                                        {stats.overallStats.totalParticipants}
                                    </p>
                                </div>
                                <Users className="h-8 w-8 text-primary" />
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
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Kehadiran
                                    </p>
                                    <p className="text-3xl font-bold">
                                        {stats.overallStats.totalAttendance}
                                    </p>
                                </div>
                                <Award className="h-8 w-8 text-primary" />
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
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Tingkat Kehadiran
                                    </p>
                                    <p className="text-3xl font-bold">
                                        {stats.overallStats.attendanceRate}%
                                    </p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-primary" />
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
                            <div className="space-y-4">
                                {stats.monthlyEvents.map((item) => (
                                    <div key={item.month} className="flex items-center justify-between">
                                        <span className="text-sm font-medium">
                                            {monthNames[item.month - 1]}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-32 bg-muted rounded-full h-2">
                                                <div
                                                    className="bg-primary h-2 rounded-full"
                                                    style={{
                                                        width: `${(item.count / Math.max(...stats.monthlyEvents.map(e => e.count))) * 100}%`
                                                    }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-bold w-8 text-right">
                                                {item.count}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
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
                            <div className="space-y-4">
                                {stats.monthlyParticipants.map((item) => (
                                    <div key={item.month} className="flex items-center justify-between">
                                        <span className="text-sm font-medium">
                                            {monthNames[item.month - 1]}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-32 bg-muted rounded-full h-2">
                                                <div
                                                    className="bg-primary h-2 rounded-full"
                                                    style={{
                                                        width: `${(item.registrations / Math.max(...stats.monthlyParticipants.map(p => p.registrations))) * 100}%`
                                                    }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-bold w-8 text-right">
                                                {item.registrations}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Top Events */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>10 Kegiatan Terpopuler</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.topEvents.map((event) => (
                                <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex-1">
                                        <h4 className="font-medium">{event.title}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(event.date).toLocaleDateString('id-ID')} - {event.location}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-primary">
                                            {event.participantCount} peserta
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
