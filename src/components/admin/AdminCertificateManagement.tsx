'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Award,
    Download,
    Search,
    Plus,
    CheckCircle,
    Clock,
    Eye,
    Users
} from 'lucide-react';

interface Event {
    id: string;
    title: string;
    date: string;
    location: string;
    status: 'active' | 'completed' | 'upcoming';
}

interface Participant {
    id: string;
    name: string;
    email: string;
    attendance: 'present' | 'absent' | 'pending';
    certificateGenerated: boolean;
    certificateNumber?: string;
    certificateUrl?: string;
}

// bikin type khusus buat filter
type FilterStatus = 'all' | 'generated' | 'pending';

export function AdminCertificateManagement() {
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<string>('');
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

    // Mock data - replace with actual API calls
    useEffect(() => {
        setEvents([
            {
                id: '1',
                title: 'Workshop Digital Marketing 2024',
                date: '2024-01-15',
                location: 'Jakarta Convention Center',
                status: 'completed'
            },
            {
                id: '2',
                title: 'Seminar Teknologi AI',
                date: '2024-02-20',
                location: 'Bandung Tech Hub',
                status: 'completed'
            },
            {
                id: '3',
                title: 'Pelatihan React Development',
                date: '2024-03-10',
                location: 'Online',
                status: 'upcoming'
            }
        ]);

        if (selectedEvent) {
            setParticipants([
                {
                    id: '1',
                    name: 'John Doe',
                    email: 'john@example.com',
                    attendance: 'present',
                    certificateGenerated: true,
                    certificateNumber: 'CERT-2024-A1B2C3D4',
                    certificateUrl: '/certificates/cert-1.pdf'
                },
                {
                    id: '2',
                    name: 'Jane Smith',
                    email: 'jane@example.com',
                    attendance: 'present',
                    certificateGenerated: false
                },
                {
                    id: '3',
                    name: 'Bob Johnson',
                    email: 'bob@example.com',
                    attendance: 'absent',
                    certificateGenerated: false
                }
            ]);
        }
    }, [selectedEvent]);

    const handleGenerateCertificate = async (participantId: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/certificates/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('ramein_admin_token')}`
                },
                body: JSON.stringify({
                    participantId,
                    eventId: selectedEvent
                })
            });

            if (response.ok) {
                const updatedParticipants = participants.map(p =>
                    p.id === participantId
                        ? { ...p, certificateGenerated: true, certificateNumber: 'CERT-2024-NEW' }
                        : p
                );
                setParticipants(updatedParticipants);
            }
        } catch (error) {
            console.error('Error generating certificate:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBulkGenerate = async () => {
        const eligibleParticipants = participants.filter(p =>
            p.attendance === 'present' && !p.certificateGenerated
        );

        setIsLoading(true);
        try {
            for (const participant of eligibleParticipants) {
                await handleGenerateCertificate(participant.id);
            }
        } catch (error) {
            console.error('Error bulk generating certificates:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredParticipants = participants.filter(participant => {
        const matchesSearch =
            participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            participant.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
            filterStatus === 'all' ||
            (filterStatus === 'generated' && participant.certificateGenerated) ||
            (filterStatus === 'pending' && !participant.certificateGenerated && participant.attendance === 'present');

        return matchesSearch && matchesFilter;
    });

    const eligibleCount = participants.filter(p =>
        p.attendance === 'present' && !p.certificateGenerated
    ).length;

    return (
        <div className="space-y-6">
            {/* Event Selection */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Pilih Event untuk Generate Sertifikat
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {events.map((event) => (
                            <Card
                                key={event.id}
                                className={`cursor-pointer transition-all hover:shadow-md ${
                                    selectedEvent === event.id ? 'ring-2 ring-primary' : ''
                                }`}
                                onClick={() => setSelectedEvent(event.id)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-semibold text-sm">{event.title}</h3>
                                        <Badge variant={event.status === 'completed' ? 'default' : 'secondary'}>
                                            {event.status}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-1">{event.date}</p>
                                    <p className="text-xs text-muted-foreground">{event.location}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {selectedEvent && (
                <>
                    {/* Bulk Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Generate Sertifikat</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        {eligibleCount} peserta yang hadir belum memiliki sertifikat
                                    </p>
                                </div>
                                <Button
                                    onClick={handleBulkGenerate}
                                    disabled={eligibleCount === 0 || isLoading}
                                    className="flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Generate Semua ({eligibleCount})
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Search and Filter */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Daftar Peserta</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4 mb-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Cari peserta..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border rounded-md"
                                    />
                                </div>
                                <select
                                    value={filterStatus}
                                    onChange={(e) =>
                                        setFilterStatus(e.target.value as FilterStatus)
                                    }
                                    className="px-4 py-2 border rounded-md"
                                >
                                    <option value="all">Semua Status</option>
                                    <option value="generated">Sudah Generate</option>
                                    <option value="pending">Belum Generate</option>
                                </select>
                            </div>

                            {/* Participants List */}
                            <div className="space-y-2">
                                {filteredParticipants.map((participant) => (
                                    <div
                                        key={participant.id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <h4 className="font-medium">{participant.name}</h4>
                                                    <p className="text-sm text-muted-foreground">{participant.email}</p>
                                                </div>
                                                <Badge
                                                    variant={
                                                        participant.attendance === 'present'
                                                            ? 'default'
                                                            : participant.attendance === 'absent'
                                                            ? 'destructive'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {participant.attendance === 'present'
                                                        ? 'Hadir'
                                                        : participant.attendance === 'absent'
                                                        ? 'Tidak Hadir'
                                                        : 'Pending'}
                                                </Badge>
                                            </div>
                                            {participant.certificateNumber && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    No. Sertifikat: {participant.certificateNumber}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {participant.certificateGenerated ? (
                                                <>
                                                    <Button size="sm" variant="outline">
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        Lihat
                                                    </Button>
                                                    <Button size="sm">
                                                        <Download className="w-4 h-4 mr-2" />
                                                        Download
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleGenerateCertificate(participant.id)}
                                                    disabled={participant.attendance !== 'present' || isLoading}
                                                >
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Generate
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {filteredParticipants.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>Tidak ada peserta ditemukan</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Certificate Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Peserta</p>
                                        <p className="text-2xl font-bold">{participants.length}</p>
                                    </div>
                                    <Users className="w-8 h-8 text-muted-foreground" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Hadir</p>
                                        <p className="text-2xl font-bold text-green-600">
                                            {participants.filter(p => p.attendance === 'present').length}
                                        </p>
                                    </div>
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Sertifikat</p>
                                        <p className="text-2xl font-bold text-blue-600">
                                            {participants.filter(p => p.certificateGenerated).length}
                                        </p>
                                    </div>
                                    <Award className="w-8 h-8 text-blue-600" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Pending</p>
                                        <p className="text-2xl font-bold text-orange-600">
                                            {participants.filter(p => p.attendance === 'present' && !p.certificateGenerated).length}
                                        </p>
                                    </div>
                                    <Clock className="w-8 h-8 text-orange-600" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}

            {!selectedEvent && (
                <Card>
                    <CardContent className="p-8 text-center">
                        <Award className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">Pilih Event</h3>
                        <p className="text-muted-foreground">
                            Silakan pilih event terlebih dahulu untuk melihat daftar peserta dan generate sertifikat
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
