'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '@/lib/api';
import { motion } from 'framer-motion';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Plus,
    Search,
    Calendar,
    MapPin,
    Clock,
    Users,
    Download,
    Edit,
    Trash2,
    AlertCircle,
    CheckCircle
} from 'lucide-react';

interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    flyer?: string;
    flyerUrl?: string;
    certificate?: string;
    certificateUrl?: string;
    category: {
        id: string;
        name: string;
    };
    participantCount: number;
    attendanceCount: number;
    createdAt: string;
    // New fields
    price?: number;
    maxParticipants?: number;
    registrationDeadline?: string;
    eventType?: string;
    contactPersonName?: string;
    contactPersonPhone?: string;
    contactPersonEmail?: string;
    meetingLink?: string;
    requirements?: string;
    benefits?: string;
    isFeatured?: boolean;
    tags?: string[];
}

interface Category {
    id: string;
    nama_kategori: string;
    kategori_logo?: string;
}

export function AdminEventManagement() {
    const [events, setEvents] = useState<Event[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Initial form state
    const initialFormState = {
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        flyerUrl: '',
        certificateUrl: '',
        flyerFile: null as File | null,
        certificateFile: null as File | null,
        categoryId: '',
        // New fields
        price: '0',
        maxParticipants: '',
        registrationDeadline: '',
        eventType: 'offline',
        contactPersonName: '',
        contactPersonPhone: '',
        contactPersonEmail: '',
        meetingLink: '',
        requirements: '',
        benefits: '',
        isFeatured: false,
        tags: ''
    };

    // Form state
    const [formData, setFormData] = useState(initialFormState);
    const [flyerPreview, setFlyerPreview] = useState<string>('');
    const [certificatePreview, setCertificatePreview] = useState<string>('');

    const fetchEvents = useCallback(async () => {
        try {
            setIsLoading(true);
            const adminToken = localStorage.getItem('ramein_admin_token');
            
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: '10',
                ...(searchTerm && { search: searchTerm }),
                ...(selectedCategory && { categoryId: selectedCategory })
            });

            const response = await fetch(`${API_BASE_URL}/admin/events?${params}`, {
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setEvents(data.events);
                setTotalPages(data.pagination.totalPages);
            } else {
                setError('Gagal memuat data kegiatan');
            }
        } catch (error) {
            console.error('Failed to fetch events:', error);
            setError('Terjadi kesalahan saat memuat data');
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, searchTerm, selectedCategory]);

    useEffect(() => {
        fetchCategories(); // Fetch categories first
        fetchEvents();
    }, [fetchEvents]);

    // Open create dialog if URL has ?action=create
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const action = params.get('action');
        if (action === 'create') {
            setIsCreateDialogOpen(true);
        }
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/categories`);
            
            if (response.ok) {
                const data = await response.json();
                console.log('📦 Categories loaded:', data);
                setCategories(data);
            } else {
                console.error('Failed to fetch categories:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const handleFlyerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({...formData, flyerFile: file});
            const reader = new FileReader();
            reader.onloadend = () => {
                setFlyerPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCertificateFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({...formData, certificateFile: file});
            const reader = new FileReader();
            reader.onloadend = () => {
                setCertificatePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const adminToken = localStorage.getItem('ramein_admin_token');
            
            // Prepare form data with files if present
            const formDataToSend = new FormData();
            
            // Add text fields
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('date', formData.date);
            formDataToSend.append('time', formData.time);
            formDataToSend.append('location', formData.location);
            formDataToSend.append('categoryId', formData.categoryId);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('maxParticipants', formData.maxParticipants);
            formDataToSend.append('registrationDeadline', formData.registrationDeadline);
            formDataToSend.append('eventType', formData.eventType);
            formDataToSend.append('contactPersonName', formData.contactPersonName);
            formDataToSend.append('contactPersonPhone', formData.contactPersonPhone);
            formDataToSend.append('contactPersonEmail', formData.contactPersonEmail);
            formDataToSend.append('meetingLink', formData.meetingLink);
            formDataToSend.append('requirements', formData.requirements);
            formDataToSend.append('benefits', formData.benefits);
            formDataToSend.append('isFeatured', formData.isFeatured.toString());
            formDataToSend.append('tags', formData.tags);
            
            // Add files if present, otherwise add URLs
            if (formData.flyerFile) {
                formDataToSend.append('flyerFile', formData.flyerFile);
            } else if (formData.flyerUrl) {
                formDataToSend.append('flyerUrl', formData.flyerUrl);
            }
            
            if (formData.certificateFile) {
                formDataToSend.append('certificateFile', formData.certificateFile);
            } else if (formData.certificateUrl) {
                formDataToSend.append('certificateUrl', formData.certificateUrl);
            }
            
            const response = await fetch(`${API_BASE_URL}/admin/events`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                },
                body: formDataToSend
            });

            if (response.ok) {
                setIsCreateDialogOpen(false);
                resetForm();
                fetchEvents();
            } else {
                const data = await response.json();
                setError(data.message || 'Gagal membuat kegiatan');
            }
        } catch (error) {
            console.error('Failed to create event:', error);
            setError('Terjadi kesalahan saat membuat kegiatan');
        }
    };

    const handleUpdateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEvent) return;

        try {
            const adminToken = localStorage.getItem('ramein_admin_token');
            
            // Prepare form data with files if present
            const formDataToSend = new FormData();
            
            // Add text fields
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('date', formData.date);
            formDataToSend.append('time', formData.time);
            formDataToSend.append('location', formData.location);
            formDataToSend.append('categoryId', formData.categoryId);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('maxParticipants', formData.maxParticipants);
            formDataToSend.append('registrationDeadline', formData.registrationDeadline);
            formDataToSend.append('eventType', formData.eventType);
            formDataToSend.append('contactPersonName', formData.contactPersonName);
            formDataToSend.append('contactPersonPhone', formData.contactPersonPhone);
            formDataToSend.append('contactPersonEmail', formData.contactPersonEmail);
            formDataToSend.append('meetingLink', formData.meetingLink);
            formDataToSend.append('requirements', formData.requirements);
            formDataToSend.append('benefits', formData.benefits);
            formDataToSend.append('isFeatured', formData.isFeatured.toString());
            formDataToSend.append('tags', formData.tags);
            
            // Add files if present, otherwise add URLs
            if (formData.flyerFile) {
                formDataToSend.append('flyerFile', formData.flyerFile);
            } else if (formData.flyerUrl) {
                formDataToSend.append('flyerUrl', formData.flyerUrl);
            }
            
            if (formData.certificateFile) {
                formDataToSend.append('certificateFile', formData.certificateFile);
            } else if (formData.certificateUrl) {
                formDataToSend.append('certificateUrl', formData.certificateUrl);
            }
            
            const response = await fetch(`${API_BASE_URL}/admin/events/${selectedEvent.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                },
                body: formDataToSend
            });

            if (response.ok) {
                setIsEditDialogOpen(false);
                setSelectedEvent(null);
                resetForm();
                fetchEvents();
            } else {
                const data = await response.json();
                setError(data.message || 'Gagal mengupdate kegiatan');
            }
        } catch (error) {
            console.error('Failed to update event:', error);
            setError('Terjadi kesalahan saat mengupdate kegiatan');
        }
    };

    const handleDeleteEvent = async (eventId: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus kegiatan ini?')) return;

        try {
            const adminToken = localStorage.getItem('ramein_admin_token');
            
            const response = await fetch(`${API_BASE_URL}/admin/events/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                }
            });

            if (response.ok) {
                fetchEvents();
            } else {
                const data = await response.json();
                setError(data.message || 'Gagal menghapus kegiatan');
            }
        } catch (error) {
            console.error('Failed to delete event:', error);
            setError('Terjadi kesalahan saat menghapus kegiatan');
        }
    };

    const handleExportParticipants = async (eventId: string, eventTitle: string) => {
        try {
            const adminToken = localStorage.getItem('ramein_admin_token');
            
            const response = await fetch(`${API_BASE_URL}/admin/events/${eventId}/participants/export?format=xlsx`, {
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `peserta_${eventTitle.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                setError('Gagal mengexport data peserta');
            }
        } catch (error) {
            console.error('Export failed:', error);
            setError('Terjadi kesalahan saat mengexport data');
        }
    };

    const openEditDialog = (event: Event) => {
        setSelectedEvent(event);
        setFormData({
            title: event.title,
            description: event.description,
            date: event.date.split('T')[0],
            time: event.time,
            location: event.location,
            flyerUrl: event.flyerUrl || '',
            certificateUrl: event.certificateUrl || '',
            flyerFile: null,
            certificateFile: null,
            categoryId: event.category.id,
            price: event.price?.toString() || '0',
            maxParticipants: event.maxParticipants?.toString() || '',
            registrationDeadline: event.registrationDeadline || '',
            eventType: event.eventType || 'offline',
            contactPersonName: event.contactPersonName || '',
            contactPersonPhone: event.contactPersonPhone || '',
            contactPersonEmail: event.contactPersonEmail || '',
            meetingLink: event.meetingLink || '',
            requirements: event.requirements || '',
            benefits: event.benefits || '',
            isFeatured: event.isFeatured || false,
            tags: event.tags?.join(', ') || ''
        });
        setIsEditDialogOpen(true);
    };

    const resetForm = () => {
        setFormData(initialFormState);
        setFlyerPreview('');
        setCertificatePreview('');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold">Pengelolaan Kegiatan</h2>
                    <p className="text-muted-foreground">
                        Kelola kegiatan dan data peserta
                    </p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>
                            <Plus className="w-4 h-4 mr-2" />
                            Buat Kegiatan Baru
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                        <DialogHeader>
                            <DialogTitle>Buat Kegiatan Baru</DialogTitle>
                            <p className="text-sm text-muted-foreground mt-1">Lengkapi informasi kegiatan yang akan diselenggarakan</p>
                        </DialogHeader>
                        <form onSubmit={handleCreateEvent} className="flex-1 overflow-y-auto pr-4 space-y-6">
                            {/* Section 1: Basic Information */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-base flex items-center gap-2">
                                    <span className="text-lg">📋</span> Informasi Dasar
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Judul Kegiatan</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        placeholder="Masukkan judul kegiatan"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="categoryId">Kategori</Label>
                                    <select
                                        id="categoryId"
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        required
                                    >
                                        <option value="">Pilih kategori</option>
                                        {categories.length === 0 ? (
                                            <option disabled>Loading...</option>
                                        ) : (
                                            categories.map(category => (
                                                <option key={category.id} value={category.id}>
                                                    {category.nama_kategori}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date">Tanggal</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="time">Waktu</Label>
                                    <Input
                                        id="time"
                                        type="time"
                                        value={formData.time}
                                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="location">Lokasi Event *</Label>
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                                        placeholder="Masukkan lokasi kegiatan"
                                        required
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="description">Deskripsi</Label>
                                    <textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        placeholder="Masukkan deskripsi kegiatan"
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                                        required
                                    />
                                </div>
                                </div>
                            </div>

                            {/* Section 2: Capacity & Price */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-base flex items-center gap-2">
                                    <span className="text-lg">💰</span> Kapasitas & Harga
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="maxParticipants">Kapasitas Peserta</Label>
                                    <Input
                                        id="maxParticipants"
                                        type="number"
                                        min="1"
                                        value={formData.maxParticipants}
                                        onChange={(e) => setFormData({...formData, maxParticipants: e.target.value})}
                                        placeholder="Unlimited"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="price">Harga (Rp)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        min="0"
                                        value={formData.price}
                                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                                        placeholder="0"
                                    />
                                    <p className="text-xs text-muted-foreground">Isi 0 untuk event gratis</p>
                                </div>
                                </div>
                            </div>

                            {/* Section 3: Event Type & Meeting Link */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-base flex items-center gap-2">
                                    <span className="text-lg">🎯</span> Tipe Event
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="eventType">Tipe Event *</Label>
                                    <select
                                        id="eventType"
                                        value={formData.eventType}
                                        onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        required
                                    >
                                        <option value="offline">Offline</option>
                                        <option value="online">Online</option>
                                        <option value="hybrid">Hybrid</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="registrationDeadline">Batas Pendaftaran</Label>
                                    <Input
                                        id="registrationDeadline"
                                        type="datetime-local"
                                        value={formData.registrationDeadline}
                                        onChange={(e) => setFormData({...formData, registrationDeadline: e.target.value})}
                                    />
                                </div>
                                {(formData.eventType === 'online' || formData.eventType === 'hybrid') && (
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="meetingLink">Link Meeting</Label>
                                        <Input
                                            id="meetingLink"
                                            value={formData.meetingLink}
                                            onChange={(e) => setFormData({...formData, meetingLink: e.target.value})}
                                            placeholder="https://zoom.us/j/..."
                                        />
                                    </div>
                                )}
                                </div>
                            </div>

                            {/* Section 4: Contact Person */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-base flex items-center gap-2">
                                    <span className="text-lg">👤</span> Contact Person
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="contactPersonName">Nama</Label>
                                    <Input
                                        id="contactPersonName"
                                        value={formData.contactPersonName}
                                        onChange={(e) => setFormData({...formData, contactPersonName: e.target.value})}
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contactPersonPhone">WhatsApp</Label>
                                    <Input
                                        id="contactPersonPhone"
                                        value={formData.contactPersonPhone}
                                        onChange={(e) => setFormData({...formData, contactPersonPhone: e.target.value})}
                                        placeholder="08123456789"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="contactPersonEmail">Email</Label>
                                    <Input
                                        id="contactPersonEmail"
                                        type="email"
                                        value={formData.contactPersonEmail}
                                        onChange={(e) => setFormData({...formData, contactPersonEmail: e.target.value})}
                                        placeholder="contact@example.com"
                                    />
                                </div>
                                </div>
                            </div>

                            {/* Section 5: Additional Info */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-base flex items-center gap-2">
                                    <span className="text-lg">ℹ️</span> Informasi Tambahan
                                </h3>
                                <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="requirements">Syarat Peserta</Label>
                                    <textarea
                                        id="requirements"
                                        value={formData.requirements}
                                        onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                                        placeholder="Contoh: Mahasiswa aktif, membawa laptop, dll"
                                        className="flex min-h-[70px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="benefits">Benefit yang Didapat</Label>
                                    <textarea
                                        id="benefits"
                                        value={formData.benefits}
                                        onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                                        placeholder="Contoh: E-Certificate, Snack, Modul, dll"
                                        className="flex min-h-[70px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                                    />
                                </div>
                                </div>
                            </div>

                            {/* Section 6: Files & Featured */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-base flex items-center gap-2">
                                    <span className="text-lg">📎</span> File & Pengaturan
                                </h3>
                                <div className="space-y-4">
                                {/* Flyer Upload */}
                                <div className="space-y-2">
                                    <Label htmlFor="flyerFile">Upload Flyer (Opsional)</Label>
                                    <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-accent/50 transition-colors">
                                        <input
                                            id="flyerFile"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFlyerFileChange}
                                            className="hidden"
                                        />
                                        <label htmlFor="flyerFile" className="cursor-pointer block">
                                            {flyerPreview ? (
                                                <div className="space-y-2">
                                                    <ImageWithFallback
                                                        src={flyerPreview}
                                                        alt="Flyer preview"
                                                        className="w-full h-32 object-cover rounded"
                                                    />
                                                    <p className="text-sm text-muted-foreground">Klik untuk ganti file</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium">Klik atau drag file gambar di sini</p>
                                                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF (Max 5MB)</p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                {/* Flyer URL Fallback */}
                                <div className="space-y-2">
                                    <Label htmlFor="flyerUrl">atau URL Flyer (Jika tidak upload file)</Label>
                                    <Input
                                        id="flyerUrl"
                                        value={formData.flyerUrl}
                                        onChange={(e) => setFormData({...formData, flyerUrl: e.target.value})}
                                        placeholder="https://example.com/flyer.jpg"
                                        disabled={!!formData.flyerFile}
                                    />
                                </div>

                                {/* Certificate Upload */}
                                <div className="space-y-2">
                                    <Label htmlFor="certificateFile">Upload Sertifikat (Opsional)</Label>
                                    <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-accent/50 transition-colors">
                                        <input
                                            id="certificateFile"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleCertificateFileChange}
                                            className="hidden"
                                        />
                                        <label htmlFor="certificateFile" className="cursor-pointer block">
                                            {certificatePreview ? (
                                                <div className="space-y-2">
                                                    <img src={certificatePreview} alt="Certificate preview" className="w-full h-32 object-cover rounded" />
                                                    <p className="text-sm text-muted-foreground">Klik untuk ganti file</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium">Klik atau drag file gambar di sini</p>
                                                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF (Max 5MB)</p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                {/* Certificate URL Fallback */}
                                <div className="space-y-2">
                                    <Label htmlFor="certificateUrl">atau URL Sertifikat (Jika tidak upload file)</Label>
                                    <Input
                                        id="certificateUrl"
                                        value={formData.certificateUrl}
                                        onChange={(e) => setFormData({...formData, certificateUrl: e.target.value})}
                                        placeholder="https://example.com/certificate.jpg"
                                        disabled={!!formData.certificateFile}
                                    />
                                </div>

                                <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-md hover:bg-accent transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={formData.isFeatured}
                                        onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm font-medium">⭐ Jadikan Event Unggulan</span>
                                </label>
                                </div>
                            </div>
                        </form>
                        <div className="flex justify-end gap-2 pt-4 border-t mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" onClick={handleCreateEvent}>
                                Buat Kegiatan
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Filters */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari kegiatan..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="w-full md:w-64">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full p-2 border rounded-md"
                            >
                                <option value="">Semua Kategori</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.nama_kategori}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Events List */}
            {isLoading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="p-6">
                                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-muted rounded w-1/2"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {events.map((event, index) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card>
                                <CardContent className="p-6">
                                    {/* Top Section: Image + Info */}
                                    <div className="flex items-start gap-4 mb-4">
                                        {/* Event Image Preview */}
                                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden shrink-0 bg-muted">
                                            <ImageWithFallback
                                                src={event.flyer || `https://picsum.photos/seed/${event.id}/400/300`}
                                                alt={event.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Event Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                <h3 className="text-lg font-semibold">{event.title}</h3>
                                                <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full shrink-0">
                                                    {event.category.name}
                                                </span>
                                            </div>
                                            <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                                                {event.description}
                                            </p>
                                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{new Date(event.date).toLocaleDateString('id-ID')}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{event.time}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{event.location}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Users className="w-4 h-4" />
                                                    <span>{event.participantCount} peserta</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <CheckCircle className="w-4 h-4" />
                                                    <span>{event.attendanceCount} hadir</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Section: Action Buttons */}
                                    <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                                        <Button
                                            variant="outline"
                                            size="default"
                                            onClick={() => handleExportParticipants(event.id, event.title)}
                                            className="flex-1 sm:flex-none"
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Export Peserta
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="default"
                                            onClick={() => openEditDialog(event)}
                                            className="flex-1 sm:flex-none"
                                        >
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit Event
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="default"
                                            onClick={() => handleDeleteEvent(event.id)}
                                            className="flex-1 sm:flex-none text-destructive hover:bg-destructive/10 hover:text-destructive"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Hapus Event
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <span className="flex items-center px-4">
                        Halaman {currentPage} dari {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Edit Kegiatan</DialogTitle>
                        <p className="text-sm text-muted-foreground mt-1">Perbarui informasi kegiatan</p>
                    </DialogHeader>
                    <form onSubmit={handleUpdateEvent} className="flex-1 overflow-y-auto pr-4 space-y-6">
                        {/* Section 1: Basic Information */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-base flex items-center gap-2">
                                <span className="text-lg">📋</span> Informasi Dasar
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-title">Judul Kegiatan</Label>
                                <Input
                                    id="edit-title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    placeholder="Masukkan judul kegiatan"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-categoryId">Kategori</Label>
                                <select
                                    id="edit-categoryId"
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    required
                                >
                                    <option value="">Pilih kategori</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.nama_kategori}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-date">Tanggal</Label>
                                <Input
                                    id="edit-date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-time">Waktu</Label>
                                <Input
                                    id="edit-time"
                                    type="time"
                                    value={formData.time}
                                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="edit-location">Lokasi</Label>
                                <Input
                                    id="edit-location"
                                    value={formData.location}
                                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                                    placeholder="Masukkan lokasi kegiatan"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-flyerUrl">URL Flyer (Opsional)</Label>
                                <Input
                                    id="edit-flyerUrl"
                                    value={formData.flyerUrl}
                                    onChange={(e) => setFormData({...formData, flyerUrl: e.target.value})}
                                    placeholder="https://example.com/flyer.jpg"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-certificateUrl">URL Sertifikat (Opsional)</Label>
                                <Input
                                    id="edit-certificateUrl"
                                    value={formData.certificateUrl}
                                    onChange={(e) => setFormData({...formData, certificateUrl: e.target.value})}
                                    placeholder="https://example.com/certificate.jpg"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="edit-location">Lokasi Event *</Label>
                                <Input
                                    id="edit-location"
                                    value={formData.location}
                                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                                    placeholder="Masukkan lokasi kegiatan"
                                    required
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="edit-description">Deskripsi</Label>
                                <textarea
                                    id="edit-description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    placeholder="Masukkan deskripsi kegiatan"
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                                    required
                                />
                            </div>
                            </div>
                        </div>

                        {/* Section 2: Capacity & Price */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-base flex items-center gap-2">
                                <span className="text-lg">💰</span> Kapasitas & Harga
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-maxParticipants">Kapasitas Peserta</Label>
                                <Input
                                    id="edit-maxParticipants"
                                    type="number"
                                    min="1"
                                    value={formData.maxParticipants}
                                    onChange={(e) => setFormData({...formData, maxParticipants: e.target.value})}
                                    placeholder="Unlimited"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-price">Harga (Rp)</Label>
                                <Input
                                    id="edit-price"
                                    type="number"
                                    min="0"
                                    value={formData.price}
                                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                                    placeholder="0"
                                />
                            </div>
                            </div>
                        </div>

                        {/* Section 3: Event Type & Meeting Link */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-base flex items-center gap-2">
                                <span className="text-lg">🎯</span> Tipe Event
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-eventType">Tipe Event *</Label>
                                <select
                                    id="edit-eventType"
                                    value={formData.eventType}
                                    onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    required
                                >
                                    <option value="offline">Offline</option>
                                    <option value="online">Online</option>
                                    <option value="hybrid">Hybrid</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-registrationDeadline">Batas Pendaftaran</Label>
                                <Input
                                    id="edit-registrationDeadline"
                                    type="datetime-local"
                                    value={formData.registrationDeadline}
                                    onChange={(e) => setFormData({...formData, registrationDeadline: e.target.value})}
                                />
                            </div>
                            {(formData.eventType === 'online' || formData.eventType === 'hybrid') && (
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="edit-meetingLink">Link Meeting</Label>
                                    <Input
                                        id="edit-meetingLink"
                                        value={formData.meetingLink}
                                        onChange={(e) => setFormData({...formData, meetingLink: e.target.value})}
                                        placeholder="https://zoom.us/j/..."
                                    />
                                </div>
                            )}
                            </div>
                        </div>

                        {/* Section 4: Contact Person */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-base flex items-center gap-2">
                                <span className="text-lg">👤</span> Contact Person
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-contactPersonName">Nama</Label>
                                <Input
                                    id="edit-contactPersonName"
                                    value={formData.contactPersonName}
                                    onChange={(e) => setFormData({...formData, contactPersonName: e.target.value})}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-contactPersonPhone">WhatsApp</Label>
                                <Input
                                    id="edit-contactPersonPhone"
                                    value={formData.contactPersonPhone}
                                    onChange={(e) => setFormData({...formData, contactPersonPhone: e.target.value})}
                                    placeholder="08123456789"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="edit-contactPersonEmail">Email</Label>
                                <Input
                                    id="edit-contactPersonEmail"
                                    type="email"
                                    value={formData.contactPersonEmail}
                                    onChange={(e) => setFormData({...formData, contactPersonEmail: e.target.value})}
                                    placeholder="contact@example.com"
                                />
                            </div>
                            </div>
                        </div>

                        {/* Section 5: Additional Info */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-base flex items-center gap-2">
                                <span className="text-lg">ℹ️</span> Informasi Tambahan
                            </h3>
                            <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-requirements">Syarat Peserta</Label>
                                <textarea
                                    id="edit-requirements"
                                    value={formData.requirements}
                                    onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                                    placeholder="Contoh: Mahasiswa aktif, membawa laptop, dll"
                                    className="flex min-h-[70px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-benefits">Benefit yang Didapat</Label>
                                <textarea
                                    id="edit-benefits"
                                    value={formData.benefits}
                                    onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                                    placeholder="Contoh: E-Certificate, Snack, Modul, dll"
                                    className="flex min-h-[70px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                                />
                            </div>
                            </div>
                        </div>

                        {/* Section 6: Files & Featured */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-base flex items-center gap-2">
                                <span className="text-lg">📎</span> File & Pengaturan
                            </h3>
                            <div className="space-y-4">
                            {/* Flyer Upload */}
                            <div className="space-y-2">
                                <Label htmlFor="edit-flyerFile">Upload Flyer (Opsional)</Label>
                                <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-accent/50 transition-colors">
                                    <input
                                        id="edit-flyerFile"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFlyerFileChange}
                                        className="hidden"
                                    />
                                    <label htmlFor="edit-flyerFile" className="cursor-pointer block">
                                        {flyerPreview ? (
                                            <div className="space-y-2">
                                                <img src={flyerPreview} alt="Flyer preview" className="w-full h-32 object-cover rounded" />
                                                <p className="text-sm text-muted-foreground">Klik untuk ganti file</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium">Klik atau drag file gambar di sini</p>
                                                <p className="text-xs text-muted-foreground">PNG, JPG, GIF (Max 5MB)</p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            {/* Flyer URL Fallback */}
                            <div className="space-y-2">
                                <Label htmlFor="edit-flyerUrl">atau URL Flyer (Jika tidak upload file)</Label>
                                <Input
                                    id="edit-flyerUrl"
                                    value={formData.flyerUrl}
                                    onChange={(e) => setFormData({...formData, flyerUrl: e.target.value})}
                                    placeholder="https://example.com/flyer.jpg"
                                    disabled={!!formData.flyerFile}
                                />
                            </div>

                            {/* Certificate Upload */}
                            <div className="space-y-2">
                                <Label htmlFor="edit-certificateFile">Upload Sertifikat (Opsional)</Label>
                                <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-accent/50 transition-colors">
                                    <input
                                        id="edit-certificateFile"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleCertificateFileChange}
                                        className="hidden"
                                    />
                                    <label htmlFor="edit-certificateFile" className="cursor-pointer block">
                                        {certificatePreview ? (
                                            <div className="space-y-2">
                                                <img src={certificatePreview} alt="Certificate preview" className="w-full h-32 object-cover rounded" />
                                                <p className="text-sm text-muted-foreground">Klik untuk ganti file</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium">Klik atau drag file gambar di sini</p>
                                                <p className="text-xs text-muted-foreground">PNG, JPG, GIF (Max 5MB)</p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            {/* Certificate URL Fallback */}
                            <div className="space-y-2">
                                <Label htmlFor="edit-certificateUrl">atau URL Sertifikat (Jika tidak upload file)</Label>
                                <Input
                                    id="edit-certificateUrl"
                                    value={formData.certificateUrl}
                                    onChange={(e) => setFormData({...formData, certificateUrl: e.target.value})}
                                    placeholder="https://example.com/certificate.jpg"
                                    disabled={!!formData.certificateFile}
                                />
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-md hover:bg-accent transition-colors">
                                <input
                                    type="checkbox"
                                    checked={formData.isFeatured}
                                    onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm font-medium">⭐ Jadikan Event Unggulan</span>
                            </label>
                            </div>
                        </div>
                    </form>
                    <div className="flex justify-end gap-2 pt-4 border-t mt-6">
                        <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Batal
                        </Button>
                        <Button type="submit" onClick={handleUpdateEvent}>
                            Update Kegiatan
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
