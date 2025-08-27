import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Calendar, Clock, MapPin, Download, Search, Filter,
    Award, CheckCircle, XCircle, AlertCircle, User,
    Mail, Phone, MapPin as MapPinIcon, GraduationCap
} from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';

interface UserDashboardProps {
    user: {
        id: string;
        name: string;
        email: string;
        avatar?: string;
    };
}

interface EventHistory {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    status: 'completed' | 'upcoming' | 'cancelled';
    attended: boolean;
    certificate?: {
        id: string;
        downloadUrl: string;
    };
    token?: string;
    registrationDate: string;
    image: string;
}

interface Certificate {
    id: string;
    eventTitle: string;
    eventDate: string;
    issuedDate: string;
    downloadUrl: string;
    verificationCode: string;
}

export function UserDashboard({ user }: UserDashboardProps) {
    const [searchHistory, setSearchHistory] = useState('');
    const [searchCertificate, setSearchCertificate] = useState('');

    // Mock data - in real app, this would come from API
    const eventHistory: EventHistory[] = [
        {
            id: '1',
            title: 'Workshop React Advanced',
            date: '2024-12-15',
            time: '09:00',
            location: 'Jakarta Convention Center',
            status: 'completed',
            attended: true,
            certificate: {
                id: 'cert-001',
                downloadUrl: '/certificates/cert-001.pdf'
            },
            token: '1234567890',
            registrationDate: '2024-12-01',
            image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=500'
        },
        {
            id: '2',
            title: 'Digital Marketing Summit 2024',
            date: '2025-01-20',
            time: '08:00',
            location: 'Balai Kartini, Jakarta',
            status: 'upcoming',
            attended: false,
            token: '9876543210',
            registrationDate: '2024-12-10',
            image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500'
        },
        {
            id: '3',
            title: 'UI/UX Design Masterclass',
            date: '2024-11-25',
            time: '13:00',
            location: 'Design Studio, Bandung',
            status: 'completed',
            attended: false,
            registrationDate: '2024-11-10',
            image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=500'
        }
    ];

    const certificates: Certificate[] = [
        {
            id: 'cert-001',
            eventTitle: 'Workshop React Advanced',
            eventDate: '2024-12-15',
            issuedDate: '2024-12-16',
            downloadUrl: '/certificates/cert-001.pdf',
            verificationCode: 'REACT-ADV-001'
        }
    ];

    const filteredHistory = eventHistory.filter(event =>
        event.title.toLowerCase().includes(searchHistory.toLowerCase())
    );

    const filteredCertificates = certificates.filter(cert =>
        cert.eventTitle.toLowerCase().includes(searchCertificate.toLowerCase())
    );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusBadge = (status: string, attended: boolean) => {
        switch (status) {
            case 'completed':
                if (attended) {
                    return <Badge className="bg-green-500 text-white"><CheckCircle className="w-3 h-3 mr-1" />Hadir</Badge>;
                } else {
                    return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Tidak Hadir</Badge>;
                }
            case 'upcoming':
                return <Badge className="bg-blue-500 text-white"><Clock className="w-3 h-3 mr-1" />Akan Datang</Badge>;
            case 'cancelled':
                return <Badge variant="outline"><XCircle className="w-3 h-3 mr-1" />Dibatalkan</Badge>;
            default:
                return <Badge variant="secondary">Unknown</Badge>;
        }
    };

    const handleDownloadCertificate = (downloadUrl: string, eventTitle: string) => {
        // In real app, this would trigger actual download
        console.log(`Downloading certificate for ${eventTitle}`);
        alert(`Download sertifikat untuk event "${eventTitle}"`);
    };

    const stats = {
        totalEvents: eventHistory.length,
        completedEvents: eventHistory.filter(e => e.status === 'completed').length,
        upcomingEvents: eventHistory.filter(e => e.status === 'upcoming').length,
        certificates: certificates.length
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl text-white p-8 mb-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <Avatar className="w-24 h-24 border-4 border-white">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-white text-purple-600 text-2xl">
                            {user.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-3xl mb-2">Selamat datang, {user.name}!</h1>
                        <p className="text-white/90 mb-4">Kelola event dan sertifikat Anda dengan mudah</p>

                        {/* Mock user details */}
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <span>{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                <span>+62 812 3456 7890</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPinIcon className="w-4 h-4" />
                                <span>Jakarta, Indonesia</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <GraduationCap className="w-4 h-4" />
                                <span>S1 Teknik Informatika</span>
                            </div>
                        </div>
                    </div>

                    <Button variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                        <User className="w-4 h-4 mr-2" />
                        Edit Profil
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card className="text-center">
                    <CardContent className="p-6">
                        <div className="text-2xl text-purple-600 mb-2">{stats.totalEvents}</div>
                        <div className="text-sm text-gray-600">Total Event</div>
                    </CardContent>
                </Card>

                <Card className="text-center">
                    <CardContent className="p-6">
                        <div className="text-2xl text-green-600 mb-2">{stats.completedEvents}</div>
                        <div className="text-sm text-gray-600">Event Selesai</div>
                    </CardContent>
                </Card>

                <Card className="text-center">
                    <CardContent className="p-6">
                        <div className="text-2xl text-blue-600 mb-2">{stats.upcomingEvents}</div>
                        <div className="text-sm text-gray-600">Event Mendatang</div>
                    </CardContent>
                </Card>

                <Card className="text-center">
                    <CardContent className="p-6">
                        <div className="text-2xl text-orange-600 mb-2">{stats.certificates}</div>
                        <div className="text-sm text-gray-600">Sertifikat</div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="history" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="history">Riwayat Event</TabsTrigger>
                    <TabsTrigger value="certificates">Sertifikat</TabsTrigger>
                </TabsList>

                <TabsContent value="history" className="space-y-6">
                    {/* Search */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    placeholder="Cari riwayat event..."
                                    value={searchHistory}
                                    onChange={(e) => setSearchHistory(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Event History */}
                    <div className="space-y-4">
                        {filteredHistory.map((event) => (
                            <Card key={event.id} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <ImageWithFallback
                                            src={event.image}
                                            alt={event.title}
                                            className="w-full md:w-32 h-32 object-cover rounded-lg"
                                        />

                                        <div className="flex-1">
                                            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                                                <div>
                                                    <h3 className="text-xl mb-2">{event.title}</h3>
                                                    {getStatusBadge(event.status, event.attended)}
                                                </div>

                                                {event.certificate && (
                                                    <Button
                                                        onClick={() => handleDownloadCertificate(event.certificate!.downloadUrl, event.title)}
                                                        className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white mt-2 md:mt-0"
                                                    >
                                                        <Download className="w-4 h-4 mr-2" />
                                                        Download Sertifikat
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-purple-500" />
                                                    <span>{formatDate(event.date)} • {event.time} WIB</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-green-500" />
                                                    <span>{event.location}</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <AlertCircle className="w-4 h-4 text-blue-500" />
                                                    <span>Token: {event.token}</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-orange-500" />
                                                    <span>Daftar: {formatDate(event.registrationDate)}</span>
                                                </div>
                                            </div>

                                            {event.status === 'upcoming' && (
                                                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                                    <div className="flex items-center gap-2 text-blue-700">
                                                        <AlertCircle className="w-5 h-5" />
                                                        <span>Tombol absensi akan aktif pada hari H setelah jam event dimulai</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {filteredHistory.length === 0 && (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl text-gray-600 mb-2">Belum ada riwayat event</h3>
                                    <p className="text-gray-500">Mulai daftar event untuk melihat riwayat Anda</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="certificates" className="space-y-6">
                    {/* Search */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    placeholder="Cari sertifikat..."
                                    value={searchCertificate}
                                    onChange={(e) => setSearchCertificate(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Certificates */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {filteredCertificates.map((certificate) => (
                            <Card key={certificate.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                                            <Award className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{certificate.eventTitle}</CardTitle>
                                            <p className="text-sm text-gray-600">Kode: {certificate.verificationCode}</p>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent>
                                    <div className="space-y-3 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Tanggal Event:</span>
                                            <span>{formatDate(certificate.eventDate)}</span>
                                        </div>

                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Tanggal Terbit:</span>
                                            <span>{formatDate(certificate.issuedDate)}</span>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => handleDownloadCertificate(certificate.downloadUrl, certificate.eventTitle)}
                                        className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download Sertifikat
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}

                        {filteredCertificates.length === 0 && (
                            <div className="md:col-span-2">
                                <Card>
                                    <CardContent className="p-12 text-center">
                                        <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-xl text-gray-600 mb-2">Belum ada sertifikat</h3>
                                        <p className="text-gray-500">Hadiri event untuk mendapatkan sertifikat</p>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}