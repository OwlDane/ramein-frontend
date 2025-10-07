import { useState, useEffect } from 'react'

type ViewType = 'home' | 'events' | 'dashboard' | 'event-detail' | 'contact' | 'articles'

interface ViewState {
    currentView: ViewType
    selectedEventId: string | null
    scrollPosition: number
}

const STORAGE_KEY = 'ramein-view-state'

export function useViewPersistence() {
    const [viewState, setViewState] = useState<ViewState>({
        currentView: 'home',
        selectedEventId: null,
        scrollPosition: 0
    })
    const [isLoaded, setIsLoaded] = useState(false)

    // Load state from localStorage on mount
    useEffect(() => {
        try {
            const savedState = localStorage.getItem(STORAGE_KEY)
            if (savedState) {
                const parsedState = JSON.parse(savedState) as ViewState
                setViewState(parsedState)

                // Restore scroll position after a short delay to ensure DOM is ready
                if (parsedState.scrollPosition > 0) {
                    setTimeout(() => {
                        window.scrollTo(0, parsedState.scrollPosition)
                    }, 100)
                }
            }
        } catch (error) {
            console.warn('Failed to load view state from localStorage:', error)
        } finally {
            setIsLoaded(true)
        }
    }, [])

    // Save state to localStorage whenever it changes
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(viewState))
            } catch (error) {
                console.warn('Failed to save view state to localStorage:', error)
            }
        }
    }, [viewState, isLoaded])

    const updateView = (newView: ViewType) => {
        setViewState(prev => ({
            ...prev,
            currentView: newView,
            scrollPosition: 0 // Reset scroll position when changing views
        }))
    }

    const updateEventId = (eventId: string | null) => {
        setViewState(prev => ({
            ...prev,
            selectedEventId: eventId
        }))
    }

    const updateViewAndEvent = (newView: ViewType, eventId: string | null) => {
        setViewState(prev => ({
            ...prev,
            currentView: newView,
            selectedEventId: eventId,
            scrollPosition: 0 // Reset scroll position when changing views
        }))
    }

    const resetToHome = () => {
        setViewState({
            currentView: 'home',
            selectedEventId: null,
            scrollPosition: 0
        })
    }

    const clearState = () => {
        try {
            localStorage.removeItem(STORAGE_KEY)
            setViewState({
                currentView: 'home',
                selectedEventId: null,
                scrollPosition: 0
            })
        } catch (error) {
            console.warn('Failed to clear view state from localStorage:', error)
        }
    }

    const saveScrollPosition = () => {
        setViewState(prev => ({
            ...prev,
            scrollPosition: window.scrollY
        }))
    }

    return {
        currentView: viewState.currentView,
        selectedEventId: viewState.selectedEventId,
        isLoaded,
        updateView,
        updateEventId,
        updateViewAndEvent,
        resetToHome,
        clearState,
        saveScrollPosition
    }
}
