import { DroughtResistantCrops } from '@/components/ui/drought-resistant-crops'
import { FloatingButtons } from '@/components/ui/floating-buttons'

export default function DroughtCropsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        <DroughtResistantCrops />
      </div>
      
      <FloatingButtons
        pageTitle="Drought-Resistant Crops"
        pageContext="AI-powered crop recommendations for climate resilience with regional suitability mapping, water requirements, and sustainable farming guidance"
      />
    </div>
  )
}
