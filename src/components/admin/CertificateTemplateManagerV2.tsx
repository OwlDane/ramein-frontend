'use client';

import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Plus,
    Eye,
    Trash2,
    Edit,
    CheckCircle,
    AlertCircle,
    Loader2,
    FileText,
    Palette
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { CertificateTemplateEditor, TemplateData } from './CertificateTemplateEditor';
import { motion } from 'framer-motion';

interface PlaceholderConfig {
    key: string;
    label: string;
    x: number;
    y: number;
    fontSize: number;
    fontFamily: string;
    color: string;
    align: 'left' | 'center' | 'right';
    maxWidth?: number;
}

interface CertificateTemplate {
    id: string;
    name: string;
    description: string;
    templateUrl: string;
    thumbnailUrl?: string;
    isDefault: boolean;
    isActive: boolean;
    category: string;
    placeholders: PlaceholderConfig[];
    createdAt: string;
}

export function CertificateTemplateManagerV2() {
    const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState<string>('');
    const [showEditor, setShowEditor] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch user token
    useEffect(() => {
        const token = localStorage.getItem('ramein_admin_token');
        if (token) {
            setUserToken(token);
        }
    }, []);

    // Fetch templates from API
    useEffect(() => {
        if (userToken) {
            fetchTemplates();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userToken]);

    const fetchTemplates = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE_URL}/certificate-templates`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setTemplates(data);
            } else {
                toast.error('Gagal memuat template');
            }
        } catch (error) {
            console.error('Error fetching templates:', error);
            toast.error('Terjadi kesalahan saat memuat template');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveTemplate = async (templateData: TemplateData) => {
        try {
            const method = editingTemplate ? 'PUT' : 'POST';
            const url = editingTemplate 
                ? `${API_BASE_URL}/certificate-templates/${editingTemplate}`
                : `${API_BASE_URL}/certificate-templates`;

            console.log('Saving template to:', url);
            console.log('Template data:', templateData);

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                },
                body: JSON.stringify(templateData)
            });

            const responseData = await response.json();
            console.log('Response:', responseData);

            if (response.ok) {
                toast.success(editingTemplate ? 'Template berhasil diupdate' : 'Template berhasil dibuat');
                setShowEditor(false);
                setEditingTemplate(null);
                fetchTemplates();
            } else {
                const errorMsg = responseData.message || 'Gagal menyimpan template';
                console.error('Save failed:', errorMsg);
                toast.error(errorMsg);
            }
        } catch (error) {
            console.error('Error saving template:', error);
            toast.error('Terjadi kesalahan saat menyimpan template');
        }
    };

    const handleDeleteTemplate = async (templateId: string) => {
        if (!confirm('Yakin ingin menghapus template ini?')) return;

        try {
            const response = await fetch(`${API_BASE_URL}/certificate-templates/${templateId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            if (response.ok) {
                toast.success('Template berhasil dihapus');
                fetchTemplates();
            } else {
                toast.error('Gagal menghapus template');
            }
        } catch (error) {
            console.error('Error deleting template:', error);
            toast.error('Terjadi kesalahan saat menghapus template');
        }
    };

    const handleSetDefault = async (templateId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/certificate-templates/${templateId}/set-default`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            if (response.ok) {
                toast.success('Template default berhasil diubah');
                fetchTemplates();
            } else {
                toast.error('Gagal mengubah template default');
            }
        } catch (error) {
            console.error('Error setting default template:', error);
            toast.error('Terjadi kesalahan');
        }
    };

    const filteredTemplates = templates.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (showEditor) {
        return (
            <CertificateTemplateEditor
                templateId={editingTemplate || undefined}
                onSave={handleSaveTemplate}
                onCancel={() => {
                    setShowEditor(false);
                    setEditingTemplate(null);
                }}
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold">Kelola Template Sertifikat</h3>
                    <p className="text-sm text-muted-foreground">
                        Buat dan kelola template sertifikat custom
                    </p>
                </div>
                <Button onClick={() => setShowEditor(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Buat Template Baru
                </Button>
            </div>

            {/* Search */}
            <div className="flex gap-4">
                <Input
                    placeholder="Cari template..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            {/* Templates Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : filteredTemplates.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground mb-4">
                            {searchTerm ? 'Tidak ada template yang ditemukan' : 'Belum ada template'}
                        </p>
                        {!searchTerm && (
                            <Button onClick={() => setShowEditor(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Buat Template Pertama
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.map((template, index) => (
                        <motion.div
                            key={template.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                                {/* Template Preview */}
                                <div className="relative aspect-[4/3] bg-gray-100">
                                    {template.thumbnailUrl ? (
                                        <img
                                            src={template.thumbnailUrl}
                                            alt={template.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Palette className="w-12 h-12 text-muted-foreground opacity-50" />
                                        </div>
                                    )}
                                    
                                    {/* Badges */}
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        {template.isDefault && (
                                            <Badge className="bg-green-500">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Default
                                            </Badge>
                                        )}
                                        {!template.isActive && (
                                            <Badge variant="secondary">Inactive</Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Template Info */}
                                <CardHeader>
                                    <CardTitle className="text-base">{template.name}</CardTitle>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {template.description || 'Tidak ada deskripsi'}
                                    </p>
                                </CardHeader>

                                <CardContent>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <Badge variant="outline">{template.category}</Badge>
                                        <Badge variant="outline">
                                            {template.placeholders?.length || 0} placeholders
                                        </Badge>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => {
                                                setEditingTemplate(template.id);
                                                setShowEditor(true);
                                            }}
                                        >
                                            <Edit className="w-4 h-4 mr-1" />
                                            Edit
                                        </Button>
                                        
                                        {!template.isDefault && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleSetDefault(template.id)}
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                            </Button>
                                        )}
                                        
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red-600 hover:text-red-700"
                                            onClick={() => handleDeleteTemplate(template.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Stats */}
            <Card>
                <CardContent className="py-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold">{templates.length}</p>
                            <p className="text-sm text-muted-foreground">Total Templates</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-green-600">
                                {templates.filter(t => t.isActive).length}
                            </p>
                            <p className="text-sm text-muted-foreground">Active</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-blue-600">
                                {templates.filter(t => t.isDefault).length}
                            </p>
                            <p className="text-sm text-muted-foreground">Default</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
