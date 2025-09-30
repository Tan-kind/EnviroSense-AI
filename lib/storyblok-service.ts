import { getStoryblokApi } from '@storyblok/react/rsc'

export interface ResourceItem {
  item_name: string
  description: string
  website_url: string
  contact_info: string
}

export interface ResourceCategory {
  category_title: string
  resource_items: ResourceItem[]
}

export interface ResourceSection {
  feature_name: string
  country: string
  section_1: ResourceCategory[]
  section_2: ResourceCategory[]
}

export interface CountryTheme {
  country_code: string
  country_name: string
  hero_title: string
  hero_subtitle: string
  welcome_message: string
  background_image_url: string
  primary_cta_text: string
  primary_cta_url: string
  secondary_cta_text: string
  secondary_cta_url: string
}

const FEATURE_MAPPING = {
  'drought-crops': 'Drought Crops',
  'water-conservation': 'Water Conservation', 
  'solar-optimizer': 'Solar Optimizer',
  'habitat-protection': 'Habitat Protection',
  'farm-equipment': 'Farm Equipment'
}

class StoryblokService {
  private api = getStoryblokApi()

  async getResourceSection(country: string, feature: string): Promise<ResourceSection | null> {
    try {
      const countryCode = country.toLowerCase()
      const featureSlug = this.getFeatureSlug(feature)
      
      if (!featureSlug) {
        console.warn(`Feature "${feature}" not supported`)
        return null
      }

      const { data } = await this.api.get(`cdn/stories/resources/${countryCode}/${featureSlug}`, {
        version: 'published',
        resolve_links: 'url'
      })

      return this.transformResourceSection(data.story.content)
    } catch (error) {
      console.error(`Failed to fetch resource section for ${country}/${feature}:`, error)
      return null
    }
  }

  async getCountryTheme(country: string): Promise<CountryTheme | null> {
    try {
      const countryCode = country.toLowerCase()
      
      const { data } = await this.api.get(`cdn/stories/themes/${countryCode}`, {
        version: 'published'
      })

      return this.transformCountryTheme(data.story.content)
    } catch (error) {
      console.error(`Failed to fetch theme for ${country}:`, error)
      return null
    }
  }

  private getFeatureSlug(feature: string): string | null {
    const slugMap: Record<string, string> = {
      'Drought Crops': 'drought-crops',
      'Water Conservation': 'water-conservation',
      'Solar Optimizer': 'solar-optimizer', 
      'Habitat Protection': 'habitat-protection',
      'Farm Equipment': 'farm-equipment'
    }
    
    return slugMap[feature] || null
  }

  private transformResourceSection(content: any): ResourceSection {
    return {
      feature_name: content.feature_name,
      country: content.country,
      section_1: this.transformResourceCategories(content.section_1),
      section_2: this.transformResourceCategories(content.section_2)
    }
  }

  private transformResourceCategories(sections: any[]): ResourceCategory[] {
    if (!Array.isArray(sections)) return []
    
    return sections.map(section => ({
      category_title: section.category_title,
      resource_items: this.transformResourceItems(section.resource_items)
    }))
  }

  private transformResourceItems(items: any[]): ResourceItem[] {
    if (!Array.isArray(items)) return []
    
    return items.map(item => ({
      item_name: item.item_name,
      description: item.description,
      website_url: item.website_url,
      contact_info: item.contact_info
    }))
  }

  private transformCountryTheme(content: any): CountryTheme {
    return {
      country_code: content.country_code,
      country_name: content.country_name,
      hero_title: content.hero_title,
      hero_subtitle: content.hero_subtitle,
      welcome_message: content.welcome_message,
      background_image_url: content.background_image_url,
      primary_cta_text: content.primary_cta_text,
      primary_cta_url: content.primary_cta_url,
      secondary_cta_text: content.secondary_cta_text,
      secondary_cta_url: content.secondary_cta_url
    }
  }

  // Get fallback data when Storyblok is unavailable
  getFallbackResourceSection(country: string, feature: string): ResourceSection {
    return {
      feature_name: feature,
      country: country,
      section_1: [{
        category_title: 'Resources',
        resource_items: [{
          item_name: 'Local Resources',
          description: `Find ${feature.toLowerCase()} resources in your area`,
          website_url: '#',
          contact_info: 'Contact your local extension office'
        }]
      }],
      section_2: [{
        category_title: 'Support',
        resource_items: [{
          item_name: 'Technical Support',
          description: 'Get technical assistance and guidance',
          website_url: '#',
          contact_info: 'Local technical support'
        }]
      }]
    }
  }

  getFallbackCountryTheme(country: string): CountryTheme {
    const themes = {
      'USA': {
        country_code: 'USA',
        country_name: 'United States',
        hero_title: 'Protecting America\'s Environment with AI',
        hero_subtitle: 'Advanced climate solutions for sustainable agriculture and conservation across the United States',
        welcome_message: 'Welcome to EnviroSense AI - your partner in building a sustainable future for American agriculture and environmental conservation.',
        background_image_url: '/images/american-landscape.jpg',
        primary_cta_text: 'Explore US Climate Solutions',
        primary_cta_url: '/features',
        secondary_cta_text: 'View Conservation Programs',
        secondary_cta_url: '/resources'
      },
      'INDIA': {
        country_code: 'INDIA',
        country_name: 'India',
        hero_title: 'भारत के लिए AI-संचालित पर्यावरण समाधान',
        hero_subtitle: 'Sustainable farming and climate resilience solutions tailored for Indian agriculture and environmental challenges',
        welcome_message: 'नमस्ते! EnviroSense AI के साथ भारतीय कृषि और पर्यावरण संरक्षण के लिए उन्नत समाधान खोजें।',
        background_image_url: '/images/indian-agricultural-landscape.jpg',
        primary_cta_text: 'भारतीय समाधान देखें',
        primary_cta_url: '/features',
        secondary_cta_text: 'सरकारी योजनाएं',
        secondary_cta_url: '/resources'
      }
    }

    return themes[country as keyof typeof themes] || themes['USA']
  }
}

export const storyblokService = new StoryblokService()
