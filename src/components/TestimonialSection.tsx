"use client"

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star } from 'lucide-react'

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
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        rating: 5,
        content: "Event yang luar biasa! Organisasinya sangat profesional dan peserta sangat antusias. Platform Ramein memudahkan kami dalam mengelola event dengan efisien."
    },
    {
        id: 2,
        name: "Ahmad Rahman",
        role: "Event Coordinator",
        company: "Creative Solutions",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        rating: 5,
        content: "Sistem registrasi yang smooth dan dashboard yang user-friendly. Tim support sangat responsif dan membantu. Highly recommended!"
    },
    {
        id: 3,
        name: "Diana Putri",
        role: "HR Director",
        company: "InnovateLab",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        rating: 5,
        content: "Kami sudah menggunakan Ramein untuk 3 event berturut-turut. Hasilnya selalu memuaskan. Fitur sertifikat otomatis sangat membantu."
    },
    {
        id: 4,
        name: "Budi Santoso",
        role: "CEO",
        company: "StartupHub Jakarta",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        rating: 5,
        content: "Platform yang sangat powerful untuk event management. Analytics yang detail membantu kami memahami engagement peserta dengan baik."
    },
    {
        id: 5,
        name: "Maya Sari",
        role: "Community Manager",
        company: "Digital Nomads ID",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
        rating: 5,
        content: "Interface yang modern dan intuitif. Fitur attendance tracking dengan token sangat inovatif. Peserta kami sangat menyukai sistemnya."
    },
    {
        id: 6,
        name: "Rizki Pratama",
        role: "Product Manager",
        company: "Innovation Labs",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        rating: 5,
        content: "Sistem yang sangat reliable dan scalable. Dari event kecil hingga besar, Ramein selalu memberikan performa yang konsisten."
    },
    {
        id: 7,
        name: "Nina Kartika",
        role: "Event Director",
        company: "Creative Events",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
        rating: 5,
        content: "Fitur yang lengkap dan support yang excellent. Tim Ramein selalu siap membantu kapanpun kami butuhkan. Terima kasih!"
    },
    {
        id: 8,
        name: "David Wijaya",
        role: "Tech Lead",
        company: "Digital Solutions",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
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
        <section ref={containerRef} className="py-20 bg-gradient-to-br from-background via-muted/20 to-background overflow-hidden">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                        Apa Kata <span className="text-primary">Mereka</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
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
                                            "{testimonial.content}"
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
                                            "{testimonial.content}"
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
