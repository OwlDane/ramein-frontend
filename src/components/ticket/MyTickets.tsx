import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Ticket, Eye, AlertCircle } from 'lucide-react';
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        if (!selectedTicket) return;
        
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
                const qrData = `RAMEIN-TICKET-${selectedTicket.tokenNumber}-${selectedTicket.event.id}`;
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
            const titleLines = pdf.splitTextToSize(selectedTicket.event.title, contentMaxWidth - margin);
            pdf.text(titleLines, margin, yPos);
            yPos += titleLines.length * 8;
            
            // Event info
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(12);
            pdf.setTextColor(107, 114, 128);
            
            const eventDate = new Date(selectedTicket.event.date).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            pdf.text(`Tanggal: ${eventDate}`, margin, yPos);
            yPos += 8;
            pdf.text(`Waktu: ${selectedTicket.event.time}`, margin, yPos);
            yPos += 8;
            const locationLines = pdf.splitTextToSize(`Lokasi: ${selectedTicket.event.location}`, contentMaxWidth - margin);
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
            pdf.text(`Token: ${selectedTicket.tokenNumber}`, margin, yPos);
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
            const fileName = `E-Ticket_${selectedTicket.event.title.replace(/[^a-zA-Z0-9]/g, '_')}_${selectedTicket.tokenNumber}.pdf`;
            pdf.save(fileName);

            toast.success('E-Ticket berhasil didownload!');
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Gagal mendownload E-Ticket');
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
