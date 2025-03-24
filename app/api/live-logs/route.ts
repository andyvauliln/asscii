import { NextResponse } from 'next/server'

const API_BOTS_URL = process.env.API_BOTS_URL || 'http://35.204.20.112:9090'

// Define the tags we're interested in
const TAGS = {
  buy_tx_confirmed: { name: 'buy_tx_confirmed', description: 'Buy transaction confirmed' },
  sell_tx_confirmed: { name: 'sell_tx_confirmed', description: 'Sell transaction confirmed' },
  rug_validation: { name: 'rug_validation', description: 'Rug validation' },
  telegram_ai_token_analysis: { name: 'telegram_ai_token_analysis', description: 'Telegram AI token analysis' }
};

// Log the API configuration on module load
console.log('API Configuration:', {
  API_BOTS_URL,
  NODE_ENV: process.env.NODE_ENV
})

export async function GET(request: Request) {
  try {
    console.log('Fetching logs...')

    // Forward the request to the external API
    const url = `${API_BOTS_URL}/api/live-logs`
    console.log("Attempting to fetch logs from:", url)
    
    // Get the request URL parameters if any
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || '20'
    const offset = searchParams.get('offset') || '0'
    
    console.log(`Request parameters: limit=${limit}, offset=${offset}`)
    
    try {
      const response = await fetch(
        `${url}?limit=${limit}&offset=${offset}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 NextJS Application',
            'Accept': 'application/json',
            'Origin': process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
          },
          cache: 'no-store', // Ensure we don't get cached results
          next: { revalidate: 0 } // For Next.js 13+ to avoid caching
        }
      )

      const data = await response.json()
      console.log('Received data:', data)
      
      // Add detailed debugging about the response structure
      console.log('Response structure:', { 
        status: response.status,
        hasData: !!data.data,
        hasLogs: data.data?.logs ? true : false,
        logCount: data.data?.logs?.length || 0,
        success: data.success,
        dataKeys: data.data ? Object.keys(data.data) : []
      })

      if (!response.ok) {
        console.error('API request failed:', {
          status: response.status,
          data
        })
        return NextResponse.json(
          { 
            error: data.error || 'Failed to fetch logs', 
            success: false 
          },
          { status: response.status }
        )
      }

      // Create a properly structured response
      const logs = data.data?.logs || [];
      const tags = data.data?.tags || Object.values(TAGS);
      
      console.log(`Retrieved ${logs.length} logs`)
      
      return NextResponse.json({
        data: { 
          logs, 
          tags 
        },
        success: true
      })

    } catch (fetchError) {
      console.error('Fetch error details:', {
        message: fetchError.message,
        cause: fetchError.cause,
        url
      })
      throw fetchError
    }

  } catch (error) {
    console.error('Error fetching logs:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch logs',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        success: false
      },
      { status: 500 }
    )
  }
}
