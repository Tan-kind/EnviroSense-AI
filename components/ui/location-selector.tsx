"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe, MapPin, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Country {
  code: string
  name: string
  flag: string
}

const SUPPORTED_COUNTRIES: Country[] = [
  { code: 'usa', name: 'United States', flag: '🇺🇸' },
  { code: 'india', name: 'India', flag: '🇮🇳' },
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

  // Load saved location from localStorage on component mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('envirosense-location')
    if (savedLocation) {
      try {
        const country = JSON.parse(savedLocation) as Country
        setSelectedCountry(country)
      } catch (error) {
        console.error('Failed to parse saved location:', error)
      }
    }
  }, [])

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country)
    setIsOpen(false)
    
    // Save to localStorage
    localStorage.setItem('envirosense-location', JSON.stringify(country))
    
    // Notify parent component
    onLocationChange?.(country)
    
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('locationChanged', { 
      detail: country 
    }))
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn(
            "flex items-center gap-2 min-w-[140px] justify-between",
            "hover:bg-accent hover:text-accent-foreground",
            "border-2 border-primary/20 hover:border-primary/40",
            "transition-all duration-200",
            className
          )}
        >
          <div className="flex items-center gap-2">
            {selectedCountry ? (
              <>
                <span className="text-lg">{selectedCountry.flag}</span>
                <span className="font-medium">{selectedCountry.name}</span>
              </>
            ) : (
              <>
                <Globe className="h-4 w-4" />
                <span>Select Location</span>
              </>
            )}
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-56 p-2"
        sideOffset={4}
      >
        <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
          Choose your region
        </div>
        
        {SUPPORTED_COUNTRIES.map((country) => (
          <DropdownMenuItem
            key={country.code}
            onClick={() => handleCountrySelect(country)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 cursor-pointer",
              "hover:bg-accent hover:text-accent-foreground",
              "focus:bg-accent focus:text-accent-foreground",
              "transition-colors duration-150",
              selectedCountry?.code === country.code && "bg-accent/50"
            )}
          >
            <span className="text-xl">{country.flag}</span>
            <div className="flex flex-col">
              <span className="font-medium">{country.name}</span>
              <span className="text-xs text-muted-foreground">
                {country.code === 'usa' ? 'Federal programs & resources' : 'Government schemes & support'}
              </span>
            </div>
            {selectedCountry?.code === country.code && (
              <MapPin className="h-4 w-4 ml-auto text-primary" />
            )}
          </DropdownMenuItem>
        ))}
        
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
