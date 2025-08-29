'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'

import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { AboutSection } from '@/components/AboutSection'
import { EventCatalog } from '@/components/event/EventCatalog'
import { UserDashboard } from '@/components/UserDashboard'
import { EventDetail } from '@/components/event/EventDetail'
import { Footer } from '@/components/Footer'
import { FeaturedGallery } from '@/components/gallery/FeaturedGallery'
import { ContactSection } from '@/components/ContactSection'
import EventCarousel from '@/components/event/EventCarousel'
import TestimonialSection from '@/components/TestimonialSection'

type ViewType = 'home' | 'events' | 'dashboard' | 'event-detail' | 'contact'

export default function HomePage() {
  const [currentView, setCurrentView] = useState<ViewType>('home')
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const { user, isLoggedIn } = useAuth()
  const router = useRouter()

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
