'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LiquidityPanel() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel p-4">
          <div className="text-sm text-gray-400">Total Liquidity</div>
          <div className="text-2xl font-bold text-[#ff1b6b]">$125,000</div>
        </div>
        <div className="glass-panel p-4">
          <div className="text-sm text-gray-400">Your Share</div>
          <div className="text-2xl font-bold text-[#45caff]">$25,000</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex space-x-2">
          <Input
            type="number"
            placeholder="Amount"
            className="glass-panel border-0 focus:ring-[#ff1b6b] focus:ring-opacity-50"
          />
          <Button className="gradient-button">
            Add Liquidity
          </Button>
        </div>
        <div className="flex space-x-2">
          <Input
            type="number"
            placeholder="Amount"
            className="glass-panel border-0 focus:ring-[#45caff] focus:ring-opacity-50"
          />
          <Button className="gradient-button" style={{ background: 'linear-gradient(135deg, #45caff, #ff1b6b)' }}>
            Remove Liquidity
          </Button>
        </div>
      </div>
    </div>
  )
}
