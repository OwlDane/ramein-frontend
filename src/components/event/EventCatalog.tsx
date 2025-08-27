import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, MapPin, Users, Clock, Filter, Sparkles, SlidersHorizontal, X } from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';

interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    category: string;
    price: number;
    maxParticipants: number;
    currentParticipants: number;
    image: string;
    organizer: string;
    tags: string[];
}

interface EventCatalogProps {
    onEventSelect: (eventId: string) => void;
    limit?: number;
}

export function EventCatalog({ onEventSelect, limit }: EventCatalogProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('date-asc');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Memoize events data to avoid dependency issues
    const events: Event[] = useMemo(() => [
        {
            id: '1',
            title: 'Workshop React Advanced',
            description: 'Pelajari teknik advanced React untuk pengembangan aplikasi modern',
            date: '2025-01-15',
            time: '09:00',
            location: 'Jakarta Convention Center',
            category: 'Technology',
            price: 150000,
            maxParticipants: 100,
            currentParticipants: 75,
            image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=500',
            organizer: 'Tech Indonesia',
            tags: ['React', 'JavaScript', 'Frontend']
        },
        {
            id: '2',
            title: 'Digital Marketing Summit 2025',
            description: 'Event terbesar untuk para digital marketer di Indonesia',
            date: '2025-01-20',
            time: '08:00',
            location: 'Balai Kartini, Jakarta',
            category: 'Marketing',
            price: 300000,
            maxParticipants: 500,
            currentParticipants: 450,
            image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500',
            organizer: 'Marketing Pro',
            tags: ['Digital Marketing', 'SEO', 'Social Media']
        },
        {
            id: '3',
            title: 'Startup Pitch Competition',
            description: 'Kompetisi pitch untuk startup teknologi terbaik',
            date: '2025-01-25',
            time: '10:00',
            location: 'Universitas Indonesia',
            category: 'Business',
            price: 0,
            maxParticipants: 200,
            currentParticipants: 120,
            image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=500',
            organizer: 'Startup Hub',
            tags: ['Startup', 'Pitch', 'Investment']
        },
        {
            id: '4',
            title: 'UI/UX Design Masterclass',
            description: 'Masterclass design UI/UX dengan mentor berpengalaman',
            date: '2025-02-01',
            time: '13:00',
            location: 'Design Studio, Bandung',
            category: 'Design',
            price: 200000,
            maxParticipants: 50,
            currentParticipants: 30,
            image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=500',
            organizer: 'Design Academy',
            tags: ['UI/UX', 'Design', 'Figma']
        },
        {
            id: '5',
            title: 'Blockchain & Web3 Conference',
            description: 'Konferensi terbesar tentang teknologi blockchain dan Web3',
            date: '2025-02-10',
            time: '09:00',
            location: 'Grand Hyatt, Jakarta',
            category: 'Technology',
            price: 500000,
            maxParticipants: 300,
            currentParticipants: 180,
            image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500',
            organizer: 'Blockchain Indonesia',
            tags: ['Blockchain', 'Web3', 'Cryptocurrency']
        },
        {
            id: '6',
            title: 'Photography Workshop',
            description: 'Workshop fotografi untuk pemula hingga profesional',
            date: '2025-02-15',
            time: '08:00',
            location: 'Taman Mini Indonesia Indah',
            category: 'Creative',
            price: 250000,
            maxParticipants: 80,
            currentParticipants: 45,
            image: 'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=500',
            organizer: 'Photo Community',
            tags: ['Photography', 'Creative', 'Portfolio']
        }
    ], []);

    const categories = ['all', 'Technology', 'Marketing', 'Business', 'Design', 'Creative'];

    const filteredAndSortedEvents = useMemo(() => {
        const filtered = events.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });

        // Sort events
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'date-asc':
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                case 'date-desc':
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                default:
                    return 0;
            }
        });

        return limit ? filtered.slice(0, limit) : filtered;
    }, [events, searchQuery, selectedCategory, sortBy, limit]);

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
        if (price === 0) return 'Gratis';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const getAvailabilityStatus = (current: number, max: number) => {
        const percentage = (current / max) * 100;
        if (percentage >= 90) return { status: 'Hampir Penuh', color: 'bg-destructive' };
        if (percentage >= 70) return { status: 'Terbatas', color: 'bg-muted-foreground' };
        return { status: 'Tersedia', color: 'bg-primary' };
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut" as const
            }
        }
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('all');
        setSortBy('date-asc');
    };

    const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'all' || sortBy !== 'date-asc';

    return (
        <section className="container mx-auto px-4 py-12">
            <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <motion.div
                    className="inline-flex items-center gap-2 mb-6"
                    whileHover={{ scale: 1.05 }}
                >
                    <Sparkles className="w-8 h-8 text-primary" />
                    <h2 className="text-5xl lg:text-6xl text-foreground font-bold tracking-tight">
                        {limit ? 'Event ' : 'Katalog '}
                        <span className="text-primary">{limit ? 'Terpopuler' : 'Event'}</span>
                    </h2>
                </motion.div>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    Temukan event yang sesuai dengan minat dan kebutuhan Anda
                </p>
            </motion.div>

            {/* Enhanced Search and Filters */}
            {!limit && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-12"
                >
                    {/* Main Search Bar */}
                    <Card className="mb-6 border-border shadow-xl hover:shadow-2xl transition-all duration-300 bg-card/80 backdrop-blur-sm">
                        <CardContent className="p-8">
                            <div className="relative">
                                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-muted-foreground" />
                                <Input
                                    placeholder="Cari event impian Anda..."
                                    value={searchQuery}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                                    className="pl-16 h-16 text-lg border-0 bg-transparent focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60"
                                />
                                <motion.button
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <SlidersHorizontal className="w-6 h-6 text-primary" />
                                </motion.button>
                            </div>

                            {/* Active Filters Display */}
                            {hasActiveFilters && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="flex items-center gap-3 mt-4 pt-4 border-t border-border"
                                >
                                    <span className="text-sm text-muted-foreground">Aktif:</span>
                                    {searchQuery && (
                                        <Badge variant="secondary" className="gap-2">
                                            Search: {searchQuery}
                                            <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                                        </Badge>
                                    )}
                                    {selectedCategory !== 'all' && (
                                        <Badge variant="secondary" className="gap-2">
                                            Kategori: {selectedCategory}
                                            <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('all')} />
                                        </Badge>
                                    )}
                                    {sortBy !== 'date-asc' && (
                                        <Badge variant="secondary" className="gap-2">
                                            Sort: {sortBy === 'date-desc' ? 'Tanggal Terjauh' :
                                                sortBy === 'price-asc' ? 'Harga Terendah' :
                                                    sortBy === 'price-desc' ? 'Harga Tertinggi' : sortBy}
                                            <X className="w-3 h-3 cursor-pointer" onClick={() => setSortBy('date-asc')} />
                                        </Badge>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearFilters}
                                        className="text-primary hover:text-primary/80 text-sm ml-auto"
                                    >
                                        Clear All
                                    </Button>
                                </motion.div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Advanced Filters */}
                    <motion.div
                        initial={false}
                        animate={{
                            height: isFilterOpen ? 'auto' : 0,
                            opacity: isFilterOpen ? 1 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <Card className="border-border bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
                            <CardContent className="p-6">
                                <div className="grid md:grid-cols-3 gap-6">
                                    <motion.div
                                        whileFocus={{ scale: 1.02 }}
                                        className="space-y-2"
                                    >
                                        <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                            <Filter className="w-4 h-4 text-primary" />
                                            Kategori Event
                                        </label>
                                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                            <SelectTrigger className="h-12 bg-background/50 border-border/50 backdrop-blur-sm">
                                                <SelectValue placeholder="Pilih kategori" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map(category => (
                                                    <SelectItem key={category} value={category}>
                                                        {category === 'all' ? 'Semua Kategori' : category}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </motion.div>

                                    <motion.div
                                        whileFocus={{ scale: 1.02 }}
                                        className="space-y-2"
                                    >
                                        <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-primary" />
                                            Urutkan Berdasarkan
                                        </label>
                                        <Select value={sortBy} onValueChange={setSortBy}>
                                            <SelectTrigger className="h-12 bg-background/50 border-border/50 backdrop-blur-sm">
                                                <SelectValue placeholder="Pilih urutan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="date-asc">📅 Tanggal Terdekat</SelectItem>
                                                <SelectItem value="date-desc">📅 Tanggal Terjauh</SelectItem>
                                                <SelectItem value="price-asc">💰 Harga Terendah</SelectItem>
                                                <SelectItem value="price-desc">💰 Harga Tertinggi</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </motion.div>

                                    <motion.div
                                        className="flex items-end"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Button
                                            onClick={() => setIsFilterOpen(false)}
                                            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                                        >
                                            Terapkan Filter
                                        </Button>
                                    </motion.div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            )}

            {/* Results Count */}
            {!limit && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-8 flex items-center justify-between"
                >
                    <p className="text-lg text-muted-foreground">
                        Menampilkan <span className="text-foreground font-medium">{filteredAndSortedEvents.length}</span> event
                        {searchQuery && (
                            <span> untuk &ldquo;{searchQuery}&rdquo;</span>
                        )}
                    </p>
                    {filteredAndSortedEvents.length > 0 && (
                        <Badge variant="outline" className="text-sm">
                            {filteredAndSortedEvents.length} hasil
                        </Badge>
                    )}
                </motion.div>
            )}

            {/* Events Grid */}
            <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {filteredAndSortedEvents.map((event, index) => {
                    const availability = getAvailabilityStatus(event.currentParticipants, event.maxParticipants);

                    return (
                        <motion.div
                            key={event.id}
                            variants={itemVariants}
                            whileHover={{
                                y: -8,
                                transition: { duration: 0.3 }
                            }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Card className="group hover:shadow-2xl transition-all duration-300 border-border shadow-lg overflow-hidden bg-card h-full flex flex-col">
                                <div className="relative overflow-hidden">
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ImageWithFallback
                                            src={event.image}
                                            alt={event.title}
                                            className="w-full h-48 object-cover"
                                        />
                                    </motion.div>
                                    <div className="absolute top-4 left-4">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: index * 0.1 + 0.3 }}
                                        >
                                            <Badge className={`${availability.color} text-white`}>
                                                {availability.status}
                                            </Badge>
                                        </motion.div>
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: index * 0.1 + 0.4 }}
                                        >
                                            <Badge variant="secondary" className="bg-card/90 text-card-foreground">
                                                {event.category}
                                            </Badge>
                                        </motion.div>
                                    </div>
                                </div>

                                <CardHeader className="pb-3 flex-grow">
                                    <motion.h3
                                        className="text-xl group-hover:text-primary transition-colors duration-200 line-clamp-2"
                                        whileHover={{ x: 5 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {event.title}
                                    </motion.h3>
                                    <p className="text-muted-foreground text-base line-clamp-2">{event.description}</p>
                                </CardHeader>

                                <CardContent className="pt-0">
                                    <div className="space-y-3 mb-6">
                                        <motion.div
                                            className="flex items-center gap-2 text-base text-muted-foreground"
                                            whileHover={{ x: 5 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Calendar className="w-5 h-5 text-primary" />
                                            <span>{formatDate(event.date)}</span>
                                        </motion.div>

                                        <motion.div
                                            className="flex items-center gap-2 text-base text-muted-foreground"
                                            whileHover={{ x: 5 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Clock className="w-5 h-5 text-primary" />
                                            <span>{event.time} WIB</span>
                                        </motion.div>

                                        <motion.div
                                            className="flex items-center gap-2 text-base text-muted-foreground"
                                            whileHover={{ x: 5 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <MapPin className="w-5 h-5 text-primary" />
                                            <span className="line-clamp-1">{event.location}</span>
                                        </motion.div>

                                        <motion.div
                                            className="flex items-center gap-2 text-base text-muted-foreground"
                                            whileHover={{ x: 5 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Users className="w-5 h-5 text-primary" />
                                            <span>{event.currentParticipants}/{event.maxParticipants} peserta</span>
                                        </motion.div>
                                    </div>

                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <motion.div
                                                className="text-2xl text-primary mb-1 font-bold"
                                                whileHover={{ scale: 1.1 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {formatPrice(event.price)}
                                            </motion.div>
                                            <div className="text-sm text-muted-foreground">by {event.organizer}</div>
                                        </div>

                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Button
                                                onClick={() => onEventSelect(event.id)}
                                                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
                                            >
                                                Lihat Detail
                                            </Button>
                                        </motion.div>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2">
                                        {event.tags.slice(0, 3).map((tag, tagIndex) => (
                                            <motion.div
                                                key={tag}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.1 + tagIndex * 0.1 + 0.5 }}
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                <Badge variant="outline" className="text-sm border-border">
                                                    {tag}
                                                </Badge>
                                            </motion.div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </motion.div>

            {filteredAndSortedEvents.length === 0 && (
                <motion.div
                    className="text-center py-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div
                        className="text-muted-foreground mb-6"
                        animate={{
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <Search className="w-20 h-20 mx-auto" />
                    </motion.div>
                    <h3 className="text-3xl text-foreground mb-4 font-bold">Event tidak ditemukan</h3>
                    <p className="text-xl text-muted-foreground mb-8">Coba ubah kata kunci pencarian atau filter yang digunakan</p>
                    {hasActiveFilters && (
                        <Button onClick={clearFilters} variant="outline" size="lg">
                            Reset Filter
                        </Button>
                    )}
                </motion.div>
            )}

            {limit && filteredAndSortedEvents.length > 0 && (
                <motion.div
                    className="text-center mt-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 text-lg px-8 py-6"
                        >
                            Lihat Semua Event
                        </Button>
                    </motion.div>
                </motion.div>
            )}
        </section>
    );
}