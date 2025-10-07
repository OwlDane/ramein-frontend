'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HeaderNew as Header } from '@/components/layout/HeaderNew';
import { FooterNew as Footer } from '@/components/layout/FooterNew';
import { Mail, Phone, MessageCircle, Clock, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CustomerServicePage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement actual form submission
        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-background">
            <Header onViewChange={() => {}} currentView="contact" />

            <main className="pt-32 pb-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Hero Section with Illustration */}
                        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                            {/* Left Side - Text Content */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <span className="text-sm tracking-[0.3em] uppercase text-primary font-medium block mb-4">
                                    CUSTOMER SERVICE
                                </span>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                                    We&apos;re Here to{' '}
                                    <span className="italic text-primary">Help</span>
                                </h1>
                                <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                                    Have questions or need assistance? Our dedicated support team is ready to help you 
                                    with any inquiries about events, registrations, or platform features.
                                </p>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-4 rounded-2xl bg-muted/50">
                                        <div className="text-3xl font-bold text-primary mb-1">24/7</div>
                                        <div className="text-sm text-muted-foreground">Support Available</div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-muted/50">
                                        <div className="text-3xl font-bold text-primary mb-1">&lt;2h</div>
                                        <div className="text-sm text-muted-foreground">Response Time</div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Right Side - Illustration */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="relative"
                            >
                                <div className="relative aspect-square max-w-md mx-auto">
                                    {/* Background Circle */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full" />
                                    
                                    {/* Decorative Elements */}
                                    <div className="absolute top-10 right-10 w-20 h-20 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                                    <div className="absolute bottom-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse delay-75" />
                                    
                                    {/* Main Illustration */}
                                    <div className="relative z-10 flex items-center justify-center h-full">
                                        <div className="text-center">
                                            {/* Customer Service Representative */}
                                            <div className="relative inline-block mb-8">
                                                <div className="w-48 h-48 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                                                    <MessageCircle className="w-24 h-24 text-primary-foreground" />
                                                </div>
                                                
                                                {/* Floating Chat Bubbles */}
                                                <motion.div
                                                    animate={{ y: [-10, 10, -10] }}
                                                    transition={{ duration: 3, repeat: Infinity }}
                                                    className="absolute -top-4 -right-4 bg-card border border-border rounded-2xl p-3 shadow-lg"
                                                >
                                                    <div className="flex gap-1">
                                                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                                                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-75" />
                                                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-150" />
                                                    </div>
                                                </motion.div>

                                                <motion.div
                                                    animate={{ y: [10, -10, 10] }}
                                                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                                                    className="absolute -bottom-4 -left-4 bg-primary text-primary-foreground rounded-2xl p-3 shadow-lg"
                                                >
                                                    <CheckCircle className="w-6 h-6" />
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Contact Methods */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="grid md:grid-cols-3 gap-6 mb-16"
                        >
                            <div className="p-6 rounded-3xl bg-card border border-border hover:border-primary/30 transition-all">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                    <Mail className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Email Support</h3>
                                <p className="text-muted-foreground mb-4">Get help via email</p>
                                <a href="mailto:support@ramein.com" className="text-primary font-medium hover:underline">
                                    support@ramein.com
                                </a>
                            </div>

                            <div className="p-6 rounded-3xl bg-card border border-border hover:border-primary/30 transition-all">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                    <Phone className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Phone Support</h3>
                                <p className="text-muted-foreground mb-4">Call us directly</p>
                                <a href="tel:+6281234567890" className="text-primary font-medium hover:underline">
                                    +62 812-3456-7890
                                </a>
                            </div>

                            <div className="p-6 rounded-3xl bg-card border border-border hover:border-primary/30 transition-all">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                    <Clock className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Business Hours</h3>
                                <p className="text-muted-foreground mb-4">We&apos;re available</p>
                                <p className="text-primary font-medium">
                                    Mon - Fri: 9AM - 6PM WIB
                                </p>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="max-w-3xl mx-auto"
                        >
                            <div className="p-8 md:p-10 rounded-3xl bg-card border border-border">
                                <h2 className="text-3xl font-bold mb-2">Send us a Message</h2>
                                <p className="text-muted-foreground mb-8">
                                    Fill out the form below and we&apos;ll get back to you as soon as possible
                                </p>

                                {isSubmitted ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-12"
                                    >
                                        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle className="w-10 h-10 text-green-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                                        <p className="text-muted-foreground">
                                            Thank you for contacting us. We&apos;ll respond within 24 hours.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium mb-2">
                                                    Full Name*
                                                </label>
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder="John Doe"
                                                    required
                                                    className="h-12"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium mb-2">
                                                    Email Address*
                                                </label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    placeholder="john@example.com"
                                                    required
                                                    className="h-12"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="subject" className="block text-sm font-medium mb-2">
                                                Subject*
                                            </label>
                                            <Input
                                                id="subject"
                                                type="text"
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                placeholder="How can we help you?"
                                                required
                                                className="h-12"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="message" className="block text-sm font-medium mb-2">
                                                Message*
                                            </label>
                                            <textarea
                                                id="message"
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                placeholder="Tell us more about your inquiry..."
                                                required
                                                rows={6}
                                                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full h-12 text-base font-semibold gap-2"
                                        >
                                            <Send className="w-5 h-5" />
                                            Send Message
                                        </Button>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
