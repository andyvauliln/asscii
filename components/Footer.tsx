import { Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-[#FF1493]/20 mt-8">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="text-white text-sm">
            2025 $ASScii. All rights reserved.
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-white text-xs">
              $ASScii AI trading agent is developed with the{' '}
              <a 
                href="https://chi.dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#FF1493] hover:text-[#FF1493]/80 transition-colors"
              >
                CHI Swarm Framework
              </a>
            </div>
            <a
              href="https://x.com/asscii_ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF1493] hover:text-[#FF1493]/80 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                <path d="M13.3174 10.7749L19.1457 4H17.7646L12.7039 9.88256L8.66193 4H4L10.1122 12.8955L4 20H5.38119L10.7255 13.7878L14.994 20H19.656L13.3171 10.7749H13.3174ZM11.4257 12.9738L10.8064 12.0881L5.87886 5.03974H8.00029L11.9769 10.728L12.5962 11.6137L17.7652 19.0075H15.6438L11.4257 12.9742V12.9738Z" />
              </svg>
            </a>
            <a
              href="https://t.me/asscii_ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF1493] hover:text-[#FF1493]/80 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
