'use client'

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Users, Award } from 'lucide-react';

interface DreamsSectionProps {
    onViewEvents: () => void;
}

export function DreamsSection({ onViewEvents }: DreamsSectionProps) {
    const features = [
        {
            icon: Calendar,
            title: 'Diverse Events',
            description: 'From workshops to conferences, find events that match your passion'
        },
        {
            icon: Users,
            title: 'Community',
            description: 'Connect with like-minded people and build lasting relationships'
        },
        {
            icon: Award,
            title: 'Certificates',
            description: 'Get recognized for your participation with official certificates'
        }
    ];

    return (
        <section className="py-24 md:py-32 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Main Content */}
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
                        {/* Left - Text */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <motion.span
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="text-sm tracking-[0.3em] uppercase text-muted-foreground font-medium block mb-6"
                            >
                                OUR MISSION
                            </motion.span>
                            
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                Bringing Dreams to Life,{' '}
                                <span className="italic">One Event at a Time!</span>
                            </h2>
                            
                            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                                We&apos;re on a mission to revolutionize event management and make quality education accessible to everyone. 
                                Whether you&apos;re looking to learn, network, or celebrate, Ramein connects you 
                                with events that matter.
                            </p>
                            
                            <Button
                                onClick={onViewEvents}
                                size="lg"
                                className="bg-primary text-primary-foreground hover:bg-primary/90 group"
                            >
                                Discover Events
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </motion.div>

                        {/* Right - Image/Visual */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="aspect-square rounded-3xl bg-gradient-to-br from-muted to-accent overflow-hidden shadow-soft">
                                <img
                                    src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=800&fit=crop"
                                    alt="Event atmosphere"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            
                            {/* Floating Stats Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="absolute -bottom-6 -left-6 bg-card p-6 rounded-2xl shadow-soft border border-border"
                            >
                                <div className="text-4xl font-bold mb-1">1000+</div>
                                <div className="text-sm text-muted-foreground">Events Hosted</div>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Features Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="text-center p-6"
                            >
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
                                    <feature.icon className="w-8 h-8 text-foreground" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
