'use client'

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { apiFetch, buildQuery } from '@/lib/api';
import type { BackendEvent } from '@/types/event';
import { format, parseISO } from 'date-fns';

interface UpcomingEventsSectionProps {
    onEventSelect: (eventId: string) => void;
    onViewAllEvents?: () => void;
}

export function UpcomingEventsSection({ onEventSelect, onViewAllEvents }: UpcomingEventsSectionProps) {
    const [events, setEvents] = useState<BackendEvent[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUpcomingEvents = useCallback(async () => {
        setLoading(true);
        try {
            const query = buildQuery({
                sort: 'nearest',
                limit: 4  // Only show 4 upcoming events
            });
            const fetchedEvents = await apiFetch<BackendEvent[]>(`/events${query}`);
            setEvents(fetchedEvents);
        } catch (err) {
            console.error('Failed to fetch events:', err);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUpcomingEvents();
    }, [fetchUpcomingEvents]);

    const formatEventDate = (dateString: string) => {
        try {
            const date = parseISO(dateString);
            return {
                day: format(date, 'dd'),
                month: format(date, 'MMM'),
                year: format(date, 'yyyy')
            };
        } catch {
            return { day: '01', month: 'Jan', year: '2025' };
        }
    };

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
        <section className="py-24 md:py-32 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mb-16"
                    >
                        <span className="text-sm tracking-[0.3em] uppercase text-muted-foreground font-medium block mb-4">
                            UPCOMING
                        </span>
                        <div className="flex items-end justify-between">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                                Upcoming Live
                            </h2>
                        </div>
                    </motion.div>

                    {/* Events List - Redesigned */}
                    {events.length > 0 ? (
                        <>
                        <div className="space-y-3 mb-12">
                            {events.slice(0, 4).map((event, index) => {
                                const dateInfo = formatEventDate(event.date);
                                
                                return (
                                    <motion.div
                                        key={event.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ 
                                            duration: 0.5, 
                                            delay: index * 0.1,
                                            ease: [0.22, 1, 0.36, 1]
                                        }}
                                        onClick={() => onEventSelect(event.id)}
                                        className="group cursor-pointer"
                                    >
                                        <div className="relative bg-card rounded-2xl overflow-hidden border border-border hover:border-foreground/30 transition-all duration-300">
                                            {/* Animated Background Gradient on Hover */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                            
                                            <div className="relative flex gap-4 md:gap-6 items-center p-4 md:p-6">
                                                {/* Date Box - Redesigned */}
                                                <motion.div 
                                                    className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden"
                                                    whileHover={{ scale: 1.05, rotate: 5 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    {/* Animated background */}
                                                    <div className="absolute inset-0 bg-gradient-to-br from-foreground to-foreground/80 group-hover:from-primary group-hover:to-primary/80 transition-all duration-300" />
                                                    
                                                    <div className="relative text-background">
                                                        <div className="text-2xl md:text-3xl font-black leading-none">{dateInfo.day}</div>
                                                        <div className="text-[10px] md:text-xs font-bold uppercase mt-0.5 tracking-wider">{dateInfo.month}</div>
                                                    </div>
                                                </motion.div>

                                                {/* Event Info */}
                                                <div className="flex-1 min-w-0">
                                                    <motion.h3 
                                                        className="text-lg md:text-xl font-bold mb-1.5 line-clamp-1 group-hover:text-primary transition-colors"
                                                        whileHover={{ x: 5 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        {event.title}
                                                    </motion.h3>
                                                    
                                                    <p className="text-xs md:text-sm text-muted-foreground mb-2 line-clamp-1">
                                                        {event.description}
                                                    </p>
                                                    
                                                    <div className="flex flex-wrap gap-3 md:gap-4 text-xs text-muted-foreground">
                                                        {event.time && (
                                                            <div className="flex items-center gap-1.5">
                                                                <Clock className="w-3.5 h-3.5" />
                                                                <span>{event.time}</span>
                                                            </div>
                                                        )}
                                                        {event.location && (
                                                            <div className="flex items-center gap-1.5">
                                                                <MapPin className="w-3.5 h-3.5" />
                                                                <span className="line-clamp-1">{event.location}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Arrow - Animated */}
                                                <motion.div 
                                                    className="flex-shrink-0 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-muted group-hover:bg-foreground transition-all duration-300"
                                                    whileHover={{ scale: 1.1, rotate: -45 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <ArrowRight className="w-5 h-5 text-foreground group-hover:text-background transition-colors" />
                                                </motion.div>
                                            </div>

                                            {/* Progress bar animation on hover */}
                                            <motion.div
                                                className="absolute bottom-0 left-0 h-0.5 bg-primary"
                                                initial={{ width: 0 }}
                                                whileHover={{ width: '100%' }}
                                                transition={{ duration: 0.4 }}
                                            />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                        
                        {/* CTA Button */}
                        {onViewAllEvents && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="text-center"
                            >
                                <Button
                                    onClick={onViewAllEvents}
                                    size="lg"
                                    variant="outline"
                                    className="group border-2"
                                >
                                    View All Events
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </motion.div>
                        )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No upcoming events at the moment.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
