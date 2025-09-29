import { NextRequest, NextResponse } from "next/server"
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(request: NextRequest) {
  try {
    // Get auth token from Authorization header
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: "Missing authorization header" }, { status: 401 })
    }
    
    const token = authHeader.replace('Bearer ', '')
    
    // Create supabase client with the user's access token
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    })

    // Get user from the token
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("Auth error:", authError)
      return NextResponse.json({ error: "Unauthorized", details: authError?.message }, { status: 401 })
    }

    const body = await request.json()
    const { object_name, category, carbon_footprint } = body

    if (!object_name || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Insert scan history
    const { data, error } = await supabase
      .from("scan_history")
      .insert({
        user_id: user.id,
        object_name,
        category,
        carbon_footprint: carbon_footprint || 0
      })
      .select()
      .single()

    if (error) {
      console.error("Error saving scan:", error)
      return NextResponse.json({ error: "Failed to save scan" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Scan history API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get auth token from Authorization header
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: "Missing authorization header" }, { status: 401 })
    }
    
    const token = authHeader.replace('Bearer ', '')
    
    // Create supabase client with the user's access token
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    })

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("Auth error:", authError)
      return NextResponse.json({ error: "Unauthorized", details: authError?.message }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "10")

    // Get recent scans
    const { data, error } = await supabase
      .from("scan_history")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching scans:", error)
      return NextResponse.json({ error: "Failed to fetch scans" }, { status: 500 })
    }

    // Get category summary
    const { data: categoryData, error: categoryError } = await supabase
      .from("scan_history")
      .select("category")
      .eq("user_id", user.id)

    if (categoryError) {
      console.error("Error fetching category data:", categoryError)
      return NextResponse.json({ error: "Failed to fetch category data" }, { status: 500 })
    }

    // Count scans by category
    const categoryCounts = categoryData.reduce((acc: Record<string, number>, scan) => {
      acc[scan.category] = (acc[scan.category] || 0) + 1
      return acc
    }, {})

    return NextResponse.json({ 
      scans: data, 
      categoryCounts,
      totalScans: categoryData.length 
    })
  } catch (error) {
    console.error("Scan history GET API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
