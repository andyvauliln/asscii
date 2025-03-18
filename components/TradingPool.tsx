'use client';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useEffect, useState } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

const mockPoolData = [
  { symbol: 'SOL', value: 2500000, percentage: 25 },
  { symbol: 'USDC', value: 2000000, percentage: 20 },
  { symbol: 'JUP', value: 1500000, percentage: 15 },
  { symbol: 'BONK', value: 1000000, percentage: 10 },
  { symbol: 'RAY', value: 800000, percentage: 8 },
  { symbol: 'ORCA', value: 700000, percentage: 7 },
  { symbol: 'MNGO', value: 600000, percentage: 6 },
  { symbol: 'SRM', value: 400000, percentage: 4 },
  { symbol: 'SAMO', value: 300000, percentage: 3 },
  { symbol: 'COPE', value: 200000, percentage: 2 },
];

const colors = [
  '#FF1493', // Deep Pink
  '#FF69B4', // Hot Pink
  '#FFB6C1', // Light Pink
  '#FF82AB', // Pale Violet Red
  '#FF34B3', // Maroon1
  '#FF3E96', // Violet Red
  '#FF00FF', // Magenta
  '#FF83FA', // Orchid1
  '#FF6EB4', // Hot Pink1
  '#FF1493', // Deep Pink1
];

// After the colors array and before addTransparency function
const generateAdditionalColor = (index: number) => {
  // Generate colors by rotating hue while keeping pink/magenta theme
  const hue = (320 + (index * 20)) % 360; // 320 is close to magenta/pink
  return `hsl(${hue}, 100%, 50%)`;
};

const getColorForIndex = (index: number) => {
  if (index < colors.length) {
    return colors[index];
  }
  return generateAdditionalColor(index);
};

// Function to add transparency
const addTransparency = (color: string) => {
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 0.8)`;
  }
  return color;
};

interface Token {
  tokenName: string;
  tokenSymbol: string;
  tokenMint: string;
  balance: number;
  tokenValueUSDC: number;
  percentage: number;
}

interface PoolData {
  poolSizeTotalValueUSDC: number;
  tokens: Token[];
}

export default function TradingPool() {
  const [poolData, setPoolData] = useState<PoolData | null>(null);

  useEffect(() => {
    const fetchPoolData = async () => {
      try {
        const response = await fetch('/api/pool-data');
        const result = await response.json();
        if (result.success) {
          setPoolData(result.data);
        }
      } catch (error) {
        console.error('Error fetching pool data:', error);
      }
    };

    fetchPoolData();
  }, []);

  if (!poolData) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-medium text-white mb-4">Trading Pool</h2>
        <div className="bg-black/20 rounded-lg p-4 border border-[#FF1493]/40 h-[300px] flex items-center justify-center">
          <div className="text-white/60">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-medium text-white mb-4">Trading Pool</h2>
      <div className="bg-black/20 rounded-lg p-4 border border-[#FF1493]/40 h-[300px]">
        <div className="grid grid-cols-[200px,1fr] gap-8 h-full">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-white/60 text-sm">Total Value</div>
                <div className="text-white text-2xl font-medium">
                  ${poolData.poolSizeTotalValueUSDC.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
            <div className="w-[200px] h-[200px]">
              <Pie
                data={{
                  labels: poolData.tokens.map(token => `$${token.tokenSymbol}`),
                  datasets: [{
                    data: poolData.tokens.map(token => token.percentage),
                    backgroundColor: poolData.tokens.map((_, index) => 
                      addTransparency(getColorForIndex(index))
                    ),
                    borderColor: '#000',
                    borderWidth: 1,
                  }],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      enabled: true,
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      titleColor: 'white',
                      bodyColor: 'white',
                      padding: 12,
                      callbacks: {
                        label: function(context: any) {
                          const token = poolData.tokens[context.dataIndex];
                          return [
                            `${token.percentage.toFixed(2)}%`,
                            `$${token.tokenValueUSDC.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
                          ];
                        }
                      }
                    }
                  },
                  cutout: '60%',
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-4 h-[200px] content-center">
            {poolData.tokens.map((token, index) => (
              <div 
                key={token.tokenMint}
                className="flex items-center gap-2"
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span 
                      className="text-xs border-b-2"
                      style={{ 
                        color: getColorForIndex(index),
                        borderColor: getColorForIndex(index)
                      }}
                    >
                      ${token.tokenSymbol}
                    </span>
                    <span className="text-white/60 text-xs">
                      {token.percentage.toFixed(2)}%
                    </span>
                  </div>
                  <span className="text-white/40 text-xs">
                    ${token.tokenValueUSDC.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
