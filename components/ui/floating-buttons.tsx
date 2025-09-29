'use client'

import { AccessibilityMenu } from './accessibility-menu'
import { ContextAwareAssistant } from './context-aware-assistant'

interface FloatingButtonsProps {
  pageTitle: string
  pageContext: string
}

export function FloatingButtons({ pageTitle, pageContext }: FloatingButtonsProps) {
  return (
    <div className="fixed bottom-0 right-0 z-50 space-y-2">
      {/* AI Assistant Button - Top */}
      <div className="fixed bottom-20 right-6 z-50">
        <ContextAwareAssistant 
          pageTitle={pageTitle}
          pageContext={pageContext}
        />
      </div>
      
      {/* Accessibility Button - Bottom */}
      <div className="fixed bottom-6 right-6 z-50">
        <AccessibilityMenu />
      </div>
    </div>
  )
}
