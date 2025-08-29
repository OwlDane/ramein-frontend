"use client"
import { useCallback, useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import { ImageWithFallback } from "@/components/ui/ImageWithFallback"
import { apiFetch } from "@/lib/api"

type BEEvent = {
    id: string
    title: string
    description: string
    date: string
    time: string
    location: string
    flyer?: string
    category?: string
    price?: number | string
}

interface Props {
    onEventSelect: (id: string) => void
}

export default function EventCarousel({ onEventSelect }: Props) {
    const [events, setEvents] = useState<BEEvent[]>([])
    const [idx, setIdx] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const categoryClassMap = useMemo<Record<string, string>>(
        () => ({
            technology: "bg-blue-500 text-white",
            marketing: "bg-pink-500 text-white",
            business: "bg-amber-500 text-black",
            design: "bg-violet-500 text-white",
            creative: "bg-emerald-500 text-white",
            general: "bg-primary/90 text-primary-foreground",
        }),
        [],
    )

    const badgeClass = useCallback(
        (c?: string) => categoryClassMap[(c || "general").toLowerCase()] || categoryClassMap.general,
        [categoryClassMap],
    )

    useEffect(() => {
        const run = async () => {
            setLoading(true)
            setError("")
            try {
                const data = await apiFetch<BEEvent[]>(`/events?sort=nearest`)
                setEvents(data.slice(0, 5))
            } catch (e: any) {
                setError(e?.message || "Gagal memuat event")
            } finally {
                setLoading(false)
            }
        }
        run()
    }, [])

    useEffect(() => {
        const timer = setInterval(() => {
            setIdx((i) => (i + 1) % Math.max(1, events.length || 1))
        }, 8000) // Changed from 4000ms to 8000ms (8 seconds)
        return () => clearInterval(timer)
    }, [events.length])

    const go = (dir: number) => {
        if (!events.length) return
        setIdx((i) => (i + dir + events.length) % events.length)
    }

    const formatDate = (s: string) =>
        new Date(s).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })

    const formatPrice = (p?: number | string) => {
        const n = Number(p ?? 0)
        return n === 0
            ? "Gratis"
            : new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)
    }

    return (
        <section className="container mx-auto px-4 py-12">
            <div className="text-center mb-8">
                <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
                    Event <span className="text-gradient-primary">Terpopuler</span>
                </h2>
            </div>
            <div className="relative max-w-6xl mx-auto">
                <div className="overflow-hidden rounded-2xl bg-muted/20 p-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: 300, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -300, scale: 0.8 }}
                            transition={{
                                duration: 0.8, // Increased from 0.6 to 0.8 for smoother transition
                                ease: [0.25, 0.46, 0.45, 0.94],
                                scale: { duration: 0.5 }, // Increased from 0.4 to 0.5
                            }}
                            className="w-full"
                        >
                            {events[idx] && (
                                <Card className="overflow-hidden border-border shadow-2xl bg-card mx-auto max-w-4xl">
                                    <div className="relative h-80 md:h-96">
                                        <ImageWithFallback
                                            src={
                                                events[idx].flyer && events[idx].flyer.startsWith("http")
                                                    ? events[idx].flyer
                                                    : `https://picsum.photos/seed/${events[idx].id}/1200/600`
                                            }
                                            alt={events[idx].title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-6 left-6">
                                            <Badge className={`${badgeClass(events[idx].category)} shadow-lg text-sm px-3 py-1`}>
                                                {events[idx].category || "General"}
                                            </Badge>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    </div>
                                    <CardContent className="p-8">
                                        <h3 className="text-3xl font-bold mb-3 line-clamp-2 text-balance">{events[idx].title}</h3>
                                        <p className="text-muted-foreground mb-6 line-clamp-3 text-lg leading-relaxed">
                                            {events[idx].description}
                                        </p>
                                        <div className="grid sm:grid-cols-3 gap-4 text-muted-foreground mb-6">
                                            <div className="flex items-center gap-3">
                                                <Calendar className="w-5 h-5 text-primary" />
                                                <span className="text-sm">{formatDate(events[idx].date)}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Clock className="w-5 h-5 text-primary" />
                                                <span className="text-sm">{events[idx].time} WIB</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <MapPin className="w-5 h-5 text-primary" />
                                                <span className="line-clamp-1 text-sm">{events[idx].location}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="text-3xl font-bold text-primary">{formatPrice(events[idx].price)}</div>
                                            <Button size="lg" onClick={() => onEventSelect(events[idx].id)} className="px-8">
                                                Lihat Detail
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
                <motion.button
                    onClick={() => go(-1)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-1/2 -left-6 -translate-y-1/2 w-12 h-12 rounded-full bg-background border-2 border-border shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center hover:bg-accent"
                >
                    <ChevronLeft className="w-6 h-6" />
                </motion.button>
                <motion.button
                    onClick={() => go(1)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-1/2 -right-6 -translate-y-1/2 w-12 h-12 rounded-full bg-background border-2 border-border shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center hover:bg-accent"
                >
                    <ChevronRight className="w-6 h-6" />
                </motion.button>
                <div className="flex items-center justify-center gap-3 mt-8">
                    {events.map((_, i) => (
                        <motion.button
                            key={i}
                            onClick={() => setIdx(i)}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.8 }}
                            aria-label={`slide-${i + 1}`}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === i ? "bg-primary shadow-lg scale-125" : "bg-muted-foreground/40 hover:bg-muted-foreground/60"
                                }`}
                        />
                    ))}
                </div>
            </div>
            {loading && <div className="text-center text-sm text-muted-foreground mt-4">Memuat...</div>}
            {error && !loading && <div className="text-center text-sm text-destructive mt-2">{error}</div>}
        </section>
    )
}