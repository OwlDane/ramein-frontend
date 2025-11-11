import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { 
    Calendar, Clock, MapPin, Users, CheckCircle, XCircle, 
    Clock3, Download, Search, Filter, Ticket, X, CalendarDays, Award, UserCheck, UserX, ChevronDown, ChevronUp
} from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { apiFetch } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { ETicket } from '@/components/ticket/ETicket';

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
    const [showFilter, setShowFilter] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Participant | null>(null);
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);

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
        fetchUserProfile();
    }, [fetchEventHistory]);

    const fetchUserProfile = async () => {
        try {
            const { authAPI } = await import('@/lib/auth');
            const profile = await authAPI.getProfile(userToken);
            setUser(profile);
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        }
    };

    const isEventCompleted = (date: string, time: string) => {
        const now = new Date();
        const eventDateTime = new Date(date);
        eventDateTime.setHours(parseInt(time.split(':')[0]));
        eventDateTime.setMinutes(parseInt(time.split(':')[1]));
        return now > eventDateTime;
    };

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

    const handleDownloadTicket = async (participant: Participant) => {
        try {
            toast.success('Mempersiapkan download E-Ticket...');
            
            // Dynamically import libraries
            const html2canvas = (await import('html2canvas')).default;
            const { jsPDF } = await import('jspdf');

            // Find the ticket element
            const ticketElement = document.getElementById('e-ticket-content');
            if (!ticketElement) {
                throw new Error('Ticket element not found');
            }

            // Capture the ticket as canvas
            const canvas = await html2canvas(ticketElement, {
                scale: 2, // Higher quality
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                allowTaint: true,
                foreignObjectRendering: false,
                imageTimeout: 0,
                onclone: (clonedDoc) => {
                    // Fix modern CSS colors that html2canvas doesn't support
                    const clonedElement = clonedDoc.getElementById('e-ticket-content');
                    if (clonedElement) {
                        // Remove problematic gradient classes and use solid colors
                        const gradients = clonedElement.querySelectorAll('[class*="gradient"]');
                        gradients.forEach((el) => {
                            if (el instanceof HTMLElement) {
                                el.style.background = '#f0f0f0';
                                el.style.backgroundImage = 'none';
                            }
                        });
                        
                        // Convert any problematic colors to hex
                        clonedElement.style.backgroundColor = '#ffffff';
                    }
                }
            });

            // Convert canvas to PDF
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            // Calculate dimensions to fit A4
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 10; // 10mm from top

            pdf.addImage(
                imgData,
                'PNG',
                imgX,
                imgY,
                imgWidth * ratio,
                imgHeight * ratio
            );

            // Save the PDF
            const fileName = `E-Ticket_${participant.event.title.replace(/[^a-zA-Z0-9]/g, '_')}_${participant.tokenNumber}.pdf`;
            pdf.save(fileName);

            toast.success('E-Ticket berhasil didownload!');
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Gagal mendownload E-Ticket');
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
                    { label: 'Total Event', value: stats.total, icon: CalendarDays },
                    { label: 'Akan Datang', value: stats.upcoming, icon: Clock3 },
                    { label: 'Selesai', value: stats.completed, icon: CheckCircle },
                    { label: 'Hadir', value: stats.attended, icon: UserCheck },
                    { label: 'Tidak Hadir', value: stats.missed, icon: UserX },
                    { label: 'Sertifikat', value: stats.certificates, icon: Award }
                ].map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="text-center border-border hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mx-auto mb-2">
                                        <IconComponent className="w-6 h-6 text-foreground" />
                                    </div>
                                    <p className="text-2xl font-bold mb-1">{stat.value}</p>
                                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
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
                <Button
                    variant="outline"
                    onClick={() => setShowFilter(!showFilter)}
                    className="flex items-center gap-2"
                >
                    <Filter className="w-4 h-4" />
                    Filter
                    {showFilter ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
            </div>

            {/* Collapsible Filter Dropdown */}
            <AnimatePresence>
                {showFilter && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <Card className="p-4">
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                <Button
                                    variant={activeTab === 'all' ? 'default' : 'outline'}
                                    onClick={() => setActiveTab('all')}
                                    className="w-full justify-start"
                                >
                                    <CalendarDays className="w-4 h-4 mr-2" />
                                    Semua ({stats.total})
                                </Button>
                                <Button
                                    variant={activeTab === 'upcoming' ? 'default' : 'outline'}
                                    onClick={() => setActiveTab('upcoming')}
                                    className="w-full justify-start"
                                >
                                    <Clock3 className="w-4 h-4 mr-2" />
                                    Akan Datang ({stats.upcoming})
                                </Button>
                                <Button
                                    variant={activeTab === 'completed' ? 'default' : 'outline'}
                                    onClick={() => setActiveTab('completed')}
                                    className="w-full justify-start"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Selesai ({stats.completed})
                                </Button>
                                <Button
                                    variant={activeTab === 'attended' ? 'default' : 'outline'}
                                    onClick={() => setActiveTab('attended')}
                                    className="w-full justify-start"
                                >
                                    <UserCheck className="w-4 h-4 mr-2" />
                                    Hadir ({stats.attended})
                                </Button>
                                <Button
                                    variant={activeTab === 'missed' ? 'default' : 'outline'}
                                    onClick={() => setActiveTab('missed')}
                                    className="w-full justify-start"
                                >
                                    <UserX className="w-4 h-4 mr-2" />
                                    Tidak Hadir ({stats.missed})
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content */}
            <Tabs value={activeTab} className="w-full">
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
                                                        <div className="flex items-center gap-3 flex-wrap">
                                                            {/* View Ticket Button - for upcoming events */}
                                                            {!isEventCompleted(participant.event.date, participant.event.time) && (
                                                                <Button
                                                                    onClick={() => setSelectedTicket(participant)}
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                                                                >
                                                                    <Ticket className="w-4 h-4 mr-2" />
                                                                    Lihat E-Ticket
                                                                </Button>
                                                            )}

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

            {/* E-Ticket Modal */}
            <AnimatePresence>
                {selectedTicket && user && (
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedTicket(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <Button
                                onClick={() => setSelectedTicket(null)}
                                variant="ghost"
                                size="icon"
                                className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full shadow-lg"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                            
                            <ETicket
                                participant={{
                                    id: selectedTicket.id,
                                    tokenNumber: selectedTicket.tokenNumber,
                                    hasAttended: selectedTicket.hasAttended,
                                    event: {
                                        id: selectedTicket.event.id,
                                        title: selectedTicket.event.title,
                                        date: selectedTicket.event.date,
                                        time: selectedTicket.event.time,
                                        location: selectedTicket.event.location,
                                        flyer: selectedTicket.event.flyer,
                                        eventType: selectedTicket.event.category,
                                    }
                                }}
                                user={{
                                    name: user.name,
                                    email: user.email,
                                }}
                                showActions={true}
                                onDownload={() => handleDownloadTicket(selectedTicket)}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}