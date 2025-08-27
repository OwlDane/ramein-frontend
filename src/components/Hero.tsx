'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Calendar, Users, Star, ArrowRight, Sparkles, Zap } from 'lucide-react'

interface HeroProps {
    onViewEvents: () => void;
}

export function Hero({ onViewEvents }: HeroProps) {
    const { scrollY } = useScroll()
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    const backgroundY = useTransform(scrollY, [0, 500], [0, 150])
    const textY = useTransform(scrollY, [0, 500], [0, -100])
    const heroY = useTransform(scrollY, [0, 500], [0, -150])

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX - window.innerWidth / 2) / 50,
                y: (e.clientY - window.innerHeight / 2) / 50
            })
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    }

    const floatingVariants = {
        animate: {
            y: [-10, 10, -10],
            rotate: [-5, 5, -5],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    }

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-accent/50 text-foreground min-h-[100vh] flex items-center">
            <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
                <motion.div
                    className="absolute inset-0 opacity-10"
                    animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                    transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='5' cy='5' r='2'/%3E%3Ccircle cx='55' cy='55' r='2'/%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '60px 60px'
                    }}
                />
            </motion.div>

            <motion.div
                className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-xl"
                style={{
                    x: mousePosition.x * 0.5,
                    y: mousePosition.y * 0.3,
                }}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
                className="absolute bottom-20 right-10 w-40 h-40 bg-accent/20 rounded-full blur-xl"
                style={{
                    x: mousePosition.x * -0.3,
                    y: mousePosition.y * 0.5,
                }}
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.2, 0.5, 0.2]
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                }}
            />

            <div className="relative container mx-auto px-4 py-20 lg:py-32">
                <motion.div className="grid lg:grid-cols-2 gap-12 items-center" variants={containerVariants} initial="hidden" animate="visible">

                    {/* TEXT SECTION */}
                    <motion.div className="text-center lg:text-left" style={{ y: textY }}>
                        <motion.div
                            className="inline-flex items-center gap-3 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-border"
                            variants={itemVariants}
                            whileHover={{ scale: 1.05 }}
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                x: mousePosition.x * 0.2
                            }}
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                                <Star className="w-5 h-5 text-primary" />
                            </motion.div>
                            <span className="text-base text-muted-foreground font-medium">Platform Event Terpercaya #1</span>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <motion.h1
                                className="text-6xl lg:text-8xl mb-8 leading-tight text-foreground font-bold tracking-tight"
                                style={{
                                    y: mousePosition.y * -0.5,
                                    x: mousePosition.x * 0.3
                                }}
                            >
                                <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
                                    Temukan
                                </motion.span>{' '}
                                <motion.span
                                    className="relative inline-block"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                    initial={{ opacity: 0, rotateX: 90 }}
                                    animate={{ opacity: 1, rotateX: 0 }}
                                    style={{
                                        transformPerspective: 1000,
                                        y: mousePosition.y * -0.8
                                    }}
                                >
                                    <span className="bg-gradient-to-r from-primary to-muted-foreground bg-clip-text text-transparent">
                                        Event
                                    </span>
                                    <motion.div
                                        className="absolute -top-3 -right-3"
                                        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                        style={{
                                            x: mousePosition.x * 0.5,
                                            y: mousePosition.y * -0.5
                                        }}
                                    >
                                        <Sparkles className="w-8 h-8 text-primary" />
                                    </motion.div>
                                </motion.span>
                                <br />
                                <motion.span
                                    className="relative"
                                    whileHover={{ scale: 1.02 }}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                    style={{
                                        x: mousePosition.x * -0.2
                                    }}
                                >
                                    Impianmu
                                    <motion.div
                                        className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent rounded-full"
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ delay: 1, duration: 0.8 }}
                                    />
                                </motion.span>
                            </motion.h1>
                        </motion.div>

                        <motion.p
                            className="text-2xl text-muted-foreground mb-10 max-w-2xl leading-relaxed"
                            variants={itemVariants}
                            style={{
                                y: mousePosition.y * -0.3,
                                x: mousePosition.x * 0.1
                            }}
                        >
                            Bergabunglah dengan ribuan peserta dalam event-event berkualitas tinggi.
                            Dapatkan sertifikat dan pengalaman tak terlupakan bersama{' '}
                            <motion.span
                                className="text-primary font-medium"
                                whileHover={{ scale: 1.05 }}
                                style={{
                                    display: 'inline-block',
                                    x: mousePosition.x * 0.2
                                }}
                            >
                                Ramein
                            </motion.span>.
                        </motion.p>

                        <motion.div className="flex flex-col sm:flex-row gap-6 mb-16" variants={itemVariants} style={{ x: mousePosition.x * 0.15 }}>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button onClick={onViewEvents} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl hover:shadow-2xl transition-all duration-200 group text-lg px-8 py-6">
                                    Jelajahi Event
                                    <motion.div
                                        className="ml-3"
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        <ArrowRight className="w-6 h-6" />
                                    </motion.div>
                                </Button>
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="outline" size="lg" className="border-2 border-border bg-background/50 text-foreground hover:bg-accent hover:border-primary backdrop-blur-sm transition-all duration-200 text-lg px-8 py-6">
                                    Pelajari Lebih Lanjut
                                </Button>
                            </motion.div>
                        </motion.div>

                        {/* Stats */}
                        <motion.div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto lg:mx-0" variants={itemVariants} style={{ y: mousePosition.y * -0.2 }}>
                            {[
                                { number: '1000+', label: 'Event Tersedia', icon: Calendar },
                                { number: '50K+', label: 'Peserta Aktif', icon: Users },
                                { number: '25K+', label: 'Sertifikat Terbit', icon: Star }
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    className="text-center group cursor-pointer"
                                    whileHover={{ scale: 1.1, y: -5 }}
                                    transition={{ duration: 0.2 }}
                                    style={{
                                        x: mousePosition.x * (index % 2 === 0 ? 0.1 : -0.1),
                                        y: mousePosition.y * (index % 2 === 0 ? -0.1 : 0.1)
                                    }}
                                >
                                    <motion.div
                                        className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors backdrop-blur-sm"
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <stat.icon className="w-6 h-6 text-primary" />
                                    </motion.div>
                                    <motion.div
                                        className="text-3xl text-primary mb-2 font-bold"
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 1 + index * 0.2, duration: 0.5 }}
                                    >
                                        {stat.number}
                                    </motion.div>
                                    <div className="text-base text-muted-foreground font-medium">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* IMAGE/GRAPHIC SIDE */}
                    <motion.div className="relative" variants={itemVariants} style={{ y: heroY }}>
                        {/* Visual Box */}
                        <motion.div
                            className="relative z-10 bg-card/80 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-border"
                            whileHover={{ scale: 1.02, rotateY: 5 }}
                            transition={{ duration: 0.3 }}
                            style={{
                                x: mousePosition.x * 0.3,
                                y: mousePosition.y * 0.2
                            }}
                        >
                            <motion.div
                                className="aspect-square bg-gradient-to-br from-accent/50 to-muted/30 rounded-2xl flex items-center justify-center border border-border relative overflow-hidden"
                                variants={floatingVariants}
                                animate="animate"
                            >
                                <div className="absolute inset-0 opacity-20">
                                    <div className="grid grid-cols-6 h-full">
                                        {Array.from({ length: 36 }).map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="border border-primary/20"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: i * 0.05 }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="text-center relative z-10">
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        style={{
                                            x: mousePosition.x * -0.2,
                                            y: mousePosition.y * -0.3
                                        }}
                                    >
                                        <Sparkles className="w-28 h-28 text-primary mx-auto mb-6" />
                                    </motion.div>
                                    <h3 className="text-2xl mb-3 text-foreground font-bold">Event Mendatang</h3>
                                    <p className="text-muted-foreground text-lg leading-relaxed">
                                        Daftar sekarang dan dapatkan early bird discount!
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Floating Icons */}
                        <motion.div className="absolute -top-6 -right-6 bg-primary rounded-2xl p-6 shadow-lg border border-border"
                            animate={{ y: [-10, 10, -10], rotate: [-10, 10, -10], scale: [1, 1.05, 1] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            whileHover={{ scale: 1.15 }}
                            style={{ x: mousePosition.x * 0.4, y: mousePosition.y * 0.3 }}
                        >
                            <Users className="w-10 h-10 text-primary-foreground" />
                        </motion.div>

                        <motion.div className="absolute -bottom-6 -left-6 bg-accent rounded-2xl p-6 shadow-lg border border-border"
                            animate={{ y: [10, -10, 10], rotate: [10, -10, 10], scale: [1, 1.05, 1] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                            whileHover={{ scale: 1.15 }}
                            style={{ x: mousePosition.x * -0.4, y: mousePosition.y * -0.3 }}
                        >
                            <Zap className="w-10 h-10 text-primary" />
                        </motion.div>

                        <motion.div className="absolute top-1/4 -left-4 w-4 h-4 bg-primary rounded-full"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            style={{ x: mousePosition.x * 0.6, y: mousePosition.y * 0.4 }}
                        />

                        <motion.div className="absolute bottom-1/4 -right-4 w-6 h-6 bg-accent rounded-full"
                            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            style={{ x: mousePosition.x * -0.6, y: mousePosition.y * -0.4 }}
                        />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
