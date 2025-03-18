import { NextResponse } from 'next/server'

const API_BOTS_URL = process.env.API_BOTS_URL || 'http://35.204.20.112:9090'

// Log the API configuration on module load
console.log('API Configuration:', {
  API_BOTS_URL,
  NODE_ENV: process.env.NODE_ENV
})

export async function GET(request: Request) {
  try {
    console.log('Fetching logs...')
    const { searchParams } = new URL(request.url)
    const module = searchParams.get('module')
    const date = searchParams.get('date')

    // Validate required parameters
    if (!module || !date) {
      return NextResponse.json(
        { error: 'Both module and date parameters are required' },
        { status: 400 }
      )
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: 'Invalid date format. Please use YYYY-MM-DD format.' },
        { status: 400 }
      )
    }

    // Validate module name format
    if (!/^[a-zA-Z0-9_-]+$/.test(module)) {
      return NextResponse.json(
        { error: 'Invalid module name format' },
        { status: 400 }
      )
    }

    // Forward the request to the external API
    const url = `${API_BOTS_URL}/api/logs?module=${module}&date=${date}`
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
          { error: data.error || 'Failed to fetch logs' },
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
    console.error('Error fetching logs:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch logs',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
