import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { faker } from '@faker-js/faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const THEME = {
  pink: 'rgba(255, 20, 147, 1)',
};

// Add interface for API response
interface ChartDataPoint {
  x: string;  // Keep as string since API returns string dates
  y: number;
}

interface ApiResponse {
  success: boolean;
  data: ChartDataPoint[];
}

// Update options to handle string x-axis
const options: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: 'Agent Performance Chart (USD)',
      align: 'start',
      color: '#FFFFFF',
      font: {
        size: 14,
        weight: 500
      },
      padding: {
        bottom: 15
      }
    },
    legend: {
      display: false
    },
    tooltip: {
      enabled: true,
      mode: 'index',
      intersect: false,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#FFFFFF',
      bodyColor: '#FFFFFF',
      borderColor: THEME.pink,
      borderWidth: 1,
    },
  },
  interaction: {
    mode: 'index',
    intersect: false,
  },
  elements: {
    point: {
      radius: 0,
      hoverRadius: 6,
      hoverBorderWidth: 2,
      hoverBackgroundColor: THEME.pink,
      hoverBorderColor: 'white',
    },
  },
  scales: {
    x: {
      type: 'category',
      display: true,
      grid: {
        display: false,
      },
      ticks: {
        display: true,
        color: '#9CA3AF',
        font: {
          size: 12,
        },
        maxRotation: 0,
        autoSkip: true,
        maxTicksLimit: 5,
      },
      border: {
        display: false,
      }
    },
    y: {
      type: 'linear',
      display: true,
      position: 'right',
      grid: {
        display: true,
        color: '#374151',
        lineWidth: 1,
      },
      ticks: {
        display: true,
        color: '#9CA3AF',
        font: {
          size: 12,
        },
        padding: 15,
      },
      border: {
        display: false,
      }
    },
  },
};

interface TradingChartProps {
  timeframe: string
  type: string
}

export default function TradingChart({ timeframe, type }: TradingChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  console.log(chartData, "chartdata");

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch('/api/agent-performance-chart');
        const data: ApiResponse = await response.json();
        console.log(data, "chart data");
        if (data.success) {
          setChartData(data.data);
        }
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchChartData();
  }, []);

  const chartTitle = `${timeframe} ${type === 'agent' ? 'Performance' : 'Portfolio'}`

  const chartOptions = {
    ...options,
    plugins: {
      ...options.plugins,
      title: {
        ...options.plugins.title,
        text: chartTitle
      }
    }
  }

  const chartDataConfig: ChartData<'line'> = {
    labels: chartData.map(point => point.x),  // Use x values as labels
    datasets: [
      {
        label: 'Performance',
        data: chartData.map(point => point.y),  // Only use y values as data
        borderColor: THEME.pink,
        backgroundColor: 'transparent',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="w-full h-[300px]">
      <Line options={chartOptions} data={chartDataConfig} />
    </div>
  );
}
