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
import { EnhancedKPICard } from './dashboard/EnhancedKPICard';
import { DateRangePicker, DateRange } from './dashboard/DateRangePicker';
import { FinancialAnalytics, FinancialData } from './dashboard/FinancialAnalytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    const [activeView, setActiveView] = useState<'overview' | 'financial'>('overview');
    const [dateRange, setDateRange] = useState<DateRange>({
        startDate: new Date(new Date().getFullYear(), 0, 1),
        endDate: new Date(),
        label: 'Tahun Ini'
    });
    const [financialData, setFinancialData] = useState<FinancialData | null>(null);
    const [isLoadingFinancial, setIsLoadingFinancial] = useState(false);

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

    const fetchFinancialData = async () => {
        try {
            setIsLoadingFinancial(true);
            const adminToken = localStorage.getItem('ramein_admin_token');
            
            const startDate = dateRange.startDate.toISOString().split('T')[0];
            const endDate = dateRange.endDate.toISOString().split('T')[0];
            
            const response = await fetch(
                `${API_BASE_URL}/admin/dashboard/financial?startDate=${startDate}&endDate=${endDate}`,
                {
                    headers: {
                        'Authorization': `Bearer ${adminToken}`
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log('📊 Financial Data from API:', data);
                setFinancialData(data);
            } else {
                const errorText = await response.text();
                console.error('❌ Financial API Error:', response.status, errorText);
                setError('Gagal memuat data finansial');
            }
        } catch (error) {
            console.error('Failed to fetch financial data:', error);
            setError('Terjadi kesalahan saat memuat data finansial');
        } finally {
            setIsLoadingFinancial(false);
        }
    };

    useEffect(() => {
        if (activeView === 'financial') {
            fetchFinancialData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeView, dateRange]);

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
                    <h2 className="text-2xl sm:text-3xl font-bold">Dashboard</h2>
                    <p className="text-sm sm:text-base text-muted-foreground">
                        Statistik dan analisis sistem Ramein
                    </p>
                </div>
            </div>

            <Tabs value={activeView} onValueChange={(v) => setActiveView(v as 'overview' | 'financial')}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="financial">Financial Analytics</TabsTrigger>
                    </TabsList>
                    
                    <div className="flex flex-wrap gap-2">
                        <DateRangePicker value={dateRange} onChange={setDateRange} />
                        <Button variant="outline" onClick={() => fetchDashboardStats()} size="sm">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">Refresh</span>
                        </Button>
                        <Button onClick={() => handleExportData('xlsx')} size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">Export</span>
                        </Button>
                    </div>
                </div>

                <TabsContent value="overview" className="space-y-6 mt-6">

            {/* Enhanced KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <EnhancedKPICard
                    title="Total Kegiatan"
                    value={stats.overallStats.totalEvents}
                    icon={Calendar}
                    color="blue"
                    sparklineData={stats.monthlyEvents.map(m => m.count)}
                />
                
                <EnhancedKPICard
                    title="Total Peserta"
                    value={stats.overallStats.totalParticipants}
                    icon={Users}
                    color="green"
                    sparklineData={stats.monthlyParticipants.map(m => m.registrations)}
                />
                
                <EnhancedKPICard
                    title="Total Pengguna"
                    value={stats.overallStats.totalUsers}
                    icon={Users}
                    color="purple"
                />
                
                <EnhancedKPICard
                    title="Tingkat Kehadiran"
                    value={stats.overallStats.attendanceRate}
                    icon={CheckCircle}
                    color="orange"
                    target={{
                        current: parseInt(stats.overallStats.attendanceRate),
                        target: 100,
                        label: "Target kehadiran"
                    }}
                />
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

                </TabsContent>

                <TabsContent value="financial" className="space-y-6 mt-6">
                    {financialData ? (
                        <FinancialAnalytics 
                            data={financialData} 
                            isLoading={isLoadingFinancial} 
                        />
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">
                                {isLoadingFinancial ? 'Memuat data finansial...' : 'Pilih rentang tanggal untuk melihat analisis finansial'}
                            </p>
                        </div>
                    )}
                </TabsContent>

            </Tabs>

        </div>
    );
}
