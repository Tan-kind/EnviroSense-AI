import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { region, soilType, rainfall, farmSize, currentCrops, user_country } = await request.json()

    if (!region || !soilType) {
      return NextResponse.json({ error: 'Region and soil type are required' }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    // Get country-specific context
    const countryContext = getCountryContext(user_country || 'USA')

    const prompt = `You are an agricultural expert specializing in drought-resistant crops for farming in ${countryContext.name}. Provide crop recommendations based on the following conditions:

COUNTRY CONTEXT FOR ${countryContext.name.toUpperCase()}:
${countryContext.agricultural_factors}

FARM CONDITIONS:
- Region: ${region}
- Soil Type: ${soilType}
- Annual Rainfall: ${rainfall}mm
- Farm Size: ${farmSize} hectares
- Current Crops: ${currentCrops}

Return ONLY valid JSON in this exact format:
{
  "recommendedCrops": [
    {
      "name": "Crop Name",
      "variety": "Specific variety",
      "waterRequirement": "Low/Medium/High",
      "plantingTime": "Month range",
      "harvestTime": "Month range", 
      "yieldPotential": "tonnes per hectare",
      "marketPrice": "price per tonne in local currency",
      "advantages": ["advantage1", "advantage2"],
      "challenges": ["challenge1", "challenge2"]
    }
  ],
  "seasonalTips": {
    "spring": "spring advice",
    "summer": "summer advice", 
    "autumn": "autumn advice",
    "winter": "winter advice"
  },
  "riskFactors": ["risk1", "risk2", "risk3"]
}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const content = response.text()
    
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const cropData = JSON.parse(jsonMatch[0])
    
    return NextResponse.json(cropData)
  } catch (error) {
    console.error('Drought crops API error:', error)
    
    // Return fallback data
    return NextResponse.json({
      recommendedCrops: [
        {
          name: "Sorghum",
          variety: "Dryland Grain Sorghum",
          waterRequirement: "Low",
          plantingTime: "October-December",
          harvestTime: "March-May",
          yieldPotential: "3-5 tonnes per hectare",
          marketPrice: "$280-320 per tonne",
          advantages: ["Drought tolerant", "Heat resistant", "Good feed value"],
          challenges: ["Bird damage", "Market volatility"]
        }
      ],
      seasonalTips: {
        spring: "Prepare soil and plan planting schedule",
        summer: "Monitor water levels and pest control",
        autumn: "Harvest and storage planning",
        winter: "Soil preparation for next season"
      },
      riskFactors: ["Drought conditions", "Market price fluctuations", "Pest pressure"]
    })
  }
}

function getCountryContext(countryCode: string) {
  const contexts: Record<string, { name: string; agricultural_factors: string }> = {
    'USA': {
      name: 'United States',
      agricultural_factors: `
- Diverse agricultural zones from temperate to arid climates
- Advanced irrigation systems and precision agriculture technology
- Focus on corn, soybeans, wheat, and specialty crops
- Drought-resistant varieties developed for Great Plains and Southwest
- Emphasis on water-efficient farming and soil conservation
- Market access through established distribution networks`
    },
    'IND': {
      name: 'India',
      agricultural_factors: `
- Monsoon-dependent agriculture with kharif and rabi seasons
- Traditional farming practices mixed with modern techniques
- Focus on rice, wheat, pulses, and cash crops like cotton
- Water scarcity issues requiring drought-tolerant varieties
- Small-scale farming with limited mechanization
- Emphasis on food security and sustainable practices`
    }
  }
  
  return contexts[countryCode] || contexts['USA']
}
