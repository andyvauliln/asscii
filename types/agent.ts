export type TradeAction = 'BUY' | 'SELL' | 'PROVIDE_LIQUIDITY' | 'REMOVE_LIQUIDITY' | 'ARBITRAGE';

export type Token = {
  symbol: string;
  price: number;
  change24h?: number;
};

export type Trade = {
  action: TradeAction;
  token: Token;
  amount: number;
  price: number;
  timestamp: string;
  reasoning: string;
  profitLoss?: number;
};

export type AgentMessage = {
  type: 'trade' | 'analysis' | 'alert' | 'status';
  content: string;
  metadata?: {
    trade?: Trade;
    tokens?: Token[];
    sentiment?: 'bullish' | 'bearish' | 'neutral';
    confidence?: number;
    chart?: {
      type: 'line' | 'candlestick';
      data: any;
    };
  };
};
