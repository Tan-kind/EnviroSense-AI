'use client'

import { useState, useEffect } from 'react'
import { getStoryblokApi } from '@storyblok/react'

interface ResourceSectionData {
  feature_name: string
  country: string
  section_1?: any[]
  section_2?: any[]
}

export function useResourceSection(featureName: string) {
  const [resourceData, setResourceData] = useState<ResourceSectionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchResourceSection() {
      try {
        setLoading(true)
        
        // Detect user's country (simplified - you can enhance this)
        const country = await detectUserCountry()
        
        const storyblokApi = getStoryblokApi()
        
        // Try to fetch country-specific resource first
        let slug = `resources/${country}/${featureName}`
        
        try {
          const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
            version: 'draft', // Use 'published' in production
            resolve_relations: ['resource_section.section_1', 'resource_section.section_2']
          })
          
          setResourceData(data.story.content)
        } catch (countryError) {
          // Fallback to global resources
          slug = `resources/global/${featureName}`
          
          try {
            const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
              version: 'draft',
              resolve_relations: ['resource_section.section_1', 'resource_section.section_2']
            })
            
            setResourceData(data.story.content)
          } catch (globalError) {
            console.warn(`No resource section found for ${featureName}`)
            setResourceData(null)
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch resources')
      } finally {
        setLoading(false)
      }
    }

    if (featureName) {
      fetchResourceSection()
    }
  }, [featureName])

  return { resourceData, loading, error }
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
