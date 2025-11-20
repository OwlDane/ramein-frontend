'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Award,
    Download,
    Search,
    CheckCircle,
    Clock,
    Eye,
    Users,
    AlertCircle,
    FileCheck,
    Loader2
} from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';
import { motion } from 'framer-motion';

interface Event {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    category: string;
}

interface Participant {
    id: string;
    userId: string;
    eventId: string;
    hasAttended: boolean;
    attendedAt: string | null;
    user: {
        id: string;
        name: string;
        email: string;
    };
    certificate?: {
        id: string;
        certificateNumber: string;
        certificateUrl: string;
        issuedAt: string;
    };
}

type FilterStatus = 'all' | 'generated' | 'pending';

export function AdminCertificateManagement() {
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<string>('');
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Fetch completed events
    useEffect(() => {
        fetchCompletedEvents();
    }, []);

    // Fetch participants when event is selected
    useEffect(() => {
        if (selectedEvent) {
            fetchEventParticipants(selectedEvent);
        }
    }, [selectedEvent]);

    const fetchCompletedEvents = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('ramein_admin_token');
            const response = await fetch(`${API_BASE_URL}/admin/events?status=completed`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                // Filter only past events
                const completedEvents = data.events.filter((event: Event) => {
                    const eventDate = new Date(event.date);
                    return eventDate < new Date();
                });
                setEvents(completedEvents);
            } else {
                setError('Gagal memuat daftar kegiatan');
            }
        } catch (err) {
            console.error('Error fetching events:', err);
            setError('Terjadi kesalahan saat memuat data');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchEventParticipants = async (eventId: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('ramein_admin_token');
            const response = await fetch(`${API_BASE_URL}/admin/events/${eventId}/participants`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                // Only show participants who attended
                const attendedParticipants = data.participants.filter(
                    (p: Participant) => p.hasAttended
                );
                setParticipants(attendedParticipants);
            } else {
                setError('Gagal memuat daftar peserta');
            }
        } catch (err) {
            console.error('Error fetching participants:', err);
            setError('Terjadi kesalahan saat memuat data peserta');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateCertificate = async (participantId: string) => {
        setIsGenerating(participantId);
        setError(null);
        setSuccess(null);
        
        try {
            const token = localStorage.getItem('ramein_admin_token');
            const response = await fetch(`${API_BASE_URL}/certificates/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    participantId,
                    eventId: selectedEvent
                })
            });

            if (response.ok) {
                const data = await response.json();
                setSuccess(`Sertifikat berhasil dibuat: ${data.certificateNumber}`);
                // Refresh participants to show updated certificate
                await fetchEventParticipants(selectedEvent);
            } else {
                const errorData = await response.json();
                console.error('[Certificate] Generation failed:', {
                    status: response.status,
                    error: errorData,
                    hasToken: !!token,
                    tokenPrefix: token?.substring(0, 20)
                });
                setError(errorData.message || errorData.error || `Gagal membuat sertifikat (${response.status})`);
            }
        } catch (err) {
            console.error('Error generating certificate:', err);
            setError('Terjadi kesalahan saat membuat sertifikat');
        } finally {
            setIsGenerating(null);
        }
    };

    const handleBulkGenerate = async () => {
        const eligibleParticipants = participants.filter(p => 
            p.hasAttended && !p.certificate
        );

        if (eligibleParticipants.length === 0) {
            setError('Tidak ada peserta yang memenuhi syarat untuk generate sertifikat');
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const token = localStorage.getItem('ramein_admin_token');
            const response = await fetch(`${API_BASE_URL}/certificates/generate-bulk`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    eventId: selectedEvent,
                    participantIds: eligibleParticipants.map(p => p.id)
                })
            });

            if (response.ok) {
                const data = await response.json();
                setSuccess(`Berhasil membuat ${data.generated} sertifikat`);
                // Refresh participants
                await fetchEventParticipants(selectedEvent);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Gagal membuat sertifikat massal');
            }
        } catch (err) {
            console.error('Error bulk generating certificates:', err);
            setError('Terjadi kesalahan saat membuat sertifikat massal');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadCertificate = (certificateUrl: string, participantName: string) => {
        const link = document.createElement('a');
        link.href = certificateUrl;
        link.download = `Sertifikat_${participantName.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredParticipants = participants.filter(participant => {
        const matchesSearch = 
            participant.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            participant.user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = 
            filterStatus === 'all' ||
            (filterStatus === 'generated' && participant.certificate) ||
            (filterStatus === 'pending' && !participant.certificate);

        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: participants.length,
        generated: participants.filter(p => p.certificate).length,
        pending: participants.filter(p => !p.certificate).length
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h3 className="text-lg font-semibold">Generate Sertifikat</h3>
                <p className="text-sm text-muted-foreground">
                    Pilih kegiatan dan generate sertifikat untuk peserta yang hadir
                </p>
            </div>

            {/* Alerts */}
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
            )}

            {/* Event Selection */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Pilih Event untuk Generate Sertifikat
                    </CardTitle>
                    <CardDescription>
                        Hanya menampilkan kegiatan yang sudah selesai
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading && !selectedEvent ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            <span className="ml-2">Memuat kegiatan...</span>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>Belum ada kegiatan yang selesai</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {events.map((event) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ scale: 1.02 }}
                                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                        selectedEvent === event.id
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:border-primary/50'
                                    }`}
                                    onClick={() => setSelectedEvent(event.id)}
                                >
                                    <h4 className="font-semibold mb-2 line-clamp-2">{event.title}</h4>
                                    <div className="space-y-1 text-sm text-muted-foreground">
                                        <p className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            {new Date(event.date).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>
                                        <p className="line-clamp-1">{event.location}</p>
                                        <Badge variant="secondary" className="mt-2">
                                            {event.category}
                                        </Badge>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Participants List */}
            {selectedEvent && (
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    Daftar Peserta
                                </CardTitle>
                                <CardDescription>
                                    Peserta yang hadir dan memenuhi syarat sertifikat
                                </CardDescription>
                            </div>
                            <Button
                                onClick={handleBulkGenerate}
                                disabled={isLoading || stats.pending === 0}
                                className="whitespace-nowrap"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <FileCheck className="w-4 h-4 mr-2" />
                                        Generate Semua ({stats.pending})
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">Total Peserta</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg">
                                <p className="text-sm text-green-700">Sudah Generate</p>
                                <p className="text-2xl font-bold text-green-700">{stats.generated}</p>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-lg">
                                <p className="text-sm text-orange-700">Belum Generate</p>
                                <p className="text-2xl font-bold text-orange-700">{stats.pending}</p>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari peserta..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant={filterStatus === 'all' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setFilterStatus('all')}
                                >
                                    Semua
                                </Button>
                                <Button
                                    variant={filterStatus === 'generated' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setFilterStatus('generated')}
                                >
                                    Sudah Generate
                                </Button>
                                <Button
                                    variant={filterStatus === 'pending' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setFilterStatus('pending')}
                                >
                                    Belum Generate
                                </Button>
                            </div>
                        </div>

                        {/* Participants Table */}
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                <span className="ml-2">Memuat peserta...</span>
                            </div>
                        ) : filteredParticipants.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>Tidak ada peserta yang ditemukan</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredParticipants.map((participant) => (
                                    <motion.div
                                        key={participant.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <h4 className="font-semibold">{participant.user.name}</h4>
                                            <p className="text-sm text-muted-foreground">{participant.user.email}</p>
                                            {participant.certificate && (
                                                <p className="text-xs text-green-600 mt-1">
                                                    No. Sertifikat: {participant.certificate.certificateNumber}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {participant.certificate ? (
                                                <>
                                                    <Badge variant="default" className="bg-green-500">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Generated
                                                    </Badge>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleDownloadCertificate(
                                                            participant.certificate!.certificateUrl,
                                                            participant.user.name
                                                        )}
                                                    >
                                                        <Download className="w-4 h-4 mr-1" />
                                                        Download
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => window.open(participant.certificate!.certificateUrl, '_blank')}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Badge variant="secondary">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        Pending
                                                    </Badge>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleGenerateCertificate(participant.id)}
                                                        disabled={isGenerating === participant.id}
                                                    >
                                                        {isGenerating === participant.id ? (
                                                            <>
                                                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                                                Generating...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Award className="w-4 h-4 mr-1" />
                                                                Generate
                                                            </>
                                                        )}
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
