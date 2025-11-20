"use client";

import { useState, useEffect } from "react";
import Image from "next/image"; 
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface BannerContent {
    id: number;
    title: string;
    subtitle: string;
    buttonText: string;
    backgroundImage: string;
}

const bannerContents: BannerContent[] = [
    {
        id: 1,
        title: "JANGAN LEWATKAN EVENT TERBARU KAMI",
        subtitle: "Daftar sekarang dan dapatkan diskon 20% untuk event pilihan",
        buttonText: "Daftar Sekarang",
        backgroundImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=400&fit=crop",
    },
    {
        id: 3,
        title: "SERTIFIKAT RESMI UNTUK SETIAP EVENT",
        subtitle: "Tingkatkan skill Anda dan dapatkan pengakuan profesional",
        buttonText: "Jelajahi Event",
        backgroundImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=400&fit=crop",
    },
    {
        id: 4,
        title: "PROMO SPESIAL BULAN INI",
        subtitle: "Daftar 3 event, gratis 1 event pilihan Anda",
        buttonText: "Lihat Penawaran",
        backgroundImage: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1200&h=400&fit=crop",
    },
];

export function EventBanner() {
    const [currentBanner, setCurrentBanner] = useState(0);
    const [autoPlay, setAutoPlay] = useState(true);

    useEffect(() => {
        if (!autoPlay) return;

        const timer = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % bannerContents.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [autoPlay]);

    const handlePrev = () => {
        setCurrentBanner(
            (prev) => (prev - 1 + bannerContents.length) % bannerContents.length
        );
        setAutoPlay(false);
    };

    const handleNext = () => {
        setCurrentBanner((prev) => (prev + 1) % bannerContents.length);
        setAutoPlay(false);
    };

    const banner = bannerContents[currentBanner];

    return (
        <section className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-screen-2xl">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={banner.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="relative overflow-hidden rounded-3xl h-80 md:h-96 lg:h-[400px]"
                    >
                        {/* Background Image */}
                        <Image
                            src={banner.backgroundImage}
                            alt={banner.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                            priority
                        />

                        {/* Dark Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />

                        {/* Content */}
                        <div className="relative z-10 h-full flex flex-col justify-center p-8 md:p-12 lg:p-16">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="max-w-2xl"
                            >
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
                                    {banner.title}
                                </h2>
                                <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                                    {banner.subtitle}
                                </p>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button
                                        size="lg"
                                        className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-8 py-3 text-base shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        {banner.buttonText}
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* Navigation Dots */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2"
                        >
                            {bannerContents.map((_, index) => (
                                <motion.button
                                    key={index}
                                    onClick={() => {
                                        setCurrentBanner(index);
                                        setAutoPlay(false);
                                    }}
                                    className={`h-2 rounded-full transition-all duration-300 ${index === currentBanner
                                            ? "bg-white w-8"
                                            : "bg-white/50 w-2 hover:bg-white/75"
                                        }`}
                                    whileHover={{ scale: 1.2 }}
                                />
                            ))}
                        </motion.div>

                        {/* Arrow Navigation */}
                        <motion.button
                            onClick={handlePrev}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </motion.button>

                        <motion.button
                            onClick={handleNext}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </motion.button>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}