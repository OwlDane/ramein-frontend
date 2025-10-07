'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { useViewPersistence } from '@/hooks/useViewPersistence'

import { HeaderNew as Header } from '@/components/layout/HeaderNew'
import { HeroNew as Hero } from '@/components/common/HeroNew'
import { DreamsSection } from '@/components/common/DreamsSection'
import { EventCatalogNew as EventCatalog } from '@/components/event/EventCatalogNew'
import { UserDashboard } from '@/components/UserDashboard'
import { EventDetail } from '@/components/event/EventDetail'
import { FooterNew as Footer } from '@/components/layout/FooterNew'
import { FeaturedEventsSection } from '@/components/event/FeaturedEventsSection'
import { UpcomingEventsSection } from '@/components/event/UpcomingEventsSection'
import { NewsSection } from '@/components/common/NewsSection'
import { ContactSection } from '@/components/common/ContactSection'

type ViewType = 'home' | 'events' | 'dashboard' | 'event-detail' | 'contact' | 'articles'

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
  const searchParams = useSearchParams()

  // Handle query parameter for view
  React.useEffect(() => {
    const viewParam = searchParams.get('view')
    if (viewParam === 'events' && currentView !== 'events') {
      updateView('events')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

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
              eventId={selectedEventId || ''}
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
            />
            <DreamsSection 
                onViewEvents={() => handleViewChange('events')}
            />
            <FeaturedEventsSection onViewEvents={() => handleViewChange('events')} />
            <UpcomingEventsSection 
              onEventSelect={handleEventSelect}
              onViewAllEvents={() => handleViewChange('events')}
            />
            <NewsSection />
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

      <main className="pt-20 sm:pt-24">
        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      </main>

      {currentView !== 'contact' && <Footer />}
    </div>
  )
}
