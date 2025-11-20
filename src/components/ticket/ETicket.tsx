import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User, Mail, Ticket, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateQRCode } from '@/lib/qrcode';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';

interface ETicketProps {
    participant: {
        id: string;
        tokenNumber: string;
        hasAttended: boolean;
        event: {
            id: string;
            title: string;
            date: string;
            time: string;
            location: string;
            flyer?: string;
            eventType?: string;
        };
    };
    user: {
        name: string;
        email: string;
    };
    onDownload?: () => void;
    showActions?: boolean;
}

export function ETicket({ participant, user, onDownload, showActions = true }: ETicketProps) {
    const [qrCode, setQrCode] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const generateQR = async () => {
        try {
            setLoading(true);
            setError(null);

            // Check if tokenNumber exists
            if (!participant.tokenNumber) {
                setError('Token number not available');
                setQrCode('');
                return;
            }

            const qrDataURL = await generateQRCode(participant.tokenNumber, {
                width: 250,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF',
                },
            });
            setQrCode(qrDataURL);
        } catch (error) {
            console.error('Failed to generate QR code:', error);
            setError(error instanceof Error ? error.message : 'Failed to generate QR code');
            setQrCode('');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        generateQR();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [participant.tokenNumber]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (timeString: string) => {
        return timeString + ' WIB';
    };

    const getEventTypeColor = (type?: string) => {
        switch (type) {
            case 'online':
                return 'bg-blue-500';
            case 'hybrid':
                return 'bg-purple-500';
            default:
                return 'bg-green-500';
        }
    };

    const getEventTypeName = (type?: string) => {
        switch (type) {
            case 'online':
                return 'Online';
            case 'hybrid':
                return 'Hybrid';
            default:
                return 'Offline';
        }
    };

    const isEventPassed = () => {
        const now = new Date();
        const eventDateTime = new Date(participant.event.date);
        const [hours, minutes] = participant.event.time.split(':').map(Number);
        eventDateTime.setHours(hours, minutes);
        return now > eventDateTime;
    };

    const copyToken = async () => {
        try {
            await navigator.clipboard.writeText(participant.tokenNumber);
            // You might want to add a toast notification here
        } catch (error) {
            console.error('Failed to copy token:', error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl mx-auto"
        >
            <Card id="e-ticket-content" className="border-2 border-border overflow-hidden pdf-safe">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 p-6 border-b-2 border-dashed border-border">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                                <Ticket className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">RAMEIN</h2>
                                <p className="text-sm text-muted-foreground">E-Ticket</p>
                            </div>
                        </div>
                        <Badge className={`${getEventTypeColor(participant.event.eventType)} text-white`}>
                            {getEventTypeName(participant.event.eventType)}
                        </Badge>
                    </div>

                    {participant.hasAttended && (
                        <Badge variant="default" className="bg-green-600">
                            ✓ Sudah Hadir
                        </Badge>
                    )}

                    {isEventPassed() && !participant.hasAttended && (
                        <Badge variant="destructive">
                            Event Selesai
                        </Badge>
                    )}
                </div>

                <CardContent className="p-6 space-y-6">
                    {/* Event Info */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-2xl font-bold text-foreground mb-2">
                                {participant.event.title}
                            </h3>
                            <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
                                <ImageWithFallback
                                    src={participant.event.flyer || `https://picsum.photos/seed/${participant.event.id}/800/400`}
                                    alt={participant.event.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                                <Calendar className="w-5 h-5 text-primary mt-0.5" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Tanggal</p>
                                    <p className="font-semibold text-foreground">{formatDate(participant.event.date)}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                                <Clock className="w-5 h-5 text-primary mt-0.5" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Waktu</p>
                                    <p className="font-semibold text-foreground">{formatTime(participant.event.time)}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 md:col-span-2">
                                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Lokasi</p>
                                    <p className="font-semibold text-foreground">{participant.event.location}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Participant Info */}
                    <div className="border-t border-dashed pt-6">
                        <h4 className="text-sm font-semibold text-muted-foreground mb-3">INFORMASI PESERTA</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                                <User className="w-4 h-4 text-primary" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Nama</p>
                                    <p className="font-medium text-foreground">{user.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                                <Mail className="w-4 h-4 text-primary" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Email</p>
                                    <p className="font-medium text-foreground truncate">{user.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* QR Code Section */}
                    <div className="border-t border-dashed pt-6">
                        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 text-center">
                            <h4 className="text-sm font-semibold text-muted-foreground mb-4">KODE QR KEHADIRAN</h4>

                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                                </div>
                            ) : error ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="text-center">
                                        <p className="text-sm text-red-600 font-medium">{error}</p>
                                    </div>
                                </div>
                            ) : qrCode ? (
                                <div className="space-y-4">
                                    <div className="inline-block p-4 bg-white rounded-2xl shadow-lg">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={qrCode} alt="QR Code" className="w-64 h-64" />
                                    </div>

                                    <div>
                                        <p className="text-xs text-muted-foreground mb-2">Token Number</p>
                                        <div className="flex items-center justify-center gap-2">
                                            <code className="text-2xl font-mono font-bold text-foreground tracking-wider">
                                                {participant.tokenNumber}
                                            </code>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={copyToken}
                                                className="h-8 w-8 p-0"
                                            >
                                                <Share2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-center items-center h-64">
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground">QR code tidak tersedia</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium mb-2">
                            ⚠️ Petunjuk Penggunaan E-Ticket
                        </p>
                        <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1 ml-4 list-disc">
                            <li>Tunjukkan QR code ini saat check-in di lokasi event</li>
                            <li>Simpan e-ticket ini di ponsel Anda</li>
                            <li>Pastikan layar ponsel cukup terang saat scanning</li>
                            <li>Token kehadiran juga telah dikirim ke email Anda</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    {showActions && (
                        <div className="flex gap-3 pt-4">
                            <Button onClick={onDownload} className="flex-1" size="lg">
                                <Download className="w-4 h-4 mr-2" />
                                Download PDF
                            </Button>
                        </div>
                    )}
                </CardContent>

                {/* Footer */}
                <div className="bg-muted/30 px-6 py-4 border-t border-dashed text-center">
                    <p className="text-xs text-muted-foreground">
                        E-Ticket ini valid sampai event dimulai • Powered by Ramein
                    </p>
                </div>
            </Card>
        </motion.div>
    );
}
