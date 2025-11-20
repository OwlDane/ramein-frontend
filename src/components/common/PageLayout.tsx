"use client";

import React from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/common/BackToTop";

interface PageLayoutProps {
  children: React.ReactNode;
  currentView: "home" | "events" | "articles" | "contact" | "dashboard" | "login" | "register";
}

export function PageLayout({ children, currentView }: PageLayoutProps) {
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3, ease: "easeIn" as const },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Header currentView={currentView} />

      <motion.main
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="pt-20 sm:pt-24"
      >
        {children}
      </motion.main>

      <Footer />
      <BackToTop />
    </div>
  );
}
