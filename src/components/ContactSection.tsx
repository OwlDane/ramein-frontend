import React, { useState } from 'react';
import { motion} from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import {
    Mail, Phone, MapPin, Send, MessageCircle,
    Clock, Globe, Users, Award, Sparkles,
    ChevronDown, HelpCircle
} from 'lucide-react';
import { toast } from 'sonner';

export function ContactSection() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            toast.success('Pesan berhasil dikirim! Kami akan membalas dalam 24 jam.');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch {
            toast.error('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const contactInfo = [
        {
            icon: Mail,
            title: 'Email Us',
            description: 'Kirim email langsung ke tim kami',
            value: 'hello@ramein.com',
            color: 'text-blue-500'
        },
        {
            icon: Phone,
            title: 'Call Us',
            description: 'Hubungi kami via telepon',
            value: '+62 21 1234 5678',
            color: 'text-green-500'
        },
        {
            icon: MapPin,
            title: 'Visit Us',
            description: 'Kantor pusat di Jakarta',
            value: 'Jakarta, Indonesia',
            color: 'text-red-500'
        },
        {
            icon: MessageCircle,
            title: 'Live Chat',
            description: 'Chat langsung dengan support',
            value: 'Online 24/7',
            color: 'text-purple-500'
        }
    ];

    const stats = [
        { icon: Users, value: '50K+', label: 'Happy Customers' },
        { icon: Award, value: '1000+', label: 'Events Hosted' },
        { icon: Globe, value: '25+', label: 'Cities Covered' },
        { icon: Clock, value: '24/7', label: 'Support' }
    ];

    const faqs = [
        {
            question: 'Bagaimana cara mendaftar event di Ramein?',
            answer: 'Anda bisa mendaftar dengan mudah melalui website kami. Pilih event yang diinginkan, klik "Daftar Sekarang", dan ikuti langkah-langkah pembayaran. Setelah berhasil, Anda akan menerima konfirmasi dan token event via email.'
        },
        {
            question: 'Apakah saya bisa membatalkan pendaftaran?',
            answer: 'Ya, Anda bisa membatalkan pendaftaran hingga 7 hari sebelum event dimulai dengan pengembalian dana 100%. Untuk pembatalan kurang dari 7 hari, akan dikenakan biaya administrasi 10%.'
        },
        {
            question: 'Bagaimana sistem sertifikat bekerja?',
            answer: 'Sertifikat digital akan diterbitkan otomatis setelah Anda menyelesaikan event dengan tingkat kehadiran minimal 80%. Sertifikat dapat diunduh melalui dashboard Anda dalam 1x24 jam setelah event berakhir.'
        },
        {
            question: 'Apakah ada syarat khusus untuk mengikuti event?',
            answer: 'Syarat berbeda untuk setiap event. Umumnya hanya memerlukan laptop/perangkat yang mendukung, koneksi internet stabil, dan semangat belajar. Syarat detail tercantum di halaman deskripsi masing-masing event.'
        },
        {
            question: 'Bagaimana jika saya memiliki kendala teknis saat event?',
            answer: 'Tim support teknis kami siap membantu 24/7 selama event berlangsung. Anda bisa menghubungi melalui live chat, WhatsApp, atau email untuk mendapat bantuan langsung.'
        },
        {
            question: 'Apakah materi event bisa diakses setelah selesai?',
            answer: 'Ya, semua peserta mendapat akses seumur hidup ke materi event termasuk rekaman, slide presentasi, dan resources tambahan melalui platform learning kami.'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut" as const
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-accent/30 to-muted/50">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-16 lg:py-24">
                <div className="absolute inset-0 opacity-5">
                    <motion.div
                        className="absolute inset-0"
                        animate={{
                            backgroundPosition: ['0% 0%', '100% 100%'],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            repeatType: 'reverse'
                        }}
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                            backgroundSize: '60px 60px'
                        }}
                    />
                </div>

                <div className="container mx-auto px-4 relative">
                    <motion.div
                        className="text-center mb-12 lg:mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div
                            className="inline-flex items-center gap-2 mb-6"
                            whileHover={{ scale: 1.05 }}
                        >
                            <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-primary" />
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-foreground font-bold tracking-tight mobile-text-2xl">
                                Get In <span className="text-primary">Touch</span>
                            </h1>
                        </motion.div>
                        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mobile-text-base">
                            Punya pertanyaan tentang event? Ingin berkolaborasi?
                            Tim kami siap membantu mewujudkan acara impian Anda.
                        </p>
                    </motion.div>

                    {/* Stats Row */}
                    <motion.div
                        className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-16"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                                className="text-center"
                            >
                                <Card className="p-4 lg:p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
                                    <CardContent className="p-0">
                                        <motion.div
                                            className="w-10 h-10 lg:w-12 lg:h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3 lg:mb-4"
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <stat.icon className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                                        </motion.div>
                                        <motion.div
                                            className="text-2xl lg:text-3xl font-bold text-foreground mb-1 lg:mb-2 mobile-text-xl"
                                            initial={{ opacity: 0, scale: 0 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
                                        >
                                            {stat.value}
                                        </motion.div>
                                        <p className="text-sm lg:text-base text-muted-foreground mobile-text-sm">{stat.label}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Main Content */}
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-16 lg:mb-24">
                        {/* Contact Form */}
                        <motion.div
                            variants={itemVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <Card className="p-6 lg:p-8 bg-card/80 backdrop-blur-sm border-border/50 shadow-xl">
                                <CardContent className="p-0">
                                    <div className="mb-6 lg:mb-8">
                                        <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-3 lg:mb-4 mobile-text-xl">
                                            Send us a Message
                                        </h2>
                                        <p className="text-muted-foreground text-base lg:text-lg mobile-text-sm">
                                            Isi form di bawah dan kami akan merespons secepat mungkin
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                                                <label className="block text-sm font-medium text-foreground mb-2">
                                                    Nama Lengkap
                                                </label>
                                                <Input
                                                    type="text"
                                                    placeholder="Masukkan nama Anda"
                                                    value={formData.name}
                                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                                    className="h-10 lg:h-12 text-sm lg:text-base border-border focus:border-primary transition-colors mobile-text-sm"
                                                    required
                                                />
                                            </motion.div>

                                            <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                                                <label className="block text-sm font-medium text-foreground mb-2">
                                                    Email
                                                </label>
                                                <Input
                                                    type="email"
                                                    placeholder="nama@email.com"
                                                    value={formData.email}
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                                    className="h-10 lg:h-12 text-sm lg:text-base border-border focus:border-primary transition-colors mobile-text-sm"
                                                    required
                                                />
                                            </motion.div>
                                        </div>

                                        <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Subject
                                            </label>
                                            <Input
                                                type="text"
                                                placeholder="Topik pesan Anda"
                                                value={formData.subject}
                                                onChange={(e) => handleInputChange('subject', e.target.value)}
                                                className="h-10 lg:h-12 text-sm lg:text-base border-border focus:border-primary transition-colors mobile-text-sm"
                                                required
                                            />
                                        </motion.div>

                                        <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Pesan
                                            </label>
                                            <Textarea
                                                placeholder="Tulis pesan Anda di sini..."
                                                value={formData.message}
                                                onChange={(e) => handleInputChange('message', e.target.value)}
                                                className="min-h-[100px] lg:min-h-[120px] text-sm lg:text-base border-border focus:border-primary transition-colors resize-none mobile-text-sm"
                                                required
                                            />
                                        </motion.div>

                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full h-10 lg:h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 text-sm lg:text-base mobile-text-sm"
                                            >
                                                {isSubmitting ? (
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        className="w-4 h-4 lg:w-5 lg:h-5 border-2 border-current border-t-transparent rounded-full mr-2"
                                                    />
                                                ) : (
                                                    <Send className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                                                )}
                                                {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
                                            </Button>
                                        </motion.div>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Contact Information */}
                        <motion.div
                            className="space-y-6"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <motion.div variants={itemVariants} className="mb-6 lg:mb-8">
                                <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-3 lg:mb-4 mobile-text-xl">
                                    Contact Information
                                </h2>
                                <p className="text-muted-foreground text-base lg:text-lg leading-relaxed mobile-text-sm">
                                    Kami selalu terbuka untuk diskusi tentang event, partnership,
                                    atau pertanyaan lainnya. Jangan ragu untuk menghubungi kami!
                                </p>
                            </motion.div>

                            <div className="space-y-3 lg:space-y-4">
                                {contactInfo.map((info, index) => (
                                    <motion.div
                                        key={index}
                                        variants={itemVariants}
                                        whileHover={{ x: 10, scale: 1.02 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Card className="p-4 lg:p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 cursor-pointer">
                                            <CardContent className="p-0">
                                                <div className="flex items-start gap-3 lg:gap-4">
                                                    <motion.div
                                                        className="w-10 h-10 lg:w-12 lg:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0"
                                                        whileHover={{ rotate: 360 }}
                                                        transition={{ duration: 0.6 }}
                                                    >
                                                        <info.icon className={`w-5 h-5 lg:w-6 lg:h-6 ${info.color}`} />
                                                    </motion.div>
                                                    <div className="flex-1">
                                                        <h3 className="text-lg lg:text-xl font-medium text-foreground mb-1 mobile-text-base">
                                                            {info.title}
                                                        </h3>
                                                        <p className="text-muted-foreground text-sm lg:text-base mb-2 mobile-text-sm">
                                                            {info.description}
                                                        </p>
                                                        <p className="text-foreground font-medium text-sm lg:text-base mobile-text-sm">
                                                            {info.value}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* FAQ Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mb-16 lg:mb-24"
                    >
                        <div className="text-center mb-8 lg:mb-12">
                            <motion.div
                                className="inline-flex items-center gap-2 mb-6"
                                whileHover={{ scale: 1.05 }}
                            >
                                <HelpCircle className="w-6 h-6 lg:w-8 lg:h-8 text-primary" />
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl text-foreground font-bold tracking-tight mobile-text-xl">
                                    Frequently Asked <span className="text-primary">Questions</span>
                                </h2>
                            </motion.div>
                            <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mobile-text-sm">
                                Temukan jawaban untuk pertanyaan yang sering diajukan tentang platform kami
                            </p>
                        </div>

                        <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-xl overflow-hidden">
                            <CardContent className="p-0">
                                <Accordion type="single" collapsible className="w-full">
                                    {faqs.map((faq, index) => (
                                        <AccordionItem
                                            key={index}
                                            value={`item-${index}`}
                                            className="border-b border-border/50 last:border-b-0"
                                        >
                                            <AccordionTrigger className="px-4 lg:px-6 py-4 lg:py-6 text-left hover:bg-accent/50 transition-colors group">
                                                <div className="flex items-center gap-3 lg:gap-4 text-base lg:text-lg font-medium text-foreground mobile-text-sm">
                                                    <motion.div
                                                        className="w-8 h-8 lg:w-10 lg:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors"
                                                        whileHover={{ rotate: 180 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <ChevronDown className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                                                    </motion.div>
                                                    <span className="leading-relaxed">{faq.question}</span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="px-4 lg:px-6 pb-4 lg:pb-6">
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="ml-11 lg:ml-14 text-sm lg:text-base text-muted-foreground leading-relaxed mobile-text-sm"
                                                >
                                                    {faq.answer}
                                                </motion.div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Bottom CTA */}
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20 p-6 lg:p-8">
                            <CardContent className="p-0">
                                <motion.div
                                    className="w-12 h-12 lg:w-16 lg:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6"
                                    whileHover={{ scale: 1.1, rotate: 360 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <Clock className="w-6 h-6 lg:w-8 lg:h-8 text-primary" />
                                </motion.div>
                                <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-2 lg:mb-3 mobile-text-lg">
                                    Quick Response Guarantee
                                </h3>
                                <p className="text-muted-foreground text-base lg:text-lg mobile-text-sm">
                                    Kami berkomitmen untuk merespons semua pertanyaan dalam waktu 24 jam
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}