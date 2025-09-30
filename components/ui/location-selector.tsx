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
    const savedLocation = localStorage.getItem('selectedLocation')
    if (savedLocation) {
      const country = ALL_COUNTRIES.find(c => c.code === savedLocation)
      if (country) {
        setSelectedCountry(country)
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
    
    localStorage.setItem('selectedLocation', country.code)
    
    await new Promise(resolve => setTimeout(resolve, 800))
    
    window.dispatchEvent(new CustomEvent('locationChanged', { 
      detail: { country: country.code } 
    }))
    
    onLocationChange?.(country)
    setIsLoading(false)
  }

  const displayText = selectedCountry ? selectedCountry.name : 'Select Location'

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          disabled={isLoading}
          className={cn(
            "flex items-center gap-2 min-w-[140px]",
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
              <span className="text-base">{selectedCountry.flag}</span>
              <span className="font-medium">{displayText}</span>
            </>
          ) : (
            <>
              <Globe className="h-4 w-4" />
              <span>Select Location</span>
            </>
          )}
          <ChevronDown className="h-4 w-4 ml-auto" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <div className="p-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="max-h-60 overflow-y-auto">
          {filteredCountries.map((country) => (
            <DropdownMenuItem
              key={country.code}
              onClick={() => handleLocationSelect(country)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <span className="text-base">{country.flag}</span>
              <div className="flex flex-col">
                <span className="font-medium">{country.name}</span>
                {(country.code === 'usa' || country.code === 'india') && (
                  <span className="text-xs text-muted-foreground">
                    Dynamic content available
                  </span>
                )}
              </div>
            </DropdownMenuItem>
          ))}
          {filteredCountries.length === 0 && (
            <div className="p-4 text-center text-muted-foreground">
              No countries found
            </div>
          )}
        </div>
        
        <div className="mt-2 pt-2 border-t">
          <div className="px-3 py-2 text-xs text-muted-foreground">
            Your location helps us show relevant resources and programs
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
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
