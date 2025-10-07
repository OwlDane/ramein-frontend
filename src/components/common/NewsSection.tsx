'use client'

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';

interface NewsItem {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    readTime: string;
    image: string;
    date: string;
}

export function NewsSection() {
    // Dummy data for news/blog posts
    const newsItems: NewsItem[] = [
        {
            id: '1',
            title: 'How to Make the Most of Virtual Events',
            excerpt: 'Discover strategies to maximize your virtual event experience and build meaningful connections online.',
            category: 'Tips & Tricks',
            readTime: '5 min read',
            image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&h=600&fit=crop',
            date: 'Dec 15, 2024'
        },
        {
            id: '2',
            title: 'Top Event Trends for 2025',
            excerpt: 'Explore the latest trends shaping the event industry and what to expect in the coming year.',
            category: 'Industry Insights',
            readTime: '7 min read',
            image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop',
            date: 'Dec 10, 2024'
        },
        {
            id: '3',
            title: 'Building Community Through Events',
            excerpt: 'Learn how events can foster strong communities and create lasting relationships among participants.',
            category: 'Community',
            readTime: '6 min read',
            image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
            date: 'Dec 5, 2024'
        }
    ];

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
                            BLOG
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            News, Insight,{' '}
                            <span className="italic">and more</span>
                        </h2>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                            Stay updated with the latest stories, tips, and insights from the event world
                        </p>
                    </motion.div>

                    {/* News Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {newsItems.map((item, index) => (
                            <motion.article
                                key={item.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{ y: -8 }}
                                className="group cursor-pointer"
                            >
                                <div className="bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-soft-hover transition-all duration-300 border border-border h-full flex flex-col">
                                    {/* Image */}
                                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm text-foreground">
                                                {item.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                                            <span>{item.date}</span>
                                            <span>•</span>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                <span>{item.readTime}</span>
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                            {item.title}
                                        </h3>

                                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                                            {item.excerpt}
                                        </p>

                                        <button className="flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all">
                                            Read More
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-center"
                    >
                        <Link href="/articles">
                            <Button
                                size="lg"
                                variant="outline"
                                className="group border-2"
                            >
                                View All Articles
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
