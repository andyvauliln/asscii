'use client'

import { useState } from 'react'
import TradingChart from '@/components/TradingChart'
import TokenHoldings from '@/components/TokenHoldings'
import LiquidityPanel from '@/components/LiquidityPanel'
import TopBar from '@/components/TopBar'
import { RealtimeUpdates } from '@/components/RealtimeUpdates'
import TradeHistory from '@/components/TradeHistory'
import TradingPool from '@/components/TradingPool'
import PoolHistory from '@/components/PoolHistory'
import Footer from '@/components/Footer'
import Performance from '@/components/Performance'

const THEME = {
  pink: 'rgb(255, 20, 147)',
  black: 'rgb(0, 0, 0)',
}

export default function Home() {
  const [timeframe, setTimeframe] = useState('30d')
  const [activeTab, setActiveTab] = useState('agent')
  const [expandedTrades, setExpandedTrades] = useState(new Set())

  return (
    <>
      <TopBar />
      <main className="min-h-screen overflow-y-auto pt-16">
        <div className="max-w-7xl mx-auto px-6 pb-12">
          {/* Title Section */}
          <div className="mb-8">
            <h1 className="text-2xl text-[rgb(255,20,147)] font-bold mb-2">
              Agent Dashboard
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Left Column - Trading Agent */}
            <div className="gradient-border">
              <div className="p-6">
                <h2 className="text-2xl text-white font-bold mb-3">$ASScii AI Trading Agent</h2>
                <p className="text-white/80 text-sm mb-4">
                  $ASScii is an autonomous AI trading agent on Solana, leveraging advanced LLM technology and machine learning to generate profits through sophisticated market analysis and automated trading strategies.
                </p>
                <ul className="space-y-2 text-sm text-white/80">
                  <li className="flex items-center gap-2">
                    <span className="text-[rgb(255,20,147)]">🤖</span>
                    Advanced AI-powered trading algorithms
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[rgb(255,20,147)]">📊</span>
                    Real-time market analysis and execution
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[rgb(255,20,147)]">⚡</span>
                    High-frequency trading capabilities
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[rgb(255,20,147)]">🛡️</span>
                    Risk management and position sizing
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column - $ASScii Project */}
            <div className="gradient-border">
              <div className="p-6">
                <h2 className="text-2xl text-white font-bold mb-3">$ASScii Token</h2>
                <p className="text-white/80 text-sm mb-4">
                  $ASScii is more than just a meme – it's a revolutionary trading ecosystem that combines AI technology with community-driven development on Solana.
                </p>
                <ul className="space-y-2 text-sm text-white/80">
                  <li className="flex items-center gap-2">
                    <span className="text-[rgb(255,20,147)]">💎</span>
                    Tiered holder benefits with tax discounts
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[rgb(255,20,147)]">🌊</span>
                    Liquidity pool profit sharing
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[rgb(255,20,147)]">🎯</span>
                    Automated trading strategies
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[rgb(255,20,147)]">🤝</span>
                    Strong community governance
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex">
            {/* Left Column - Performance */}
            <div className="w-1/2 pr-8">
              <h2 className="text-2xl text-white font-medium mb-4">Performance</h2>
              <Performance timeframe={timeframe} />

              {/* Chart */}
              <div className="gradient-border mt-4">
                <div className="p-4">
                  {/* Chart Controls */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex space-x-2">
                      {['agent'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`px-3 py-1 rounded-lg text-sm ${
                            activeTab === tab
                              ? 'bg-[rgb(255,20,147)] text-black'
                              : 'text-white/60 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      {['30d'].map((tf) => (
                        <button
                          key={tf}
                          onClick={() => setTimeframe(tf)}
                          className={`px-3 py-1 rounded-lg text-sm ${
                            timeframe === tf
                              ? 'bg-[rgb(255,20,147)] text-black'
                              : 'text-white/60 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="rounded-lg p-4">
                    <TradingChart timeframe={timeframe} type={activeTab} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - How to Start */}
            <div className="w-1/2 pl-8">
              <h2 className="text-xl text-white font-medium mb-2">How to Start</h2>
              <p className="text-white/80 text-sm mb-8 leading-6">
                Join our AI trading pool in three simple steps. Start earning profits automatically with our advanced trading algorithms.
              </p>
              
              <div className="space-y-6">
                {/* Step 1 */}
                <div className="gradient-border pink-glow">
                  <div className="p-4 space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-[rgb(255,20,147)] flex items-center justify-center text-black font-medium">
                        1
                      </div>
                      <h3 className="text-white font-medium">Connect Your Wallet</h3>
                    </div>
                    <p className="text-white/80 text-sm pl-11">
                      Connect your Solana wallet to get started. We support Phantom, Solflare, and other major Solana wallets.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="gradient-border pink-glow">
                  <div className="p-4 space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-[rgb(255,20,147)] flex items-center justify-center text-black font-medium">
                        2
                      </div>
                      <h3 className="text-white font-medium">Add Liquidity</h3>
                    </div>
                    <p className="text-white/80 text-sm pl-11">
                      Deposit funds into the trading pool. Your funds will be used by our AI agent to execute profitable trades.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="gradient-border pink-glow">
                  <div className="p-4 space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-[rgb(255,20,147)] flex items-center justify-center text-black font-medium">
                        3
                      </div>
                      <h3 className="text-white font-medium">Start Earning</h3>
                    </div>
                    <p className="text-white/80 text-sm pl-11">
                      Watch your portfolio grow as our AI executes trades. Track performance and withdraw profits anytime.
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full py-3 px-4 bg-[rgb(255,20,147)] text-black font-medium rounded-lg hover:bg-[rgb(255,20,147)]/90 transition-colors">
                  Add Liquidity
                </button>
              </div>
            </div>
          </div>

          {/* Trade History Section - Full Width */}
          <div className="mt-12">
            <div className="container mx-auto p-4">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <RealtimeUpdates />
                  <div className="mt-14">
                    <TradingPool />
                  </div>
                </div>
                <div>
                  <TradeHistory />
                  <div className="mt-14">
                    <PoolHistory />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
