'use client'

import { useResourceSection } from '@/hooks/useResourceSection'
import ResourceSection from '@/components/storyblok/ResourceSection'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface DynamicResourceSectionProps {
  featureName: string
  fallbackContent?: React.ReactNode
}

export default function DynamicResourceSection({ 
  featureName, 
  fallbackContent 
}: DynamicResourceSectionProps) {
  const { resourceData, loading, error } = useResourceSection(featureName)

  if (loading) {
    return (
      <Card className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    console.warn(`Resource section error for ${featureName}:`, error)
  }

  // If we have Storyblok data, use it
  if (resourceData) {
    return <ResourceSection blok={resourceData} />
  }

  // Otherwise, show fallback content (existing static content)
  return fallbackContent || null
}
