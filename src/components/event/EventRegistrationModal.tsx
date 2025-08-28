import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiFetch } from '@/lib/api';

interface EventRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: {
        id: string;
        title: string;
        date: string;
        time: string;
        location: string;
        maxParticipants: number;
        currentParticipants: number;
        price: number;
    };
    userToken: string;
    onRegistrationSuccess: (token: string) => void;
}

interface RegistrationData {
    eventId: string;
    userId: string;
}

export function EventRegistrationModal({ 
    isOpen, 
    onClose, 
    event, 
    userToken, 
    onRegistrationSuccess 
}: EventRegistrationModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [registrationStep, setRegistrationStep] = useState<'confirm' | 'success'>('confirm');
    const [generatedToken, setGeneratedToken] = useState<string>('');

    // Check if event is still open for registration
    const isEventOpen = () => {
        const now = new Date();
        const eventDateTime = new Date(event.date);
        eventDateTime.setHours(parseInt(event.time.split(':')[0]));
        eventDateTime.setMinutes(parseInt(event.time.split(':')[1]));
        return now < eventDateTime;
    };

    // Check if event is full
    const isEventFull = event.currentParticipants >= event.maxParticipants;

    const handleRegistration = async () => {
        if (!isEventOpen()) {
            toast.error('Pendaftaran event sudah ditutup');
            return;
        }

        if (isEventFull) {
            toast.error('Event sudah penuh');
            return;
        }

        setIsLoading(true);
        try {
            const response = await apiFetch<any>('/participants/register', {
                method: 'POST',
                body: {
                    eventId: event.id
                },
                token: userToken
            });

            if (response.participant?.tokenNumber) {
                setGeneratedToken(response.participant.tokenNumber);
                setRegistrationStep('success');
                onRegistrationSuccess(response.participant.tokenNumber);
                toast.success('Pendaftaran berhasil! Token kehadiran telah dikirim ke email Anda.');
            } else {
                toast.error('Gagal mendapatkan token kehadiran');
            }
        } catch (error: any) {
            console.error('Registration error:', error);
            toast.error(error?.message || 'Terjadi kesalahan saat mendaftar event');
        } finally {
            setIsLoading(false);
        }
    };

    const copyToken = async () => {
        try {
            await navigator.clipboard.writeText(generatedToken);
            toast.success('Token berhasil disalin!');
        } catch {
            toast.error('Gagal menyalin token');
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

    const formatPrice = (price: number) => {
        if (price === 0) return 'Gratis';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const getEventStatus = () => {
        if (!isEventOpen()) {
            return { status: 'closed', color: 'destructive', text: 'Pendaftaran Ditutup' };
        }
        if (isEventFull) {
            return { status: 'full', color: 'destructive', text: 'Event Penuh' };
        }
        return { status: 'open', color: 'default', text: 'Pendaftaran Dibuka' };
    };

    const eventStatus = getEventStatus();

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                >
                    <Card className="border-border shadow-2xl">
                        <CardHeader className="text-center border-b border-border">
                            <CardTitle className="text-2xl font-bold">
                                {registrationStep === 'confirm' ? 'Konfirmasi Pendaftaran' : 'Pendaftaran Berhasil!'}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-6">
                            {registrationStep === 'confirm' ? (
                                <div className="space-y-6">
                                    {/* Event Info */}
                                    <div className="text-center">
                                        <h3 className="text-xl font-semibold text-foreground mb-2">
                                            {event.title}
                                        </h3>
                                        <Badge variant={eventStatus.color as any} className="text-sm">
                                            {eventStatus.text}
                                        </Badge>
                                    </div>

                                    {/* Event Details */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                            <Calendar className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Tanggal</p>
                                                <p className="font-medium">{formatDate(event.date)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                            <Clock className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Waktu</p>
                                                <p className="font-medium">{event.time} WIB</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                            <MapPin className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Lokasi</p>
                                                <p className="font-medium">{event.location}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                            <Users className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Peserta</p>
                                                <p className="font-medium">{event.currentParticipants}/{event.maxParticipants}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                                        <p className="text-sm text-muted-foreground mb-1">Biaya Pendaftaran</p>
                                        <p className="text-2xl font-bold text-primary">{formatPrice(event.price)}</p>
                                    </div>

                                    {/* Warnings */}
                                    {!isEventOpen() && (
                                        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                                            <XCircle className="w-5 h-5 text-destructive" />
                                            <div>
                                                <p className="font-medium text-destructive">Event Sudah Dimulai</p>
                                                <p className="text-sm text-destructive/80">
                                                    Pendaftaran ditutup karena event sudah berlangsung
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {isEventFull && (
                                        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                                            <XCircle className="w-5 h-5 text-destructive" />
                                            <div>
                                                <p className="font-medium text-destructive">Event Sudah Penuh</p>
                                                <p className="text-sm text-destructive/80">
                                                    Maaf, kuota peserta sudah terpenuhi
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <Button
                                            variant="outline"
                                            onClick={onClose}
                                            className="flex-1"
                                            disabled={isLoading}
                                        >
                                            Batal
                                        </Button>
                                        <Button
                                            onClick={handleRegistration}
                                            disabled={!isEventOpen() || isEventFull || isLoading}
                                            className="flex-1 bg-primary hover:bg-primary/90"
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Mendaftar...
                                                </div>
                                            ) : (
                                                'Daftar Sekarang'
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center space-y-6">
                                    {/* Success Icon */}
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                        <CheckCircle className="w-12 h-12 text-green-600" />
                                    </div>

                                    {/* Success Message */}
                                    <div>
                                        <h3 className="text-xl font-semibold text-foreground mb-2">
                                            Pendaftaran Berhasil!
                                        </h3>
                                        <p className="text-muted-foreground">
                                            Anda telah berhasil mendaftar untuk event ini. 
                                            Silakan simpan token kehadiran Anda.
                                        </p>
                                    </div>

                                    {/* Token Display */}
                                    <div className="p-4 bg-muted/30 rounded-lg border-2 border-dashed border-primary/30">
                                        <p className="text-sm text-muted-foreground mb-2">Token Kehadiran</p>
                                        <div className="flex items-center gap-3 justify-center">
                                            <code className="text-2xl font-mono font-bold text-primary tracking-wider">
                                                {generatedToken}
                                            </code>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={copyToken}
                                                className="shrink-0"
                                            >
                                                Salin
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Important Notes */}
                                    <div className="text-left p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4" />
                                            Penting!
                                        </h4>
                                        <ul className="text-sm text-blue-800 space-y-1">
                                            <li>• Token kehadiran telah dikirim ke email Anda</li>
                                            <li>• Simpan token ini untuk mengisi daftar hadir</li>
                                            <li>• Daftar hadir akan dibuka setelah event dimulai</li>
                                            <li>• Token bersifat unik dan tidak dapat dibagikan</li>
                                        </ul>
                                    </div>

                                    {/* Close Button */}
                                    <Button
                                        onClick={onClose}
                                        className="w-full bg-primary hover:bg-primary/90"
                                    >
                                        Tutup
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
