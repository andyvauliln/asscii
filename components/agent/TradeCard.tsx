import { Trade } from '@/types/agent';

export function TradeCard({ trade }: { trade: Trade }) {
  const isProfitable = trade.profitLoss && trade.profitLoss > 0;
  const profitLossColor = isProfitable ? 'text-green-400' : 'text-red-400';

  return (
    <div className="rounded-lg bg-black/40 p-2 backdrop-blur-sm text-xs">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <span className="text-white/60">•</span>
          <span className="text-white">${trade.token.symbol}</span>
        </div>
        {trade.profitLoss && (
          <div className={`flex items-center gap-0.5 ${profitLossColor}`}>
            {isProfitable ? '↑' : '↓'}
            {Math.abs(trade.profitLoss).toFixed(2)}%
          </div>
        )}
      </div>
      <div className="text-white/80 text-xs mb-1">
        {trade.amount.toFixed(2)} @ ${trade.price.toFixed(2)}
      </div>
      <div className="text-white/60 text-[10px]">
        {trade.reasoning}
      </div>
    </div>
  );
}
