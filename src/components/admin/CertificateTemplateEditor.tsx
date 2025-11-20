'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Move,
    Type,
    Palette,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Save,
    Eye,
    Upload,
    X,
    Plus,
    Trash2,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { motion, Reorder } from 'framer-motion';

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

interface TemplateSettings {
    width: number;
    height: number;
    orientation: 'landscape' | 'portrait';
    backgroundColor?: string;
}

export interface TemplateData {
    name: string;
    description: string;
    backgroundImage: string | null;
    placeholders: PlaceholderConfig[];
    settings: TemplateSettings;
}

interface CertificateTemplateEditorProps {
    templateId?: string;
    onSave?: (template: TemplateData) => void;
    onCancel?: () => void;
}

const AVAILABLE_PLACEHOLDERS = [
    { key: 'nama', label: 'Nama Peserta', sample: 'John Doe' },
    { key: 'event', label: 'Nama Event', sample: 'Workshop Digital Marketing' },
    { key: 'tanggal', label: 'Tanggal Event', sample: '15 Januari 2025' },
    { key: 'nomor', label: 'Nomor Sertifikat', sample: 'CERT-2025-001' },
    { key: 'kategori', label: 'Kategori Event', sample: 'Workshop' },
    { key: 'lokasi', label: 'Lokasi Event', sample: 'Jakarta' },
];

const FONT_FAMILIES = [
    'Arial',
    'Times New Roman',
    'Georgia',
    'Courier New',
    'Verdana',
    'Helvetica',
    'Palatino',
    'Garamond',
    'Comic Sans MS',
    'Impact'
];

export function CertificateTemplateEditor({ templateId, onSave, onCancel }: CertificateTemplateEditorProps) {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [templateName, setTemplateName] = useState('');
    const [templateDescription, setTemplateDescription] = useState('');
    const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
    const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
    const [placeholders, setPlaceholders] = useState<PlaceholderConfig[]>([]);
    const [selectedPlaceholder, setSelectedPlaceholder] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
    const [settings, setSettings] = useState<TemplateSettings>({
        width: 1200,
        height: 900,
        orientation: 'landscape',
        backgroundColor: '#ffffff'
    });
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Calculate canvas scale
    useEffect(() => {
        const updateCanvasSize = () => {
            if (canvasRef.current) {
                const containerWidth = canvasRef.current.parentElement?.clientWidth || 800;
                const scale = Math.min(containerWidth / settings.width, 0.8);
                setCanvasSize({
                    width: settings.width * scale,
                    height: settings.height * scale
                });
            }
        };

        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);
        return () => window.removeEventListener('resize', updateCanvasSize);
    }, [settings.width, settings.height]);

    const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('Ukuran file maksimal 5MB');
                return;
            }

            setBackgroundFile(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setBackgroundImage(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const addPlaceholder = (placeholderType: typeof AVAILABLE_PLACEHOLDERS[0]) => {
        const newPlaceholder: PlaceholderConfig = {
            key: placeholderType.key,
            label: placeholderType.label,
            x: canvasSize.width / 2,
            y: canvasSize.height / 2,
            fontSize: 24,
            fontFamily: 'Arial',
            color: '#000000',
            align: 'center',
            maxWidth: 600
        };

        setPlaceholders([...placeholders, newPlaceholder]);
        setSelectedPlaceholder(placeholderType.key);
    };

    const updatePlaceholder = (key: string, updates: Partial<PlaceholderConfig>) => {
        setPlaceholders(placeholders.map(p =>
            p.key === key ? { ...p, ...updates } : p
        ));
    };

    const removePlaceholder = (key: string) => {
        setPlaceholders(placeholders.filter(p => p.key !== key));
        if (selectedPlaceholder === key) {
            setSelectedPlaceholder(null);
        }
    };

    const handlePlaceholderDrag = (key: string, e: React.MouseEvent) => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scale = canvasSize.width / settings.width;

        const startX = e.clientX;
        const startY = e.clientY;
        const placeholder = placeholders.find(p => p.key === key);
        if (!placeholder) return;

        const startPosX = placeholder.x;
        const startPosY = placeholder.y;

        setIsDragging(true);
        setSelectedPlaceholder(key);

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = (moveEvent.clientX - startX) / scale;
            const deltaY = (moveEvent.clientY - startY) / scale;

            updatePlaceholder(key, {
                x: Math.max(0, Math.min(settings.width, startPosX + deltaX)),
                y: Math.max(0, Math.min(settings.height, startPosY + deltaY))
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleSave = async () => {
        if (!templateName.trim()) {
            setError('Nama template harus diisi');
            return;
        }

        if (placeholders.length === 0) {
            setError('Minimal harus ada 1 placeholder');
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            const templateData = {
                name: templateName,
                description: templateDescription,
                backgroundImage: backgroundImage,
                placeholders: placeholders,
                settings: settings
            };

            if (onSave) {
                onSave(templateData);
            }

            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            setError('Gagal menyimpan template');
        } finally {
            setIsSaving(false);
        }
    };

    const selectedPlaceholderData = placeholders.find(p => p.key === selectedPlaceholder);
    const scale = canvasSize.width / settings.width;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Template Editor</h3>
                    <p className="text-sm text-muted-foreground">
                        Desain template sertifikat dengan drag & drop
                    </p>
                </div>
                <div className="flex gap-2">
                    {onCancel && (
                        <Button variant="outline" onClick={onCancel}>
                            <X className="w-4 h-4 mr-2" />
                            Batal
                        </Button>
                    )}
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? (
                            <>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    className="w-4 h-4 mr-2"
                                >
                                    <Save className="w-4 h-4" />
                                </motion.div>
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Simpan Template
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Alerts */}
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {saveSuccess && (
                <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                        Template berhasil disimpan!
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel - Canvas */}
                <div className="lg:col-span-2 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="w-5 h-5" />
                                Preview Template
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Canvas */}
                            <div className="flex justify-center bg-gray-100 p-4 rounded-lg">
                                <div
                                    ref={canvasRef}
                                    className="relative bg-white shadow-2xl"
                                    style={{
                                        width: `${canvasSize.width}px`,
                                        height: `${canvasSize.height}px`,
                                        backgroundColor: settings.backgroundColor,
                                        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        cursor: isDragging ? 'grabbing' : 'default'
                                    }}
                                >
                                    {/* Placeholders */}
                                    {placeholders.map((placeholder) => {
                                        const sampleText = AVAILABLE_PLACEHOLDERS.find(
                                            p => p.key === placeholder.key
                                        )?.sample || placeholder.label;

                                        return (
                                            <motion.div
                                                key={placeholder.key}
                                                className={`absolute cursor-move select-none ${
                                                    selectedPlaceholder === placeholder.key
                                                        ? 'ring-2 ring-primary ring-offset-2'
                                                        : ''
                                                }`}
                                                style={{
                                                    left: `${placeholder.x * scale}px`,
                                                    top: `${placeholder.y * scale}px`,
                                                    transform: 'translate(-50%, -50%)',
                                                    fontSize: `${placeholder.fontSize * scale}px`,
                                                    fontFamily: placeholder.fontFamily,
                                                    color: placeholder.color,
                                                    textAlign: placeholder.align,
                                                    maxWidth: placeholder.maxWidth ? `${placeholder.maxWidth * scale}px` : 'none',
                                                    fontWeight: 'bold',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    backgroundColor: selectedPlaceholder === placeholder.key
                                                        ? 'rgba(255, 255, 255, 0.9)'
                                                        : 'transparent'
                                                }}
                                                onMouseDown={(e) => handlePlaceholderDrag(placeholder.key, e)}
                                                onClick={() => setSelectedPlaceholder(placeholder.key)}
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                {sampleText}
                                            </motion.div>
                                        );
                                    })}

                                    {/* Empty State */}
                                    {placeholders.length === 0 && !backgroundImage && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center text-muted-foreground">
                                                <Upload className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                                <p>Upload background dan tambahkan placeholder</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Panel - Controls */}
                <div className="space-y-4">
                    <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="basic">Basic</TabsTrigger>
                            <TabsTrigger value="placeholders">Placeholders</TabsTrigger>
                            <TabsTrigger value="style">Style</TabsTrigger>
                        </TabsList>

                        {/* Basic Tab */}
                        <TabsContent value="basic" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Informasi Template</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="templateName">Nama Template</Label>
                                        <Input
                                            id="templateName"
                                            value={templateName}
                                            onChange={(e) => setTemplateName(e.target.value)}
                                            placeholder="e.g., Modern Certificate"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="templateDescription">Deskripsi</Label>
                                        <Input
                                            id="templateDescription"
                                            value={templateDescription}
                                            onChange={(e) => setTemplateDescription(e.target.value)}
                                            placeholder="Deskripsi template"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Background Image</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleBackgroundUpload}
                                                className="flex-1"
                                            />
                                            {backgroundImage && (
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => {
                                                        setBackgroundImage(null);
                                                        setBackgroundFile(null);
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Recommended: 1200x900px, Max 5MB
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bgColor">Background Color</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="bgColor"
                                                type="color"
                                                value={settings.backgroundColor}
                                                onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                                                className="w-20 h-10"
                                            />
                                            <Input
                                                value={settings.backgroundColor}
                                                onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                                                placeholder="#ffffff"
                                                className="flex-1"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Placeholders Tab */}
                        <TabsContent value="placeholders" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Tambah Placeholder</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {AVAILABLE_PLACEHOLDERS.map((placeholder) => {
                                        const isAdded = placeholders.some(p => p.key === placeholder.key);
                                        return (
                                            <Button
                                                key={placeholder.key}
                                                variant={isAdded ? "secondary" : "outline"}
                                                className="w-full justify-start"
                                                onClick={() => !isAdded && addPlaceholder(placeholder)}
                                                disabled={isAdded}
                                            >
                                                {isAdded ? (
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                ) : (
                                                    <Plus className="w-4 h-4 mr-2" />
                                                )}
                                                {placeholder.label}
                                            </Button>
                                        );
                                    })}
                                </CardContent>
                            </Card>

                            {/* Placeholder List */}
                            {placeholders.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Active Placeholders</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {placeholders.map((placeholder) => (
                                            <div
                                                key={placeholder.key}
                                                className={`flex items-center justify-between p-2 rounded border ${
                                                    selectedPlaceholder === placeholder.key
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-border'
                                                }`}
                                                onClick={() => setSelectedPlaceholder(placeholder.key)}
                                            >
                                                <span className="text-sm font-medium">{placeholder.label}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removePlaceholder(placeholder.key);
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>

                        {/* Style Tab */}
                        <TabsContent value="style" className="space-y-4">
                            {selectedPlaceholderData ? (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">
                                            Style: {selectedPlaceholderData.label}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Font Size: {selectedPlaceholderData.fontSize}px</Label>
                                            <Input
                                                type="range"
                                                min="12"
                                                max="72"
                                                value={selectedPlaceholderData.fontSize}
                                                onChange={(e) => updatePlaceholder(selectedPlaceholderData.key, {
                                                    fontSize: parseInt(e.target.value)
                                                })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Font Family</Label>
                                            <Select
                                                value={selectedPlaceholderData.fontFamily}
                                                onValueChange={(value) => updatePlaceholder(selectedPlaceholderData.key, {
                                                    fontFamily: value
                                                })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {FONT_FAMILIES.map((font) => (
                                                        <SelectItem key={font} value={font}>
                                                            {font}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Text Color</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="color"
                                                    value={selectedPlaceholderData.color}
                                                    onChange={(e) => updatePlaceholder(selectedPlaceholderData.key, {
                                                        color: e.target.value
                                                    })}
                                                    className="w-20 h-10"
                                                />
                                                <Input
                                                    value={selectedPlaceholderData.color}
                                                    onChange={(e) => updatePlaceholder(selectedPlaceholderData.key, {
                                                        color: e.target.value
                                                    })}
                                                    className="flex-1"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Text Alignment</Label>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant={selectedPlaceholderData.align === 'left' ? 'default' : 'outline'}
                                                    size="icon"
                                                    onClick={() => updatePlaceholder(selectedPlaceholderData.key, { align: 'left' })}
                                                >
                                                    <AlignLeft className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant={selectedPlaceholderData.align === 'center' ? 'default' : 'outline'}
                                                    size="icon"
                                                    onClick={() => updatePlaceholder(selectedPlaceholderData.key, { align: 'center' })}
                                                >
                                                    <AlignCenter className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant={selectedPlaceholderData.align === 'right' ? 'default' : 'outline'}
                                                    size="icon"
                                                    onClick={() => updatePlaceholder(selectedPlaceholderData.key, { align: 'right' })}
                                                >
                                                    <AlignRight className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Position</Label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <Label className="text-xs">X: {Math.round(selectedPlaceholderData.x)}</Label>
                                                    <Input
                                                        type="number"
                                                        value={Math.round(selectedPlaceholderData.x)}
                                                        onChange={(e) => updatePlaceholder(selectedPlaceholderData.key, {
                                                            x: parseInt(e.target.value) || 0
                                                        })}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-xs">Y: {Math.round(selectedPlaceholderData.y)}</Label>
                                                    <Input
                                                        type="number"
                                                        value={Math.round(selectedPlaceholderData.y)}
                                                        onChange={(e) => updatePlaceholder(selectedPlaceholderData.key, {
                                                            y: parseInt(e.target.value) || 0
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card>
                                    <CardContent className="py-8 text-center text-muted-foreground">
                                        <Type className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p>Pilih placeholder untuk edit style</p>
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
