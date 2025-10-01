'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Languages, ChevronDown, Check } from 'lucide-react'

interface LanguageOption {
  code: string
  name: string
  flag: string
}

interface CustomLanguageSelectorProps {
  onLanguageChange: (languageCode: string) => void
  currentLanguage?: string
  size?: 'sm' | 'md' | 'lg'
}

export function CustomLanguageSelector({
  onLanguageChange,
  currentLanguage = 'en',
  size = 'md'
}: CustomLanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage)
  const [isOpen, setIsOpen] = useState(false)

  const languages: LanguageOption[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' }
  ]

  const handleLanguageSelect = (languageCode: string) => {
    console.log('Language changed to:', languageCode)
    setSelectedLanguage(languageCode)
    setIsOpen(false)
    onLanguageChange(languageCode)

    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { code: languageCode }
    }))
  }

  const currentLang = languages.find(lang => lang.code === selectedLanguage) || languages[0]

  const buttonSizes = {
    sm: 'h-8 px-2 text-xs',
    md: 'h-9 px-3 text-sm',
    lg: 'h-10 px-4 text-base'
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        className={`${buttonSizes[size]} flex items-center gap-2 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white/90`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
      >
        <Languages className="h-4 w-4" />
        <span className="hidden sm:inline">{currentLang.flag}</span>
        <span className="hidden md:inline">{currentLang.name}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageSelect(language.code)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 ${
                selectedLanguage === language.code ? 'bg-blue-50 dark:bg-blue-950' : ''
              }`}
            >
              <span className="text-lg">{language.flag}</span>
              <span className="flex-1">{language.name}</span>
              {selectedLanguage === language.code && (
                <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
