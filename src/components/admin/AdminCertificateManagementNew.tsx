'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, Palette } from 'lucide-react';
import { CertificateTemplateManagerV2 } from './CertificateTemplateManagerV2';
import { AdminCertificateManagement } from './AdminCertificateManagement';

export function AdminCertificateManagementNew() {
    return (
        <div className="space-y-6">
            <Tabs defaultValue="generate" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="generate" className="flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Generate Sertifikat
                    </TabsTrigger>
                    <TabsTrigger value="templates" className="flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Kelola Template
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="generate">
                    <AdminCertificateManagement />
                </TabsContent>

                <TabsContent value="templates">
                    <CertificateTemplateManagerV2 />
                </TabsContent>
            </Tabs>
        </div>
    );
}
