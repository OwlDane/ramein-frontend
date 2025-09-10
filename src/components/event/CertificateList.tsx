import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    Calendar, Download, Search, Filter, Award, 
    CheckCircle, ExternalLink, Copy,
    XCircle
} from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { apiFetch } from '@/lib/api';
import { toast } from 'react-hot-toast';

interface CertificateListProps {
    userToken: string;
}

interface Certificate {
    id: string;
    participantId: string;
    eventId: string;
    certificateNumber: string;
    certificateUrl: string;
    verificationCode: string;
    isVerified: boolean;
    issuedAt: Date;
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
}

export function CertificateList({ userToken }: CertificateListProps) {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    const fetchCertificates = useCallback(async () => {
        try {
            setLoading(true);
            // First get all participants, then filter those with certificates
            const participants = await apiFetch<Array<{ 
                id: string; 
                eventId: string; 
                certificate?: { 
                    id: string; 
                    certificateNumber?: string; 
                    certificateUrl?: string; 
                    verificationCode?: string; 
                    isVerified?: boolean; 
                    issuedAt?: string 
                }; 
                event: { 
                    id: string; 
                    title: string; 
                    description?: string;
                    date: string; 
                    time?: string;
                    location: string;
                    flyer?: string;
                    category?: string;
                }; 
                attendedAt?: string 
            }>>('/participants/my-events', {
                token: userToken
            });
            
            // Filter participants who have certificates
            const participantsWithCertificates = participants.filter(p => p.certificate);
            
            // Transform to certificate format with proper null checks
            const certs: Certificate[] = participantsWithCertificates.map(p => {
                // Since we filtered above, we know p.certificate exists, but TypeScript doesn't
                const cert = p.certificate!;
                
                return {
                    id: cert.id,
                    participantId: p.id,
                    eventId: p.eventId,
                    certificateNumber: cert.certificateNumber || cert.id,
                    certificateUrl: cert.certificateUrl || '', // Provide fallback
                    verificationCode: cert.verificationCode || `CERT-${p.eventId.slice(0, 8).toUpperCase()}`,
                    isVerified: cert.isVerified ?? true,
                    issuedAt: new Date(cert.issuedAt || p.attendedAt || new Date()),
                    event: {
                        id: p.event.id,
                        title: p.event.title,
                        description: p.event.description || '',
                        date: p.event.date,
                        time: p.event.time || '00:00',
                        location: p.event.location,
                        flyer: p.event.flyer,
                        category: p.event.category
                    }
                };
            });
            
            setCertificates(certs);
        } catch (err: unknown) {
            console.error('Failed to fetch certificates:', err);
            const errorMessage = err instanceof Error ? err.message : 'Gagal memuat daftar sertifikat';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [userToken]);

    useEffect(() => {
        fetchCertificates();
    }, [fetchCertificates]);

    const filteredCertificates = certificates.filter(certificate => {
        const matchesSearch = certificate.event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            certificate.event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            certificate.event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            certificate.verificationCode.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter = activeFilter === 'all' ||
            (activeFilter === 'verified' && certificate.isVerified) ||
            (activeFilter === 'recent' && isRecentCertificate(certificate.issuedAt));

        return matchesSearch && matchesFilter;
    });

    const isRecentCertificate = (issuedAt: Date) => {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        return new Date(issuedAt) > thirtyDaysAgo;
    };

    const formatDate = (dateString: string | Date) => {
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
            toast.success(`Download sertifikat untuk event "${eventTitle}"`);
            console.log('Downloading certificate from:', certificateUrl);
        } catch {
            toast.error('Gagal mengunduh sertifikat');
        }
    };

    const copyVerificationCode = async (code: string) => {
        try {
            await navigator.clipboard.writeText(code);
            toast.success('Kode verifikasi berhasil disalin!');
        } catch {
            toast.error('Gagal menyalin kode verifikasi');
        }
    };

    const getStats = () => {
        const total = certificates.length;
        const verified = certificates.filter(c => c.isVerified).length;
        const recent = certificates.filter(c => isRecentCertificate(c.issuedAt)).length;
        const categories = [...new Set(certificates.map(c => c.event.category).filter(Boolean))];

        return { total, verified, recent, categories: categories.length };
    };

    const stats = getStats();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Memuat daftar sertifikat...</p>
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
                    <h3 className="text-xl font-semibold mb-2">Lagi error nih pas ambil sertifikat</h3>
                    <p className="text-muted-foreground mb-6">Coba refresh datanya ya. Kalo masih gagal, balik dulu ke beranda.</p>
                    <div className="flex items-center justify-center gap-3">
                        <Button onClick={fetchCertificates}>Coba Lagi</Button>
                        <Button variant="outline" onClick={() => window.location.assign('/')}>Ke Beranda</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Sertifikat', value: stats.total, color: 'bg-blue-500', icon: Award },
                    { label: 'Terverifikasi', value: stats.verified, color: 'bg-green-500', icon: CheckCircle },
                    { label: 'Terbaru (30 hari)', value: stats.recent, color: 'bg-yellow-500', icon: Calendar },
                    { label: 'Kategori', value: stats.categories, color: 'bg-purple-500', icon: Filter }
                ].map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="text-center border-border">
                                <CardContent className="p-4">
                                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
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
                        placeholder="Cari sertifikat berdasarkan nama event, deskripsi, lokasi, atau kode verifikasi..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Filter:</span>
                    <select
                        value={activeFilter}
                        onChange={(e) => setActiveFilter(e.target.value)}
                        className="text-sm border border-border rounded-md px-2 py-1 bg-background"
                    >
                        <option value="all">Semua</option>
                        <option value="verified">Terverifikasi</option>
                        <option value="recent">Terbaru</option>
                    </select>
                </div>
            </div>

            {/* Certificates List */}
            {filteredCertificates.length === 0 ? (
                <div className="py-16">
                    <div className="max-w-xl mx-auto text-center">
                        <div className="w-16 h-16 rounded-full bg-muted/30 text-primary flex items-center justify-center mx-auto mb-4">
                            <Award className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Belum ada sertifikat</h3>
                        <p className="text-muted-foreground">Ikut event dulu ya, nanti sertifikatmu bakal nongol di sini.</p>
                        <div className="flex items-center justify-center gap-3 mt-6">
                            { (searchQuery || activeFilter !== 'all') ? (
                                <Button onClick={() => { setSearchQuery(''); setActiveFilter('all'); }} variant="outline">Reset Filter</Button>
                            ) : (
                                <Button variant="outline" onClick={() => window.location.assign('/')}>Lihat Event</Button>
                            ) }
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredCertificates.map((certificate, index) => (
                        <motion.div
                            key={certificate.id}
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
                                                src={certificate.event.flyer || `https://picsum.photos/seed/${certificate.event.id}/400/300`}
                                                alt={certificate.event.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Certificate Details */}
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-xl font-bold text-foreground mb-2">
                                                        {certificate.event.title}
                                                    </h3>
                                                    <p className="text-muted-foreground line-clamp-2">
                                                        {certificate.event.description}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={certificate.isVerified ? "default" : "secondary"}>
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        {certificate.isVerified ? 'Terverifikasi' : 'Pending'}
                                                    </Badge>
                                                    {certificate.event.category && (
                                                        <Badge variant="outline" className="text-xs">
                                                            {certificate.event.category}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Event Info */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-primary" />
                                                    <span className="text-sm">{formatDate(certificate.event.date)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-primary" />
                                                    <span className="text-sm">{formatTime(certificate.event.time)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-primary" />
                                                    <span className="text-sm">{formatDate(certificate.issuedAt)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Award className="w-4 h-4 text-primary" />
                                                    <span className="text-sm">#{certificate.certificateNumber}</span>
                                                </div>
                                            </div>

                                            {/* Verification Code */}
                                            <div className="p-3 bg-muted/30 rounded-lg">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm text-muted-foreground mb-1">Kode Verifikasi</p>
                                                        <code className="text-lg font-mono font-bold text-primary tracking-wider">
                                                            {certificate.verificationCode}
                                                        </code>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => copyVerificationCode(certificate.verificationCode)}
                                                        className="shrink-0"
                                                    >
                                                        <Copy className="w-4 h-4 mr-2" />
                                                        Salin
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-3">
                                                <Button
                                                    onClick={() => handleDownloadCertificate(
                                                        certificate.certificateUrl,
                                                        certificate.event.title
                                                    )}
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Download Sertifikat
                                                </Button>
                                                
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => window.open(certificate.certificateUrl, '_blank')}
                                                >
                                                    <ExternalLink className="w-4 h-4 mr-2" />
                                                    Lihat Online
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}