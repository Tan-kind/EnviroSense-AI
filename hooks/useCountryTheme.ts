'use client'

import { useState, useEffect } from 'react'
import { getStoryblokApi } from '@storyblok/react'

interface CountryTheme {
  country: string
  hero_image: {
    filename: string
    alt: string
  }
  hero_title: string
  hero_subtitle: string
  welcome_message: string
}

export function useCountryTheme() {
  const [themeData, setThemeData] = useState<CountryTheme | null>(null)
  const [loading, setLoading] = useState(true)
  const [country, setCountry] = useState<string>('global')

  useEffect(() => {
    async function fetchCountryTheme() {
      try {
        setLoading(true)
        
        // Detect user's country
        const detectedCountry = await detectUserCountry()
        setCountry(detectedCountry)
        
        const storyblokApi = getStoryblokApi()
        
        // Try to fetch country-specific theme
        let slug = `themes/${detectedCountry}`
        
        try {
          const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
            version: 'draft' // Use 'published' in production
          })
          
          setThemeData(data.story.content)
        } catch (error) {
          // Fallback to default theme
          console.warn(`No theme found for ${detectedCountry}, using default`)
          setThemeData(null)
        }
      } catch (err) {
        console.error('Failed to fetch country theme:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCountryTheme()
  }, [])

  return { themeData, loading, country }
}

async function detectUserCountry(): Promise<string> {
  try {
    // Try to get country from browser's geolocation API
    if (navigator.geolocation) {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              // Use a geolocation service to convert coordinates to country
              const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
              )
              const data = await response.json()
              
              if (data.countryCode === 'US') {
                resolve('usa')
              } else if (data.countryCode === 'IN') {
                resolve('india')
              } else {
                resolve('global')
              }
            } catch {
              resolve('global')
            }
          },
          () => {
            // Fallback to timezone-based detection
            resolve(detectCountryFromTimezone())
          },
          { timeout: 5000 }
        )
      })
    }
    
    return detectCountryFromTimezone()
  } catch {
    return 'global'
  }
}

function detectCountryFromTimezone(): string {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    
    if (timezone.includes('America/') || timezone.includes('US/')) {
      return 'usa'
    } else if (timezone.includes('Asia/Kolkata') || timezone.includes('Asia/Calcutta')) {
      return 'india'
    }
    
    return 'global'
  } catch {
    return 'global'
  }
}
