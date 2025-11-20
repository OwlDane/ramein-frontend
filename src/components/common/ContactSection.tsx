import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';    
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone } from 'lucide-react';

export function ContactSection() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert('Pesan berhasil dikirim! Kami akan membalas dalam 24 jam.');
            setFormData({ name: '', email: '', message: '' });
        } catch {
            console.error('Failed to send message');
            alert('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left Side - Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="order-2 lg:order-1"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Nama
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Nama lengkap"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="w-full h-12 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Email
                                </label>
                                <Input
                                    type="email"
                                    placeholder="email@example.com"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="w-full h-12 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Pesan
                                </label>
                                <Textarea
                                    placeholder="Tuliskan pesanmu di sini..."
                                    value={formData.message}
                                    onChange={(e) => handleInputChange('message', e.target.value)}
                                    className="w-full min-h-[120px] px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 resize-none bg-white"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors duration-300 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
                            </Button>
                        </form>
                    </motion.div>

                    {/* Right Side - Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="order-1 lg:order-2"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Memiliki Pertanyaan Khusus? Jangan Ragu Menghubungi Kami!
                        </h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Punya pertanyaan, masukan, atau sekadar ingin menyapa? Isi form di samping dan hubungi kami. Kami akan segera merespons!
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-green-600" />
                                <div>
                                    <p className="font-medium text-gray-900">Email</p>
                                    <p className="text-gray-600">ramein@halo.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-green-600" />
                                <div>
                                    <p className="font-medium text-gray-900">Nomor Telepon</p>
                                    <p className="text-gray-600">+62 812 9510 1836</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
