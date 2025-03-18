'use client';

import { useState, useRef, useEffect } from 'react';

interface Trade {
  id: number;
  Time: number;
  Token: string;
  TokenName: string;
  TransactionType: string;
  TokenAmount: number;
  SolAmount: number;
  SolFee: number;
  PricePerTokenUSDC: number;
  TotalUSDC: number;
  Slot: number;
  Program: string;
  BotName: string;
  WalletPublicKey: string;
  comment: string;
}

export default function TradeHistory() {
  const [expandedTrades, setExpandedTrades] = useState<Set<number>>(new Set());
  const [trades, setTrades] = useState<Trade[]>([]);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const LIMIT = 20;

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async (currentOffset = 0) => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/trading-history?offset=${currentOffset}&limit=${LIMIT}`);
      const data = await response.json();
      if (data.success) {
        if (currentOffset === 0) {
          setTrades(data.data);
        } else {
          setTrades(prev => [...prev, ...data.data]);
        }
        setHasMore(data.data.length === LIMIT);
        setOffset(currentOffset + LIMIT);
      }
    } catch (error) {
      console.error('Error fetching trades:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      
      if (scrollTop > 0 && showScrollIndicator) {
        setShowScrollIndicator(false);
      }

      // Load more when user scrolls near bottom
      if (scrollHeight - scrollTop <= clientHeight * 1.5) {
        fetchTrades(offset);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [offset, hasMore, isLoading, showScrollIndicator]);

  // Initial load
  useEffect(() => {
    fetchTrades(0);
  }, []);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="relative">
      <h2 className="text-2xl font-medium text-white mb-4">Trade History</h2>
      <div 
        ref={containerRef}
        className="h-[490px] overflow-y-auto scrollbar-thin scrollbar-thumb-pink-500/20 scrollbar-track-transparent"
      >
        <div className="space-y-2">
          {isLoading && trades.length === 0 ? (
            <div className="text-white text-center py-4">Loading...</div>
          ) : trades?.map((trade) => (
            <div 
              key={trade.id} 
              className="gradient-border cursor-pointer group transition-all duration-200"
              onClick={() => {
                const newExpandedTrades = new Set(expandedTrades);
                if (newExpandedTrades.has(trade.id)) {
                  newExpandedTrades.delete(trade.id);
                } else {
                  newExpandedTrades.add(trade.id);
                }
                setExpandedTrades(newExpandedTrades);
              }}
            >
              <div className="px-3 py-2">
                {/* Header - Always Visible */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center justify-between flex-1 pr-3">
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <div className="text-[rgb(255,20,147)] font-medium text-sm">
                              {`${trade.TransactionType} ${trade.TokenName || trade.Token}`}
                            </div>
                            <div className="text-white text-xs">• {formatTime(trade.Time)}</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-white text-xs italic">
                        {trade.comment}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <svg 
                        className={`w-4 h-4 text-white transform transition-transform duration-200 ${
                          expandedTrades.has(trade.id) ? 'rotate-180' : ''
                        }`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Expandable Content */}
                  <div 
                    className={`
                      overflow-hidden transition-all duration-200 ease-in-out
                      ${expandedTrades.has(trade.id) ? 'max-h-96 mt-2' : 'max-h-0'}
                    `}
                  >
                    <div className="flex justify-between text-xs bg-black/10 rounded-lg p-2">
                      <div>
                        <div className="text-white">Token Amount</div>
                        <div className="text-white font-medium">{trade.TokenAmount}</div>
                      </div>
                      {/* <div>
                        <div className="text-white">SOL Amount</div>
                        <div className="text-white font-medium">{trade.SolAmount}</div>
                      </div> */}
                      <div>
                        <div className="text-white">Price (USDC)</div>
                        <div className="text-white font-medium">{trade.PricePerTokenUSDC.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-white">DEX</div>
                        <div className="text-white font-medium">{trade.Program}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Gradient fade to black */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgb(0,0,0) 100%)'
        }}
      />
      
      {showScrollIndicator && (
        <div 
          className="absolute bottom-0 left-0 right-0 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 50%, transparent 100%)',
            height: '100px',
            transform: 'translateY(50%)'
          }}
        >
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <div className="text-center text-white text-xs flex items-center justify-center gap-2">
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
