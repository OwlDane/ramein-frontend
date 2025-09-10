import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Calendar, User, LogOut, Home, ArrowRight, Sparkles, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { PopupContent } from '@/components/PopupContent';

interface HeaderProps {
    onViewChange: (view: 'home' | 'events' | 'dashboard' | 'event-detail' | 'contact') => void;
    currentView: string;
}

export function Header({ onViewChange, currentView }: HeaderProps) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const isLoggedIn = !!user;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [popupType, setPopupType] = useState<'about' | 'contact' | 'faq' | 'privacy' | 'terms' | null>(null);

    // Mouse trail effect - multiple elements with different speeds for 3D depth
    const [trailElements, setTrailElements] = useState([
        { x: 0, y: 0, speed: 0.1, size: 8, opacity: 0.8 },    // Fastest, largest
        { x: 0, y: 0, speed: 0.2, size: 6, opacity: 0.6 },    // Medium speed, medium size
        { x: 0, y: 0, speed: 0.3, size: 4, opacity: 0.4 },    // Slower, smaller
        { x: 0, y: 0, speed: 0.4, size: 3, opacity: 0.3 },    // Slowest, smallest
    ]);

    // Mouse tracking effect for trail
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isMenuOpen) {
                const rect = document.body.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                setMousePosition({ x, y });
                
                // Update trail elements with different speeds for 3D depth effect
                setTrailElements(prev => prev.map((element) => ({
                    ...element,
                    x: x * element.speed + (1 - element.speed) * element.x,
                    y: y * element.speed + (1 - element.speed) * element.y,
                })));
            }
        };

        if (isMenuOpen) {
            window.addEventListener('mousemove', handleMouseMove);
        }

        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isMenuOpen]);

    const navigation = useMemo(() => [
        { name: 'Beranda', view: 'home' as const, icon: Home, description: 'Halaman utama dan informasi terbaru' },
        { name: 'Event', view: 'events' as const, icon: Calendar, description: 'Jelajahi semua event yang tersedia' },
        { name: 'Contact', view: 'contact' as const, icon: Mail, description: 'Hubungi tim kami untuk bantuan' },
    ], []);

    const handleNavigation = useCallback((view: 'home' | 'events' | 'dashboard' | 'event-detail' | 'contact') => {
        onViewChange(view);
        setIsMenuOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [onViewChange]);

    const handleDashboard = useCallback(() => {
        if (isLoggedIn) {
            onViewChange('dashboard');
            setIsMenuOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            router.push('/login');
            setIsMenuOpen(false);
        }
    }, [isLoggedIn, router, onViewChange]);

    const handlePopupOpen = useCallback((type: 'about' | 'contact' | 'faq' | 'privacy' | 'terms') => {
        setPopupType(type);
    }, []);

    const handlePopupClose = useCallback(() => {
        setPopupType(null);
    }, []);

    const menuVariants = useMemo(() => ({
        closed: {
            opacity: 0,
            transition: {
                duration: 0.3,
                ease: "easeInOut" as const
            }
        },
        open: {
            opacity: 1,
            transition: {
                duration: 0.3,
                ease: "easeInOut" as const
            }
        }
    }), []);

    const menuItemVariants = useMemo(() => ({
        closed: {
            opacity: 0,
            y: 50,
            transition: { duration: 0.2 }
        },
        open: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1 + 0.2,
                duration: 0.4,
                ease: "easeOut" as const
            }
        })
    }), []);

    return (
        <>
            <motion.header
                className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" as const }}
            >
                <div className="container mx-auto px-3 sm:px-4">
                    <div className="flex items-center justify-between h-14 sm:h-16">
                        {/* Logo */}
                        <motion.button
                            onClick={() => handleNavigation('home')}
                            className="flex items-center gap-2 group"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.div
                                className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg sm:rounded-xl flex items-center justify-center shadow-glow group-hover:shadow-glow-hover transition-all duration-200"
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                            >
                                <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-primary-foreground" />
                            </motion.div>
                            <motion.span
                                className="text-sm sm:text-lg text-primary tracking-tight mobile-text-sm"
                                whileHover={{ x: 5 }}
                                transition={{ duration: 0.2 }}
                                style={{ fontWeight: 'var(--font-weight-bold)' }}
                            >
                                Ramein
                            </motion.span>
                        </motion.button>

                        {/* Center Text - Only when menu is closed and on desktop */}
                        <AnimatePresence>
                            {!isMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                    className="hidden md:block absolute left-1/2 transform -translate-x-1/2"
                                >
                                    <span className="text-xs lg:text-sm text-muted-foreground tracking-wide uppercase font-medium">
                                        Find Your Perfect Event
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* User Section & Hamburger */}
                        <div className="flex items-center gap-2 sm:gap-4">
                            {/* User Avatar - Only when logged in and menu closed */}
                            <AnimatePresence>
                                {isLoggedIn && !isMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.2 }}
                                        className="hidden sm:block"
                                    >
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <motion.div
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <Button variant="ghost" className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full hover:bg-accent">
                                                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                                                            <AvatarImage src={undefined} alt={user?.name ?? 'User avatar'} />
                                                            <AvatarFallback className="bg-primary text-primary-foreground text-xs sm:text-sm">
                                                                {user?.name?.charAt(0) || 'U'}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    </Button>
                                                </motion.div>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-56 bg-card border-border" align="end">
                                                <DropdownMenuItem onClick={() => handleNavigation('dashboard')} className="hover:bg-accent">
                                                    <User className="w-4 h-4 mr-2" />
                                                    Dashboard
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={logout} className="hover:bg-accent">
                                                    <LogOut className="w-4 h-4 mr-2" />
                                                    Logout
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Mobile-optimized Hamburger Button */}
                            <motion.button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="relative z-50 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg hover:bg-accent transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                            >
                                <motion.div
                                    animate={isMenuOpen ? "open" : "closed"}
                                    className="w-6 h-6 sm:w-7 sm:h-7 flex flex-col justify-center items-center gap-1"
                                >
                                    <motion.span
                                        variants={{
                                            closed: { rotate: 0, y: 0, opacity: 1 },
                                            open: { rotate: 45, y: 8, opacity: 1 }
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className="w-5 h-1 sm:w-6 sm:h-1 bg-foreground block rounded-full shadow-sm"
                                    />
                                    <motion.span
                                        variants={{
                                            closed: { opacity: 1, x: 0 },
                                            open: { opacity: 0, x: -10 }
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className="w-5 h-1 sm:w-6 sm:h-1 bg-foreground block rounded-full shadow-sm"
                                    />
                                    <motion.span
                                        variants={{
                                            closed: { rotate: 0, y: 0, opacity: 1 },
                                            open: { rotate: -45, y: -8, opacity: 1 }
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className="w-5 h-1 sm:w-6 sm:h-1 bg-foreground block rounded-full shadow-sm"
                                    />
                                </motion.div>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Full Screen Menu Overlay with Mouse Tracking */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className="fixed inset-0 z-40 bg-background text-foreground"
                        variants={menuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                    >
                        <div className="container mx-auto px-4 h-full flex flex-col justify-center">
                            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center h-full py-16 lg:py-20">
                                {/* Navigation Menu */}
                                <motion.div
                                    className="space-y-6 lg:space-y-8"
                                >
                                    <motion.div
                                        variants={menuItemVariants}
                                        custom={0}
                                        initial="closed"
                                        animate="open"
                                        exit="closed"
                                        className="mb-8 lg:mb-12"
                                    >
                                        <h2 className="text-lg sm:text-xl text-foreground/80 mb-2 font-bold mobile-text-lg">Navigasi</h2>
                                        <div className="w-16 lg:w-20 h-1 bg-primary/40"></div>
                                    </motion.div>

                                    <nav className="space-y-4 lg:space-y-8">
                                        {navigation.map((item, index) => (
                                            <motion.button
                                                key={item.name}
                                                onClick={() => handleNavigation(item.view)}
                                                className={`group flex items-center justify-between w-full text-left transition-all duration-300 hover:translate-x-2 lg:hover:translate-x-4 ${currentView === item.view ? 'text-foreground' : 'text-foreground/80 hover:text-foreground'
                                                    }`}
                                                variants={menuItemVariants}
                                                custom={index + 1}
                                                initial="closed"
                                                animate="open"
                                                exit="closed"
                                                whileHover={{ x: 10 }}
                                                transition={{ duration: 0.2 }}

                                            >
                                                <div className="flex items-center gap-3 lg:gap-4">
                                                    <motion.div
                                                        className={`p-2 lg:p-3 rounded-lg transition-all duration-300 ${currentView === item.view
                                                                ? 'bg-primary/20'
                                                                : 'bg-accent/50 group-hover:bg-primary/20'
                                                            }`}
                                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                                    >
                                                        <item.icon className="w-4 h-4 lg:w-5 lg:h-5" />
                                                    </motion.div>
                                                    <div>
                                                        <div className="text-base sm:text-lg lg:text-xl xl:text-2xl mb-1 font-bold mobile-text-base">
                                                            {item.name}
                                                        </div>
                                                        <div className="text-xs sm:text-xs lg:text-sm text-muted-foreground mobile-text-xs">
                                                            {item.description}
                                                        </div>
                                                    </div>
                                                </div>
                                                <motion.div
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                    whileHover={{ x: 5 }}
                                                >
                                                    <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6" />
                                                </motion.div>
                                            </motion.button>
                                        ))}
                                    </nav>

                                    {/* Dashboard/Login */}
                                    <motion.button
                                        onClick={handleDashboard}
                                        className={`group flex items-center justify-between w-full text-left transition-all duration-300 hover:translate-x-2 lg:hover:translate-x-4 ${currentView === 'dashboard' ? 'text-foreground' : 'text-foreground/80 hover:text-foreground'
                                            }`}
                                        variants={menuItemVariants}
                                        custom={navigation.length + 1}
                                        initial="closed"
                                        animate="open"
                                        exit="closed"
                                        whileHover={{ x: 10 }}
                                        transition={{ duration: 0.2 }}

                                    >
                                        <div className="flex items-center gap-3 lg:gap-4">
                                            <motion.div
                                                className={`p-2 lg:p-3 rounded-lg transition-all duration-300 ${currentView === 'dashboard'
                                                        ? 'bg-primary/20'
                                                        : 'bg-accent/50 group-hover:bg-primary/20'
                                                    }`}
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                            >
                                                <User className="w-4 h-4 lg:w-5 lg:h-5" />
                                            </motion.div>
                                            <div>
                                                <div className="text-base sm:text-lg lg:text-xl xl:text-2xl mb-1 font-bold mobile-text-base">
                                                    {isLoggedIn ? 'Dashboard' : 'Masuk'}
                                                </div>
                                                <div className="text-xs sm:text-xs lg:text-sm text-muted-foreground mobile-text-xs">
                                                    {isLoggedIn ? 'Kelola akun dan riwayat event' : 'Login atau daftar akun baru'}
                                                </div>
                                            </div>
                                        </div>
                                        <motion.div
                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            whileHover={{ x: 5 }}
                                        >
                                            <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6" />
                                        </motion.div>
                                    </motion.button>
                                </motion.div>

                                {/* User Info if logged in - Mobile optimized */}
                                {isLoggedIn && (
                                    <motion.div
                                        variants={menuItemVariants}
                                        custom={navigation.length + 2}
                                        initial="closed"
                                        animate="open"
                                        exit="closed"                                    >
                                    </motion.div>
                                )}

                                {/* Mouse Trail Effect for 3D Depth */}
                                <motion.div
                                    className="hidden lg:block fixed inset-0 pointer-events-none z-10"
                                    variants={menuItemVariants}
                                    custom={navigation.length + 3}
                                    initial="closed"
                                    animate="open"
                                    exit="closed"
                                >
                                    {/* Trail Elements with different speeds for 3D depth */}
                                    {trailElements.map((element, index) => (
                                        <motion.div
                                            key={index}
                                            className="absolute rounded-full bg-primary/20 backdrop-blur-sm"
                                            style={{
                                                width: element.size,
                                                height: element.size,
                                                x: element.x - element.size / 2,
                                                y: element.y - element.size / 2,
                                                opacity: element.opacity,
                                            }}
                                            animate={{
                                                scale: [1, 1.2, 1],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                                delay: index * 0.1,
                                            }}
                                        />
                                    ))}
                                    
                                    {/* Main cursor follower */}
                                    <motion.div
                                        className="absolute w-4 h-4 rounded-full bg-primary/40 backdrop-blur-sm border border-primary/60"
                                        style={{
                                            x: mousePosition.x - 8,
                                            y: mousePosition.y - 8,
                                        }}
                                        animate={{
                                            scale: [1, 1.5, 1],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                    />
                                </motion.div>
                            </div>

                            {/* Bottom Info - Mobile optimized */}
                            <motion.div
                                className="absolute bottom-4 lg:bottom-8 left-4 right-4 flex flex-col md:flex-row justify-between items-center gap-3 lg:gap-4 text-xs lg:text-base text-muted-foreground mobile-text-xs"
                                variants={menuItemVariants}
                                custom={navigation.length + 4}
                                initial="closed"
                                animate="open"
                                exit="closed"
                            >
                                <div className="flex gap-4 lg:gap-8">
                                    {[
                                        { text: 'Tentang Kami', icon: '🏢', type: 'about' as const },
                                        { text: 'Hubungi', icon: '📞', type: 'contact' as const },
                                        { text: 'FAQ', icon: '❓', type: 'faq' as const }
                                    ].map((item) => (
                                        <motion.button
                                            key={item.text}
                                            onClick={() => handlePopupOpen(item.type)}
                                            className="group flex items-center gap-2 hover:text-foreground transition-colors duration-300"
                                            whileHover={{ 
                                                y: -2,
                                                scale: 1.05,
                                                transition: { duration: 0.2 }
                                            }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <motion.span
                                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                initial={{ opacity: 0, x: -10 }}
                                                whileHover={{ opacity: 1, x: 0 }}
                                            >
                                                {item.icon}
                                            </motion.span>
                                            <span className="relative">
                                                {item.text}
                                                <motion.div
                                                    className="absolute -bottom-1 left-0 h-0.5 bg-primary/40 rounded-full"
                                                    initial={{ width: 0 }}
                                                    whileHover={{ width: '100%' }}
                                                    transition={{ duration: 0.3 }}
                                                />
                                            </span>
                                        </motion.button>
                                    ))}
                                </div>
                                <div className="flex gap-3 lg:gap-6">
                                    {[
                                        { text: 'Privacy', icon: '🔒', type: 'privacy' as const },
                                        { text: 'Terms', icon: '📋', type: 'terms' as const }
                                    ].map((item) => (
                                        <motion.button
                                            key={item.text}
                                            onClick={() => handlePopupOpen(item.type)}
                                            className="group flex items-center gap-2 hover:text-foreground transition-colors duration-300"
                                            whileHover={{ 
                                                y: -2,
                                                scale: 1.05,
                                                transition: { duration: 0.2 }
                                            }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <motion.span
                                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                initial={{ opacity: 0, x: -10 }}
                                                whileHover={{ opacity: 1, x: 0 }}
                                            >
                                                {item.icon}
                                            </motion.span>
                                            <span className="relative">
                                                {item.text}
                                                <motion.div
                                                    className="absolute -bottom-1 left-0 h-0.5 bg-primary/40 rounded-full"
                                                    initial={{ width: 0 }}
                                                    whileHover={{ width: '100%' }}
                                                    transition={{ duration: 0.3 }}
                                                />
                                            </span>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Popup Content */}
            {popupType && (
                <PopupContent
                    type={popupType}
                    isOpen={!!popupType}
                    onClose={handlePopupClose}
                />
            )}
        </>
    );
}