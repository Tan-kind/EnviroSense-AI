import { BushfireRiskDashboard } from '@/components/ui/bushfire-risk-dashboard'
import { FloatingButtons } from '@/components/ui/floating-buttons'

export default function BushfireRiskPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        <BushfireRiskDashboard />
      </div>
      
      <FloatingButtons
        pageTitle="Bushfire Risk Assessment"
        pageContext="Real-time wildfire risk assessment with evacuation routes, fire-safe landscaping recommendations, and emergency preparedness planning for global conditions"
      />
    </div>
  )
}
