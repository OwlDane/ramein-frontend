"use client"

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star } from 'lucide-react'
import { testimonialAPI } from '@/lib/testimonialApi';
import { getAvatarFallbackUrl } from '@/lib/unsplash'

interface Testimonial {
    id: string
    name: string
    role: string
    company: string
    avatar: string | null
    rating: number
    content: string
    isActive?: boolean
    sortOrder?: number
}

const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchTestimonials = async () => {
        try {
            const data = await testimonialAPI.getTestimonials();
            setTestimonials(data);
        } catch (error) {
            console.error('Failed to fetch testimonials:', error);
        } finally {
            setLoading(false);
        }
    };
    fetchTestimonials();
}, []);

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
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={testimonial.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                    ease: "easeOut"
                                }}
                                className="min-w-[400px] lg:min-w-[450px]"
                            >
                                <Card className="h-full border-border/50 shadow-glow hover:shadow-glow-hover transition-all duration-300 bg-card/80 backdrop-blur-sm">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Avatar className="w-12 h-12">
                                                <AvatarImage src={testimonial.avatar || undefined} alt={testimonial.name} />
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
                        {testimonials.slice().reverse().map((testimonial, index) => (
                            <motion.div
                                key={`${testimonial.id}-row2`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                    ease: "easeOut"
                                }}
                                className="min-w-[400px] lg:min-w-[450px]"
                            >
                                <Card className="h-full border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/80 backdrop-blur-sm">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Avatar className="w-12 h-12">
                                                <AvatarImage src={testimonial.avatar || undefined} alt={testimonial.name} />
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
