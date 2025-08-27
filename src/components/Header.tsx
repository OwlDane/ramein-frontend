import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Calendar, User, LogOut, Home, ArrowRight, Sparkles, Mail } from 'lucide-react';

interface UserInfo {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
}

interface HeaderProps {
    isLoggedIn: boolean;
    user: UserInfo | null;
    onLogin: () => void;
    onLogout: () => void;
    onViewChange: (view: 'home' | 'events' | 'dashboard' | 'event-detail' | 'contact') => void;
    currentView: string;
}

export function Header({ isLoggedIn, user, onLogin, onLogout, onViewChange, currentView }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Smooth mouse tracking
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, { damping: 30, stiffness: 200 });
    const smoothMouseY = useSpring(mouseY, { damping: 30, stiffness: 200 });

    // Mouse tracking effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isMenuOpen) {
                const rect = document.body.getBoundingClientRect();
                const x = (e.clientX - rect.width / 2) / 50;
                const y = (e.clientY - rect.height / 2) / 50;

                mouseX.set(x);
                mouseY.set(y);
                setMousePosition({ x, y });
            }
        };

        if (isMenuOpen) {
            window.addEventListener('mousemove', handleMouseMove);
        }

        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isMenuOpen, mouseX, mouseY]);

    const navigation = [
        { name: 'Beranda', view: 'home' as const, icon: Home, description: 'Halaman utama dan informasi terbaru' },
        { name: 'Event', view: 'events' as const, icon: Calendar, description: 'Jelajahi semua event yang tersedia' },
        { name: 'Contact', view: 'contact' as const, icon: Mail, description: 'Hubungi tim kami untuk bantuan' },
    ];

    const handleNavigation = (view: 'home' | 'events' | 'dashboard' | 'event-detail' | 'contact') => {
        onViewChange(view);
        setIsMenuOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDashboard = () => {
        if (isLoggedIn) {
            onViewChange('dashboard');
            setIsMenuOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            onLogin();
            setIsMenuOpen(false);
        }
    };

    const menuVariants = {
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
    };

    const menuItemVariants = {
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
    };

    return (
        <>
            <motion.header
                className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border"
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
                                className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200"
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                            >
                                <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-primary-foreground" />
                            </motion.div>
                            <motion.span
                                className="text-lg sm:text-2xl text-primary tracking-tight mobile-text-lg"
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
                                    <span className="text-sm lg:text-lg text-muted-foreground tracking-wide uppercase font-medium">
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
                                                    <Button variant="ghost" className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full">
                                                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                                                            <AvatarImage src={user?.avatar ?? undefined} alt={user?.name ?? 'User avatar'} />
                                                            <AvatarFallback className="bg-primary text-primary-foreground text-xs sm:text-sm">
                                                                {user?.name?.charAt(0) || 'U'}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    </Button>
                                                </motion.div>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-56" align="end">
                                                <DropdownMenuItem onClick={() => handleNavigation('dashboard')}>
                                                    <User className="w-4 h-4 mr-2" />
                                                    Dashboard
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={onLogout}>
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
                                    className="w-5 h-5 sm:w-6 sm:h-6 flex flex-col justify-center items-center"
                                >
                                    <motion.span
                                        variants={{
                                            closed: { rotate: 0, y: 0, opacity: 1 },
                                            open: { rotate: 45, y: 6, opacity: 1 }
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className="w-5 h-0.5 sm:w-6 sm:h-0.5 bg-foreground block absolute"
                                    />
                                    <motion.span
                                        variants={{
                                            closed: { opacity: 1 },
                                            open: { opacity: 0 }
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className="w-5 h-0.5 sm:w-6 sm:h-0.5 bg-foreground block absolute"
                                    />
                                    <motion.span
                                        variants={{
                                            closed: { rotate: 0, y: 0, opacity: 1 },
                                            open: { rotate: -45, y: -6, opacity: 1 }
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className="w-5 h-0.5 sm:w-6 sm:h-0.5 bg-foreground block absolute"
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
                        className="fixed inset-0 z-40 bg-primary text-primary-foreground"
                        variants={menuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                    >
                        <div className="container mx-auto px-4 h-full flex flex-col justify-center">
                            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center h-full py-16 lg:py-20">

                                {/* Navigation Menu with Mouse Tracking */}
                                <motion.div
                                    className="space-y-6 lg:space-y-8"
                                    style={{
                                        x: smoothMouseX,
                                        y: smoothMouseY
                                    }}
                                >
                                    <motion.div
                                        variants={menuItemVariants}
                                        custom={0}
                                        initial="closed"
                                        animate="open"
                                        exit="closed"
                                        className="mb-8 lg:mb-12"
                                    >
                                        <h2 className="text-2xl sm:text-3xl text-primary-foreground/80 mb-2 font-bold mobile-text-xl">Navigasi</h2>
                                        <div className="w-16 lg:w-20 h-1 bg-primary-foreground/40"></div>
                                    </motion.div>

                                    <nav className="space-y-4 lg:space-y-8">
                                        {navigation.map((item, index) => (
                                            <motion.button
                                                key={item.name}
                                                onClick={() => handleNavigation(item.view)}
                                                className={`group flex items-center justify-between w-full text-left transition-all duration-300 hover:translate-x-2 lg:hover:translate-x-4 ${currentView === item.view ? 'text-primary-foreground' : 'text-primary-foreground/80 hover:text-primary-foreground'
                                                    }`}
                                                variants={menuItemVariants}
                                                custom={index + 1}
                                                initial="closed"
                                                animate="open"
                                                exit="closed"
                                                whileHover={{ x: 10 }}
                                                transition={{ duration: 0.2 }}
                                                style={{
                                                    x: mousePosition.x * (index % 2 === 0 ? 0.5 : -0.3),
                                                    y: mousePosition.y * (index % 2 === 0 ? -0.2 : 0.3)
                                                }}
                                            >
                                                <div className="flex items-center gap-3 lg:gap-4">
                                                    <motion.div
                                                        className={`p-2 lg:p-3 rounded-lg transition-all duration-300 ${currentView === item.view
                                                                ? 'bg-primary-foreground/20'
                                                                : 'bg-primary-foreground/10 group-hover:bg-primary-foreground/20'
                                                            }`}
                                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                                    >
                                                        <item.icon className="w-5 h-5 lg:w-6 lg:h-6" />
                                                    </motion.div>
                                                    <div>
                                                        <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl mb-1 font-bold mobile-text-xl">
                                                            {item.name}
                                                        </div>
                                                        <div className="text-sm sm:text-base lg:text-lg text-primary-foreground/60 mobile-text-sm">
                                                            {item.description}
                                                        </div>
                                                    </div>
                                                </div>
                                                <motion.div
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                    whileHover={{ x: 5 }}
                                                >
                                                    <ArrowRight className="w-6 h-6 lg:w-8 lg:h-8" />
                                                </motion.div>
                                            </motion.button>
                                        ))}

                                        {/* Dashboard/Login with Mouse Tracking */}
                                        <motion.button
                                            onClick={handleDashboard}
                                            className={`group flex items-center justify-between w-full text-left transition-all duration-300 hover:translate-x-2 lg:hover:translate-x-4 ${currentView === 'dashboard' ? 'text-primary-foreground' : 'text-primary-foreground/80 hover:text-primary-foreground'
                                                }`}
                                            variants={menuItemVariants}
                                            custom={navigation.length + 1}
                                            initial="closed"
                                            animate="open"
                                            exit="closed"
                                            whileHover={{ x: 10 }}
                                            transition={{ duration: 0.2 }}
                                            style={{
                                                x: mousePosition.x * 0.4,
                                                y: mousePosition.y * -0.4
                                            }}
                                        >
                                            <div className="flex items-center gap-3 lg:gap-4">
                                                <motion.div
                                                    className={`p-2 lg:p-3 rounded-lg transition-all duration-300 ${currentView === 'dashboard'
                                                            ? 'bg-primary-foreground/20'
                                                            : 'bg-primary-foreground/10 group-hover:bg-primary-foreground/20'
                                                        }`}
                                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                                >
                                                    <User className="w-5 h-5 lg:w-6 lg:h-6" />
                                                </motion.div>
                                                <div>
                                                    <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl mb-1 font-bold mobile-text-xl">
                                                        {isLoggedIn ? 'Dashboard' : 'Masuk'}
                                                    </div>
                                                    <div className="text-sm sm:text-base lg:text-lg text-primary-foreground/60 mobile-text-sm">
                                                        {isLoggedIn ? 'Kelola akun dan riwayat event' : 'Login atau daftar akun baru'}
                                                    </div>
                                                </div>
                                            </div>
                                            <motion.div
                                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                whileHover={{ x: 5 }}
                                            >
                                                <ArrowRight className="w-6 h-6 lg:w-8 lg:h-8" />
                                            </motion.div>
                                        </motion.button>
                                    </nav>

                                    {/* User Info if logged in - Mobile optimized */}
                                    {isLoggedIn && (
                                        <motion.div
                                            variants={menuItemVariants}
                                            custom={navigation.length + 2}
                                            initial="closed"
                                            animate="open"
                                            exit="closed"
                                            className="mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-primary-foreground/20"
                                        >
                                            <div className="flex items-center gap-3 lg:gap-4 mb-4">
                                                <Avatar className="h-10 w-10 lg:h-12 lg:w-12">
                                                    <AvatarImage src={user?.avatar ?? undefined} alt={user?.name ?? 'User avatar'} />
                                                    <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground">
                                                        {user?.name?.charAt(0) || 'U'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="text-lg lg:text-xl text-primary-foreground font-medium mobile-text-base">
                                                        {user?.name || 'User'}
                                                    </div>
                                                    <div className="text-sm lg:text-base text-primary-foreground/60 mobile-text-sm">
                                                        {user?.email}
                                                    </div>
                                                </div>
                                            </div>
                                            <motion.button
                                                onClick={() => {
                                                    onLogout();
                                                    setIsMenuOpen(false);
                                                }}
                                                className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                                                whileHover={{ x: 5 }}
                                            >
                                                <LogOut className="w-4 h-4 lg:w-5 lg:h-5" />
                                                <span className="text-base lg:text-lg mobile-text-sm">Logout</span>
                                            </motion.button>
                                        </motion.div>
                                    )}
                                </motion.div>

                                {/* Visual Element with Mouse Tracking */}
                                <motion.div
                                    className="hidden lg:flex items-center justify-center"
                                    variants={menuItemVariants}
                                    custom={navigation.length + 3}
                                    initial="closed"
                                    animate="open"
                                    exit="closed"
                                    style={{
                                        x: smoothMouseX.get() * -0.5,
                                        y: smoothMouseY.get() * -0.3
                                    }}
                                >
                                    <motion.div
                                        className="relative"
                                        animate={{
                                            rotate: [0, 360],
                                            scale: [1, 1.1, 1]
                                        }}
                                        transition={{
                                            duration: 20,
                                            repeat: Infinity,
                                            ease: "linear"
                                        }}
                                    >
                                        <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full border border-primary-foreground/20 flex items-center justify-center">
                                            <div className="w-48 h-48 lg:w-60 lg:h-60 rounded-full border border-primary-foreground/30 flex items-center justify-center">
                                                <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                                                    <motion.div
                                                        animate={{ rotate: [360, 0] }}
                                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                                    >
                                                        <Sparkles className="w-16 h-16 lg:w-20 lg:h-20 text-primary-foreground/60" />
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </div>

                            {/* Bottom Info - Mobile optimized */}
                            <motion.div
                                className="absolute bottom-4 lg:bottom-8 left-4 right-4 flex flex-col md:flex-row justify-between items-center gap-3 lg:gap-4 text-sm lg:text-lg text-primary-foreground/60 mobile-text-sm"
                                variants={menuItemVariants}
                                custom={navigation.length + 4}
                                initial="closed"
                                animate="open"
                                exit="closed"
                            >
                                <div className="flex gap-4 lg:gap-8">
                                    <span>Tentang Kami</span>
                                    <span>Hubungi</span>
                                    <span>FAQ</span>
                                </div>
                                <div className="flex gap-3 lg:gap-6">
                                    <span>Privacy</span>
                                    <span>Terms</span>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}