import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, MapPin, Users, Clock, Filter, Sparkles, SlidersHorizontal, X } from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { apiFetch, buildQuery } from '@/lib/api';
import type { BackendEvent } from '@/types/event';

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
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize = 10;
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [serverEvents, setServerEvents] = useState<BackendEvent[] | null>(null);

    // Default fallback image provider that always returns an image
    const defaultFlyerFor = useCallback((seed: string) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/450`, []);

    const categories = useMemo(() => ['all', 'Technology', 'Marketing', 'Business', 'Design', 'Creative'], []);

    // Map backend events into CatalogEvent shape used by UI
    const mappedServerEvents: Event[] = useMemo(() => {
        if (!serverEvents) return [];
        return serverEvents.map(ev => ({
            id: ev.id,
            title: ev.title,
            description: ev.description,
            date: ev.date,
            time: ev.time,
            location: ev.location,
            category: (ev as any).category || 'General',
            price: Number((ev as any).price ?? 0),
            maxParticipants: 0,
            currentParticipants: 0,
            image: (ev.flyer && ev.flyer.startsWith('http')) ? ev.flyer : defaultFlyerFor(ev.id),
            organizer: 'Panitia',
            tags: [],
        }));
    }, [serverEvents, defaultFlyerFor]);

    // Decide source of events: server if available, otherwise placeholder
    const events: Event[] = useMemo(() => mappedServerEvents, [mappedServerEvents]);

    // Fetch events from backend with search/sort (date-based)
    useEffect(() => {
        const controller = new AbortController();
        const fetchEvents = async () => {
            setLoading(true);
            setError('');
            try {
                const sortParam = sortBy === 'date-desc' ? 'furthest' : 'nearest';
                const q = buildQuery({
                    search: searchQuery || undefined,
                    sort: sortParam,
                    category: selectedCategory !== 'all' ? selectedCategory : undefined
                });
                const data = await apiFetch<BackendEvent[]>(`/events${q}`, { method: 'GET' });
                setServerEvents(data);
            } catch (e: any) {
                setError(e?.message || 'Gagal memuat data event');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
        return () => controller.abort();
    }, [searchQuery, sortBy, selectedCategory]);

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

    const containerVariants = useMemo(() => ({
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }), []);

    const itemVariants = useMemo(() => ({
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut" as const
            }
        }
    }), []);

    // Category color mapping for badges (keeps in-theme with Tailwind palette)
    const categoryClassMap = useMemo<Record<string, string>>(() => ({
        technology: 'bg-blue-500 text-white',
        marketing: 'bg-pink-500 text-white',
        business: 'bg-amber-500 text-black',
        design: 'bg-violet-500 text-white',
        creative: 'bg-emerald-500 text-white',
        general: 'bg-primary/90 text-primary-foreground'
    }), []);

    const getCategoryBadgeClass = useCallback((category: string | undefined) => {
        const key = (category || 'general').toLowerCase();
        return categoryClassMap[key] || categoryClassMap.general;
    }, [categoryClassMap]);

    const clearFilters = useCallback(() => {
        setSearchQuery('');
        setSelectedCategory('all');
        setSortBy('date-asc');
    }, []);

    const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'all' || sortBy !== 'date-asc';

    // Reset page when filters or data change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory, sortBy, mappedServerEvents.length]);

    // Pagination calculations
    const totalItems = events.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const pageStartIdx = (currentPage - 1) * pageSize;
    const pageEndIdx = Math.min(pageStartIdx + pageSize, totalItems);
    const pagedEvents = useMemo(() => events.slice(pageStartIdx, pageEndIdx), [events, pageStartIdx, pageEndIdx]);

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
                    <h2 className="text-3xl lg:text-4xl text-foreground font-bold tracking-tight">
                        {limit ? 'Event ' : 'Katalog '}
                        <span className="text-gradient-primary">{limit ? 'Terpopuler' : 'Event'}</span>
                    </h2>
                </motion.div>
                <p className="text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed">
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
                    <Card className="mb-6 border-border shadow-glow hover:shadow-glow-hover transition-all duration-300 bg-card/80 backdrop-blur-sm">
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
                                        <Badge variant="secondary" className="gap-2 bg-accent/50 text-foreground">
                                            Search: {searchQuery}
                                            <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                                        </Badge>
                                    )}
                                    {selectedCategory !== 'all' && (
                                        <Badge variant="secondary" className="gap-2 bg-accent/50 text-foreground">
                                            Kategori: {selectedCategory}
                                            <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('all')} />
                                        </Badge>
                                    )}
                                    {sortBy !== 'date-asc' && (
                                        <Badge variant="secondary" className="gap-2 bg-accent/50 text-foreground">
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
                    {loading && (
                        <Badge variant="secondary" className="text-sm">Memuat...</Badge>
                    )}
                    {error && !loading && (
                        <Badge variant="destructive" className="text-sm">{error}</Badge>
                    )}
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
                {pagedEvents.map((event, index) => {
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
                            <Card className="group hover:shadow-glow-hover transition-all duration-300 border-border shadow-glow overflow-hidden bg-card h-full flex flex-col">
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
                                            <Badge className={`${getCategoryBadgeClass(event.category)} shadow-md`}>{event.category}</Badge>
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

            {!limit && totalItems > 0 && (
                <motion.div
                    className="flex items-center justify-between mt-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="text-sm text-muted-foreground">
                        Menampilkan {pageStartIdx + 1}-{pageEndIdx} dari {totalItems} event
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            Sebelumnya
                        </Button>
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <Button
                                key={i}
                                variant={currentPage === i + 1 ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </Button>
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Selanjutnya
                        </Button>
                    </div>
                </motion.div>
            )}
        </section>
    );
}