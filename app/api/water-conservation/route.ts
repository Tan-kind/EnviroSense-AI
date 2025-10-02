import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { 
      propertySize, 
      currentUsage, 
      location, 
      budget, 
      waterSource,
      selectedCountry 
    } = await request.json()

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
    const prompt = `You are a water conservation expert. Analyze water usage for ${location || 'your region'} and provide practical conservation strategies.

Property: ${propertySize}
Current usage: ${currentUsage} L/day
Location: ${location || 'your region'}
Budget: $${budget || 5000}
Water source: ${waterSource || 'mains water'}

note : The currency should be in us dollars

Return ONLY a JSON object:
{
  "current_usage_analysis": {
    "daily_usage": [number],
    "monthly_usage": [number],
    "usage_category": "low|average|high|excessive",
    "comparison_to_average": "string"
  },
  "conservation_strategies": [
    {
      "strategy": "string",
      "description": "string",
      "implementation_cost": [number],
      "annual_savings_liters": [number],
      "annual_savings_dollars": [number],
      "payback_period_months": [number],
      "difficulty": "easy|moderate|difficult",
      "priority": "high|medium|low"
    }
  ],
  "total_potential_savings": {
    "annual_liters": [number],
    "annual_dollars": [number],
    "percentage_reduction": [number]
  }
}

Base on regional water conservation practices.`

    console.log('Water conservation API: Making request to Gemini')

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    try {
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const conservationData = JSON.parse(jsonMatch[0])
        console.log('Water conservation API: Returning AI result')
        return NextResponse.json(conservationData)
      } else {
        throw new Error('No JSON found in AI response')
      }
    } catch (parseError) {
      console.error('Water conservation API: Failed to parse AI response, using fallback')
      
      // Fallback data
      return NextResponse.json({
        current_usage_analysis: {
          daily_usage: parseInt(currentUsage) || 300,
          monthly_usage: (parseInt(currentUsage) || 300) * 30,
          usage_category: "average",
          comparison_to_average: "Your usage is within the typical range for households in your region"
        },
        conservation_strategies: [
          {
            strategy: "Install low-flow showerheads",
            description: "Replace existing showerheads with water-efficient models",
            implementation_cost: 150,
            annual_savings_liters: 15000,
            annual_savings_dollars: 45,
            payback_period_months: 40,
            difficulty: "easy",
            priority: "high"
          },
          {
            strategy: "Fix leaks and drips",
            description: "Repair all visible leaks in taps, pipes, and toilets",
            implementation_cost: 200,
            annual_savings_liters: 20000,
            annual_savings_dollars: 60,
            payback_period_months: 40,
            difficulty: "moderate",
            priority: "high"
          },
          {
            strategy: "Install rainwater tank",
            description: "Collect rainwater for garden irrigation and toilet flushing",
            implementation_cost: 2500,
            annual_savings_liters: 50000,
            annual_savings_dollars: 150,
            payback_period_months: 200,
            difficulty: "difficult",
            priority: "medium"
          }
        ],
        total_potential_savings: {
          annual_liters: 85000,
          annual_dollars: 255,
          percentage_reduction: 25
        }
      })
    }

  } catch (error) {
    console.error('Water conservation API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate water conservation strategies' },
      { status: 500 }
    )
  }
}
