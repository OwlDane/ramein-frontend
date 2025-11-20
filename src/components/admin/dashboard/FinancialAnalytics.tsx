'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Banknote, TrendingUp, CreditCard, RefreshCcw } from 'lucide-react';

export interface FinancialData {
    totalRevenue: number;
    monthlyRevenue: Array<{
        month: string;
        revenue: number;
        transactions: number;
    }>;
    revenueByCategory: Array<{
        category: string;
        revenue: number;
        percentage: number;
    }>;
    paymentMethods: Array<{
        method: string;
        count: number;
        amount: number;
    }>;
    metrics: {
        averageTicketPrice: number;
        totalTransactions: number;
        refundRate: number;
        refundAmount: number;
    };
}

interface FinancialAnalyticsProps {
    data: FinancialData;
    isLoading?: boolean;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

export function FinancialAnalytics({ data, isLoading = false }: FinancialAnalyticsProps) {
    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

    const formatCurrency = (value: number | undefined) => {
        const safeValue = value || 0;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(safeValue);
    };

    const formatNumber = (value: number | undefined) => {
        const safeValue = value || 0;
        return new Intl.NumberFormat('id-ID').format(safeValue);
    };

    return (
        <div className="space-y-6">
            {/* Financial KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Revenue
                            </CardTitle>
                            <Banknote className="w-4 h-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(data?.totalRevenue)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {formatNumber(data?.metrics?.totalTransactions)} transaksi
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Rata-rata Harga Tiket
                            </CardTitle>
                            <TrendingUp className="w-4 h-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(data?.metrics?.averageTicketPrice)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Per event
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Transaksi
                            </CardTitle>
                            <CreditCard className="w-4 h-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatNumber(data?.metrics?.totalTransactions)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Pembayaran berhasil
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Refund Rate
                            </CardTitle>
                            <RefreshCcw className="w-4 h-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {(data?.metrics?.refundRate || 0).toFixed(1)}%
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {formatCurrency(data?.metrics?.refundAmount)} dikembalikan
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trend */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Trend Revenue Bulanan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={data?.monthlyRevenue || []}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis
                                        dataKey="month"
                                        className="text-xs"
                                        tick={{ fill: 'currentColor' }}
                                    />
                                    <YAxis
                                        className="text-xs"
                                        tick={{ fill: 'currentColor' }}
                                        tickFormatter={(value) => `${(value / 1000000).toFixed(0)}jt`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--background))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px',
                                        }}
                                        formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#3b82f6"
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Revenue by Category */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Revenue per Kategori</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={data?.revenueByCategory || []}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={(entry: Record<string, unknown>) =>
                                            `${entry.category}: ${(entry.percentage as number).toFixed(1)}%`
                                        }
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="revenue"
                                    >
                                        {(data?.revenueByCategory || []).map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--background))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px',
                                        }}
                                        formatter={(value: number) => formatCurrency(value)}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Payment Methods */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Metode Pembayaran</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {(data?.paymentMethods || []).map((method, index) => {
                                const percentage =
                                    (method.amount / (data?.totalRevenue || 1)) * 100;
                                return (
                                    <div key={index} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium">{method.method}</span>
                                            <span className="text-muted-foreground">
                                                {formatCurrency(method.amount)} ({method.count} transaksi)
                                            </span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-2">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                                                className="h-full rounded-full"
                                                style={{
                                                    backgroundColor: COLORS[index % COLORS.length],
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
