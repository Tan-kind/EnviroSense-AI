import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    const body = await request.json()
    const { goal_title, goal_description, duration_days } = body

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const prompt = `
You are an environmental impact calculator specializing in rural and regional areas. Calculate the realistic environmental impact of this goal for rural communities:

Goal: "${goal_title}"
Description: "${goal_description || 'No additional description'}"
Duration: ${duration_days} days

RURAL CONTEXT:
- Consider remote locations, extreme weather, and limited infrastructure
- Factor in long supply chains and transport distances to rural communities
- Account for water scarcity, wildfire risks, and drought conditions
- Include solar power potential and off-grid living benefits
- Consider local land management practices where relevant

Please calculate and return ONLY a JSON object with these exact fields:
{
  "co2_saved": [number in kg],
  "water_saved": [number in liters], 
  "energy_saved": [number in kWh],
  "waste_reduced": [number in kg],
  "impact_description": "[brief description focusing on rural environmental benefits]"
}

Base calculations on rural conditions:
- Water conservation in drought-prone areas: higher impact per liter saved
- Solar energy adoption: significant benefits in sunny rural regions
- Reducing transport emissions: major impact due to long distances
- Waste reduction: critical in remote areas with limited disposal options
- Native plant gardening: supports local ecosystems and reduces water use

Make numbers realistic for rural conditions. Return ONLY the JSON object.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    try {
      // Try to parse the AI response as JSON
      const impact = JSON.parse(text.trim())
      
      // Validate the response has required fields
      if (typeof impact.co2_saved === 'number' && 
          typeof impact.water_saved === 'number' && 
          typeof impact.energy_saved === 'number' && 
          typeof impact.waste_reduced === 'number' && 
          typeof impact.impact_description === 'string') {
        
        return NextResponse.json(impact)
      } else {
        throw new Error('Invalid AI response format')
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', text)
      
      // Fallback calculation based on goal type
      const fallbackImpact = calculateFallbackImpact(goal_title, duration_days)
      return NextResponse.json(fallbackImpact)
    }

  } catch (error) {
    console.error('Error calculating impact:', error)
    
    // Fallback calculation
    const { goal_title, duration_days } = await request.json()
    const fallbackImpact = calculateFallbackImpact(goal_title || 'Environmental goal', duration_days || 7)
    return NextResponse.json(fallbackImpact)
  }
}

function calculateFallbackImpact(goalTitle: string, days: number) {
  const title = goalTitle.toLowerCase()
  
  let co2_saved = 0
  let water_saved = 0
  let energy_saved = 0
  let waste_reduced = 0
  let impact_description = ''

  if (title.includes('water') || title.includes('bottle')) {
    co2_saved = days * 0.1
    water_saved = days * 2
    energy_saved = days * 0.5
    waste_reduced = days * 0.05
    impact_description = `Using reusable water bottles for ${days} days reduces plastic waste and manufacturing emissions`
  } else if (title.includes('walk') || title.includes('bike') || title.includes('transport')) {
    co2_saved = days * 2.5
    water_saved = days * 1
    energy_saved = days * 3
    waste_reduced = days * 0.1
    impact_description = `Choosing eco-friendly transport for ${days} days significantly reduces carbon emissions`
  } else if (title.includes('food') || title.includes('plant') || title.includes('meat')) {
    co2_saved = days * 1.5
    water_saved = days * 75
    energy_saved = days * 1
    waste_reduced = days * 0.3
    impact_description = `Making sustainable food choices for ${days} days reduces agricultural environmental impact`
  } else if (title.includes('waste') || title.includes('recycle')) {
    co2_saved = days * 0.5
    water_saved = days * 10
    energy_saved = days * 0.8
    waste_reduced = days * 0.5
    impact_description = `Reducing waste for ${days} days decreases landfill burden and resource consumption`
  } else {
    // Generic environmental goal
    co2_saved = days * 0.8
    water_saved = days * 15
    energy_saved = days * 1.2
    waste_reduced = days * 0.2
    impact_description = `Maintaining this environmental habit for ${days} days creates positive ecological impact`
  }

  return {
    co2_saved: Math.round(co2_saved * 10) / 10,
    water_saved: Math.round(water_saved),
    energy_saved: Math.round(energy_saved * 10) / 10,
    waste_reduced: Math.round(waste_reduced * 10) / 10,
    impact_description
  }
}
