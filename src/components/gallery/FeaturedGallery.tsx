import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Play, Calendar, Users, MapPin, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';

interface GalleryItem {
    id: number;
    type: 'event' | 'highlight' | 'community';
    title: string;
    description: string;
    image: string;
    category?: string;
    date?: string;
    participants?: number;
    location?: string;
    isVideo: boolean;
}

interface FeaturedGalleryProps {
    onViewEvents: () => void;
}

export function FeaturedGallery({ onViewEvents }: FeaturedGalleryProps) {
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

    const galleryItems: GalleryItem[] = [
        {
            id: 1,
            type: 'event' as const,
            title: 'Tech Conference 2025',
            description: 'Konferensi teknologi terbesar tahun ini',
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
            category: 'Technology',
            date: '2025-03-15',
            participants: 500,
            location: 'Jakarta Convention Center',
            isVideo: false
        },
        {
            id: 2,
            type: 'highlight' as const,
            title: 'Event Highlights 2024',
            description: 'Momen terbaik dari event-event tahun lalu',
            image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
            isVideo: true
        },
        {
            id: 3,
            type: 'event' as const,
            title: 'Design Workshop',
            description: 'Workshop intensif untuk designer',
            image: 'https://images.unsplash.com/photo-1558403194-611308249627?w=800',
            category: 'Design',
            date: '2025-02-20',
            participants: 80,
            location: 'Bandung Creative Hub',
            isVideo: false
        },
        {
            id: 4,
            type: 'event' as const,
            title: 'Startup Pitch Day',
            description: 'Kompetisi pitch startup terbaik',
            image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800',
            category: 'Business',
            date: '2025-01-30',
            participants: 200,
            location: 'Innovation Hub',
            isVideo: false
        },
        {
            id: 5,
            type: 'community' as const,
            title: 'Community Meetup',
            description: 'Gathering komunitas developer',
            image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
            isVideo: false
        },
        {
            id: 6,
            type: 'event' as const,
            title: 'Marketing Summit',
            description: 'Summit digital marketing terdepan',
            image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
            category: 'Marketing',
            date: '2025-04-10',
            participants: 300,
            location: 'Surabaya Convention Hall',
            isVideo: false
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

    const overlayVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.3,
                ease: "easeOut" as const
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            transition: {
                duration: 0.2
            }
        }
    };

    return (
        <>
            <section className="container mx-auto px-4 py-20">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-5xl lg:text-6xl mb-6 text-foreground font-bold tracking-tight">
                        Featured <span className="text-primary">Gallery</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        Jelajahi momen-momen terbaik dari event-event yang telah diselenggarakan
                        dan temukan event menarik yang akan datang.
                    </p>
                </motion.div>

                {/* Justified Grid Gallery */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {galleryItems.map((item, index) => {
                        // Different aspect ratios for justified layout
                        const getAspectClass = () => {
                            switch (index % 6) {
                                case 0: return 'lg:col-span-2 lg:row-span-2'; // Large
                                case 1: return 'lg:col-span-1 lg:row-span-1'; // Small
                                case 2: return 'lg:col-span-1 lg:row-span-1'; // Small
                                case 3: return 'lg:col-span-1 lg:row-span-2'; // Tall
                                case 4: return 'lg:col-span-1 lg:row-span-1'; // Small
                                case 5: return 'lg:col-span-1 lg:row-span-1'; // Small
                                default: return 'lg:col-span-1 lg:row-span-1';
                            }
                        };

                        return (
                            <motion.div
                                key={item.id}
                                variants={itemVariants}
                                className={`group cursor-pointer ${getAspectClass()}`}
                                whileHover={{ y: -8 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedItem(item)}
                            >
                                <Card className="relative h-full min-h-[250px] overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500">
                                    <div className="relative h-full">
                                        <motion.div
                                            className="absolute inset-0"
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <ImageWithFallback
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </motion.div>

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                                        {/* Video Icon */}
                                        {item.isVideo && (
                                            <motion.div
                                                className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                                                whileHover={{ scale: 1.1 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <Play className="w-6 h-6 text-white" />
                                            </motion.div>
                                        )}

                                        {/* Category Badge */}
                                        {item.category && (
                                            <motion.div
                                                className="absolute top-4 left-4"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.1 + 0.3 }}
                                            >
                                                <Badge className="bg-primary/90 text-primary-foreground">
                                                    {item.category}
                                                </Badge>
                                            </motion.div>
                                        )}

                                        {/* Content */}
                                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                            <motion.h3
                                                className="text-xl lg:text-2xl font-bold mb-2 group-hover:text-primary transition-colors"
                                                whileHover={{ x: 5 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {item.title}
                                            </motion.h3>
                                            <p className="text-white/90 text-sm lg:text-base mb-3 line-clamp-2">
                                                {item.description}
                                            </p>

                                            {/* Event Details */}
                                            {item.type === 'event' && (
                                                <div className="space-y-1 text-xs lg:text-sm text-white/80">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{item.date ? new Date(item.date).toLocaleDateString('id-ID') : 'TBD'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Users className="w-4 h-4" />
                                                        <span>{item.participants} peserta</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4" />
                                                        <span className="line-clamp-1">{item.location}</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Hover Arrow */}
                                            <motion.div
                                                className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                whileHover={{ x: 5 }}
                                            >
                                                <ArrowRight className="w-6 h-6 text-white" />
                                            </motion.div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    className="text-center mt-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            onClick={onViewEvents}
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 text-lg px-8 py-6"
                        >
                            Jelajahi Semua Event
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </motion.div>
                </motion.div>
            </section>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={() => setSelectedItem(null)}
                    >
                                                    <motion.div
                                className="relative max-w-4xl w-full max-h-[90vh] bg-card rounded-lg overflow-hidden"
                                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* Image */}
                            <div className="aspect-video w-full">
                                <ImageWithFallback
                                    src={selectedItem.image}
                                    alt={selectedItem.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-foreground mb-2">
                                            {selectedItem.title}
                                        </h3>
                                        <p className="text-muted-foreground text-lg">
                                            {selectedItem.description}
                                        </p>
                                    </div>
                                    {selectedItem.category && (
                                        <Badge className="bg-primary text-primary-foreground">
                                            {selectedItem.category}
                                        </Badge>
                                    )}
                                </div>

                                {selectedItem.type === 'event' && (
                                    <div className="grid md:grid-cols-3 gap-4 mt-6">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar className="w-5 h-5 text-primary" />
                                            <span>{selectedItem.date ? new Date(selectedItem.date).toLocaleDateString('id-ID') : 'TBD'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Users className="w-5 h-5 text-primary" />
                                            <span>{selectedItem.participants} peserta</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <MapPin className="w-5 h-5 text-primary" />
                                            <span>{selectedItem.location}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-4 mt-6">
                                    <Button
                                        onClick={onViewEvents}
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                    >
                                        Lihat Event Serupa
                                    </Button>
                                    <Button variant="outline">
                                        Share
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}