'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface DateRange {
    startDate: Date;
    endDate: Date;
    label: string;
}

interface DateRangePickerProps {
    value: DateRange;
    onChange: (range: DateRange) => void;
}

const presetRanges = [
    {
        label: 'Hari Ini',
        getValue: () => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const endOfDay = new Date(today);
            endOfDay.setHours(23, 59, 59, 999);
            return { startDate: today, endDate: endOfDay, label: 'Hari Ini' };
        },
    },
    {
        label: '7 Hari Terakhir',
        getValue: () => {
            const end = new Date();
            const start = new Date();
            start.setDate(start.getDate() - 6);
            start.setHours(0, 0, 0, 0);
            return { startDate: start, endDate: end, label: '7 Hari Terakhir' };
        },
    },
    {
        label: '30 Hari Terakhir',
        getValue: () => {
            const end = new Date();
            const start = new Date();
            start.setDate(start.getDate() - 29);
            start.setHours(0, 0, 0, 0);
            return { startDate: start, endDate: end, label: '30 Hari Terakhir' };
        },
    },
    {
        label: 'Bulan Ini',
        getValue: () => {
            const now = new Date();
            const start = new Date(now.getFullYear(), now.getMonth(), 1);
            const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
            return { startDate: start, endDate: end, label: 'Bulan Ini' };
        },
    },
    {
        label: 'Bulan Lalu',
        getValue: () => {
            const now = new Date();
            const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
            return { startDate: start, endDate: end, label: 'Bulan Lalu' };
        },
    },
    {
        label: 'Tahun Ini',
        getValue: () => {
            const now = new Date();
            const start = new Date(now.getFullYear(), 0, 1);
            const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
            return { startDate: start, endDate: end, label: 'Tahun Ini' };
        },
    },
];

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
    const [isOpen, setIsOpen] = useState(false);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <div className="relative">
            <Button
                variant="outline"
                onClick={() => setIsOpen(!isOpen)}
                className="gap-2"
            >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">
                    {formatDate(value.startDate)} - {formatDate(value.endDate)}
                </span>
                <span className="sm:hidden">{value.label}</span>
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-2 w-64 bg-background border rounded-lg shadow-lg z-50 p-2"
                        >
                            <div className="space-y-1">
                                {presetRanges.map((preset) => {
                                    const range = preset.getValue();
                                    const isActive = value.label === preset.label;

                                    return (
                                        <button
                                            key={preset.label}
                                            onClick={() => {
                                                onChange(range);
                                                setIsOpen(false);
                                            }}
                                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                                isActive
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'hover:bg-muted'
                                            }`}
                                        >
                                            {preset.label}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-2 pt-2 border-t">
                                <div className="text-xs text-muted-foreground px-3 py-1">
                                    Custom range coming soon
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
