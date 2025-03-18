import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientWalletProvider from './providers/WalletProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '$ASScii AI Trading Agent',
  description: 'AI-powered trading agent on Solana',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className + " bg-gray-900 text-white min-h-screen"}>
        <ClientWalletProvider>
          {children}
        </ClientWalletProvider>
      </body>
    </html>
  )
}
