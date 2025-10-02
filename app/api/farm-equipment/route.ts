import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!)

// Fallback response for when the AI service is unavailable
function getFallbackResponse(equipmentType: string, fuelType: string, hoursPerWeek: number, farmSize: number) {
  const baseEmissions = {
    'Tractor': 25,
    'Harvester': 45,
    'Seeder': 18,
    'Sprayer': 12,
    'Cultivator': 15
  }
  
  const fuelMultiplier = {
    'Diesel': 1.0,
    'Petrol': 0.8,
    'Electric': 0.1,
    'Hybrid': 0.5
  }
  
  const weeklyEmissions = (baseEmissions[equipmentType as keyof typeof baseEmissions] || 20) * 
                         (fuelMultiplier[fuelType as keyof typeof fuelMultiplier] || 1.0) * 
                         hoursPerWeek
  
  return NextResponse.json({
    carbonFootprint: {
      weeklyEmissions: Math.round(weeklyEmissions),
      monthlyEmissions: Math.round(weeklyEmissions * 4.33),
      annualEmissions: Math.round(weeklyEmissions * 52),
      fuelConsumption: Math.round(weeklyEmissions / 2.68), // kg CO2 per liter diesel
      costPerWeek: Math.round(weeklyEmissions * 0.15) // Approximate fuel cost
    },
    recommendations: [
      "Consider upgrading to more fuel-efficient equipment",
      "Implement precision agriculture techniques to reduce operating hours",
      "Regular maintenance can improve fuel efficiency by 10-15%",
      "Plan field operations to minimize unnecessary travel"
    ],
    alternatives: [
      {
        option: "Electric/Hybrid Equipment",
        emissionReduction: "60-90%",
        costImplication: "Higher upfront, lower operating costs",
        availability: "Limited for large equipment in rural areas"
      },
      {
        option: "Biofuel Conversion",
        emissionReduction: "20-40%",
        costImplication: "Moderate conversion cost",
        availability: "Good availability in rural areas"
      }
    ],
    efficiencyTips: [
      "Maintain optimal tire pressure for fuel efficiency",
      "Use GPS guidance to minimize overlap and reduce fuel consumption",
      "Combine operations where possible (e.g., seeding and fertilizing)",
      "Service equipment regularly according to manufacturer schedules"
    ]
  })
}

export async function POST(request: NextRequest) {
  try {
    const { equipmentType, fuelType, hoursPerWeek, farmSize, region, selectedCountry } = await request.json()

    if (!equipmentType || !fuelType || !hoursPerWeek) {
      return NextResponse.json({ error: 'Equipment details are required' }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const prompt = `You are an agricultural carbon footprint expert. Calculate the carbon footprint and provide recommendations for farm equipment usage.

EQUIPMENT DETAILS:
- Equipment Type: ${equipmentType}
- Fuel Type: ${fuelType}
- Hours per Week: ${hoursPerWeek}
- Farm Size: ${farmSize} hectares
- Region: ${region || 'Rural area'}
- Country/Location: ${selectedCountry || 'Global'}

Calculate realistic carbon emissions based on:
- Standard fuel consumption rates for farm equipment
- Regional factors (transport distances, fuel availability)
- Equipment efficiency standards
- Seasonal usage patterns in agriculture

Return ONLY valid JSON in this exact format:
{
  "carbonFootprint": {
    "weeklyEmissions": "number kg CO2",
    "monthlyEmissions": "number kg CO2",
    "annualEmissions": "number kg CO2",
    "fuelConsumption": "number liters per week",
    "costPerWeek": "number in local currency"
  },
  "recommendations": [
    "string recommendation 1",
    "string recommendation 2",
    "string recommendation 3"
  ],
  "alternatives": [
    {
      "option": "string alternative name",
      "emissionReduction": "string percentage",
      "costImplication": "string cost description",
      "availability": "string availability in region"
    }
  ],
  "efficiencyTips": [
    "string tip 1",
    "string tip 2", 
    "string tip 3"
  ]
}

Focus on practical farming conditions, equipment availability, and realistic emission calculations.`

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
      if (!parsed.carbonFootprint || !parsed.recommendations) {
        throw new Error('Invalid response structure from AI')
      }
      
      return NextResponse.json(parsed)
    } catch (parseError) {
      console.error('Error parsing farm equipment response:', parseError)
      return getFallbackResponse(equipmentType, fuelType, hoursPerWeek, farmSize || 100)
    }

  } catch (error) {
    console.error('Farm equipment API error:', error)
    const { equipmentType, fuelType, hoursPerWeek, farmSize } = await request.json()
    return getFallbackResponse(equipmentType || 'Tractor', fuelType || 'Diesel', hoursPerWeek || 10, farmSize || 100)
  }
}
