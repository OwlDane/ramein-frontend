import React, { useState, useCallback } from 'react';
import { Mail, Phone, MapPin, Sparkles } from 'lucide-react';
import { PopupContent } from './PopupContent';

export function Footer() {
    const [popupType, setPopupType] = useState<'privacy' | 'terms' | null>(null);

    const handlePopupOpen = useCallback((type: 'privacy' | 'terms') => {
        setPopupType(type);
    }, []);

    const handlePopupClose = useCallback(() => {
        setPopupType(null);
    }, []);

    return (
        <footer className="bg-card border-t border-border">
            <div className="container mx-auto px-4 py-6">
                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {/* Company Info */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center shadow-glow">
                                <Sparkles className="w-4 h-4 text-primary-foreground" />
                            </div>
                            <span className="text-base font-semibold text-foreground">Ramein</span>
                        </div>
                        <p className="text-muted-foreground text-xs leading-relaxed mb-3 max-w-md">
                            Platform event terpercaya yang menghubungkan peserta dengan pengalaman berkualitas tinggi.
                        </p>
                        
                        {/* Contact Info */}
                        <div className="space-y-1.5 mb-3">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                                <Mail className="w-3 h-3 text-primary" />
                                <span>hello@ramein.com</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                                <Phone className="w-3 h-3 text-primary" />
                                <span>+62 21 1234 5678</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                                <MapPin className="w-3 h-3 text-primary" />
                                <span>Jakarta, Indonesia</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-foreground font-medium mb-2 text-xs">Perusahaan</h3>
                        <ul className="space-y-1.5">
                            {['Tentang Kami', 'Tim Kami', 'Karir', 'Press Kit'].map((link) => (
                                <li key={link}>
                                    <button className="text-xs text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 duration-200">
                                        {link}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-foreground font-medium mb-2 text-xs">Newsletter</h3>
                        <p className="text-xs text-muted-foreground mb-2">
                            Dapatkan update event terbaru
                        </p>
                        <div className="space-y-1.5">
                            <input
                                type="email"
                                placeholder="Email Anda"
                                className="w-full px-2 py-1.5 text-xs bg-background border border-border rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                            />
                            <button className="w-full px-2 py-1.5 text-xs bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-all shadow-glow hover:shadow-glow-hover">
                                Contact Us
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-border mt-4 pt-3">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
                        <span className="text-xs">© 2024 Ramein. All rights reserved.</span>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => handlePopupOpen('privacy')}
                                className="hover:text-foreground transition-colors text-xs hover:translate-y-[-1px] duration-200"
                            >
                                Privacy Policy
                            </button>
                            <button 
                                onClick={() => handlePopupOpen('terms')}
                                className="hover:text-foreground transition-colors text-xs hover:translate-y-[-1px] duration-200"
                            >
                                Terms of Service
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Popup Content */}
            {popupType && (
                <PopupContent
                    type={popupType}
                    isOpen={!!popupType}
                    onClose={handlePopupClose}
                />
            )}
        </footer>
    );
}