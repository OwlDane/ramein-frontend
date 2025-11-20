"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { apiFetch } from "@/lib/api";
import type { GalleryItem, GalleryResponse } from "@/types/gallery";
import { Plus, Edit, Trash2, Download, Calendar, MapPin, Users, Upload, X } from "lucide-react";
import { toast } from "react-hot-toast";

interface GalleryFormState {
    title: string;
    description: string;
    date: string;
    location: string;
    participants: string;
    category: string;
    imageUrl: string;
    imageFile: File | null;
    imagePreview: string | null;
}

const initialFormState: GalleryFormState = {
    title: "",
    description: "",
    date: "",
    location: "",
    participants: "",
    category: "",
    imageUrl: "",
    imageFile: null,
    imagePreview: null,
};

export function AdminGalleryManagement() {
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
    const [formData, setFormData] = useState<GalleryFormState>(initialFormState);

    // Fetch gallery items
    useEffect(() => {
        fetchGalleryItems();
    }, []);

    const fetchGalleryItems = async () => {
        try {
            setIsLoading(true);
            const response = await apiFetch<GalleryResponse>('/gallery?limit=100');
            setGalleryItems(response.data);
        } catch (error) {
            console.error('Failed to fetch gallery:', error);
            toast.error('Gagal memuat galeri');
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    imageFile: file,
                    imagePreview: reader.result as string
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const resetForm = () => {
        setFormData(initialFormState);
        setSelectedItem(null);
    };

    const handleCreateGallery = async () => {
        if (!formData.title || !formData.description || !formData.date || !formData.location) {
            toast.error('Semua field wajib diisi');
            return;
        }

        try {
            const formDataObj = new FormData();
            formDataObj.append('title', formData.title);
            formDataObj.append('description', formData.description);
            formDataObj.append('date', formData.date);
            formDataObj.append('location', formData.location);
            formDataObj.append('participants', formData.participants || '0');
            formDataObj.append('category', formData.category || '');
            formDataObj.append('imageUrl', formData.imageUrl);

            if (formData.imageFile) {
                formDataObj.append('imageFile', formData.imageFile);
            }

            const adminToken = localStorage.getItem('ramein_admin_token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/gallery`, {
                method: 'POST',
                headers: {
                    ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
                },
                body: formDataObj,
                credentials: 'include',
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Gagal membuat galeri');
            }

            toast.success('Galeri berhasil dibuat');
            setIsCreateDialogOpen(false);
            resetForm();
            fetchGalleryItems();
        } catch (error) {
            console.error('Create gallery error:', error);
            toast.error(error instanceof Error ? error.message : 'Gagal membuat galeri');
        }
    };

    const handleUpdateGallery = async () => {
        if (!selectedItem) return;

        try {
            const formDataObj = new FormData();
            formDataObj.append('title', formData.title);
            formDataObj.append('description', formData.description);
            formDataObj.append('date', formData.date);
            formDataObj.append('location', formData.location);
            formDataObj.append('participants', formData.participants || '0');
            formDataObj.append('category', formData.category || '');
            formDataObj.append('imageUrl', formData.imageUrl);

            if (formData.imageFile) {
                formDataObj.append('imageFile', formData.imageFile);
            }

            const adminToken = localStorage.getItem('ramein_admin_token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/gallery/${selectedItem.id}`, {
                method: 'PUT',
                headers: {
                    ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
                },
                body: formDataObj,
                credentials: 'include',
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Gagal mengupdate galeri');
            }

            toast.success('Galeri berhasil diupdate');
            setIsEditDialogOpen(false);
            resetForm();
            fetchGalleryItems();
        } catch (error) {
            console.error('Update gallery error:', error);
            toast.error(error instanceof Error ? error.message : 'Gagal mengupdate galeri');
        }
    };

    const handleDeleteGallery = async (id: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus galeri ini?')) return;

        try {
            const adminToken = localStorage.getItem('ramein_admin_token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/gallery/${id}`, {
                method: 'DELETE',
                headers: {
                    ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
                },
                credentials: 'include',
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Gagal menghapus galeri');
            }

            toast.success('Galeri berhasil dihapus');
            fetchGalleryItems();
        } catch (error) {
            console.error('Delete gallery error:', error);
            toast.error(error instanceof Error ? error.message : 'Gagal menghapus galeri');
        }
    };

    const openEditDialog = (item: GalleryItem) => {
        setSelectedItem(item);
        setFormData({
            title: item.title,
            description: item.description,
            date: item.date.split('T')[0],
            location: item.location,
            participants: item.participants.toString(),
            category: item.category || '',
            imageUrl: item.image || '',
            imageFile: null,
            imagePreview: item.image || null,
        });
        setIsEditDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Manajemen Galeri</h2>
                <Button
                    onClick={() => {
                        resetForm();
                        setIsCreateDialogOpen(true);
                    }}
                    className="gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Galeri
                </Button>
            </div>

            {/* Gallery Items */}
            {isLoading ? (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {galleryItems.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-muted">
                                            <ImageWithFallback
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                                            <div className="space-y-1 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{new Date(item.date).toLocaleDateString('id-ID')}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{item.location}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4" />
                                                    <span>{item.participants} peserta</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-4 border-t">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openEditDialog(item)}
                                            className="flex-1"
                                        >
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDeleteGallery(item.id)}
                                            className="flex-1 text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Hapus
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Create/Edit Dialog */}
            {(isCreateDialogOpen || isEditDialogOpen) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="sticky top-0 flex items-center justify-between p-6 border-b bg-background">
                            <h2 className="text-xl font-bold">
                                {isEditDialogOpen ? 'Edit Galeri' : 'Tambah Galeri'}
                            </h2>
                            <button
                                onClick={() => {
                                    setIsCreateDialogOpen(false);
                                    setIsEditDialogOpen(false);
                                    resetForm();
                                }}
                                className="p-2 hover:bg-muted rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Gambar</label>
                                <div className="flex items-center gap-2">
                                    <label className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        <div className="bg-muted py-2 px-3 rounded-lg text-sm text-muted-foreground cursor-pointer">
                                            Unggah gambar
                                        </div>
                                    </label>
                                    {formData.imagePreview && (
                                        <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-muted">
                                            <ImageWithFallback
                                                src={formData.imagePreview}
                                                alt="Gambar galeri"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                                {!formData.imageFile && (
                                    <input
                                        type="text"
                                        name="imageUrl"
                                        placeholder="Atau masukkan URL gambar"
                                        value={formData.imageUrl}
                                        onChange={handleInputChange}
                                        className="w-full mt-2 px-3 py-2 border rounded-lg text-sm"
                                    />
                                )}
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Judul</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="Judul galeri"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Deskripsi</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="Deskripsi galeri"
                                    rows={3}
                                />
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Tanggal</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Lokasi</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="Lokasi kegiatan"
                                />
                            </div>

                            {/* Participants */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Jumlah Peserta</label>
                                <input
                                    type="number"
                                    name="participants"
                                    value={formData.participants}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="0"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Kategori</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg bg-background"
                                >
                                    <option value="">Pilih Kategori</option>
                                    <option value="Webinar">Webinar</option>
                                    <option value="Training">Training</option>
                                    <option value="Conference">Conference</option>
                                    <option value="Workshop">Workshop</option>
                                    <option value="Seminar">Seminar</option>
                                </select>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-4 border-t">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsCreateDialogOpen(false);
                                        setIsEditDialogOpen(false);
                                        resetForm();
                                    }}
                                    className="flex-1"
                                >
                                    Batal
                                </Button>
                                <Button
                                    onClick={isEditDialogOpen ? handleUpdateGallery : handleCreateGallery}
                                    className="flex-1"
                                >
                                    {isEditDialogOpen ? 'Update' : 'Buat'}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
