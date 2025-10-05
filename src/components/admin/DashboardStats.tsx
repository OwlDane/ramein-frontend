import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardStatsProps {
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
        totalRegistrations: number;
    };
    isLoading?: boolean;
}

export function DashboardStats({
    monthlyEvents,
    monthlyParticipants,
    topEvents,
    overallStats,
    isLoading
}: DashboardStatsProps) {
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];

    if (isLoading) {
        return (
            <div className="w-full h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Event</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overallStats.totalEvents}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Peserta</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overallStats.totalParticipants}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Registrasi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overallStats.totalRegistrations}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Monthly Events Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Jumlah Event per Bulan</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyEvents.map(item => ({
                                month: months[item.month],
                                count: item.count
                            }))}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" name="Jumlah Event" fill="#2563eb" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Monthly Participants Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Statistik Peserta per Bulan</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyParticipants.map(item => ({
                                month: months[item.month],
                                registrations: item.registrations,
                                attendance: item.attendance
                            }))}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="registrations" name="Registrasi" fill="#16a34a" />
                                <Bar dataKey="attendance" name="Kehadiran" fill="#2563eb" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Top Events Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>10 Event Terpopuler</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={topEvents
                                    .slice(0, 10)
                                    .map(event => ({
                                        name: event.title.length > 30 
                                            ? event.title.substring(0, 30) + '...' 
                                            : event.title,
                                        peserta: event.participantCount
                                    }))}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={150} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="peserta" name="Jumlah Peserta" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}