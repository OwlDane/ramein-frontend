'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface TopEvent {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    participantCount: number;
}

interface TopEventsChartProps {
    data: TopEvent[];
}

export function TopEventsChart({ data }: TopEventsChartProps) {
    // Transform data for chart
    const chartData = data.map((event, index) => ({
        name: event.title.length > 20 ? event.title.substring(0, 20) + '...' : event.title,
        fullName: event.title,
        peserta: event.participantCount,
        rank: index + 1,
        date: new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        location: event.location
    }));

    // Color palette for bars
    const colors = [
        '#3b82f6', // blue-500
        '#8b5cf6', // violet-500
        '#ec4899', // pink-500
        '#f59e0b', // amber-500
        '#10b981', // emerald-500
        '#6366f1', // indigo-500
        '#14b8a6', // teal-500
        '#f97316', // orange-500
        '#06b6d4', // cyan-500
        '#84cc16', // lime-500
    ];

    interface TooltipData {
        rank: number;
        fullName: string;
        peserta: number;
        date: string;
        location: string;
    }

    const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: TooltipData }> }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-card border border-border rounded-lg shadow-lg p-4">
                    <p className="font-semibold text-foreground mb-2">#{data.rank} {data.fullName}</p>
                    <p className="text-sm text-muted-foreground mb-1">
                        <span className="font-medium">Peserta:</span> {data.peserta} orang
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">
                        <span className="font-medium">Tanggal:</span> {data.date}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Lokasi:</span> {data.location}
                    </p>
                </div>
            );
        }
        return null;
    };

    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                <p>Belum ada data event</p>
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fill: 'hsl(var(--primary))', fontSize: 12 }}
                />
                <YAxis
                    tick={{ fill: 'hsl(var(--primary))' }}
                    label={{ 
                        value: 'Jumlah Peserta', 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { fill: 'hsl(var(--primary))' }
                    }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.3)' }} />
                <Legend 
                    wrapperStyle={{ paddingTop: '20px', color: 'hsl(var(--primary))' }}
                    formatter={() => 'Jumlah Peserta'}
                    iconType="circle"
                />
                <Bar 
                    dataKey="peserta" 
                    radius={[8, 8, 0, 0]}
                    maxBarSize={60}
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
