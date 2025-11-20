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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            
            // Alternative approach: Create PDF directly without html2canvas
            const { jsPDF } = await import('jspdf');
            
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            // PDF dimensions
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 20;
            const contentWidth = pageWidth - (margin * 2);
            
            // Header
            pdf.setFillColor(249, 250, 251); // bg-gray-50
            pdf.rect(0, 0, pageWidth, 60, 'F');
            
            // Load and add logo
            try {
                const logoResponse = await fetch('/logo.png');
                const logoBlob = await logoResponse.blob();
                const logoBase64 = await new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.readAsDataURL(logoBlob);
                });
                
                // Add logo image
                pdf.addImage(logoBase64, 'PNG', margin, 15, 20, 20);
            } catch {
                console.log('Logo not found, using fallback');
                // Fallback: Logo circle
                pdf.setFillColor(5, 150, 105); // green-600
                pdf.circle(margin + 10, 25, 8, 'F');
            }
            
            // Title
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(24);
            pdf.setTextColor(17, 24, 39); // gray-900
            pdf.text('RAMEIN', margin + 25, 25);
            
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(107, 114, 128); // gray-500
            pdf.text('E-Ticket', margin + 25, 35);
            
            // Generate QR Code (moved to center-right, larger size)
            try {
                const QRCode = (await import('qrcode')).default;
                const qrData = `RAMEIN-TICKET-${participant.tokenNumber}-${participant.event.id}`;
                const qrCodeDataURL = await QRCode.toDataURL(qrData, {
                    width: 200,
                    margin: 2,
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF'
                    }
                });
                
                // Add QR code - larger and positioned on the right side
                const qrSize = 40; // 40mm x 40mm
                const qrX = pageWidth - margin - qrSize;
                const qrY = 70; // Below header, aligned with event info
                pdf.addImage(qrCodeDataURL, 'PNG', qrX, qrY, qrSize, qrSize);
                
                // Add QR code label
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(10);
                pdf.setTextColor(17, 24, 39);
                pdf.text('SCAN QR CODE', qrX + (qrSize/2), qrY + qrSize + 5, { align: 'center' });
            } catch {
                console.log('QR Code generation failed, using placeholder');
                // Fallback: QR placeholder (larger)
                const qrSize = 40;
                const qrX = pageWidth - margin - qrSize;
                const qrY = 70;
                pdf.setFillColor(17, 24, 39);
                pdf.rect(qrX, qrY, qrSize, qrSize, 'F');
                pdf.setTextColor(255, 255, 255);
                pdf.setFontSize(16);
                pdf.text('QR', qrX + (qrSize/2), qrY + (qrSize/2), { align: 'center' });
            }
            
            // Event details (adjusted for QR code space)
            let yPos = 80;
            const contentMaxWidth = pageWidth - margin - 50; // Leave space for QR code
            
            // Event title
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(18);
            pdf.setTextColor(17, 24, 39);
            const titleLines = pdf.splitTextToSize(participant.event.title, contentMaxWidth - margin);
            pdf.text(titleLines, margin, yPos);
            yPos += titleLines.length * 8;
            
            // Event info
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(12);
            pdf.setTextColor(107, 114, 128);
            
            const eventDate = new Date(participant.event.date).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            pdf.text(`Tanggal: ${eventDate}`, margin, yPos);
            yPos += 8;
            pdf.text(`Waktu: ${participant.event.time}`, margin, yPos);
            yPos += 8;
            const locationLines = pdf.splitTextToSize(`Lokasi: ${participant.event.location}`, contentMaxWidth - margin);
            pdf.text(locationLines, margin, yPos);
            yPos += locationLines.length * 8 + 10;
            
            // Participant info
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(14);
            pdf.setTextColor(17, 24, 39);
            pdf.text('Informasi Peserta', margin, yPos);
            yPos += 10;
            
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(12);
            pdf.setTextColor(107, 114, 128);
            pdf.text(`Nama: ${user?.name || 'N/A'}`, margin, yPos);
            yPos += 8;
            pdf.text(`Email: ${user?.email || 'N/A'}`, margin, yPos);
            yPos += 8;
            pdf.text(`Token: ${participant.tokenNumber}`, margin, yPos);
            yPos += 20;
            
            // Instructions
            pdf.setFillColor(254, 243, 199); // yellow-100
            pdf.rect(margin, yPos, contentWidth, 40, 'F');
            
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(12);
            pdf.setTextColor(146, 64, 14); // yellow-800
            pdf.text('PETUNJUK PENGGUNAAN E-TICKET', margin + 5, yPos + 8);
            
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            pdf.setTextColor(120, 53, 15); // yellow-700
            const instructions = [
                '• Tunjukkan QR code ini saat check-in di lokasi event',
                '• Simpan e-ticket ini di ponsel Anda',
                '• Pastikan layar ponsel cukup terang saat scanning',
                '• Token kehadiran juga telah dikirim ke email Anda'
            ];
            
            instructions.forEach((instruction, index) => {
                pdf.text(instruction, margin + 5, yPos + 18 + (index * 5));
            });
            
            // Footer
            yPos = pageHeight - 30;
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            pdf.setTextColor(107, 114, 128);
            pdf.text('Digenerate oleh RAMEIN - Sistem Manajemen Kegiatan', margin, yPos);
            pdf.text(new Date().toLocaleString('id-ID'), margin, yPos + 5);
            
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