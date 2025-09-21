'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
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
    flyerUrl?: string;
    certificateUrl?: string;
    category: {
        id: string;
        name: string;
    };
    participantCount: number;
    attendanceCount: number;
    createdAt: string;
}

interface Category {
    id: string;
    name: string;
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

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        flyerUrl: '',
        certificateUrl: '',
        categoryId: ''
    });

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

            const response = await fetch(`/api/admin/events?${params}`, {
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
        fetchEvents();
        fetchCategories();
    }, [fetchEvents]);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories');
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const adminToken = localStorage.getItem('ramein_admin_token');
            
            const response = await fetch('/api/admin/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setIsCreateDialogOpen(false);
                setFormData({
                    title: '',
                    description: '',
                    date: '',
                    time: '',
                    location: '',
                    flyerUrl: '',
                    certificateUrl: '',
                    categoryId: ''
                });
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
            
            const response = await fetch(`/api/admin/events/${selectedEvent.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setIsEditDialogOpen(false);
                setSelectedEvent(null);
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
            
            const response = await fetch(`/api/admin/events/${eventId}`, {
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
            
            const response = await fetch(`/api/admin/events/${eventId}/participants/export?format=xlsx`, {
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
            categoryId: event.category.id
        });
        setIsEditDialogOpen(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            date: '',
            time: '',
            location: '',
            flyerUrl: '',
            certificateUrl: '',
            categoryId: ''
        });
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
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Buat Kegiatan Baru</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateEvent} className="space-y-4">
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
                                        className="w-full p-2 border rounded-md"
                                        required
                                    >
                                        <option value="">Pilih kategori</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
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
                                    <Label htmlFor="location">Lokasi</Label>
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                                        placeholder="Masukkan lokasi kegiatan"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="flyerUrl">URL Flyer (Opsional)</Label>
                                    <Input
                                        id="flyerUrl"
                                        value={formData.flyerUrl}
                                        onChange={(e) => setFormData({...formData, flyerUrl: e.target.value})}
                                        placeholder="https://example.com/flyer.jpg"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="certificateUrl">URL Sertifikat (Opsional)</Label>
                                    <Input
                                        id="certificateUrl"
                                        value={formData.certificateUrl}
                                        onChange={(e) => setFormData({...formData, certificateUrl: e.target.value})}
                                        placeholder="https://example.com/certificate.jpg"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="description">Deskripsi</Label>
                                    <textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        placeholder="Masukkan deskripsi kegiatan"
                                        className="w-full p-2 border rounded-md min-h-[100px]"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                    Batal
                                </Button>
                                <Button type="submit">Buat Kegiatan</Button>
                            </div>
                        </form>
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
                                        {category.name}
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
                <div className="space-y-4">
                    {events.map((event, index) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-lg font-semibold">{event.title}</h3>
                                                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                                    {event.category.name}
                                                </span>
                                            </div>
                                            <p className="text-muted-foreground mb-4 line-clamp-2">
                                                {event.description}
                                            </p>
                                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(event.date).toLocaleDateString('id-ID')}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {event.time}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    {event.location}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    {event.participantCount} peserta
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <CheckCircle className="w-4 h-4" />
                                                    {event.attendanceCount} hadir
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleExportParticipants(event.id, event.title)}
                                            >
                                                <Download className="w-4 h-4 mr-1" />
                                                Export
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openEditDialog(event)}
                                            >
                                                <Edit className="w-4 h-4 mr-1" />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDeleteEvent(event.id)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="w-4 h-4 mr-1" />
                                                Hapus
                                            </Button>
                                        </div>
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
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Kegiatan</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdateEvent} className="space-y-4">
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
                                    className="w-full p-2 border rounded-md"
                                    required
                                >
                                    <option value="">Pilih kategori</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
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
                                <Label htmlFor="edit-description">Deskripsi</Label>
                                <textarea
                                    id="edit-description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    placeholder="Masukkan deskripsi kegiatan"
                                    className="w-full p-2 border rounded-md min-h-[100px]"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit">Update Kegiatan</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
