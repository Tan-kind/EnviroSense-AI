'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useKeyboardNavigation() {
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle keyboard shortcuts when not typing in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement ||
        (event.target as HTMLElement)?.contentEditable === 'true'
      ) {
        return
      }

      // Alt + Number shortcuts for navigation
      if (event.altKey && !event.ctrlKey && !event.shiftKey) {
        switch (event.key) {
          case '1':
            event.preventDefault()
            router.push('/scanner')
            break
          case '2':
            event.preventDefault()
            router.push('/chat')
            break
          case '3':
            event.preventDefault()
            router.push('/community')
            break
          case '4':
            event.preventDefault()
            router.push('/goals')
            break
          case '5':
            event.preventDefault()
            router.push('/drought-crops')
            break
          case '6':
            event.preventDefault()
            router.push('/water-conservation')
            break
          case '7':
            event.preventDefault()
            router.push('/solar-optimizer')
            break
          case '8':
            event.preventDefault()
            router.push('/habitat-protection')
            break
          case '9':
            event.preventDefault()
            router.push('/farm-equipment')
            break
          case 'h':
          case 'H':
            event.preventDefault()
            router.push('/')
            break
        }
      }

      // Ctrl + / for voice navigation toggle
      if (event.ctrlKey && event.key === '/') {
        event.preventDefault()
        // Trigger voice navigation button click
        const voiceButton = document.querySelector('[data-voice-nav-button]') as HTMLButtonElement
        if (voiceButton) {
          voiceButton.click()
        }
      }

      // Escape key to close modals/dialogs
      if (event.key === 'Escape') {
        // Let the default behavior handle this for dialogs
        return
      }

      // Tab navigation enhancement - ensure focus is visible
      if (event.key === 'Tab') {
        // Add a class to body to show focus indicators when using keyboard
        document.body.classList.add('keyboard-navigation')
        
        // Remove the class after a short delay if mouse is used
        const removeKeyboardClass = () => {
          document.body.classList.remove('keyboard-navigation')
          document.removeEventListener('mousedown', removeKeyboardClass)
        }
        
        setTimeout(() => {
          document.addEventListener('mousedown', removeKeyboardClass)
        }, 100)
      }
    }

    // Add event listener
    document.addEventListener('keydown', handleKeyDown)

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [router])

  // Function to programmatically focus on main content
  const focusMainContent = () => {
    const mainContent = document.querySelector('main, [role="main"], #main-content')
    if (mainContent instanceof HTMLElement) {
      mainContent.focus()
    }
  }

  // Function to skip to main content
  const skipToContent = () => {
    const mainContent = document.querySelector('main, [role="main"], #main-content, .container')
    if (mainContent instanceof HTMLElement) {
      mainContent.scrollIntoView({ behavior: 'smooth' })
      mainContent.focus()
    }
  }

  const getKeyboardShortcuts = () => [
    { keys: "Alt + 1", action: "Go to Scanner", route: "/scanner" },
    { keys: "Alt + 2", action: "Go to Chat", route: "/chat" },
    { keys: "Alt + 3", action: "Go to Community", route: "/community" },
    { keys: "Alt + 4", action: "Go to Goals", route: "/goals" },
    { keys: "Alt + 5", action: "Go to Drought Crops", route: "/drought-crops" },
    { keys: "Alt + 6", action: "Go to Water Conservation", route: "/water-conservation" },
    { keys: "Alt + 7", action: "Go to Solar Optimizer", route: "/solar-optimizer" },
    { keys: "Alt + 8", action: "Go to Habitat Protection", route: "/habitat-protection" },
    { keys: "Alt + 9", action: "Go to Farm Equipment", route: "/farm-equipment" },
    { keys: "Alt + H", action: "Go to Home", route: "/" },
    { keys: "Ctrl + /", action: "Toggle Voice Navigation", route: null },
    { keys: "Tab", action: "Navigate between elements", route: null },
    { keys: "Enter/Space", action: "Activate focused element", route: null },
  ]

  return {
    focusMainContent,
    skipToContent,
    getKeyboardShortcuts
  }
}
