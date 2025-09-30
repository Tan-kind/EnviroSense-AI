'use client'

import { useState, useEffect } from 'react'
import { storyblokService, CountryTheme } from '@/lib/storyblok-service'
import { useLocation } from '@/components/ui/location-selector'

export function useCountryTheme() {
  const [themeData, setThemeData] = useState<CountryTheme | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const location = useLocation()

  useEffect(() => {
    async function fetchCountryTheme() {
      try {
        setLoading(true)
        setError(null)
        
        // Get country from location selector, fallback to usa
        const country = location?.code || 'usa'
        
        // Fetch country theme from Storyblok
        const data = await storyblokService.getCountryTheme(country)
        
        if (data) {
          setThemeData(data)
        } else {
          // Use fallback theme if Storyblok fails
          const fallbackData = storyblokService.getFallbackCountryTheme(country)
          setThemeData(fallbackData)
        }
      } catch (err) {
        console.error(`Failed to fetch country theme for ${location?.code}:`, err)
        setError(err instanceof Error ? err.message : 'Failed to fetch theme')
        
        // Use fallback theme on error
        const country = location?.code || 'usa'
        const fallbackData = storyblokService.getFallbackCountryTheme(country)
        setThemeData(fallbackData)
      } finally {
        setLoading(false)
      }
    }

    fetchCountryTheme()
  }, [location])

  return { themeData, loading, error, country: location?.code || 'usa' }
}
