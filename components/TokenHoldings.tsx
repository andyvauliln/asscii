'use client'

import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const data = {
  labels: ['SOL', 'USDC', 'RAY', 'SRM'],
  datasets: [
    {
      data: [40, 30, 20, 10],
      backgroundColor: [
        'rgba(255, 27, 107, 0.8)',
        'rgba(69, 202, 255, 0.8)',
        'rgba(255, 27, 107, 0.6)',
        'rgba(69, 202, 255, 0.6)',
      ],
      borderColor: [
        '#ff1b6b',
        '#45caff',
        '#ff1b6b',
        '#45caff',
      ],
      borderWidth: 2,
    },
  ],
}

const options = {
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        color: 'rgba(255, 255, 255, 0.8)',
        padding: 20,
        font: {
          size: 14
        }
      },
    },
  },
  cutout: '70%',
}

export default function TokenHoldings() {
  return (
    <div className="w-full h-[300px] flex items-center justify-center">
      <Doughnut data={data} options={options} />
    </div>
  )
}
