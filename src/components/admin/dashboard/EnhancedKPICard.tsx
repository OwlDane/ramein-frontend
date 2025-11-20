'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface EnhancedKPICardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number; // percentage change
        isPositive: boolean;
        label: string; // e.g., "vs last month"
    };
    sparklineData?: number[]; // Mini chart data
    target?: {
        current: number;
        target: number;
        label: string;
    };
    color?: 'blue' | 'green' | 'orange' | 'purple' | 'red';
    isLoading?: boolean;
}

const colorClasses = {
    blue: {
        bg: 'bg-blue-50 dark:bg-blue-950',
        icon: 'text-blue-600 dark:text-blue-400',
        trend: 'text-blue-600 dark:text-blue-400',
        progress: 'bg-blue-600',
    },
    green: {
        bg: 'bg-green-50 dark:bg-green-950',
        icon: 'text-green-600 dark:text-green-400',
        trend: 'text-green-600 dark:text-green-400',
        progress: 'bg-green-600',
    },
    orange: {
        bg: 'bg-orange-50 dark:bg-orange-950',
        icon: 'text-orange-600 dark:text-orange-400',
        trend: 'text-orange-600 dark:text-orange-400',
        progress: 'bg-orange-600',
    },
    purple: {
        bg: 'bg-purple-50 dark:bg-purple-950',
        icon: 'text-purple-600 dark:text-purple-400',
        trend: 'text-purple-600 dark:text-purple-400',
        progress: 'bg-purple-600',
    },
    red: {
        bg: 'bg-red-50 dark:bg-red-950',
        icon: 'text-red-600 dark:text-red-400',
        trend: 'text-red-600 dark:text-red-400',
        progress: 'bg-red-600',
    },
};

export function EnhancedKPICard({
    title,
    value,
    icon: Icon,
    trend,
    sparklineData,
    target,
    color = 'blue',
    isLoading = false,
}: EnhancedKPICardProps) {
    const colors = colorClasses[color];

    if (isLoading) {
        return (
            <Card className="overflow-hidden">
                <CardContent className="p-6">
                    <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-muted rounded w-2/3"></div>
                        <div className="h-8 bg-muted rounded w-1/2"></div>
                        <div className="h-3 bg-muted rounded w-1/3"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const TrendIcon = trend
        ? trend.isPositive
            ? TrendingUp
            : trend.value === 0
            ? Minus
            : TrendingDown
        : null;

    const progressPercentage = target
        ? Math.min((target.current / target.target) * 100, 100)
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        {title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${colors.bg}`}>
                        <Icon className={`w-4 h-4 ${colors.icon}`} />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {/* Main Value */}
                        <div className="text-2xl font-bold">{value}</div>

                        {/* Trend Indicator */}
                        {trend && TrendIcon && (
                            <div className="flex items-center gap-2">
                                <div
                                    className={`flex items-center gap-1 text-sm font-medium ${
                                        trend.isPositive
                                            ? 'text-green-600 dark:text-green-400'
                                            : trend.value === 0
                                            ? 'text-muted-foreground'
                                            : 'text-red-600 dark:text-red-400'
                                    }`}
                                >
                                    <TrendIcon className="w-4 h-4" />
                                    <span>
                                        {trend.value > 0 ? '+' : ''}
                                        {trend.value.toFixed(1)}%
                                    </span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {trend.label}
                                </span>
                            </div>
                        )}

                        {/* Sparkline */}
                        {sparklineData && sparklineData.length > 0 && (
                            <div className="h-8 flex items-end gap-0.5">
                                {sparklineData.map((value, index) => {
                                    const maxValue = Math.max(...sparklineData);
                                    const height = (value / maxValue) * 100;
                                    return (
                                        <motion.div
                                            key={index}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${height}%` }}
                                            transition={{ delay: index * 0.05 }}
                                            className={`flex-1 ${colors.progress} rounded-sm opacity-60 hover:opacity-100 transition-opacity`}
                                        />
                                    );
                                })}
                            </div>
                        )}

                        {/* Target Progress */}
                        {target && (
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>{target.label}</span>
                                    <span>
                                        {target.current} / {target.target}
                                    </span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressPercentage}%` }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                        className={`h-full ${colors.progress} rounded-full`}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
