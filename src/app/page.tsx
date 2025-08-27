'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { AboutSection } from './components/AboutSection'
import { EventCatalog } from './components/event/EventCatalog'
import { AuthModal } from './components/AuthModal'
import { UserDashboard } from './components/UserDashboard'
import { EventDetail } from './components/event/EventDetail'
import { Footer } from './components/Footer'
import { FeaturedGallery } from './components/gallery/FeaturedGallery'
import { ContactSection } from './components/ContactSection'

type ViewType = 'home' | 'events' | 'dashboard' | 'event-detail' | 'contact'

export default function HomePage() {
  const [currentView, setCurrentView] = useState<ViewType>('home')
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view)
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
  }

  const handleEventSelect = (eventId: string) => {
    setSelectedEventId(eventId)
    setCurrentView('event-detail')
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
  }

  const handleLogin = (userData: any) => {
    setIsLoggedIn(true)
    setUser(userData)
    setIsAuthModalOpen(false)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUser(null)
    setCurrentView('home')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const pageVariants = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    in: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
    out: {
      opacity: 0,
      y: -20,
      scale: 1.02,
      transition: { duration: 0.3, ease: 'easeIn' },
    },
  }

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4,
  }

  const renderContent = () => {
    switch (currentView) {
      case 'events':
        return (
          <motion.div
            key="events"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="min-h-screen"
          >
            <div className="pt-4 lg:pt-8">
              <EventCatalog onEventSelect={handleEventSelect} />
            </div>
          </motion.div>
        )
      case 'dashboard':
        return isLoggedIn ? (
          <motion.div
            key="dashboard"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="min-h-screen"
          >
            <div className="pt-4 lg:pt-8">
              <UserDashboard user={user} />
            </div>
          </motion.div>
        ) : null
      case 'event-detail':
        return (
          <motion.div
            key="event-detail"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="min-h-screen"
          >
            <EventDetail
              eventId={selectedEventId}
              isLoggedIn={isLoggedIn}
              onAuthRequired={() => setIsAuthModalOpen(true)}
              onBack={() => handleViewChange('events')}
            />
          </motion.div>
        )
      case 'contact':
        return (
          <motion.div
            key="contact"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="min-h-screen"
          >
            <ContactSection />
          </motion.div>
        )
      default:
        return (
          <motion.div
            key="home"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Hero onViewEvents={() => handleViewChange('events')} />
            <AboutSection />
            <FeaturedGallery onViewEvents={() => handleViewChange('events')} />
            <div className="py-12 lg:py-16">
              <EventCatalog onEventSelect={handleEventSelect} limit={6} />
            </div>
          </motion.div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        isLoggedIn={isLoggedIn}
        user={user}
        onLogin={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onViewChange={handleViewChange}
        currentView={currentView}
      />

      <main className="pt-14 sm:pt-16">
        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      </main>

      {currentView !== 'contact' && <Footer />}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  )
}
