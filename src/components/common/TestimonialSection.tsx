"use client"

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star } from 'lucide-react'
import { getAvatarFallbackUrl } from '@/lib/unsplash'

interface Testimonial {
    id: number
    name: string
    role: string
    company: string
    avatar: string
    rating: number
    content: string
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "Marketing Manager",
        company: "TechCorp Indonesia",
        avatar: getAvatarFallbackUrl("Sarah Johnson", 150),
        rating: 5,
        content: "Event yang luar biasa! Organisasinya sangat profesional dan peserta sangat antusias. Platform Ramein memudahkan kami dalam mengelola event dengan efisien."
    },
    {
        id: 2,
        name: "Ahmad Rahman",
        role: "Event Coordinator",
        company: "Creative Solutions",
        avatar: getAvatarFallbackUrl("Ahmad Rahman", 150),
        rating: 5,
        content: "Sistem registrasi yang smooth dan dashboard yang user-friendly. Tim support sangat responsif dan membantu. Highly recommended!"
    },
    {
        id: 3,
        name: "Diana Putri",
        role: "HR Director",
        company: "InnovateLab",
        avatar: getAvatarFallbackUrl("Diana Putri", 150),
        rating: 5,
        content: "Kami sudah menggunakan Ramein untuk 3 event berturut-turut. Hasilnya selalu memuaskan. Fitur sertifikat otomatis sangat membantu."
    },
    {
        id: 4,
        name: "Budi Santoso",
        role: "CEO",
        company: "StartupHub Jakarta",
        avatar: getAvatarFallbackUrl("Budi Santoso", 150),
        rating: 5,
        content: "Platform yang sangat powerful untuk event management. Analytics yang detail membantu kami memahami engagement peserta dengan baik."
    },
    {
        id: 5,
        name: "Maya Sari",
        role: "Community Manager",
        company: "Digital Nomads ID",
        avatar: getAvatarFallbackUrl("Maya Sari", 150),
        rating: 5,
        content: "Interface yang modern dan intuitif. Fitur attendance tracking dengan token sangat inovatif. Peserta kami sangat menyukai sistemnya."
    },
    {
        id: 6,
        name: "Rizki Pratama",
        role: "Product Manager",
        company: "Innovation Labs",
        avatar: getAvatarFallbackUrl("Rizki Pratama", 150),
        rating: 5,
        content: "Sistem yang sangat reliable dan scalable. Dari event kecil hingga besar, Ramein selalu memberikan performa yang konsisten."
    },
    {
        id: 7,
        name: "Nina Kartika",
        role: "Event Director",
        company: "Creative Events",
        avatar: getAvatarFallbackUrl("Nina Kartika", 150),
        rating: 5,
        content: "Fitur yang lengkap dan support yang excellent. Tim Ramein selalu siap membantu kapanpun kami butuhkan. Terima kasih!"
    },
    {
        id: 8,
        name: "David Wijaya",
        role: "Tech Lead",
        company: "Digital Solutions",
        avatar: getAvatarFallbackUrl("David Wijaya", 150),
        rating: 5,
        content: "Integrasi yang seamless dengan sistem kami. API yang well-documented dan performa yang outstanding. Sangat puas!"
    }
]

export default function TestimonialSection() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"])

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting)
            },
            { threshold: 0.1 }
        )

        if (containerRef.current) {
            observer.observe(containerRef.current)
        }

        return () => observer.disconnect()
    }, [])

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
        ))
    }

    return (
        <section ref={containerRef} className="py-20 bg-gradient-dark overflow-hidden">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                        Apa Kata <span className="text-gradient-primary">Mereka</span>
                    </h2>
                    <p className="text-base text-muted-foreground max-w-3xl mx-auto">
                        Testimoni dari berbagai organisasi yang telah menggunakan platform Ramein untuk mengelola event mereka
                    </p>
                </motion.div>

                <div className="relative">
                    {/* First Row */}
                    <motion.div
                        style={{ x }}
                        className="flex gap-6 mb-6"
                    >
                        {testimonials.map((testimonial) => (
                            <motion.div
                                key={testimonial.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                                transition={{ 
                                    duration: 0.6, 
                                    delay: testimonial.id * 0.1,
                                    ease: "easeOut"
                                }}
                                className="min-w-[400px] lg:min-w-[450px]"
                            >
                                <Card className="h-full border-border/50 shadow-glow hover:shadow-glow-hover transition-all duration-300 bg-card/80 backdrop-blur-sm">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Avatar className="w-12 h-12">
                                                <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                                                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                                                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                                <p className="text-xs text-muted-foreground/70">{testimonial.company}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-1 mb-4">
                                            {renderStars(testimonial.rating)}
                                        </div>
                                        
                                        <blockquote className="text-muted-foreground leading-relaxed italic">
                                            &ldquo;{testimonial.content}&rdquo;
                                        </blockquote>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Second Row - Staggered */}
                    <motion.div
                        style={{ x: useTransform(scrollYProgress, [0, 1], ["-25%", "-75%"]) }}
                        className="flex gap-6"
                    >
                        {testimonials.slice().reverse().map((testimonial) => (
                            <motion.div
                                key={`${testimonial.id}-row2`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                                transition={{ 
                                    duration: 0.6, 
                                    delay: (testimonials.length - testimonial.id) * 0.1,
                                    ease: "easeOut"
                                }}
                                className="min-w-[400px] lg:min-w-[450px]"
                            >
                                <Card className="h-full border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/80 backdrop-blur-sm">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Avatar className="w-12 h-12">
                                                <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                                                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                                                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                                <p className="text-xs text-muted-foreground/70">{testimonial.company}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-1 mb-4">
                                            {renderStars(testimonial.rating)}
                                        </div>
                                        
                                        <blockquote className="text-muted-foreground leading-relaxed italic">
                                            &ldquo;{testimonial.content}&rdquo;
                                        </blockquote>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
