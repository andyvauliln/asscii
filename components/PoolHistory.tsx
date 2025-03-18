'use client';

import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const timeframes = [
  // { label: '24H', value: '24h' },
  // { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
  // { label: 'ALL', value: 'all' },
];

export default function PoolHistory() {
  const [activeTimeframe, setActiveTimeframe] = useState('30d');
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/historical-pool-data?timeframe=${activeTimeframe}`);
        const result = await response.json();
        if (result.success) {
          setChartData({
            labels: result.data.chartData.map((d: any) => d.x),
            datasets: [
              {
                label: 'Pool Size',
                data: result.data.chartData.map((d: any) => d.y),
                borderColor: '#FF1493',
                backgroundColor: 'rgba(255, 20, 147, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 0,
                pointHoverRadius: 4,
              },
            ],
          });
        }
      } catch (error) {
        console.error('Error fetching pool history:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [activeTimeframe]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        padding: 12,
        callbacks: {
          label: function(context: any) {
            return `$${(context.raw).toFixed(2)} `;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          padding: 10,
          callback: function(value: any) {
            return `$${(value).toFixed(2)}`;
          },
        },
      },
    },
  };

  return (
    <div>
      <h2 className="text-2xl font-medium text-white mb-4">Pool History</h2>
      <div className="bg-black/20 rounded-lg p-4 border border-[#FF1493]/40">
        <div className="flex justify-end mb-4">
          <div className="flex gap-2">
            {timeframes.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setActiveTimeframe(tf.value)}
                className={`px-3 py-1 rounded text-sm ${
                  activeTimeframe === tf.value
                    ? 'bg-[#FF1493] text-black font-medium'
                    : 'bg-black/20 text-white/60 hover:text-white'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[225px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-white/60">Loading...</div>
            </div>
          ) : chartData ? (
            <Line data={chartData} options={options} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-white/60">No data available</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
