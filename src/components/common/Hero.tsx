"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { BackendEvent } from "@/types/event";

interface HeroProps {
  onViewEvents: () => void;
}

export function Hero({ onViewEvents }: HeroProps) {
  const [events, setEvents] = useState<BackendEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await apiFetch<{ events: BackendEvent[] }>(
          '/events?limit=6&status=PUBLISHED'
        );
        setEvents(response.events || []);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const fallbackImages = [
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=500&fit=crop",
  ];

  const displayImages = events.length > 0 
    ? events.slice(0, 6).map(e => e.flyer || fallbackImages[0])
    : fallbackImages;

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-screen-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <span className="text-sm tracking-[0.3em] uppercase text-muted-foreground font-medium">
            RAMEIN
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-display-xl mb-6">
            <span className="block">AWESOME</span>
            <span className="block">EVENTS!</span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Discover and join amazing events that match your interests. Create
            unforgettable memories with Ramein.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Button
              onClick={onViewEvents}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base font-medium group"
            >
              Explore Events
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 max-w-[1400px] mx-auto"
        >
          {loading ? (
            <div className="col-span-full flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            displayImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-soft cursor-pointer group"
              >
                <Image
                  src={image}
                  alt={`Event ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-muted-foreground">
            Scroll down to explore more
          </p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="mt-4"
          >
            <svg
              className="w-6 h-6 mx-auto text-muted-foreground"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}