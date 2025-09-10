import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    Calendar, Clock, MapPin, Users, CheckCircle, XCircle, 
    Clock3, Download, Search, Filter
} from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { apiFetch } from '@/lib/api';
import { toast } from 'react-hot-toast';

interface EventHistoryProps {
    userToken: string;
}

interface Participant {
    id: string;
    eventId: string;
    tokenNumber: string;
    hasAttended: boolean;
    attendedAt: Date | null;
    createdAt: Date;
    event: {
        id: string;
        title: string;
        description: string;
        date: string;
        time: string;
        location: string;
        flyer?: string;
        category?: string;
    };
    certificate?: {
        id: string;
        certificateUrl: string;
        verificationCode: string;
        issuedAt: Date;
    };
}

export function EventHistory({ userToken }: EventHistoryProps) {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    const fetchEventHistory = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiFetch<Participant[]>('/participants/my-events', {
                token: userToken
            });
            setParticipants(response);
        } catch (error: unknown) {
            console.error('Failed to fetch event history:', error);
            const msg = error instanceof Error ? error.message : 'Gagal memuat riwayat event';
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, [userToken]);

    useEffect(() => {
        fetchEventHistory();
    }, [fetchEventHistory]);

    const filteredParticipants = participants.filter(participant => {
        const matchesSearch = participant.event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            participant.event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            participant.event.location.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesTab = activeTab === 'all' ||
            (activeTab === 'upcoming' && !isEventCompleted(participant.event.date, participant.event.time)) ||
            (activeTab === 'completed' && isEventCompleted(participant.event.date, participant.event.time)) ||
            (activeTab === 'attended' && participant.hasAttended) ||
            (activeTab === 'missed' && isEventCompleted(participant.event.date, participant.event.time) && !participant.hasAttended);

        return matchesSearch && matchesTab;
    });

    const isEventCompleted = (date: string, time: string) => {
        const now = new Date();
        const eventDateTime = new Date(date);
        eventDateTime.setHours(parseInt(time.split(':')[0]));
        eventDateTime.setMinutes(parseInt(time.split(':')[1]));
        return now > eventDateTime;
    };

    const getEventStatus = (participant: Participant) => {
        const isCompleted = isEventCompleted(participant.event.date, participant.event.time);
        
        if (isCompleted) {
            if (participant.hasAttended) {
                return { status: 'attended', color: 'default', text: 'Hadir', icon: CheckCircle };
            } else {
                return { status: 'missed', color: 'destructive', text: 'Tidak Hadir', icon: XCircle };
            }
        } else {
            return { status: 'upcoming', color: 'secondary', text: 'Akan Datang', icon: Clock3 };
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString: string) => {
        return timeString + ' WIB';
    };

    const handleDownloadCertificate = async (certificateUrl: string, eventTitle: string) => {
        try {
            // In a real app, this would trigger actual download
            // For now, we'll just show a success message
            toast.success(`Download sertifikat untuk event "${eventTitle}"`);
            console.log('Downloading certificate from:', certificateUrl);
        } catch {
            toast.error('Gagal mengunduh sertifikat');
        }
    };

    const getStats = () => {
        const total = participants.length;
        const upcoming = participants.filter(p => !isEventCompleted(p.event.date, p.event.time)).length;
        const completed = participants.filter(p => isEventCompleted(p.event.date, p.event.time)).length;
        const attended = participants.filter(p => p.hasAttended).length;
        const missed = completed - attended;
        const certificates = participants.filter(p => p.certificate).length;

        return { total, upcoming, completed, attended, missed, certificates };
    };

    const stats = getStats();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Memuat riwayat event...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-16">
                <div className="max-w-xl mx-auto text-center">
                    <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-4">
                        <XCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Waduh, gagal ngambil data</h3>
                    <p className="text-muted-foreground mb-6">Kayaknya lagi ada kendala. Coba lagi ya, atau balik ke beranda dulu.</p>
                    <div className="flex items-center justify-center gap-3">
                        <Button onClick={fetchEventHistory}>Coba Lagi</Button>
                        <Button variant="outline" onClick={() => window.location.assign('/')}>Ke Beranda</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {[
                    { label: 'Total Event', value: stats.total, color: 'bg-blue-500' },
                    { label: 'Akan Datang', value: stats.upcoming, color: 'bg-yellow-500' },
                    { label: 'Selesai', value: stats.completed, color: 'bg-green-500' },
                    { label: 'Hadir', value: stats.attended, color: 'bg-emerald-500' },
                    { label: 'Tidak Hadir', value: stats.missed, color: 'bg-red-500' },
                    { label: 'Sertifikat', value: stats.certificates, color: 'bg-purple-500' }
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="text-center border-border">
                            <CardContent className="p-4">
                                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                                    <span className="text-white font-bold text-lg">{stat.value}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari event berdasarkan nama, deskripsi, atau lokasi..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Filter:</span>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="all">Semua ({stats.total})</TabsTrigger>
                    <TabsTrigger value="upcoming">Akan Datang ({stats.upcoming})</TabsTrigger>
                    <TabsTrigger value="completed">Selesai ({stats.completed})</TabsTrigger>
                    <TabsTrigger value="attended">Hadir ({stats.attended})</TabsTrigger>
                    <TabsTrigger value="missed">Tidak Hadir ({stats.missed})</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                    {filteredParticipants.length === 0 ? (
                        <div className="py-16">
                            <div className="max-w-xl mx-auto text-center">
                                <div className="w-16 h-16 rounded-full bg-muted/30 text-primary flex items-center justify-center mx-auto mb-4">
                                    <Calendar className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Belum ada riwayat event</h3>
                                <p className="text-muted-foreground">Ngga ada riwayat event nih. Yuk daftar event biar timeline kamu rame!</p>
                                <div className="flex items-center justify-center gap-3 mt-6">
                                    <Button onClick={fetchEventHistory}>Coba Lagi</Button>
                                    <Button variant="outline" onClick={() => window.location.assign('/')}>Lihat Event</Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredParticipants.map((participant, index) => {
                                const status = getEventStatus(participant);
                                const StatusIcon = status.icon;

                                return (
                                    <motion.div
                                        key={participant.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Card className="border-border hover:shadow-lg transition-shadow">
                                            <CardContent className="p-6">
                                                <div className="flex flex-col md:flex-row gap-6">
                                                    {/* Event Image */}
                                                    <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden shrink-0">
                                                        <ImageWithFallback
                                                            src={participant.event.flyer || `https://picsum.photos/seed/${participant.event.id}/400/300`}
                                                            alt={participant.event.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>

                                                    {/* Event Details */}
                                                    <div className="flex-1 space-y-4">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <h3 className="text-xl font-bold text-foreground mb-2">
                                                                    {participant.event.title}
                                                                </h3>
                                                                <p className="text-muted-foreground line-clamp-2">
                                                                    {participant.event.description}
                                                                </p>
                                                            </div>
                                                            <Badge variant={status.color as "default" | "secondary" | "destructive" | "outline"} className="shrink-0">
                                                                <StatusIcon className="w-3 h-3 mr-1" />
                                                                {status.text}
                                                            </Badge>
                                                        </div>

                                                        {/* Event Info */}
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="w-4 h-4 text-primary" />
                                                                <span className="text-sm">{formatDate(participant.event.date)}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="w-4 h-4 text-primary" />
                                                                <span className="text-sm">{formatTime(participant.event.time)}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="w-4 h-4 text-primary" />
                                                                <span className="text-sm">{participant.event.location}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Users className="w-4 h-4 text-primary" />
                                                                <span className="text-sm">Token: {participant.tokenNumber}</span>
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex items-center gap-3">
                                                            {participant.certificate && (
                                                                <Button
                                                                    onClick={() => handleDownloadCertificate(
                                                                        participant.certificate!.certificateUrl,
                                                                        participant.event.title
                                                                    )}
                                                                    size="sm"
                                                                    className="bg-green-600 hover:bg-green-700"
                                                                >
                                                                    <Download className="w-4 h-4 mr-2" />
                                                                    Download Sertifikat
                                                                </Button>
                                                            )}
                                                            
                                                            {participant.event.category && (
                                                                <Badge variant="outline" className="text-xs">
                                                                    {participant.event.category}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}