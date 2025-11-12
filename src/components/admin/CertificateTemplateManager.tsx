'use client';

import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Upload,
    Image as ImageIcon,
    FileText,
    Eye,
    Trash2,
    Plus,
    Check,
    Sparkles,
    Palette
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { TemplatePreviewModal } from './TemplatePreviewModal';

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
    thumbnail: string;
    thumbnailUrl?: string;
    isDefault: boolean;
    category: 'modern' | 'classic' | 'elegant' | 'custom';
    placeholders: PlaceholderConfig[];
    createdAt: string;
}

export function CertificateTemplateManager() {
    const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState<string>('');
    const [previewTemplate, setPreviewTemplate] = useState<CertificateTemplate | null>(null);
    const [showPreview, setShowPreview] = useState(false);

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
                
                // Set default template as selected
                const defaultTemplate = data.find((t: CertificateTemplate) => t.isDefault);
                if (defaultTemplate) {
                    setSelectedTemplate(defaultTemplate.id);
                }
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

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'application/pdf') {
                setUploadedFile(file);
                toast.success(`File ${file.name} berhasil dipilih`);
            } else {
                toast.error('Format file harus PNG, JPG, atau PDF');
            }
        }
    };

    const handleUploadTemplate = async () => {
        if (!uploadedFile) {
            toast.error('Pilih file terlebih dahulu');
            return;
        }

        try {
            setIsLoading(true);
            
            const templateData = {
                name: `Custom Template ${templates.length + 1}`,
                description: 'Template custom yang diupload',
                category: 'custom',
                templateUrl: '/templates/custom-template.pdf',
                thumbnailUrl: URL.createObjectURL(uploadedFile),
                placeholders: [
                    { key: 'nama', label: 'Nama Peserta', x: 421, y: 260, fontSize: 36, fontFamily: 'Helvetica-Bold', color: '#2d3748', align: 'center', maxWidth: 600 },
                    { key: 'event', label: 'Nama Event', x: 421, y: 350, fontSize: 20, fontFamily: 'Helvetica-Bold', color: '#2d3748', align: 'center', maxWidth: 600 },
                    { key: 'tanggal', label: 'Tanggal', x: 421, y: 400, fontSize: 12, fontFamily: 'Helvetica', color: '#718096', align: 'center', maxWidth: 400 },
                    { key: 'nomor_sertifikat', label: 'Nomor Sertifikat', x: 421, y: 520, fontSize: 10, fontFamily: 'Helvetica', color: '#a0aec0', align: 'center', maxWidth: 400 }
                ],
                settings: { width: 842, height: 595, orientation: 'landscape', backgroundColor: '#ffffff', fontFamily: 'Helvetica', defaultFontSize: 14, defaultColor: '#000000' }
            };

            console.log('Uploading template to API...');
            console.log('Token:', userToken ? 'Token exists' : 'No token');
            console.log('Template data:', templateData);

            const response = await fetch(`${API_BASE_URL}/certificate-templates`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                },
                body: JSON.stringify(templateData)
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));

            const responseText = await response.text();
            console.log('Response text:', responseText);

            if (response.ok) {
                await fetchTemplates();
                setUploadedFile(null);
                toast.success('Template berhasil diupload!');
            } else {
                let error;
                try {
                    error = JSON.parse(responseText);
                } catch {
                    error = { message: responseText || 'Unknown error' };
                }
                console.error('Upload error:', error);
                console.error('Full response:', { status: response.status, error });
                toast.error(error.message || error.error || 'Gagal mengupload template');
            }
        } catch (error) {
            console.error('Upload exception:', error);
            toast.error('Gagal mengupload template');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteTemplate = async (templateId: string) => {
        const template = templates.find(t => t.id === templateId);
        if (template?.isDefault) {
            toast.error('Template default tidak dapat dihapus');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/certificate-templates/${templateId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            if (response.ok) {
                await fetchTemplates();
                toast.success('Template berhasil dihapus');
            } else {
                toast.error('Gagal menghapus template');
            }
        } catch {
            toast.error('Gagal menghapus template');
        }
    };

    const handleSetAsDefault = async (templateId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/certificate-templates/${templateId}/set-default`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            if (response.ok) {
                setSelectedTemplate(templateId);
                await fetchTemplates();
                toast.success('Template berhasil dipilih sebagai default');
            } else {
                toast.error('Gagal mengatur template default');
            }
        } catch {
            toast.error('Gagal mengatur template default');
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Palette className="w-5 h-5" />
                        Manajemen Template Sertifikat
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                        Kelola template sertifikat untuk event Anda. Pilih dari template default atau upload template custom.
                    </p>
                </CardHeader>
            </Card>

            <Tabs defaultValue="gallery" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="gallery">
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Template Gallery
                    </TabsTrigger>
                    <TabsTrigger value="upload">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Template
                    </TabsTrigger>
                    <TabsTrigger value="editor">
                        <FileText className="w-4 h-4 mr-2" />
                        Template Editor
                    </TabsTrigger>
                </TabsList>

                {/* Template Gallery */}
                <TabsContent value="gallery" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Template Gallery</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Pilih template yang akan digunakan untuk generate sertifikat
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {templates.map((template) => (
                                    <Card
                                        key={template.id}
                                        className={`cursor-pointer transition-all hover:shadow-lg ${
                                            selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
                                        }`}
                                        onClick={() => setSelectedTemplate(template.id)}
                                    >
                                        <CardContent className="p-4">
                                            {/* Template Preview */}
                                            <div className="aspect-[4/3] bg-muted rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                                                {(template.thumbnailUrl || template.thumbnail) ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={template.thumbnailUrl || template.thumbnail}
                                                        alt={template.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <FileText className="w-16 h-16 text-muted-foreground" />
                                                )}
                                            </div>

                                            {/* Template Info */}
                                            <div className="space-y-2">
                                                <div className="flex items-start justify-between">
                                                    <h3 className="font-semibold">{template.name}</h3>
                                                    {template.isDefault && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            <Sparkles className="w-3 h-3 mr-1" />
                                                            Default
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {template.description}
                                                </p>

                                                {/* Placeholders */}
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {template.placeholders.map((placeholder, idx) => (
                                                        <Badge key={idx} variant="outline" className="text-xs">
                                                            {`{{${placeholder.key}}}`}
                                                        </Badge>
                                                    ))}
                                                </div>

                                                {/* Actions */}
                                                <div className="flex gap-2 mt-4">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="flex-1"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setPreviewTemplate(template);
                                                            setShowPreview(true);
                                                        }}
                                                    >
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        Preview
                                                    </Button>
                                                    {selectedTemplate === template.id ? (
                                                        <Button size="sm" className="flex-1">
                                                            <Check className="w-4 h-4 mr-2" />
                                                            Terpilih
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            size="sm"
                                                            variant="default"
                                                            className="flex-1"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleSetAsDefault(template.id);
                                                            }}
                                                        >
                                                            Pilih
                                                        </Button>
                                                    )}
                                                    {!template.isDefault && (
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteTemplate(template.id);
                                                            }}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Upload Template */}
                <TabsContent value="upload" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Upload Template Custom</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Upload template sertifikat Anda sendiri (PNG, JPG, atau PDF)
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Upload Area */}
                            <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                                <input
                                    type="file"
                                    id="template-upload"
                                    accept=".png,.jpg,.jpeg,.pdf"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="template-upload"
                                    className="cursor-pointer flex flex-col items-center gap-4"
                                >
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                        <Upload className="w-8 h-8 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium mb-1">
                                            Klik untuk upload atau drag & drop
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            PNG, JPG, atau PDF (Max. 10MB)
                                        </p>
                                    </div>
                                </label>
                            </div>

                            {/* Uploaded File Info */}
                            {uploadedFile && (
                                <Card className="bg-muted/50">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <FileText className="w-8 h-8 text-primary" />
                                                <div>
                                                    <p className="font-medium">{uploadedFile.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => setUploadedFile(null)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Template Details */}
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="template-name">Nama Template</Label>
                                    <Input
                                        id="template-name"
                                        placeholder="Contoh: Template Sertifikat Workshop 2024"
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="template-description">Deskripsi</Label>
                                    <Input
                                        id="template-description"
                                        placeholder="Deskripsi singkat tentang template"
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            {/* Upload Button */}
                            <Button
                                onClick={handleUploadTemplate}
                                disabled={!uploadedFile}
                                className="w-full"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Upload Template
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Guidelines */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Panduan Upload Template</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-primary mt-0.5" />
                                    <span>Gunakan resolusi minimal 1920x1080 untuk hasil terbaik</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-primary mt-0.5" />
                                    <span>Format landscape (horizontal) lebih disarankan</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-primary mt-0.5" />
                                    <span>Sisakan ruang kosong untuk placeholder text</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-primary mt-0.5" />
                                    <span>Gunakan warna kontras untuk text yang mudah dibaca</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Template Editor */}
                <TabsContent value="editor" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Template Editor</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Sesuaikan placeholder dan posisi text pada template
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-12 text-muted-foreground">
                                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p className="font-medium mb-2">Template Editor</p>
                                <p className="text-sm">
                                    Fitur editor akan tersedia segera. Anda dapat mengatur posisi dan style text placeholder.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Preview Modal */}
            <TemplatePreviewModal
                isOpen={showPreview}
                onClose={() => {
                    setShowPreview(false);
                    setPreviewTemplate(null);
                }}
                template={previewTemplate}
                onSelect={handleSetAsDefault}
            />
        </div>
    );
}
