'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Download, Check, Sparkles } from 'lucide-react';

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

interface TemplatePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    template: {
        id: string;
        name: string;
        description: string;
        thumbnail: string;
        thumbnailUrl?: string;
        isDefault: boolean;
        category: string;
        placeholders: PlaceholderConfig[];
    } | null;
    onSelect?: (templateId: string) => void;
}

export function TemplatePreviewModal({ 
    isOpen, 
    onClose, 
    template,
    onSelect 
}: TemplatePreviewModalProps) {
    if (!isOpen || !template) return null;

    const handleSelect = () => {
        if (onSelect) {
            onSelect(template.id);
        }
        onClose();
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Card className="border-border shadow-2xl">
                        <CardHeader className="border-b border-border">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <CardTitle className="text-2xl">{template.name}</CardTitle>
                                        {template.isDefault && (
                                            <Badge variant="secondary" className="text-xs">
                                                <Sparkles className="w-3 h-3 mr-1" />
                                                Default
                                            </Badge>
                                        )}
                                        <Badge variant="outline" className="text-xs capitalize">
                                            {template.category}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {template.description}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onClose}
                                    className="ml-4"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6">
                            {/* Template Preview */}
                            <div className="mb-6">
                                <h3 className="text-sm font-medium mb-3">Preview Template</h3>
                                <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center overflow-hidden border border-border">
                                    {(template.thumbnailUrl || template.thumbnail) ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={template.thumbnailUrl || template.thumbnail}
                                            alt={template.name}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <div className="text-center text-muted-foreground">
                                            <p className="text-sm">Preview tidak tersedia</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Placeholders */}
                            <div className="mb-6">
                                <h3 className="text-sm font-medium mb-3">Placeholder yang Tersedia</h3>
                                <div className="flex flex-wrap gap-2">
                                    {template.placeholders.map((placeholder, idx) => (
                                        <Badge key={idx} variant="outline" className="font-mono text-xs">
                                            {`{{${placeholder.key}}}`}
                                        </Badge>
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Placeholder ini akan otomatis diganti dengan data peserta saat generate sertifikat
                                </p>
                            </div>

                            {/* Sample Data Preview */}
                            <div className="mb-6">
                                <h3 className="text-sm font-medium mb-3">Contoh Data</h3>
                                <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Nama:</span>
                                        <span className="font-medium">John Doe</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Event:</span>
                                        <span className="font-medium">Workshop React Advanced 2024</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Tanggal:</span>
                                        <span className="font-medium">15 Januari 2024</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Nomor Sertifikat:</span>
                                        <span className="font-medium font-mono">CERT-2024-A1B2C3D4</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={onClose}
                                    className="flex-1"
                                >
                                    Tutup
                                </Button>
                                {onSelect && (
                                    <Button
                                        onClick={handleSelect}
                                        className="flex-1 bg-primary hover:bg-primary/90"
                                    >
                                        <Check className="w-4 h-4 mr-2" />
                                        Pilih Template Ini
                                    </Button>
                                )}
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        // Download template logic
                                    }}
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
