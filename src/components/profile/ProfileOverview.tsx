'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Calendar,
    Award,
    CheckCircle,
    Clock,
    Zap,
    ChevronRight,
    Activity,
    Target
} from 'lucide-react';

interface ProfileOverviewProps {
    user: {
        id: string;
        name: string;
        email: string;
    };
    userToken: string;
    onNavigate: (view: 'overview' | 'events' | 'certificates' | 'settings') => void;
}

export function ProfileOverview({ onNavigate }: ProfileOverviewProps) {
    const stats = [
        {
            label: 'Total Event',
            value: 0,
            icon: Calendar,
            gradient: 'from-blue-500 to-blue-600',
            bgGradient: 'from-blue-500/10 to-blue-600/5'
        },
        {
            label: 'Event Selesai',
            value: 0,
            icon: CheckCircle,
            gradient: 'from-green-500 to-green-600',
            bgGradient: 'from-green-500/10 to-green-600/5'
        },
        {
            label: 'Event Akan Datang',
            value: 0,
            icon: Clock,
            gradient: 'from-yellow-500 to-orange-500',
            bgGradient: 'from-yellow-500/10 to-orange-500/5'
        },
        {
            label: 'Sertifikat',
            value: 0,
            icon: Award,
            gradient: 'from-purple-500 to-purple-600',
            bgGradient: 'from-purple-500/10 to-purple-600/5'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.03, y: -5 }}
                    >
                        <Card className={`relative overflow-hidden border-border/60 bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm hover:shadow-xl transition-all duration-300`}>
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                                        <stat.icon className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-3xl font-bold">{stat.value}</div>
                                    <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                                </div>
                            </CardContent>
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl" />
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Activity Section */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <Card className="border-border/60 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:shadow-lg transition-all">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-primary" />
                            Aksi Cepat
                        </CardTitle>
                        <CardDescription>Navigasi cepat ke fitur utama</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button
                            onClick={() => window.location.href = '/'}
                            variant="outline"
                            className="w-full justify-between group hover:bg-primary hover:text-primary-foreground transition-all"
                        >
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Jelajahi Event
                            </span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button
                            onClick={() => onNavigate('events')}
                            variant="outline"
                            className="w-full justify-between group hover:bg-primary hover:text-primary-foreground transition-all"
                        >
                            <span className="flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                Lihat Riwayat
                            </span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button
                            onClick={() => onNavigate('certificates')}
                            variant="outline"
                            className="w-full justify-between group hover:bg-primary hover:text-primary-foreground transition-all"
                        >
                            <span className="flex items-center gap-2">
                                <Award className="w-4 h-4" />
                                Sertifikat Saya
                            </span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </CardContent>
                </Card>

                {/* Activity Summary */}
                <Card className="border-border/60 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:shadow-lg transition-all">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-primary" />
                            Ringkasan Aktivitas
                        </CardTitle>
                        <CardDescription>Pencapaian Anda bulan ini</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <span className="text-sm font-medium">Event Diikuti</span>
                                <Badge variant="secondary">0 event</Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <span className="text-sm font-medium">Sertifikat Diperoleh</span>
                                <Badge variant="secondary">0 sertifikat</Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <span className="text-sm font-medium">Tingkat Partisipasi</span>
                                <Badge className="bg-green-500">Aktif</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
