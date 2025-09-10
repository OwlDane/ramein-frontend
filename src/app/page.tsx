'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useViewPersistence } from '@/hooks/useViewPersistence'

import { Header } from '@/components/layout/Header'
import { Hero } from '@/components/common/Hero'
import { AboutSection } from '@/components/common/AboutSection'
import { EventCatalog } from '@/components/event/EventCatalog'
import { UserDashboard } from '@/components/UserDashboard'
import { EventDetail } from '@/components/event/EventDetail'
import { Footer } from '@/components/layout/Footer'
import { FeaturedGallery } from '@/components/gallery/FeaturedGallery'
import { ContactSection } from '@/components/common/ContactSection'
import EventCarousel from '@/components/event/EventCarousel'
import TestimonialSection from '@/components/common/TestimonialSection'

type ViewType = 'home' | 'events' | 'dashboard' | 'event-detail' | 'contact'

export default function HomePage() {
  const { 
    currentView, 
    selectedEventId, 
    isLoaded, 
    updateView, 
    updateViewAndEvent,
    clearState,
    saveScrollPosition
  } = useViewPersistence()
  const { user, isLoggedIn } = useAuth()
  const router = useRouter()

  // Clear view state when user logs out
  React.useEffect(() => {
    if (!isLoggedIn && currentView === 'dashboard') {
      clearState()
    }
  }, [isLoggedIn, currentView, clearState])

  // Save scroll position on scroll
  React.useEffect(() => {
    const handleScroll = () => {
      saveScrollPosition()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [saveScrollPosition])

  const handleViewChange = (view: ViewType) => {
    updateView(view)
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
  }

  const handleEventSelect = (eventId: string) => {
    updateViewAndEvent('event-detail', eventId)
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
  }



  const pageVariants = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    in: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: 'easeOut' as const },
    },
    out: {
      opacity: 0,
      y: -20,
      scale: 1.02,
      transition: { duration: 0.3, ease: 'easeIn' as const },
    },
  }

  const pageTransition = {
    type: 'tween' as const,
    ease: 'anticipate' as const,
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
        return isLoggedIn && user ? (
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
              onAuthRequired={() => router.push('/login')}
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
            <Hero 
                onViewEvents={() => handleViewChange('events')} 
                onViewAbout={() => {
                    // Scroll to About section (which is the next section)
                    const aboutSection = document.querySelector('#about-section');
                    if (aboutSection) {
                        aboutSection.scrollIntoView({ behavior: 'smooth' });
                    } else {
                        // Fallback to events if about section is not found
                        handleViewChange('events');
                    }
                }}
            />
            <AboutSection 
                onViewContact={() => handleViewChange('contact')}
                onViewEvents={() => handleViewChange('events')}
            />
            <FeaturedGallery onViewEvents={() => handleViewChange('events')} />
            <div className="py-12 lg:py-16">
              <EventCarousel onEventSelect={handleEventSelect} />
            </div>
            <TestimonialSection />
          </motion.div>
        )
    }
  }

  // Show loading state while restoring view
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        onViewChange={handleViewChange}
        currentView={currentView}
      />

      <main className="pt-14 sm:pt-16">
        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      </main>

      {currentView !== 'contact' && <Footer />}
    </div>
  )
}
