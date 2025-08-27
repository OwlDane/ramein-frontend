import React, { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
    Calendar, MapPin, Users, Star, Share2, Heart,
    ArrowLeft, Check, Target, BookOpen, Sparkles,
    ChevronRight, Mail, Phone, Globe
} from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { toast } from 'react-hot-toast';

interface EventDetailProps {
    eventId: string | null;
    isLoggedIn: boolean;
    onAuthRequired: () => void;
    onBack: () => void;
}

export function EventDetail({ eventId, isLoggedIn, onAuthRequired, onBack }: EventDetailProps) {
    const [isRegistered, setIsRegistered] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [event, setEvent] = useState<any>({
        id: eventId || '1',
        title: 'Memuat...',
        subtitle: 'Master Modern React Development',
        description: '',
        fullDescription: `
            <h3>Tentang Workshop</h3>
            <p>Workshop intensif 2 hari ini dirancang khusus untuk developer yang ingin menguasai React dengan level advanced. Anda akan belajar langsung dari praktisi berpengalaman dengan studi kasus real-world.</p>
            
            <h3>Yang Akan Anda Pelajari</h3>
            ul>
                <li>Advanced React Hooks (useCallback, useMemo, useReducer)</li>
                <li>Context API dan State Management</li>
                <li>Performance Optimization Techniques</li>
                <li>Testing React Applications</li>
                <li>Server-side Rendering dengan Next.js</li>
                <li>Deployment Best Practices</li>
            </ul>

            <h3>Prerequisites</h3>
            <p>Peserta diharapkan sudah memiliki pengalaman dasar dengan React dan JavaScript ES6+.</p>`,
        date: '2025-01-15',
        endDate: '2025-01-16',
        time: '09:00',
        endTime: '17:00',
        location: 'Jakarta Convention Center',
        fullAddress: 'Jl. Gatot Subroto No.Kav. 18, RT.6/RW.1, Kuningan, Setia Budi, Kota Jakarta Selatan, DKI Jakarta 12980',
        category: 'General',
        price: 0,
        originalPrice: 1000000,
        maxParticipants: 100,
        currentParticipants: 75,
        image: 'https://picsum.photos/seed/placeholder/800/450',
        gallery: [
            'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800',
            'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800',
            'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
            'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800'
        ],
        organizer: {
            name: 'Tech Indonesia',
            logo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100',
            description: 'Leading technology education provider in Indonesia',
            rating: 4.8,
            totalEvents: 150,
            followers: 25000,
            website: 'https://techindonesia.com',
            email: 'info@techindonesia.com',
            phone: '+62 21 1234 5678',
            social: {
                instagram: '@techindonesia',
                twitter: '@techindonesia',
                linkedin: 'tech-indonesia'
            }
        },
        instructors: [
            {
                name: 'John Doe',
                title: 'Senior React Developer',
                company: 'Google',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
                bio: '8+ years experience in React development',
                expertise: ['React', 'Next.js', 'TypeScript']
            },
            {
                name: 'Jane Smith',
                title: 'Frontend Architect',
                company: 'Meta',
                avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c5b4?w=100',
                bio: 'Expert in performance optimization and scalable architectures',
                expertise: ['Performance', 'Architecture', 'Testing']
            }
        ],
        tags: ['React', 'JavaScript', 'Frontend', 'Advanced', 'Hands-on'],
        highlights: [
            '2 Days Intensive Workshop',
            'Real-world Projects',
            'Certificate of Completion',
            'Lifetime Access to Materials',
            'Q&A with Experts',
            'Networking Session'
        ],
        schedule: [
            {
                day: 'Day 1',
                date: '15 Jan 2025',
                sessions: [
                    { time: '09:00-10:30', title: 'Advanced Hooks & Patterns', type: 'Theory' },
                    { time: '10:45-12:00', title: 'Hands-on: Custom Hooks', type: 'Practical' },
                    { time: '13:00-14:30', title: 'State Management Deep Dive', type: 'Theory' },
                    { time: '14:45-16:00', title: 'Context API Workshop', type: 'Practical' },
                    { time: '16:15-17:00', title: 'Q&A and Networking', type: 'Discussion' }
                ]
            },
            {
                day: 'Day 2',
                date: '16 Jan 2025',
                sessions: [
                    { time: '09:00-10:30', title: 'Performance Optimization', type: 'Theory' },
                    { time: '10:45-12:00', title: 'Testing Strategies', type: 'Practical' },
                    { time: '13:00-14:30', title: 'Next.js & SSR', type: 'Theory' },
                    { time: '14:45-16:00', title: 'Build & Deploy', type: 'Practical' },
                    { time: '16:15-17:00', title: 'Certification & Closing', type: 'Ceremony' }
                ]
            }
        ],
        reviews: [
            {
                name: 'Ahmad Rizki',
                rating: 5,
                comment: 'Workshop yang sangat comprehensive! Instruktur sangat berpengalaman dan materinya up-to-date.',
                date: '2024-12-10',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50'
            },
            {
                name: 'Sari Dewi',
                rating: 5,
                comment: 'Best investment untuk skill development. Sekarang saya lebih confident dengan React.',
                date: '2024-12-08',
                avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c5b4?w=50'
            }
        ],
        requirements: [
            'Laptop dengan Node.js terinstall',
            'Text editor (VS Code recommended)',
            'Basic knowledge of React',
            'Understanding of JavaScript ES6+',
            'Git knowledge (basic)'
        ],
        benefits: [
            'Certificate of completion',
            'Lifetime access to materials',
            'Access to private community',
            'Job referral opportunities',
            'Follow-up mentoring session'
        ]
    });

    useEffect(() => {
        const run = async () => {
            if (!eventId) return;
            setLoading(true);
            setError('');
            try {
                const data = await apiFetch<any>(`/events/${eventId}`);
                setEvent((prev: any) => ({
                    ...prev,
                    id: data.id,
                    title: data.title,
                    description: data.description,
                    date: data.date,
                    time: data.time,
                    location: data.location,
                    category: (data as any).category || 'General',
                    price: Number((data as any).price ?? 0),
                    image: (data.flyer && data.flyer.startsWith('http')) ? data.flyer : `https://picsum.photos/seed/${data.id}/800/450`
                }));
            } catch (e: any) {
                setError(e?.message || 'Gagal memuat detail event');
            } finally {
                setLoading(false);
            }
        };
        run();
    }, [eventId]);

    const handleRegister = () => {
        if (!isLoggedIn) {
            onAuthRequired();
            return;
        }

        setIsRegistered(true);
        toast.success('Pendaftaran berhasil! Token akan dikirim ke email Anda.');
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: event.title,
                    text: event.description,
                    url: window.location.href,
                });
            } catch {
                // Share cancelled - do nothing
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link berhasil disalin!');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const availability = ((event.maxParticipants - event.currentParticipants) / event.maxParticipants) * 100;
    const discount = ((event.originalPrice - event.price) / event.originalPrice) * 100;

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
        hidden: { opacity: 0, y: 20 },
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
        <div className="min-h-screen bg-background">
            {/* Header with Back Button */}
            <motion.div
                className="bg-card border-b border-border sticky top-16 z-10"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <div className="container mx-auto px-4 py-4">
                    <motion.button
                        onClick={onBack}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
                        whileHover={{ x: -5 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="text-base font-medium">Kembali ke Event</span>
                    </motion.button>
                </div>
            </motion.div>

            <div className="container mx-auto px-4 py-8">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid lg:grid-cols-3 gap-8"
                >
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Hero Section */}
                        <motion.div variants={itemVariants}>
                            <Card className="overflow-hidden border-border shadow-xl">
                                <div className="relative h-96">
                                    <ImageWithFallback
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                    {/* Floating Action Buttons */}
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <motion.button
                                            onClick={() => setIsFavorited(!isFavorited)}
                                            className={`w-10 h-10 rounded-full backdrop-blur-sm border transition-colors ${isFavorited
                                                ? 'bg-red-500 border-red-500 text-white'
                                                : 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                                                }`}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <Heart className={`w-5 h-5 mx-auto ${isFavorited ? 'fill-current' : ''}`} />
                                        </motion.button>

                                        <motion.button
                                            onClick={handleShare}
                                            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-colors"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <Share2 className="w-5 h-5 mx-auto" />
                                        </motion.button>
                                    </div>

                                    {/* Category Badge */}
                                    <div className="absolute top-4 left-4">
                                        <Badge className="bg-primary text-primary-foreground">
                                            {event.category}
                                        </Badge>
                                    </div>

                                    {/* Title Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                        <motion.h1
                                            className="text-4xl lg:text-5xl mb-2 font-bold tracking-tight"
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            {event.title}
                                        </motion.h1>
                                        <motion.p
                                            className="text-xl text-white/90"
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            {event.subtitle}
                                        </motion.p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Key Info Cards */}
                        <motion.div variants={itemVariants} className="grid md:grid-cols-4 gap-4">
                            {[
                                { icon: Calendar, title: 'Tanggal', value: formatDate(event.date), subvalue: `${event.time} - ${event.endTime} WIB` },
                                { icon: MapPin, title: 'Lokasi', value: event.location, subvalue: 'Jakarta Convention Center' },
                                { icon: Users, title: 'Peserta', value: `${event.currentParticipants}/${event.maxParticipants}`, subvalue: `${event.maxParticipants - event.currentParticipants} slot tersisa` },
                                { icon: Star, title: 'Rating', value: event.organizer.rating.toString(), subvalue: `${event.organizer.totalEvents} events` }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Card className="text-center p-4 border-border hover:shadow-lg transition-all duration-200">
                                        <CardContent className="p-0">
                                            <motion.div
                                                className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3"
                                                whileHover={{ rotate: 360 }}
                                                transition={{ duration: 0.6 }}
                                            >
                                                <item.icon className="w-6 h-6 text-primary" />
                                            </motion.div>
                                            <h3 className="text-base font-medium text-muted-foreground mb-1">{item.title}</h3>
                                            <p className="text-lg font-bold text-foreground">{item.value}</p>
                                            <p className="text-sm text-muted-foreground">{item.subvalue}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Tabs Content */}
                        <motion.div variants={itemVariants}>
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-4 h-12 bg-muted/50">
                                    <TabsTrigger value="overview" className="text-base">Overview</TabsTrigger>
                                    <TabsTrigger value="schedule" className="text-base">Jadwal</TabsTrigger>
                                    <TabsTrigger value="instructor" className="text-base">Instruktur</TabsTrigger>
                                    <TabsTrigger value="reviews" className="text-base">Review</TabsTrigger>
                                </TabsList>

                                <TabsContent value="overview" className="mt-6 space-y-6">
                                    <Card className="border-border">
                                        <CardHeader>
                                            <h3 className="text-2xl font-bold">Tentang Event</h3>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                                                {event.description}
                                            </p>

                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <h4 className="text-xl font-medium mb-4 flex items-center gap-2">
                                                        <Target className="w-5 h-5 text-primary" />
                                                        Highlights
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {event.highlights.map((highlight, index) => (
                                                            <motion.li
                                                                key={index}
                                                                className="flex items-center gap-2 text-base text-foreground"
                                                                initial={{ opacity: 0, x: -20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: index * 0.1 + 0.5 }}
                                                            >
                                                                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                                                                <span>{highlight}</span>
                                                            </motion.li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div>
                                                    <h4 className="text-xl font-medium mb-4 flex items-center gap-2">
                                                        <BookOpen className="w-5 h-5 text-primary" />
                                                        Requirements
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {event.requirements.map((req, index) => (
                                                            <motion.li
                                                                key={index}
                                                                className="flex items-start gap-2 text-base text-muted-foreground"
                                                                initial={{ opacity: 0, x: -20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: index * 0.1 + 0.7 }}
                                                            >
                                                                <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                                                <span>{req}</span>
                                                            </motion.li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="schedule" className="mt-6">
                                    <div className="space-y-6">
                                        {event.schedule.map((day, dayIndex) => (
                                            <motion.div
                                                key={day.day}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: dayIndex * 0.2 }}
                                            >
                                                <Card className="border-border">
                                                    <CardHeader>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                                                <Calendar className="w-6 h-6 text-primary" />
                                                            </div>
                                                            <div>
                                                                <h3 className="text-xl font-bold">{day.day}</h3>
                                                                <p className="text-muted-foreground">{day.date}</p>
                                                            </div>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="space-y-4">
                                                            {day.sessions.map((session, sessionIndex) => (
                                                                <motion.div
                                                                    key={sessionIndex}
                                                                    className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg"
                                                                    whileHover={{ scale: 1.02 }}
                                                                    transition={{ duration: 0.2 }}
                                                                >
                                                                    <div className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap">
                                                                        {session.time}
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <h4 className="text-lg font-medium text-foreground">{session.title}</h4>
                                                                        <Badge variant="outline" className="mt-2 text-sm">
                                                                            {session.type}
                                                                        </Badge>
                                                                    </div>
                                                                </motion.div>
                                                            ))}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="instructor" className="mt-6">
                                    <div className="grid gap-6">
                                        {event.instructors.map((instructor, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.2 }}
                                            >
                                                <Card className="border-border">
                                                    <CardContent className="p-6">
                                                        <div className="flex items-start gap-4">
                                                            <Avatar className="w-16 h-16">
                                                                <AvatarImage src={instructor.avatar} alt={instructor.name} />
                                                                <AvatarFallback>{instructor.name.charAt(0)}</AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex-1">
                                                                <h3 className="text-xl font-bold text-foreground">{instructor.name}</h3>
                                                                <p className="text-lg text-primary font-medium">{instructor.title}</p>
                                                                <p className="text-base text-muted-foreground mb-3">{instructor.company}</p>
                                                                <p className="text-base text-foreground mb-4">{instructor.bio}</p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {instructor.expertise.map((skill, skillIndex) => (
                                                                        <Badge key={skillIndex} variant="secondary">
                                                                            {skill}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="reviews" className="mt-6">
                                    <div className="space-y-6">
                                        {event.reviews.map((review, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <Card className="border-border">
                                                    <CardContent className="p-6">
                                                        <div className="flex items-start gap-4">
                                                            <Avatar>
                                                                <AvatarImage src={review.avatar} alt={review.name} />
                                                                <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <h4 className="text-lg font-medium">{review.name}</h4>
                                                                    <div className="flex gap-1">
                                                                        {[...Array(review.rating)].map((_, i) => (
                                                                            <Star key={i} className="w-4 h-4 fill-current text-yellow-500" />
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <p className="text-base text-foreground mb-2">{review.comment}</p>
                                                                <p className="text-sm text-muted-foreground">{review.date}</p>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Registration Card */}
                        <motion.div variants={itemVariants}>
                            <Card className="border-border shadow-xl sticky top-32">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-3xl font-bold text-primary">{formatPrice(event.price)}</span>
                                                {discount > 0 && (
                                                    <span className="text-xl text-muted-foreground line-through">{formatPrice(event.originalPrice)}</span>
                                                )}
                                            </div>
                                            {discount > 0 && (
                                                <Badge className="bg-primary text-primary-foreground mt-2">
                                                    Hemat {Math.round(discount)}%
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Availability */}
                                    <div>
                                        <div className="flex justify-between text-base mb-2">
                                            <span className="text-muted-foreground">Ketersediaan</span>
                                            <span className="font-medium">{event.maxParticipants - event.currentParticipants} slot</span>
                                        </div>
                                        <Progress value={availability} className="h-2" />
                                    </div>

                                    {/* Registration Button */}
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Button
                                            onClick={handleRegister}
                                            disabled={isRegistered}
                                            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
                                        >
                                            {isRegistered ? (
                                                <div className="flex items-center gap-2">
                                                    <Check className="w-5 h-5" />
                                                    Sudah Terdaftar
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <Sparkles className="w-5 h-5" />
                                                    Daftar Sekarang
                                                </div>
                                            )}
                                        </Button>
                                    </motion.div>

                                    {/* Benefits */}
                                    <div className="space-y-2 pt-4 border-t border-border">
                                        <h4 className="text-lg font-medium text-foreground">Yang Anda Dapatkan:</h4>
                                        {event.benefits.map((benefit, index) => (
                                            <motion.div
                                                key={index}
                                                className="flex items-center gap-2 text-base text-muted-foreground"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 + 0.8 }}
                                            >
                                                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                                                <span>{benefit}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Organizer Card */}
                        <motion.div variants={itemVariants}>
                            <Card className="border-border">
                                <CardHeader>
                                    <h3 className="text-xl font-bold">Penyelenggara</h3>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-3 mb-4">
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src={event.organizer.logo} alt={event.organizer.name} />
                                            <AvatarFallback>{event.organizer.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className="text-lg font-medium">{event.organizer.name}</h4>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 fill-current text-yellow-500" />
                                                <span className="text-base text-muted-foreground">{event.organizer.rating}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-base text-muted-foreground mb-4">{event.organizer.description}</p>

                                    <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                                        <div>
                                            <div className="text-xl font-bold text-primary">{event.organizer.totalEvents}</div>
                                            <div className="text-sm text-muted-foreground">Events</div>
                                        </div>
                                        <div>
                                            <div className="text-xl font-bold text-primary">{event.organizer.followers.toLocaleString()}</div>
                                            <div className="text-sm text-muted-foreground">Followers</div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-base text-muted-foreground">
                                            <Globe className="w-4 h-4" />
                                            <span className="text-sm">{event.organizer.website}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-base text-muted-foreground">
                                            <Mail className="w-4 h-4" />
                                            <span className="text-sm">{event.organizer.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-base text-muted-foreground">
                                            <Phone className="w-4 h-4" />
                                            <span className="text-sm">{event.organizer.phone}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Tags */}
                        <motion.div variants={itemVariants}>
                            <Card className="border-border">
                                <CardHeader>
                                    <h3 className="text-xl font-bold">Tags</h3>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {event.tags.map((tag, index) => (
                                            <motion.div
                                                key={tag}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.1 + 0.6 }}
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                <Badge variant="outline" className="text-base border-border hover:bg-accent cursor-pointer">
                                                    {tag}
                                                </Badge>
                                            </motion.div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}