import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Ticket, Eye, Download, AlertCircle } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { ETicket } from './ETicket';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';

interface MyTicketsProps {
    userToken: string;
}

interface Participant {
    id: string;
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
        eventType?: string;
        category?: string;
    };
}

interface User {
    name: string;
    email: string;
}

export function MyTickets({ userToken }: MyTicketsProps) {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<Participant | null>(null);
    const [activeTab, setActiveTab] = useState('upcoming');

    useEffect(() => {
        fetchTickets();
        fetchUserProfile();
    }, []);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const response = await apiFetch<Participant[]>('/participants/my-events', {
                token: userToken,
            });
            setParticipants(response);
        } catch (error) {
            console.error('Failed to fetch tickets:', error);
            toast.error('Gagal memuat tiket');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserProfile = async () => {
        try {
            const { authAPI } = await import('@/lib/auth');
            const profile = await authAPI.getProfile(userToken);
            setUser(profile);
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        }
    };

    const isEventUpcoming = (date: string, time: string) => {
        const now = new Date();
        const eventDateTime = new Date(date);
        const [hours, minutes] = time.split(':').map(Number);
        eventDateTime.setHours(hours, minutes);
        return now < eventDateTime;
    };

    const filterTickets = (filter: string) => {
        return participants.filter((p) => {
            const isUpcoming = isEventUpcoming(p.event.date, p.event.time);

            switch (filter) {
                case 'upcoming':
                    return isUpcoming;
                case 'past':
                    return !isUpcoming;
                case 'attended':
                    return p.hasAttended;
                default:
                    return true;
            }
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const handleViewTicket = (participant: Participant) => {
        setSelectedTicket(participant);
    };

    const handleDownloadPDF = async () => {
        try {
            toast.success('Download PDF akan segera dimulai...');
            // TODO: Implement PDF download using jsPDF + html2canvas
        } catch (error) {
            toast.error('Gagal download PDF');
        }
    };

    const upcomingTickets = filterTickets('upcoming');
    const pastTickets = filterTickets('past');
    const attendedTickets = filterTickets('attended');

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Memuat tiket...</p>
                </div>
            </div>
        );
    }

    // Show full ticket view if selected
    if (selectedTicket && user) {
        return (
            <div className="space-y-6">
                <Button
                    variant="outline"
                    onClick={() => setSelectedTicket(null)}
                    className="mb-4"
                >
                    ← Kembali ke Daftar Tiket
                </Button>
                <ETicket
                    participant={selectedTicket}
                    user={user}
                    onDownload={handleDownloadPDF}
                    showActions={true}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Tiket Saya</h2>
                <p className="text-muted-foreground">
                    Kelola dan lihat semua e-ticket event yang Anda ikuti
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-border">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Tiket</p>
                                <p className="text-3xl font-bold text-foreground">{participants.length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <Ticket className="w-6 h-6 text-blue-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Akan Datang</p>
                                <p className="text-3xl font-bold text-foreground">{upcomingTickets.length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-yellow-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Sudah Hadir</p>
                                <p className="text-3xl font-bold text-foreground">{attendedTickets.length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                                <Clock className="w-6 h-6 text-green-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="upcoming">
                        Akan Datang ({upcomingTickets.length})
                    </TabsTrigger>
                    <TabsTrigger value="past">
                        Selesai ({pastTickets.length})
                    </TabsTrigger>
                    <TabsTrigger value="attended">
                        Sudah Hadir ({attendedTickets.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                    {filterTickets(activeTab).length === 0 ? (
                        <div className="py-16">
                            <div className="max-w-xl mx-auto text-center">
                                <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4">
                                    <AlertCircle className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Belum ada tiket</h3>
                                <p className="text-muted-foreground">
                                    Tidak ada tiket untuk kategori ini
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            <AnimatePresence>
                                {filterTickets(activeTab).map((participant, index) => (
                                    <motion.div
                                        key={participant.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Card className="border-border hover:shadow-lg transition-shadow overflow-hidden">
                                            <CardContent className="p-0">
                                                <div className="flex flex-col md:flex-row">
                                                    {/* Event Image */}
                                                    <div className="w-full md:w-48 h-32 md:h-auto relative">
                                                        <ImageWithFallback
                                                            src={participant.event.flyer || `https://picsum.photos/seed/${participant.event.id}/400/300`}
                                                            alt={participant.event.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        {participant.hasAttended && (
                                                            <Badge className="absolute top-2 right-2 bg-green-600">
                                                                ✓ Hadir
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    {/* Event Details */}
                                                    <div className="flex-1 p-6">
                                                        <div className="flex items-start justify-between mb-4">
                                                            <div className="flex-1">
                                                                <h3 className="text-xl font-bold text-foreground mb-2">
                                                                    {participant.event.title}
                                                                </h3>
                                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                                    {participant.event.description}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="w-4 h-4 text-primary" />
                                                                <span className="text-sm">{formatDate(participant.event.date)}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="w-4 h-4 text-primary" />
                                                                <span className="text-sm">{participant.event.time} WIB</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="w-4 h-4 text-primary" />
                                                                <span className="text-sm truncate">{participant.event.location}</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            <Button
                                                                onClick={() => handleViewTicket(participant)}
                                                                size="sm"
                                                                className="flex-1 md:flex-none"
                                                            >
                                                                <Eye className="w-4 h-4 mr-2" />
                                                                Lihat E-Ticket
                                                            </Button>

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
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
