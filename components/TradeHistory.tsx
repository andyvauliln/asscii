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
  TxId: string;
  ProfitLossSOL?: number;
  ProfitLossUSDC?: number;
  ROIPercentage?: number;
}

// Sexy comments for different transaction types
const sexyCryptoComments = {
  buy: [
    "Just aped in hard! This token's about to explode! 🚀",
    "Couldn't resist those juicy dips. Time to ride this wave! 🌊",
    "Just secured my ticket to the moon! See you there! 🌙",
    "Bought in before it gets noticed by the masses. Early bird! 🐦",
    "Just went all in! Diamond hands activated! 💎",
    "FOMO hit me hard, but these gains will hit harder! 🔥",
    "Just stacked my bags with this gem! Ready to pump! 💰",
    "Bought the dip like a professional! Bullish AF! 🐂",
    "Just loaded up! This one's going to melt faces! 🔥",
    "Sexy entry point secured! Chart looking irresistible! 📈",
    "Couldn't keep my hands off this token! Too hot to ignore! 🥵",
    "Just caught this rocket before liftoff! Strapped in tight! 🚀",
    "Bags packed and ready for this journey to the stars! ✨",
    "Just bought in! This token's curves are too seductive! 💋",
    "Added more to my position! Can't get enough of these gains! 💸"
  ],
  
  sellPositive: [
    "Just took profits! My wallet is feeling extra thicc today! 💰",
    "Sold at the perfect moment! Timing the market like a boss! 👑",
    "Just secured those juicy gains! Easy money, baby! 💸",
    "Locked in profits and feeling like a crypto god! ⚡",
    "Just sold high after buying low! Trading 101 mastered! 📚",
    "Cashed out with a smile! Green candles made my day! 💚",
    "Just harvested these delicious profits! Money printer go brrrr! 🖨️",
    "Sold with style! My portfolio is thanking me! 🙏",
    "Just took profits at resistance! Trading like a pro! 📊",
    "Cashed out and feeling sexy! These gains look good on me! 💅",
    "Just secured the bag! Time to celebrate these returns! 🎉",
    "Sold at the local top! My crystal ball was on point today! 🔮",
    "Just booked those profits! Smart money moves only! 🧠",
    "Took profits and ready for the next opportunity! Always winning! 🏆",
    "Just sold for a nice gain! Champagne tonight! 🍾"
  ],
  
  sellNegative: [
    "Just cut my losses! Better to live to trade another day... 😓",
    "Had to sell before it dumped more. Learning experience... 📉",
    "Just took an L on this one. The market can be so cruel! 💔",
    "Sold at a loss, but saved what I could. Mental health > profits! 🧠",
    "Just got out before it went to zero! Close call! 😰",
    "Had to cut the bags loose. This one wasn't meant to be... 🎒",
    "Just sold for a loss. This dip kept dipping! 📉",
    "Cut my losses. Sometimes you have to know when to walk away... 🚶",
    "Just sold underwater. No point holding a sinking ship! 🚢",
    "Took the L like a champ. Can't win them all! 🥊",
    "Just escaped this falling knife! My poor hands are bleeding! 🔪",
    "Sold at a loss, but saved my capital from total destruction! 💸",
    "Just cut my position. This token betrayed my trust! 💔",
    "Had to sell for a loss. At least I still have ramen money! 🍜",
    "Just got out with what's left. Living to trade another day! 🌅"
  ]
};

// Function to get a random sexy comment based on trade type and ROI
const getSexyComment = (trade: Trade): string => {
  if (trade.TransactionType.toLowerCase() === 'buy') {
    return sexyCryptoComments.buy[Math.floor(Math.random() * sexyCryptoComments.buy.length)];
  } else if (trade.TransactionType.toLowerCase() === 'sell') {
    if (trade.ROIPercentage && trade.ROIPercentage >= 0) {
      return sexyCryptoComments.sellPositive[Math.floor(Math.random() * sexyCryptoComments.sellPositive.length)];
    } else {
      return sexyCryptoComments.sellNegative[Math.floor(Math.random() * sexyCryptoComments.sellNegative.length)];
    }
  }
  return trade.comment; // Return original comment if no match
};

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
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: number) => {
    if (price < 0.0001) {
      return '$' + price.toFixed(8);
    } else if (price < 0.01) {
      return '$' + price.toFixed(6);
    } else {
      return '$' + price.toFixed(2);
    }
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
                  <div className="flex justify-between">
                    <div className="flex flex-col">
                      <div className="text-[rgb(255,20,147)] font-medium text-sm">
                        {`${trade.TransactionType}`}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {formatTime(trade.Time)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {/* Token amount on the right */}
                      <div className="text-white flex-col font-medium">
                        <div className="flex items-center gap-1">
                          {trade.TokenAmount.toFixed(2)}
                          <span className="text-[rgb(255,20,147)] ml-2">
                            {trade.TokenName}
                          </span>
                        </div>
                        {trade.ProfitLossUSDC && (
                          <div className={`text-right text-xs ${trade.ProfitLossUSDC < 0 ? 'text-red-400' : 'text-green-500'}`}>
                            ${trade.ProfitLossUSDC.toFixed(4)}
                            <span className="text-xs">
                              ({trade.ROIPercentage?.toFixed(2)}%)
                            </span>
                          </div>
                        )}
                      </div>
                      
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
                    <div className="text-[rgb(255,20,147)] text-xs italic flex-1 py-2 full">
                        {getSexyComment(trade)}
                        <div className="text-gray-400 text-xs pt-1 flex gap-2">
                            <a href={`https://solscan.io/tx/${trade.TxId}`} target="_blank" rel="noopener noreferrer">View on Solscan</a>
                            <a href={`https://gmgn.ai/sol/token/${trade.Token}`} target="_blank" rel="noopener noreferrer">View on GMGN</a>
                        </div>
                    </div>
                    <div className="flex justify-between text-xs bg-black/10 rounded-lg">
                      <div>
                        <div className="text-[rgb(255,20,147)]">Total USDC</div>
                        <div className="text-white font-medium">${trade.TotalUSDC.toFixed(5)}</div>
                      </div>
                      <div>
                        <div className="text-[rgb(255,20,147)]">Price per Token</div>
                        <div className="text-white font-medium">{formatPrice(trade.PricePerTokenUSDC)}</div>
                      </div>
                      <div>
                        <div className="text-[rgb(255,20,147)]">DEX</div>
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
