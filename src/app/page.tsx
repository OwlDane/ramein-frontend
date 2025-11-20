"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/common/Hero";
import { DreamsSection } from "@/components/common/DreamsSection";
import { Footer } from "@/components/layout/Footer";
import { FeaturedEventsSection } from "@/components/event/FeaturedEventsSection";
import { FAQSection } from "@/components/common/FAQSection";
import { ContactSection } from "@/components/common/ContactSection";
import { BackToTop } from "@/components/common/BackToTop";

export default function HomePage() {
  const router = useRouter();

  const handleViewEvents = () => {
    router.push('/events');
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Header currentView="home" />

      <motion.main
        initial="initial"
        animate="animate"
        variants={pageVariants}
        className="pt-20 sm:pt-24"
      >
        <Hero onViewEvents={handleViewEvents} />
        <DreamsSection onViewEvents={handleViewEvents} />
        <FeaturedEventsSection onViewEvents={handleViewEvents} />
        <FAQSection />
        <ContactSection />
      </motion.main>

      <Footer />
      <BackToTop />
    </div>
  );
}
