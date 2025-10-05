import { useEffect, useState } from 'react';
import { DashboardStats, statisticsApi } from '@/lib/statisticsApi';
import { MonthlyStatsChart } from './charts/MonthlyStatsChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function AdminStatistics() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await statisticsApi.getDashboardStats();
                setStats(data);
            } catch (err) {
                setError('Gagal memuat data statistik');
                console.error('Error fetching stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
        return null;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Event</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.monthlyEvents.reduce((a, b) => a + b, 0)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Peserta</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.monthlyParticipants.reduce((a, b) => a + b, 0)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Event Bulan Ini</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.monthlyEvents[new Date().getMonth()]}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardContent className="pt-6">
                        <MonthlyStatsChart
                            data={stats.monthlyEvents}
                            months={stats.months}
                            title="Jumlah Event per Bulan"
                            dataKey="events"
                            color="#2563eb"
                        />
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="pt-6">
                        <MonthlyStatsChart
                            data={stats.monthlyParticipants}
                            months={stats.months}
                            title="Jumlah Peserta per Bulan"
                            dataKey="participants"
                            color="#16a34a"
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}