import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    Calendar, Clock, MapPin, Users, CheckCircle, XCircle, 
    Download, Search, Filter, User, Award, BookOpen
} from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { EventHistory } from './event/EventHistory';
import { CertificateList } from './event/CertificateList';

interface UserDashboardProps {
    user: {
        id: string;
        name: string;
        email: string;
        avatar?: string | null;
    };
}

export function UserDashboard({ user }: UserDashboardProps) {
    const [userToken, setUserToken] = useState<string>('');
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        // Get user token from localStorage
        const token = localStorage.getItem('userToken');
        if (token) {
            setUserToken(token);
        }
    }, []);

    const stats = {
        totalEvents: 0, // Will be updated by EventHistory component
        completedEvents: 0,
        upcomingEvents: 0,
        certificates: 0
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" as const }
        }
    };

    if (!userToken) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Token tidak ditemukan. Silakan login ulang.</p>
                <Button onClick={() => window.location.reload()}>Refresh Halaman</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-dark">
            <div className="container mx-auto px-4 py-8">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8"
                >
                    {/* Header */}
                    <motion.div variants={itemVariants}>
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <User className="w-10 h-10 text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">
                                Selamat Datang, {user.name}!
                            </h1>
                            <p className="text-muted-foreground">
                                Kelola event, kehadiran, dan sertifikat Anda
                            </p>
                        </div>
                    </motion.div>

                    {/* Quick Stats */}
                    <motion.div variants={itemVariants}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Total Event', value: stats.totalEvents, icon: Calendar, color: 'bg-blue-500' },
                                { label: 'Event Selesai', value: stats.completedEvents, icon: CheckCircle, color: 'bg-green-500' },
                                { label: 'Event Akan Datang', value: stats.upcomingEvents, icon: Clock, color: 'bg-yellow-500' },
                                { label: 'Sertifikat', value: stats.certificates, icon: Award, color: 'bg-purple-500' }
                            ].map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Card className="text-center border-border hover:shadow-lg transition-all duration-200">
                                        <CardContent className="p-4">
                                            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                                                <stat.icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Main Content Tabs */}
                    <motion.div variants={itemVariants}>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-3 h-12 bg-muted/50">
                                <TabsTrigger value="overview" className="text-base">Overview</TabsTrigger>
                                <TabsTrigger value="events" className="text-base">Riwayat Event</TabsTrigger>
                                <TabsTrigger value="certificates" className="text-base">Sertifikat</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="mt-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Recent Events */}
                                    <Card className="border-border">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Calendar className="w-5 h-5 text-primary" />
                                                Event Terbaru
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground text-sm">
                                                Lihat event terbaru yang Anda ikuti di tab "Riwayat Event"
                                            </p>
                                            <Button 
                                                onClick={() => setActiveTab('events')}
                                                variant="outline" 
                                                className="mt-4"
                                            >
                                                Lihat Semua Event
                                            </Button>
                                        </CardContent>
                                    </Card>

                                    {/* Recent Certificates */}
                                    <Card className="border-border">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Award className="w-5 h-5 text-primary" />
                                                Sertifikat Terbaru
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground text-sm">
                                                Lihat sertifikat terbaru yang Anda dapatkan di tab "Sertifikat"
                                            </p>
                                            <Button 
                                                onClick={() => setActiveTab('certificates')}
                                                variant="outline" 
                                                className="mt-4"
                                            >
                                                Lihat Semua Sertifikat
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            <TabsContent value="events" className="mt-6">
                                <EventHistory userToken={userToken} />
                            </TabsContent>

                            <TabsContent value="certificates" className="mt-6">
                                <CertificateList userToken={userToken} />
                            </TabsContent>
                        </Tabs>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}