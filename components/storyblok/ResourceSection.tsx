'use client'

import { storyblokEditable } from '@storyblok/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ResourceItem {
  item_name: string
  description?: string
  website_url?: string
  contact_info?: string
}

interface ResourceCategory {
  category_title: string
  resource_items: ResourceItem[]
}

interface ResourceSectionProps {
  blok: {
    feature_name: string
    country: string
    section_1?: ResourceCategory[]
    section_2?: ResourceCategory[]
  }
}

export default function ResourceSection({ blok }: ResourceSectionProps) {
  const renderResourceCategory = (category: ResourceCategory) => (
    <div key={category.category_title}>
      <h4 className="font-semibold mb-2">{category.category_title}</h4>
      <ul className="space-y-1">
        {category.resource_items?.map((item, index) => (
          <li key={index} className="flex flex-col">
            <span>• {item.item_name}</span>
            {item.description && (
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                {item.description}
              </span>
            )}
            {item.website_url && (
              <a 
                href={item.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 ml-2 hover:underline"
              >
                Visit Website
              </a>
            )}
            {item.contact_info && (
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                Contact: {item.contact_info}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <Card 
      {...storyblokEditable(blok)}
      className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800"
    >
      <CardHeader>
        <CardTitle className="text-gray-700 dark:text-gray-300">
          {getResourceTitle(blok.feature_name)} Resources
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {blok.section_1?.[0] && renderResourceCategory(blok.section_1[0])}
          {blok.section_2?.[0] && renderResourceCategory(blok.section_2[0])}
        </div>
      </CardContent>
    </Card>
  )
}

function getResourceTitle(featureName: string): string {
  const titles: Record<string, string> = {
    'drought-crops': 'Drought-Resistant Crops',
    'water-conservation': 'Water Conservation Strategy',
    'solar-optimizer': 'Solar Panel Optimizer',
    'habitat-protection': 'Habitat Protection',
    'farm-equipment': 'Farm Equipment Efficiency Guide',
    'impact-scanner': 'Environmental Impact Scanner',
    'climate-advisor': 'Climate Advisor',
    'goal-tracking': 'Goal Tracking'
  }
  return titles[featureName] || 'Climate Resources'
}
