import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Users, Award, Target, Sparkles, ArrowRight,
    CheckCircle, Globe, Clock, Shield, Heart
} from 'lucide-react';

export function AboutSection() {
    const stats = [
        { icon: Users, value: '50K+', label: 'Active Users', description: 'Pengguna aktif bergabung setiap bulan' },
        { icon: Award, value: '1000+', label: 'Events Hosted', description: 'Event berkualitas telah diselenggarakan' },
        { icon: Globe, value: '25+', label: 'Cities', description: 'Kota di Indonesia telah terjangkau' },
        { icon: Clock, value: '24/7', label: 'Support', description: 'Dukungan customer service terbaik' }
    ];

    const features = [
        {
            icon: Target,
            title: 'Kurasi Berkualitas',
            description: 'Setiap event dikurasi dengan standar tinggi untuk memastikan kualitas terbaik bagi peserta.'
        },
        {
            icon: Shield,
            title: 'Aman & Terpercaya',
            description: 'Sistem keamanan berlapis dan sertifikat resmi untuk setiap event yang diselenggarakan.'
        },
        {
            icon: Heart,
            title: 'Community Driven',
            description: 'Membangun komunitas yang kuat dengan fokus pada pengembangan skill dan networking.'
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
                ease: "easeOut"
            }
        }
    };

    return (
        <section className="py-16 lg:py-24 bg-gradient-to-br from-muted/30 to-accent/20 relative overflow-hidden">
            {/* Background Pattern */}
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
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-center mb-12 lg:mb-16"
                >
                    <motion.div
                        variants={itemVariants}
                        className="inline-flex items-center gap-2 mb-6"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-primary" />
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-foreground font-bold tracking-tight mobile-text-2xl">
                            Tentang <span className="text-primary">Ramein</span>
                        </h2>
                    </motion.div>

                    <motion.p
                        variants={itemVariants}
                        className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mobile-text-base"
                    >
                        Platform event terdepan yang menghubungkan peserta dengan pengalaman berkualitas tinggi.
                        Kami berkomitmen membangun komunitas pembelajar yang kuat dan memberdayakan setiap individu
                        untuk mencapai potensi terbaik mereka.
                    </motion.p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-16 lg:mb-20"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ scale: 1.05, y: -5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Card className="h-full bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
                                <CardContent className="p-4 lg:p-6 text-center">
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

                                    <h3 className="text-base lg:text-lg font-medium text-foreground mb-2 mobile-text-sm">
                                        {stat.label}
                                    </h3>

                                    <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-tight mobile-text-xs">
                                        {stat.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="space-y-6 lg:space-y-8"
                    >
                        <motion.div variants={itemVariants}>
                            <Badge className="bg-primary/10 text-primary border-primary/20 mb-4 lg:mb-6 text-sm lg:text-base mobile-text-xs">
                                Mengapa Memilih Ramein?
                            </Badge>

                            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 lg:mb-6 leading-tight mobile-text-xl">
                                Platform Event Terpercaya untuk
                                <span className="text-primary"> Masa Depan Anda</span>
                            </h3>

                            <p className="text-base lg:text-lg text-muted-foreground leading-relaxed mb-6 lg:mb-8 mobile-text-sm">
                                Sejak didirikan, Ramein telah menjadi pilihan utama untuk pengembangan skill dan networking.
                                Kami menghadirkan event-event berkualitas tinggi dengan mentor berpengalaman dan
                                komunitas yang mendukung pertumbuhan setiap peserta.
                            </p>
                        </motion.div>

                        {/* Features */}
                        <motion.div variants={itemVariants} className="space-y-4 lg:space-y-6">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    className="flex items-start gap-3 lg:gap-4 group"
                                    whileHover={{ x: 10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <motion.div
                                        className="w-10 h-10 lg:w-12 lg:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors"
                                        whileHover={{ rotate: 360, scale: 1.1 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <feature.icon className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                                    </motion.div>

                                    <div>
                                        <h4 className="text-lg lg:text-xl font-medium text-foreground mb-1 lg:mb-2 mobile-text-base">
                                            {feature.title}
                                        </h4>
                                        <p className="text-sm lg:text-base text-muted-foreground leading-relaxed mobile-text-sm">
                                            {feature.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* CTA */}
                        <motion.div
                            variants={itemVariants}
                            className="pt-4 lg:pt-6"
                        >
                            <motion.div
                                className="inline-flex items-center gap-2 text-primary font-medium cursor-pointer group"
                                whileHover={{ x: 5 }}
                                transition={{ duration: 0.2 }}
                            >
                                <span className="text-base lg:text-lg mobile-text-sm">Pelajari lebih lanjut tentang kami</span>
                                <motion.div
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6 group-hover:translate-x-1 transition-transform" />
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Right Visual */}
                    <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <Card className="bg-gradient-to-br from-primary/5 to-accent/10 border-primary/20 p-6 lg:p-8 overflow-hidden">
                            <CardContent className="p-0 relative">
                                {/* Background Pattern */}
                                <div className="absolute inset-0 opacity-10">
                                    <div className="grid grid-cols-8 h-full">
                                        {Array.from({ length: 64 }).map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="border border-primary/20"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: i * 0.02 }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Central Icon */}
                                <div className="relative z-10 text-center">
                                    <motion.div
                                        className="w-20 h-20 lg:w-24 lg:h-24 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 lg:mb-8"
                                        animate={{
                                            scale: [1, 1.1, 1],
                                            rotate: [0, 5, -5, 0]
                                        }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        <Sparkles className="w-10 h-10 lg:w-12 lg:h-12 text-primary" />
                                    </motion.div>

                                    <h4 className="text-xl lg:text-2xl font-bold text-foreground mb-3 lg:mb-4 mobile-text-lg">
                                        Join Our Community
                                    </h4>

                                    <p className="text-sm lg:text-base text-muted-foreground leading-relaxed mobile-text-sm">
                                        Bergabunglah dengan ribuan professional yang telah mempercayai Ramein
                                        untuk mengembangkan karir dan memperluas network mereka.
                                    </p>
                                </div>

                                {/* Floating Elements */}
                                <motion.div
                                    className="absolute top-6 right-6 w-6 h-6 lg:w-8 lg:h-8 bg-primary/20 rounded-full"
                                    animate={{
                                        y: [-10, 10, -10],
                                        scale: [1, 1.2, 1]
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />

                                <motion.div
                                    className="absolute bottom-6 left-6 w-4 h-4 lg:w-6 lg:h-6 bg-accent/40 rounded-full"
                                    animate={{
                                        y: [10, -10, 10],
                                        scale: [1.2, 1, 1.2]
                                    }}
                                    transition={{
                                        duration: 2.5,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: 1
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}