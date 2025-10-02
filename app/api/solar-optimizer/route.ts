import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!)

// Fallback response for when the AI service is unavailable
function getFallbackResponse(propertySize: number, energyUsage: number, location: string) {
  const dailyUsage = parseFloat((energyUsage / 30).toFixed(1))
  const recommendedSize = Math.max(3, Math.ceil(dailyUsage / 4) * 1.2) // 4 sun hours average
  
  return NextResponse.json({
    systemRecommendation: {
      panelCapacity: recommendedSize,
      numberOfPanels: Math.ceil(recommendedSize / 0.4), // 400W panels
      panelType: "Monocrystalline (Tier 1)",
      batteryCapacity: Math.ceil(energyUsage * 2), // 2 days autonomy
      inverterSize: recommendedSize * 1.2,
      estimatedCost: recommendedSize * 1500 + 1000 // $1500/kW + $1000 base
    },
    energyProduction: {
      dailyGeneration: (recommendedSize * 4).toFixed(1), // 4 sun hours
      monthlyGeneration: (recommendedSize * 4 * 30).toFixed(1),
      annualGeneration: (recommendedSize * 4 * 365).toFixed(1),
      selfConsumption: 70,
      gridExport: Math.max(0, (recommendedSize * 4 * 30) - energyUsage).toFixed(1)
    },
    financialAnalysis: {
      totalInvestment: recommendedSize * 1500 + 1000,
      annualSavings: Math.round(energyUsage * 0.3 * 12), // $0.30/kWh
      paybackPeriod: (recommendedSize <= 3 ? '5-7' : '7-10') + ' years',
      roi25Years: Math.round(energyUsage * 0.3 * 12 * 20 * 0.8), // 20 years at 80% efficiency
      governmentRebates: recommendedSize * 300 // Approximate rebate
    },
    installationGuidance: {
      optimalTilt: "23-30 degrees (latitude optimized)",
      orientation: "True north facing",
      shadingConsiderations: ["Avoid trees", "Consider seasonal sun paths", "Account for future growth"],
      gridConnection: location.toLowerCase().includes('remote') ? "Off-grid with battery backup recommended" : "Grid-tied with net metering"
    },
    maintenanceSchedule: [
      "Monthly: Visual inspection and cleaning",
      "Quarterly: Performance monitoring and electrical connections check", 
      "Annually: Professional inspection and inverter maintenance"
    ]
  })
}

export async function POST(request: NextRequest) {
  try {
    const { propertySize, roofArea, energyUsage, location, budget, selectedCountry } = await request.json()

    if (!propertySize || !energyUsage) {
      return NextResponse.json({ error: 'Property size and energy usage are required' }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const prompt = `You are a solar energy expert specializing in rural installations. Optimize solar panel placement and sizing for:

PROPERTY DETAILS:
- Property Size: ${propertySize} hectares
- Available Roof Area: ${roofArea} square meters
- Current Energy Usage: ${energyUsage} kWh per month
- Location: ${location || 'Rural area'}
- Country/Location: ${selectedCountry || 'Global'}
- Budget: ${budget ? `$${budget}` : 'Not specified'}

Consider regional solar irradiance, rural installation challenges, grid connection costs, and battery storage needs for remote properties.

Return ONLY valid JSON in this exact format:
{
  "systemRecommendation": {
    "panelCapacity": "number kW",
    "numberOfPanels": "number panels",
    "panelType": "string panel type",
    "batteryCapacity": "number kWh",
    "inverterSize": "number kW",
    "estimatedCost": "number in us currency"
  },
  "energyProduction": {
    "dailyGeneration": "number kWh",
    "monthlyGeneration": "number kWh", 
    "annualGeneration": "number kWh",
    "selfConsumption": "number percentage",
    "gridExport": "number kWh"
  },
  "financialAnalysis": {
    "totalInvestment": "number in us currency",
    "annualSavings": "number in us currency",
    "paybackPeriod": "string years",
    "roi25Years": "number in us currency",
    "governmentRebates": "number in us currency"
  },
  "installationGuidance": {
    "optimalTilt": "string degrees",
    "orientation": "string direction",
    "shadingConsiderations": ["string consideration 1", "string consideration 2"],
    "gridConnection": "string connection type"
  },
  "maintenanceSchedule": [
    "string maintenance task 1",
    "string maintenance task 2",
    "string maintenance task 3"
  ]
}

Focus on practical solutions for rural conditions with reliable equipment and realistic costs.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const content = response.text()

    // Try to parse the JSON response
    try {
      // Extract JSON from markdown code block if present
      const jsonMatch = content.match(/```(?:json)?\n([\s\S]*?)\n```/)
      const jsonString = jsonMatch ? jsonMatch[1] : content
      const parsed = JSON.parse(jsonString)
      
      // Validate the response structure
      if (!parsed.systemRecommendation || !parsed.energyProduction) {
        throw new Error('Invalid response structure from AI')
      }
      
      return NextResponse.json(parsed)
    } catch (parseError) {
      console.error('Error parsing solar optimization response:', parseError)
      return getFallbackResponse(propertySize, energyUsage, location || 'Unknown')
    }

  } catch (error) {
    console.error('Solar optimizer API error:', error)
    return getFallbackResponse(1, 100, 'Unknown')
  }
}
