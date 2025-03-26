'use client'

import { useState, useEffect } from 'react'

interface PerformanceMetric {
  value: string
  change: number
}

interface PerformanceMetrics {
  winRate: PerformanceMetric
  totalTrades: PerformanceMetric
  volume: PerformanceMetric
  poolSize: PerformanceMetric
}

interface PerformanceResponse {
  success: boolean
  data: PerformanceMetrics
  error: string
}

export default function Performance({ timeframe = '24h' }: { timeframe?: string }) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPerformanceMetrics = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/performance-metrics?timeframe=${timeframe}`)
        const data: PerformanceResponse = await response.json()
        console.log(data, "data")
        
        if (!response.ok) {
          throw new Error(data.success === false ? 'Failed to fetch metrics' : 'Unknown error')
        }
        
        if (data.success && data.data) {
          setMetrics(data.data)
        } else {
          throw new Error('Invalid response format')
        }
      } catch (err) {
        console.error('Error fetching performance metrics:', err)
        setError('Failed to load performance metrics')
      } finally {
        setLoading(false)
      }
    }

    fetchPerformanceMetrics()
  }, [timeframe])

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="gradient-border">
            <div className="p-3">
              <div className="h-4 bg-gray-700 rounded animate-pulse mb-2 w-16"></div>
              <div className="h-6 bg-gray-700 rounded animate-pulse w-20"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-400 p-3">
        {error}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-4 gap-3">
      <div className="gradient-border">
        <div className="p-3">
          <div className="text-white text-sm mb-1">Win Rate</div>
          <div className="flex flex-col">
            <div className="text-[rgb(255,20,147)] text-lg font-bold">
              {metrics?.winRate.value || '0'}%
            </div>
            <div className={`text-xs ${metrics?.winRate.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {metrics?.winRate.change > 0 ? '+' : ''}{metrics?.winRate.change}%
            </div>
          </div>
        </div>
      </div>
      
      <div className="gradient-border">
        <div className="p-3">
          <div className="text-white text-sm mb-1">Total Trades</div>
          <div className="flex flex-col">
            <div className="text-[rgb(255,20,147)] text-lg font-bold">
              {metrics?.totalTrades.value || '0'}
            </div>
            <div className={`text-xs ${metrics?.totalTrades.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {metrics?.totalTrades.change > 0 ? '+' : ''}{metrics?.totalTrades.change}%
            </div>
          </div>
        </div>
      </div>
      
      <div className="gradient-border">
        <div className="p-3">
          <div className="text-white text-sm mb-1">Volume</div>
          <div className="flex flex-col">
            <div className="text-[rgb(255,20,147)] text-lg font-bold">
              ${metrics?.volume.value || '0'}
            </div>
            <div className={`text-xs ${metrics?.volume.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {metrics?.volume.change > 0 ? '+' : ''}{metrics?.volume.change}%
            </div>
          </div>
        </div>
      </div>
      
      <div className="gradient-border">
        <div className="p-3">
          <div className="text-white text-sm mb-1">Pool Size</div>
          <div className="flex flex-col">
            <div className="text-[rgb(255,20,147)] text-lg font-bold">
              ${metrics?.poolSize.value || '0'}
            </div>
            <div className={`text-xs ${metrics?.poolSize.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {metrics?.poolSize.change > 0 ? '+' : ''}{metrics?.poolSize.change}%
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 