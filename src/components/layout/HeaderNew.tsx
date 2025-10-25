import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface HeaderNewProps {
    onViewChange: (view: 'home' | 'events' | 'dashboard' | 'event-detail' | 'contact' | 'articles') => void;
    currentView: string;
}

export function HeaderNew({ onViewChange, currentView }: HeaderNewProps) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const isLoggedIn = !!user;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigation = [
        { name: 'Home', view: 'home' as const },
        { name: 'Event', view: 'events' as const },
        { name: 'Articles', view: 'articles' as const },
        { name: 'Contact', view: 'contact' as const },
    ];

    const handleNavigation = (view: 'home' | 'events' | 'dashboard' | 'event-detail' | 'contact' | 'articles') => {
        setIsMobileMenuOpen(false);
        
        // Handle navigation based on view
        // All views now use smooth view switching for consistent UX
        if (window.location.pathname === '/') {
            // Already on homepage, use view switching
            onViewChange(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Navigate to homepage with view parameter
            const viewParam = view === 'home' ? '' : `?view=${view}`;
            router.push(`/${viewParam}`);
        }
    };

    const handleLogin = () => {
        if (isLoggedIn) {
            router.push('/profile');
        } else {
            router.push('/login');
        }
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <motion.header
                className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        {/* Logo */}
                        <motion.button
                            onClick={() => handleNavigation('home')}
                            className="text-xl lg:text-2xl font-bold tracking-tight text-foreground"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Ramein
                        </motion.button>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-8 lg:gap-12">
                            {navigation.map((item) => (
                                <motion.button
                                    key={item.name}
                                    onClick={() => handleNavigation(item.view)}
                                    className={`text-sm lg:text-base font-medium transition-colors relative ${
                                        currentView === item.view
                                            ? 'text-foreground'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {item.name}
                                    {currentView === item.view && (
                                        <motion.div
                                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-foreground"
                                            layoutId="navbar-indicator"
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </motion.button>
                            ))}
                        </nav>

                        {/* Right Section */}
                        <div className="flex items-center gap-4">
                            {/* Login/Dashboard Button - Desktop */}
                            <div className="hidden md:block">
                                {isLoggedIn ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage src={undefined} alt={user?.name ?? 'User'} />
                                                        <AvatarFallback className="bg-primary text-primary-foreground">
                                                            {user?.name?.charAt(0) || 'U'}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </Button>
                                            </motion.div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-48" align="end">
                                            <DropdownMenuItem onClick={() => router.push('/profile')}>
                                                <User className="w-4 h-4 mr-2" />
                                                Dashboard
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={logout}>
                                                <LogOut className="w-4 h-4 mr-2" />
                                                Logout
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            onClick={handleLogin}
                                            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6"
                                        >
                                            Login
                                        </Button>
                                    </motion.div>
                                )}
                            </div>

                            {/* Mobile Menu Button */}
                            <motion.button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isMobileMenuOpen ? (
                                    <X className="w-6 h-6" />
                                ) : (
                                    <Menu className="w-6 h-6" />
                                )}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className="fixed inset-0 z-40 md:hidden bg-background"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="container mx-auto px-4 pt-24 pb-8">
                            <nav className="flex flex-col gap-6">
                                {navigation.map((item, index) => (
                                    <motion.button
                                        key={item.name}
                                        onClick={() => handleNavigation(item.view)}
                                        className={`text-2xl font-bold text-left ${
                                            currentView === item.view
                                                ? 'text-foreground'
                                                : 'text-muted-foreground'
                                        }`}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {item.name}
                                    </motion.button>
                                ))}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: navigation.length * 0.1 }}
                                    className="pt-4 border-t border-border"
                                >
                                    <Button
                                        onClick={handleLogin}
                                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                                        size="lg"
                                    >
                                        {isLoggedIn ? 'Dashboard' : 'Login'}
                                    </Button>
                                </motion.div>
                            </nav>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
