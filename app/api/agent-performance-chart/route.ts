import { NextResponse } from 'next/server'

const API_BOTS_URL = process.env.API_BOTS_URL || 'http://35.204.20.112:9090'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || '30d'
    const agentId = searchParams.get('agentId')


    // Forward the request to the external API
    const url = `${API_BOTS_URL}/api/agent-performance-chart?timeframe=${timeframe}`
    console.log("Fetching agent performance chart data from:", url)
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('API request failed:', {
          status: response.status,
          data
        })
        return NextResponse.json(
          { error: data.error || 'Failed to fetch agent performance chart data' },
          { status: response.status }
        )
      }

      return NextResponse.json(data)

    } catch (fetchError) {
      console.error('Fetch error details:', {
        message: fetchError.message,
        cause: fetchError.cause,
        url
      })
      throw fetchError
    }

  } catch (error) {
    console.error('Error fetching agent performance chart data:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch agent performance chart data',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
} 