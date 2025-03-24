import { NextResponse } from 'next/server'

const API_BOTS_URL = process.env.API_BOTS_URL || 'http://35.204.20.112:9090'

// Define the tags we're interested in
export const TAGS = {
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
    
    try {
      const response = await fetch(
        url,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      const data = await response.json()

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
