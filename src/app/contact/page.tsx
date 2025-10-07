'use client'

import { motion } from 'framer-motion';
import { HeaderNew as Header } from '@/components/layout/HeaderNew';
import { FooterNew as Footer } from '@/components/layout/FooterNew';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header onViewChange={() => {}} currentView="contact" />

            <main className="pt-32 pb-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        {/* Page Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-16"
                        >
                            <span className="text-sm tracking-[0.3em] uppercase text-muted-foreground font-medium block mb-4">
                                GET IN TOUCH
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                                Contact{' '}
                                <span className="italic">Us</span>
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                                Have questions about our platform or need support? We&apos;re here to help!
                            </p>
                        </motion.div>

                        <div className="grid lg:grid-cols-2 gap-12">
                            {/* Contact Info */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <h2 className="text-2xl font-bold mb-8">Contact Information</h2>
                                
                                <div className="space-y-6">
                                    <motion.div
                                        whileHover={{ x: 5 }}
                                        className="flex items-start gap-4 p-6 rounded-2xl bg-card border border-border hover:border-foreground/20 transition-all"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                                            <Mail className="w-6 h-6 text-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-lg mb-1">Email</p>
                                            <a href="mailto:hello@ramein.com" className="text-muted-foreground hover:text-primary transition-colors">
                                                hello@ramein.com
                                            </a>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ x: 5 }}
                                        className="flex items-start gap-4 p-6 rounded-2xl bg-card border border-border hover:border-foreground/20 transition-all"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                                            <Phone className="w-6 h-6 text-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-lg mb-1">Phone</p>
                                            <a href="tel:+622112345678" className="text-muted-foreground hover:text-primary transition-colors">
                                                +62 21 1234 5678
                                            </a>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ x: 5 }}
                                        className="flex items-start gap-4 p-6 rounded-2xl bg-card border border-border hover:border-foreground/20 transition-all"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-6 h-6 text-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-lg mb-1">Address</p>
                                            <p className="text-muted-foreground">
                                                Jakarta, Indonesia
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Social Links */}
                                <div className="mt-12">
                                    <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
                                    <div className="flex gap-3">
                                        {['Instagram', 'Twitter', 'LinkedIn'].map((social) => (
                                            <button
                                                key={social}
                                                className="w-12 h-12 rounded-full bg-muted hover:bg-foreground hover:text-background transition-all flex items-center justify-center"
                                            >
                                                <span className="text-sm font-medium">{social[0]}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Contact Form */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <div className="bg-card border border-border rounded-3xl p-8">
                                    <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                                    
                                    <form className="space-y-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium mb-2">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:border-foreground/30 transition-colors"
                                                placeholder="Your name"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium mb-2">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:border-foreground/30 transition-colors"
                                                placeholder="your.email@example.com"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="subject" className="block text-sm font-medium mb-2">
                                                Subject
                                            </label>
                                            <input
                                                type="text"
                                                id="subject"
                                                className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:border-foreground/30 transition-colors"
                                                placeholder="What is this about?"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="message" className="block text-sm font-medium mb-2">
                                                Message
                                            </label>
                                            <textarea
                                                id="message"
                                                rows={5}
                                                className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:border-foreground/30 transition-colors resize-none"
                                                placeholder="How can we help you?"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 group"
                                        >
                                            Send Message
                                            <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </form>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
