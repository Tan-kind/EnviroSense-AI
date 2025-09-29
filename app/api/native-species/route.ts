import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { region, habitat, purpose } = await request.json()

    if (!region) {
      return NextResponse.json({ error: 'Region is required' }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a native species expert specializing in flora and fauna of global regions. Provide detailed information about native species for:

Region: ${region}
Habitat Type: ${habitat || 'Mixed'}
Purpose: ${purpose || 'General conservation'}

REQUIREMENTS:
- Focus on species native to the specified region
- Include both flora and fauna
- Provide conservation status for each species
- Include practical information for landowners and conservationists
- Use appropriate regional terminology and scientific names
- Consider climate adaptation and drought tolerance

Return your response as a JSON object with this exact structure:
{
  "species": [
    {
      "name": "Common Name",
      "scientificName": "Scientific name",
      "type": "Flora" or "Fauna",
      "conservationStatus": "Least Concern/Near Threatened/Vulnerable/Endangered/Critically Endangered",
      "habitat": "Preferred habitat description",
      "characteristics": "Key identifying features and characteristics",
      "ecologicalRole": "Role in the ecosystem",
      "threats": ["List of main threats"],
      "conservationActions": ["List of conservation actions"],
      "culturalSignificance": "Aboriginal cultural significance if applicable",
      "plantingTips": "For flora: planting and care tips",
      "observationTips": "For fauna: best times and places to observe"
    }
  ],
  "habitatInfo": {
    "description": "Description of the habitat type",
    "keyFeatures": ["List of key habitat features"],
    "conservationPriority": "High/Medium/Low",
    "threats": ["List of habitat threats"],
    "managementRecommendations": ["List of management actions"]
  },
  "resources": {
    "governmentPrograms": ["List of relevant government programs"],
    "fundingOpportunities": ["List of funding sources"],
    "expertContacts": ["List of relevant organizations"]
  }
}

Ensure all data is accurate for regional species and includes practical, actionable information for landowners and conservationists.`
            }]
          }]
        })
      }
    )

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data.candidates || !data.candidates[0]) {
      throw new Error('No response from Gemini API')
    }

    const content = data.candidates[0].content.parts[0].text
    
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
    
    const speciesData = JSON.parse(jsonString)
    
    return NextResponse.json(speciesData)
  } catch (error) {
    console.error('Native species API error:', error)
    
    // Return fallback data
    return NextResponse.json({
      species: [
        {
          name: 'Red Kangaroo',
          scientificName: 'Osphranter rufus',
          type: 'Fauna',
          conservationStatus: 'Least Concern',
          habitat: 'Open plains, grasslands, and scrublands',
          characteristics: 'Largest marsupial, distinctive red-brown fur in males, powerful hind legs',
          ecologicalRole: 'Grazer that helps maintain grassland ecosystems',
          threats: ['Habitat fragmentation', 'Vehicle strikes', 'Drought'],
          conservationActions: ['Wildlife corridors', 'Speed limit enforcement', 'Water point management'],
          culturalSignificance: 'Important totem animal for many Aboriginal groups',
          observationTips: 'Most active during dawn and dusk, often seen in groups'
        },
        {
          name: 'Sturt\'s Desert Pea',
          scientificName: 'Swainsona formosa',
          type: 'Flora',
          conservationStatus: 'Near Threatened',
          habitat: 'Arid and semi-arid regions, sandy soils',
          characteristics: 'Distinctive red and black flowers, prostrate growth habit',
          ecologicalRole: 'Nitrogen-fixing legume, provides habitat for insects',
          threats: ['Overgrazing', 'Habitat clearing', 'Climate change'],
          conservationActions: ['Seed collection', 'Habitat restoration', 'Grazing management'],
          culturalSignificance: 'Regional floral emblem',
          plantingTips: 'Requires well-drained sandy soil, minimal watering once established'
        }
      ],
      habitatInfo: {
        description: 'Arid ecosystems characterized by low rainfall and extreme temperatures',
        keyFeatures: ['Sparse vegetation', 'Adapted wildlife', 'Seasonal water sources'],
        conservationPriority: 'High',
        threats: ['Climate change', 'Invasive species', 'Overgrazing'],
        managementRecommendations: ['Controlled grazing', 'Weed management', 'Water point planning']
      },
      resources: {
        governmentPrograms: ['Environmental Stewardship Programs', 'Biodiversity Conservation Trusts'],
        fundingOpportunities: ['Government Environment Grants', 'Regional conservation funding'],
        expertContacts: ['Local Land Services', 'Wildlife Conservancy Organizations']
      }
    })
  }
}
