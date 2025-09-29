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

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("Auth error:", authError)
      return NextResponse.json({ error: "Unauthorized", details: authError?.message }, { status: 401 })
    }

    const body = await request.json()
    const { topic } = body

    if (!topic) {
      return NextResponse.json({ error: "Topic required" }, { status: 400 })
    }

    // Use the upsert function to track chat topics
    const { error } = await supabase.rpc('upsert_chat_topic', {
      user_uuid: user.id,
      topic_name: topic
    })

    if (error) {
      console.error("Error tracking chat topic:", error)
      return NextResponse.json({ error: "Failed to track topic" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Chat topics POST API error:", error)
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

    // Get user's most discussed topics
    const { data, error } = await supabase
      .from("chat_topics")
      .select("*")
      .eq("user_id", user.id)
      .order("mentioned_count", { ascending: false })
      .limit(10)

    if (error) {
      console.error("Error fetching chat topics:", error)
      return NextResponse.json({ error: "Failed to fetch topics" }, { status: 500 })
    }

    return NextResponse.json({ topics: data })
  } catch (error) {
    console.error("Chat topics GET API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
