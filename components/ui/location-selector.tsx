"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe, MapPin, ChevronDown, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Country {
  code: string
  name: string
  flag: string
}

const ALL_COUNTRIES: Country[] = [
  { code: 'usa', name: 'United States', flag: '🇺🇸' },
  { code: 'india', name: 'India', flag: '🇮🇳' },
  { code: 'afghanistan', name: 'Afghanistan', flag: '🇦🇫' },
  { code: 'albania', name: 'Albania', flag: '🇦🇱' },
  { code: 'algeria', name: 'Algeria', flag: '🇩🇿' },
  { code: 'argentina', name: 'Argentina', flag: '🇦🇷' },
  { code: 'australia', name: 'Australia', flag: '🇦🇺' },
  { code: 'austria', name: 'Austria', flag: '🇦🇹' },
  { code: 'bangladesh', name: 'Bangladesh', flag: '🇧🇩' },
  { code: 'belgium', name: 'Belgium', flag: '🇧🇪' },
  { code: 'brazil', name: 'Brazil', flag: '🇧🇷' },
  { code: 'canada', name: 'Canada', flag: '🇨🇦' },
  { code: 'china', name: 'China', flag: '🇨🇳' },
  { code: 'colombia', name: 'Colombia', flag: '🇨🇴' },
  { code: 'denmark', name: 'Denmark', flag: '🇩🇰' },
  { code: 'egypt', name: 'Egypt', flag: '🇪🇬' },
  { code: 'finland', name: 'Finland', flag: '🇫🇮' },
  { code: 'france', name: 'France', flag: '🇫🇷' },
  { code: 'germany', name: 'Germany', flag: '🇩🇪' },
  { code: 'ghana', name: 'Ghana', flag: '🇬🇭' },
  { code: 'greece', name: 'Greece', flag: '🇬🇷' },
  { code: 'indonesia', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'iran', name: 'Iran', flag: '🇮🇷' },
  { code: 'iraq', name: 'Iraq', flag: '🇮🇶' },
  { code: 'ireland', name: 'Ireland', flag: '🇮🇪' },
  { code: 'israel', name: 'Israel', flag: '🇮🇱' },
  { code: 'italy', name: 'Italy', flag: '🇮🇹' },
  { code: 'japan', name: 'Japan', flag: '🇯🇵' },
  { code: 'kenya', name: 'Kenya', flag: '🇰🇪' },
  { code: 'malaysia', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'mexico', name: 'Mexico', flag: '🇲🇽' },
  { code: 'morocco', name: 'Morocco', flag: '🇲🇦' },
  { code: 'netherlands', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'nigeria', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'norway', name: 'Norway', flag: '🇳🇴' },
  { code: 'pakistan', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'philippines', name: 'Philippines', flag: '🇵🇭' },
  { code: 'poland', name: 'Poland', flag: '🇵🇱' },
  { code: 'portugal', name: 'Portugal', flag: '🇵🇹' },
  { code: 'russia', name: 'Russia', flag: '🇷🇺' },
  { code: 'saudi_arabia', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'south_africa', name: 'South Africa', flag: '🇿🇦' },
  { code: 'south_korea', name: 'South Korea', flag: '🇰🇷' },
  { code: 'spain', name: 'Spain', flag: '🇪🇸' },
  { code: 'sri_lanka', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'sweden', name: 'Sweden', flag: '🇸🇪' },
  { code: 'switzerland', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'thailand', name: 'Thailand', flag: '🇹🇭' },
  { code: 'turkey', name: 'Turkey', flag: '🇹🇷' },
  { code: 'ukraine', name: 'Ukraine', flag: '🇺🇦' },
  { code: 'united_kingdom', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'vietnam', name: 'Vietnam', flag: '🇻🇳' },
]

interface LocationSelectorProps {
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  onLocationChange?: (country: Country) => void
}

export function LocationSelector({ 
  className, 
  variant = 'outline', 
  size = 'default',
  onLocationChange 
}: LocationSelectorProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const savedLocationData = localStorage.getItem('envirosense-location')
    if (savedLocationData) {
      try {
        const country = JSON.parse(savedLocationData)
        setSelectedCountry(country)
      } catch (error) {
        console.error('Error parsing saved location:', error)
      }
    }
  }, [])

  const filteredCountries = ALL_COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleLocationSelect = async (country: Country) => {
    setIsLoading(true)
    setSelectedCountry(country)
    setIsOpen(false)
    setSearchTerm('')
    
    localStorage.setItem('envirosense-location', JSON.stringify(country))
    
    await new Promise(resolve => setTimeout(resolve, 800))
    
    window.dispatchEvent(new CustomEvent('locationChanged', { 
      detail: country 
    }))
    
    onLocationChange?.(country)
    setIsLoading(false)
  }

  const displayText = selectedCountry ? selectedCountry.name : 'Select Location'

  return (
    <div className="relative">
      <Button
        variant={variant}
        size={size}
        disabled={isLoading}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 min-w-[140px] justify-between",
          className
        )}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
            <span>Updating...</span>
          </>
        ) : selectedCountry ? (
          <>
            <div className="flex items-center gap-2">
              <span className="text-base">{selectedCountry.flag}</span>
              <span className="font-medium">{displayText}</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>Select Location</span>
            </div>
          </>
        )}
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 max-h-80 overflow-hidden">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
                autoFocus
              />
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {filteredCountries.map((country) => (
              <div
                key={country.code}
                onClick={() => handleLocationSelect(country)}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <span className="text-base">{country.flag}</span>
                <div className="flex flex-col flex-1">
                  <span className="font-medium text-sm">{country.name}</span>
                  {(country.code === 'usa' || country.code === 'india') && (
                    <span className="text-xs text-green-600 dark:text-green-400">
                      ✓ Dynamic content available
                    </span>
                  )}
                </div>
                {selectedCountry?.code === country.code && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            ))}
            {filteredCountries.length === 0 && (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No countries found
              </div>
            )}
          </div>
          
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Your location helps us show relevant resources and programs
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

// Hook to get current location
export function useLocation() {
  const [location, setLocation] = useState<Country | null>(null)

  useEffect(() => {
    // Load initial location from localStorage
    const savedLocation = localStorage.getItem('envirosense-location')
    if (savedLocation) {
      try {
        setLocation(JSON.parse(savedLocation))
      } catch (error) {
        console.error('Failed to parse saved location:', error)
      }
    }

    // Listen for location changes
    const handleLocationChange = (event: CustomEvent) => {
      setLocation(event.detail)
    }

    window.addEventListener('locationChanged', handleLocationChange as EventListener)
    
    return () => {
      window.removeEventListener('locationChanged', handleLocationChange as EventListener)
    }
  }, [])

  return location
}

// Utility function to get location synchronously (for server-side or immediate access)
export function getStoredLocation(): Country | null {
  if (typeof window === 'undefined') return null
  
  try {
    const saved = localStorage.getItem('envirosense-location')
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}
