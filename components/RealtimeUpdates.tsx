'use client';

import { useState, useEffect, useRef } from 'react';
import { AgentMessage } from '@/types/agent';
import { TradeCard } from './agent/TradeCard';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Mock data generator
const generateMockTrade = () => ({
  action: ['BUY', 'SELL', 'ARBITRAGE'][Math.floor(Math.random() * 3)] as 'BUY' | 'SELL' | 'ARBITRAGE',
  token: {
    symbol: ['SOL', 'BONK', 'JUP', 'RAY'][Math.floor(Math.random() * 4)],
    price: Math.random() * 100,
    change24h: (Math.random() * 20) - 10
  },
  amount: Math.random() * 1000,
  price: Math.random() * 100,
  timestamp: new Date().toISOString(),
  reasoning: "Detected favorable market conditions",
  profitLoss: (Math.random() * 10) - 2
});

const MOCK_MESSAGES: AgentMessage[] = [
  {
    type: 'trade',
    content: "Hey besties! 👋 Check out this juicy trade I just made!",
    metadata: {
      trade: {
        action: 'BUY',
        token: { symbol: 'SOL', price: 98.45, change24h: 2.3 },
        amount: 145.23,
        price: 98.45,
        timestamp: new Date().toISOString(),
        reasoning: "RSI showing oversold conditions while whale wallets are accumulating. Classic setup! 💅",
        profitLoss: 2.3
      }
    }
  },
  {
    type: 'analysis',
    content: "Spilling the tea on $BONK... 🫖",
    metadata: {
      sentiment: 'bullish',
      confidence: 0.85,
      tokens: [
        { symbol: 'BONK', price: 0.00002341, change24h: 5.6 }
      ]
    }
  },
  {
    type: 'trade',
    content: "Omg bestie, look at this arbitrage opportunity! 👀",
    metadata: {
      trade: {
        action: 'ARBITRAGE',
        token: { symbol: 'JUP', price: 1.24, change24h: -1.2 },
        amount: 500,
        price: 1.24,
        timestamp: new Date().toISOString(),
        reasoning: "Found a price gap between Orca and Raydium. Easy money! 💅",
        profitLoss: 1.8
      }
    }
  }
];

interface RealtimeUpdatesProps {
  className?: string;
}

export function RealtimeUpdates({ className = '' }: RealtimeUpdatesProps) {
  const [videoError, setVideoError] = useState(false);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [textOnly, setTextOnly] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Simulate streaming messages
    const interval = setInterval(() => {
      const randomMessage = {...MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)]};
      if (randomMessage.metadata?.trade) {
        randomMessage.metadata.trade = generateMockTrade();
      }
      setMessages(prev => [...prev.slice(-4), randomMessage]); // Keep last 5 messages
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Handle video loading
  const handleVideoError = (e: any) => {
    console.error('Video loading error:', e);
    setVideoError(true);
  };

  return (
    <div className={className}>
      <div className="w-full space-y-2">
        <h1 className="text-xl font-medium text-white">Realtime Updates</h1>

        {!textOnly && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black/20">
              {videoError ? (
                <div className="absolute inset-0 flex items-center justify-center text-white/60">
                  <p>Video loading failed... 💅</p>
                </div>
              ) : (
                <video 
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  onError={handleVideoError}
                  style={{ 
                    filter: 'brightness(0.9) contrast(1.1)',
                    backgroundColor: 'rgba(0,0,0,0.2)'
                  }}
                >
                  <source src="/assets/new-video.mp4" type="video/mp4" />
                </video>
              )}
            </div>
            <div className="flex items-center">
              <div className="space-y-2">
                <div className="text-[#FF1493] font-medium text-lg">Meet Angel 👋</div>
                <p className="text-white/80 text-sm leading-relaxed">
                  Your $ASScii video agent "Angel" will keep you updated in real-time about all the trades executed by our AI Trading agent. She'll announce each trade as it happen in a sexy way.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end px-2 -mt-1">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="text-only" 
              checked={textOnly}
              onCheckedChange={(checked) => setTextOnly(checked as boolean)}
              className="border-white/40"
            />
            <Label 
              htmlFor="text-only" 
              className="text-[10px] text-white cursor-pointer"
            >
              Text updates only
            </Label>
          </div>
        </div>

        <div className="h-[300px] bg-black/20 rounded-lg relative border border-[#FF1493]/40">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-white/60 text-xs">
              <div className="animate-pulse">Connecting to agent... 💅</div>
            </div>
          ) : (
            <div className="space-y-1.5 p-2 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-pink-500/20 scrollbar-track-transparent">
              {messages.map((message, i) => (
                <div key={i} className="animate-fadeIn">
                  <div className="text-white/80 text-[10px] mb-1">
                    {message.content}
                  </div>
                  
                  {message.metadata?.trade && (
                    <TradeCard trade={message.metadata.trade} />
                  )}
                  
                  {message.metadata?.sentiment && (
                    <div className="text-[9px] text-white/60 flex items-center gap-1.5 mt-1">
                      <span>Sentiment: {message.metadata.sentiment}</span>
                      <span>•</span>
                      <span>Confidence: {(message.metadata.confidence! * 100).toFixed(0)}%</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {/* Gradient fade to black */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgb(0,0,0) 100%)'
            }}
          />
        </div>
      </div>
    </div>
  );
}
