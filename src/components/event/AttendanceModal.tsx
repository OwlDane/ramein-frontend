import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, AlertCircle, Clipboard, Clock3 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiFetch } from '@/lib/api';

interface AttendanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: {
        id: string;
        title: string;
        date: string;
        time: string;
        location: string;
    };
    userToken: string;
    onAttendanceSuccess: () => void;
}

export function AttendanceModal({ 
    isOpen, 
    onClose, 
    event, 
    userToken, 
    onAttendanceSuccess 
}: AttendanceModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [attendanceStep, setAttendanceStep] = useState<'input' | 'success'>('input');
    const [tokenInput, setTokenInput] = useState('');
    const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);

    // Check if attendance is open (after event starts)
    useEffect(() => {
        const checkAttendanceStatus = () => {
            const now = new Date();
            const eventDateTime = new Date(event.date);
            eventDateTime.setHours(parseInt(event.time.split(':')[0]));
            eventDateTime.setMinutes(parseInt(event.time.split(':')[1]));
            setIsAttendanceOpen(now >= eventDateTime);
        };

        checkAttendanceStatus();
        // Check every minute
        const interval = setInterval(checkAttendanceStatus, 60000);
        return () => clearInterval(interval);
    }, [event.date, event.time]);

    const handleAttendance = async () => {
        if (!tokenInput.trim()) {
            toast.error('Masukkan token kehadiran');
            return;
        }

        if (!isAttendanceOpen) {
            toast.error('Daftar hadir belum dibuka');
            return;
        }

        setIsLoading(true);
        try {
            const response = await apiFetch<any>('/participants/attendance', {
                method: 'POST',
                body: {
                    eventId: event.id,
                    token: tokenInput.trim()
                },
                token: userToken
            });

            if (response.participant) {
                setAttendanceStep('success');
                onAttendanceSuccess();
                toast.success('Daftar hadir berhasil diisi!');
            } else {
                toast.error('Gagal mengisi daftar hadir');
            }
        } catch (error: any) {
            console.error('Attendance error:', error);
            toast.error(error?.message || 'Terjadi kesalahan saat mengisi daftar hadir');
        } finally {
            setIsLoading(false);
        }
    };

    const pasteFromClipboard = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setTokenInput(text);
            toast.success('Token berhasil disalin dari clipboard');
        } catch {
            toast.error('Gagal membaca dari clipboard');
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

    const getAttendanceStatus = () => {
        if (!isAttendanceOpen) {
            return { 
                status: 'closed', 
                color: 'destructive', 
                text: 'Daftar Hadir Belum Dibuka',
                description: 'Daftar hadir akan dibuka setelah event dimulai'
            };
        }
        return { 
            status: 'open', 
            color: 'default', 
            text: 'Daftar Hadir Dibuka',
            description: 'Silakan masukkan token kehadiran Anda'
        };
    };

    const attendanceStatus = getAttendanceStatus();

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
                                {attendanceStep === 'input' ? 'Daftar Hadir' : 'Kehadiran Berhasil!'}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-6">
                            {attendanceStep === 'input' ? (
                                <div className="space-y-6">
                                    {/* Event Info */}
                                    <div className="text-center">
                                        <h3 className="text-xl font-semibold text-foreground mb-2">
                                            {event.title}
                                        </h3>
                                        <Badge variant={attendanceStatus.color as any} className="text-sm">
                                            {attendanceStatus.text}
                                        </Badge>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            {attendanceStatus.description}
                                        </p>
                                    </div>

                                    {/* Event Details */}
                                    <div className="grid grid-cols-3 gap-4">
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
                                    </div>

                                    {/* Status Warning */}
                                    {!isAttendanceOpen && (
                                        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                            <Clock3 className="w-5 h-5 text-amber-600" />
                                            <div>
                                                <p className="font-medium text-amber-800">Event Belum Dimulai</p>
                                                <p className="text-sm text-amber-700">
                                                    Daftar hadir hanya dapat diisi setelah event dimulai pada {formatDate(event.date)} pukul {event.time} WIB
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Token Input */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-foreground">
                                            Token Kehadiran
                                        </label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="text"
                                                placeholder="Masukkan 10 digit token"
                                                value={tokenInput}
                                                onChange={(e) => setTokenInput(e.target.value)}
                                                maxLength={10}
                                                className="flex-1 font-mono text-lg tracking-wider"
                                                disabled={!isAttendanceOpen}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={pasteFromClipboard}
                                                disabled={!isAttendanceOpen}
                                                className="shrink-0"
                                            >
                                                <Clipboard className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Token kehadiran adalah 10 digit angka yang dikirim ke email Anda saat mendaftar
                                        </p>
                                    </div>

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
                                            onClick={handleAttendance}
                                            disabled={!isAttendanceOpen || !tokenInput.trim() || isLoading}
                                            className="flex-1 bg-primary hover:bg-primary/90"
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Memproses...
                                                </div>
                                            ) : (
                                                'Isi Daftar Hadir'
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
                                            Kehadiran Berhasil!
                                        </h3>
                                        <p className="text-muted-foreground">
                                            Anda telah berhasil mengisi daftar hadir untuk event ini.
                                        </p>
                                    </div>

                                    {/* Event Details */}
                                    <div className="p-4 bg-muted/30 rounded-lg">
                                        <h4 className="font-medium text-foreground mb-3">Detail Event</h4>
                                        <div className="text-left space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Event:</span>
                                                <span className="font-medium">{event.title}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Tanggal:</span>
                                                <span className="font-medium">{formatDate(event.date)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Waktu:</span>
                                                <span className="font-medium">{event.time} WIB</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Lokasi:</span>
                                                <span className="font-medium">{event.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Important Notes */}
                                    <div className="text-left p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4" />
                                            Selanjutnya
                                        </h4>
                                        <ul className="text-sm text-blue-800 space-y-1">
                                            <li>• Sertifikat akan tersedia dalam 24-48 jam</li>
                                            <li>• Anda akan mendapat notifikasi via email</li>
                                            <li>• Sertifikat dapat diunduh dari dashboard</li>
                                            <li>• Terima kasih telah berpartisipasi!</li>
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
