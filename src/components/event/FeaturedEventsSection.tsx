"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ArrowRight, Loader2 } from "lucide-react";
import { apiFetch, buildQuery } from "@/lib/api";
import type { BackendEvent } from "@/types/event";
import { format } from "date-fns";

interface FeaturedEventsSectionProps {
  onViewEvents: () => void;
}

export function FeaturedEventsSection({
  onViewEvents,
}: FeaturedEventsSectionProps) {
  const [events, setEvents] = useState<BackendEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeaturedEvents = useCallback(async () => {
    setLoading(true);
    try {
      const query = buildQuery({
        sort: "nearest",
        limit: 3, // Only show 3 featured events
      });
      const fetchedEvents = await apiFetch<BackendEvent[]>(`/events${query}`);
      setEvents(fetchedEvents);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      // Set empty array on error
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedEvents();
  }, [fetchFeaturedEvents]);

  if (loading) {
    return (
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-sm tracking-[0.3em] uppercase text-muted-foreground font-medium block mb-4">
              FEATURED EVENTS
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Your Story, <span className="italic">Our Stage</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover events that inspire, connect, and transform
            </p>
          </motion.div>

          {/* Events Grid - Redesigned */}
          {events.length > 0 ? (
            <>
              <div className="grid md:grid-cols-3 gap-4 mb-12">
                {events.slice(0, 3).map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.15,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="group cursor-pointer"
                  >
                    <div className="relative h-[400px] rounded-3xl overflow-hidden bg-gradient-to-br from-muted to-accent">
                      {/* Background Image with Overlay */}
                      <div className="absolute inset-0">
                        <Image
                          src={
                            event.flyer ||
                            `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=600&fit=crop&seed=${event.id}`
                          }
                          alt={event.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                      </div>

                      {/* Content */}
                      <div className="absolute inset-0 p-6 flex flex-col justify-end">
                        {/* Date Badge */}
                        <motion.div
                          className="absolute top-6 right-6 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full"
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className="flex items-center gap-2 text-xs font-medium">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {event.date
                                ? format(new Date(event.date), "MMM dd")
                                : "TBA"}
                            </span>
                          </div>
                        </motion.div>

                        {/* Title & Info */}
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ delay: index * 0.15 + 0.2 }}
                        >
                          <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2">
                            {event.title}
                          </h3>

                          {event.location && (
                            <div className="flex items-center gap-2 text-white/80 text-sm mb-3">
                              <MapPin className="w-4 h-4" />
                              <span className="line-clamp-1">
                                {event.location}
                              </span>
                            </div>
                          )}

                          {/* Hover Action */}
                          <motion.div
                            className="flex items-center gap-2 text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            whileHover={{ x: 5 }}
                          >
                            <span className="text-sm">View Details</span>
                            <ArrowRight className="w-4 h-4" />
                          </motion.div>
                        </motion.div>
                      </div>

                      {/* Animated Border on Hover */}
                      <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 rounded-3xl transition-all duration-300" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center"
              >
                <Button
                  onClick={onViewEvents}
                  size="lg"
                  variant="outline"
                  className="group border-2"
                >
                  View All Events
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No featured events available at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
