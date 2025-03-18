'use client'

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState, useEffect } from 'react';

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

export default function TopBar() {
  const { connected } = useWallet();
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformanceMetrics = async () => {
      try {
        const response = await fetch('/api/performance-metrics?timeframe=24h');
        const data: PerformanceResponse = await response.json();
        
        if (response.ok && data.success && data.data) {
          setMetrics(data.data);
        }
      } catch (err) {
        console.error('Error fetching performance metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceMetrics();
  }, []);

  return (
    <div className="top-bar">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center space-x-6">
            {/* Win Rate */}
            <div className="top-bar-stat">
              <span className="top-bar-label">Win Rate</span>
              <span className="top-bar-value">
                {loading ? '...' : `${metrics?.winRate.value || '0'}%`}
              </span>
              {!loading && metrics?.winRate.change !== 0 && (
                <span className={`ml-1 ${metrics?.winRate.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {metrics?.winRate.change > 0 ? '+' : ''}{metrics?.winRate.change}%
                </span>
              )}
            </div>

            {/* Total Trades */}
            <div className="top-bar-stat">
              <span className="top-bar-label">Total Trades</span>
              <span className="top-bar-value">
                {loading ? '...' : metrics?.totalTrades.value || '0'}
              </span>
              {!loading && metrics?.totalTrades.change !== 0 && (
                <span className={`ml-1 ${metrics?.totalTrades.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {metrics?.totalTrades.change > 0 ? '+' : ''}{metrics?.totalTrades.change}%
                </span>
              )}
            </div>

            {/* Volume */}
            <div className="top-bar-stat">
              <span className="top-bar-label">Volume</span>
              <span className="top-bar-value">
                {loading ? '...' : `$${metrics?.volume.value || '0'}`}
              </span>
              {!loading && metrics?.volume.change !== 0 && (
                <span className={`ml-1 ${metrics?.volume.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {metrics?.volume.change > 0 ? '+' : ''}{metrics?.volume.change}%
                </span>
              )}
            </div>

            {/* Pool Size */}
            <div className="top-bar-stat">
              <span className="top-bar-label">Pool Size</span>
              <span className="top-bar-value">
                {loading ? '...' : `$${metrics?.poolSize.value || '0'}`}
              </span>
              {!loading && metrics?.poolSize.change !== 0 && (
                <span className={`ml-1 ${metrics?.poolSize.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {metrics?.poolSize.change > 0 ? '+' : ''}{metrics?.poolSize.change}%
                </span>
              )}
            </div>
          </div>

          {/* Wallet */}
          <div>
            <WalletMultiButton className="!bg-[#FF1493] !text-black !h-[28px] !py-0">
              {!connected ? 'Connect Wallet' : null}
            </WalletMultiButton>
          </div>
        </div>
      </div>
    </div>
  );
}
