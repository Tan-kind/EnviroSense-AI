import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GEMINI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY || ''
)

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { assessment } = body

  if (!assessment || !assessment.region || !assessment.habitatType) {
    return NextResponse.json(
      { error: 'Property assessment data is required' },
      { status: 400 }
    )
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `As a habitat conservation expert, provide personalized habitat protection recommendations for a property with the following characteristics:

Property Details:
- Size: ${assessment.propertySize} hectares
- Region: ${assessment.region}
- Primary Habitat Type: ${assessment.habitatType}
- Habitat Connectivity: ${assessment.connectivity}
- Current Management: ${assessment.currentManagement}
- Threatened Species Present: ${assessment.threatenedSpecies ? 'Yes' : 'No'}
- Permanent Water Sources: ${assessment.waterSources ? 'Yes' : 'No'}

Please provide 1-2 specific, actionable habitat protection recommendations tailored to this property. For each recommendation, include:

1. Title (specific action)
2. Priority level (Critical/High/Medium/Low)
3. Category (Restoration/Protection/Connectivity/Monitoring/Community)
4. Description (2-3 sentences explaining the action)
5. Target species that will benefit
6. Implementation timeframe
7. Estimated cost range
8. Difficulty level (Easy/Medium/Hard)
9. 4-6 specific implementation steps
10. 3-4 expected outcomes
11. 2-3 relevant funding sources

Focus on:
- Native species and ecosystems
- Climate resilience and adaptation
- Practical solutions for rural properties
- Cost-effective approaches suitable for the property size
- Integration with existing land management practices
- Compliance with local environmental regulations

Return the response as a JSON object with this structure:
{
  "recommendations": [
    {
      "id": "1",
      "title": "Action title",
      "priority": "High",
      "category": "Restoration",
      "description": "Detailed description",
      "targetSpecies": ["Species 1", "Species 2"],
      "timeframe": "6-12 months",
      "cost": "$5,000-15,000",
      "difficulty": "Medium",
      "steps": ["Step 1", "Step 2", "Step 3", "Step 4"],
      "expectedOutcomes": ["Outcome 1", "Outcome 2", "Outcome 3"],
      "fundingSources": ["Source 1", "Source 2"]
    }
  ],
  "propertySpecificNotes": "Additional context or considerations for this specific property"
}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const content = response.text()

    // Extract JSON from response with better parsing
    let jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/)
    if (!jsonMatch) {
      jsonMatch = content.match(/\{[\s\S]*\}/)
    }

    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    // Clean the JSON string
    let jsonString = jsonMatch[1] || jsonMatch[0]
    jsonString = jsonString.trim()
    
    // Fix common JSON issues
    jsonString = jsonString.replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
    jsonString = jsonString.replace(/([{,]\s*)(\w+):/g, '$1"$2":') // Quote unquoted keys
    
    const habitatData = JSON.parse(jsonString)

    // Validate the response structure
    if (!habitatData.recommendations || !Array.isArray(habitatData.recommendations)) {
      throw new Error('Invalid response structure from AI')
    }

    return NextResponse.json(habitatData)

  } catch (error) {
    console.error('Habitat protection API error:', error)
    
    // Fallback recommendations based on assessment
    const fallbackRecommendations = generateFallbackRecommendations(assessment)
    
    return NextResponse.json({
      recommendations: fallbackRecommendations,
      propertySpecificNotes: "These are general recommendations. For personalized advice, please consult with a local conservation expert.",
      source: "Fallback recommendations"
    })
  }
}

function generateFallbackRecommendations(assessment: any) {
  const baseRecommendations = [
    {
      id: "1",
      title: "Establish Native Vegetation Corridors",
      priority: "High",
      category: "Connectivity",
      description: "Create connected pathways of native vegetation to link habitat fragments and allow wildlife movement across the landscape.",
      targetSpecies: ["Native birds", "Small mammals", "Pollinators", "Reptiles"],
      timeframe: "2-3 years",
      cost: "$8,000-25,000",
      difficulty: "Medium",
      steps: [
        "Map existing vegetation and identify corridor opportunities",
        "Select appropriate native plant species for the region",
        "Prepare planting sites and control weeds",
        "Plant native vegetation in strategic locations",
        "Install protective fencing if needed",
        "Monitor establishment and maintain plantings"
      ],
      expectedOutcomes: [
        "Improved wildlife movement between habitats",
        "Enhanced genetic diversity in wildlife populations",
        "Increased ecosystem resilience",
        "Better pollination services for native plants"
      ],
      fundingSources: [
        "Government Environment Restoration Fund",
        "State biodiversity conservation programs",
        "Local Landcare group grants"
      ]
    },
    {
      id: "2",
      title: "Control Invasive Species",
      priority: "High",
      category: "Restoration",
      description: "Systematically remove invasive plants and animals that compete with native species and degrade habitat quality.",
      targetSpecies: ["All native species"],
      timeframe: "1-2 years ongoing",
      cost: "$3,000-12,000 per hectare",
      difficulty: "Medium",
      steps: [
        "Conduct invasive species survey and mapping",
        "Prioritize control based on threat level",
        "Apply appropriate control methods",
        "Follow up with repeat treatments",
        "Replant with native species where needed",
        "Establish ongoing monitoring program"
      ],
      expectedOutcomes: [
        "Reduced competition for native species",
        "Improved habitat structure and quality",
        "Increased native plant regeneration",
        "Enhanced ecosystem function"
      ],
      fundingSources: [
        "National Landcare Program",
        "State weed control grants",
        "Local council environmental programs"
      ]
    }
  ]

  // Add water-specific recommendation if no permanent water sources
  if (!assessment.waterSources) {
    baseRecommendations.push({
      id: "3",
      title: "Install Wildlife Water Points",
      priority: "Critical",
      category: "Protection",
      description: "Establish reliable water sources to support wildlife during dry periods and improve habitat suitability.",
      targetSpecies: ["All wildlife", "Particularly birds and mammals"],
      timeframe: "3-6 months",
      cost: "$2,000-8,000 per water point",
      difficulty: "Easy",
      steps: [
        "Assess water needs and optimal locations",
        "Install tanks or troughs with wildlife-friendly design",
        "Set up reliable water supply system",
        "Create habitat plantings around water points",
        "Install monitoring equipment if needed",
        "Establish maintenance schedule"
      ],
      expectedOutcomes: [
        "Increased wildlife survival during droughts",
        "Greater species diversity on property",
        "Improved breeding success for water-dependent species",
        "Enhanced ecosystem resilience"
      ],
      fundingSources: [
        "Drought resilience funding programs",
        "Wildlife conservation grants",
        "Water infrastructure support schemes"
      ]
    })
  }

  return baseRecommendations
}
