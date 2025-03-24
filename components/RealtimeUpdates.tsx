'use client';

import { useState, useEffect, useRef } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Define the API log structure
interface ApiLog {
  id: number;
  date: string;
  time: string;
  run_prefix: string;
  full_message: string;
  message: string;
  module: string;
  function: string;
  type: string;
  data: any; // This will be parsed JSON
  cycle: number;
  tag: string;
}

interface RealtimeUpdatesProps {
  className?: string;
}

export function RealtimeUpdates({ className = '' }: RealtimeUpdatesProps) {
  const [videoError, setVideoError] = useState(false);
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [textOnly, setTextOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isClient, setIsClient] = useState(false);
  
  // Set isClient to true once component mounts on client
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Fetch logs from API
  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/live-logs');
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch logs');
      }
      
      // Update logs if we received any
      if (data.data && data.data.logs && Array.isArray(data.data.logs)) {
        setLogs(prevLogs => {
          // Combine existing and new logs, take last 10
          const combinedLogs = [...prevLogs, ...data.data.logs];
          
          // Filter out duplicates by ID
          const uniqueLogs = combinedLogs.filter((log, index, self) => 
            index === self.findIndex(l => l.id === log.id)
          );
          
          // Sort by date and time, newest first
          uniqueLogs.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateB.getTime() - dateA.getTime();
          });
          
          return uniqueLogs.slice(0, 10); // Keep only the latest 10 logs
        });
      }
      
      setIsLoading(false);
      setError(null);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setError('Failed to fetch updates');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchLogs();
    
    // Poll for updates every 10 seconds
    const interval = setInterval(() => {
      fetchLogs();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // Handle video loading
  const handleVideoError = (e: any) => {
    console.error('Video loading error:', e);
    setVideoError(true);
  };

  // Format the timestamp
  const formatTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Get tag color
  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'buy_tx_confirmed':
        return 'text-green-400';
      case 'sell_tx_confirmed':
        return 'text-red-400';
      case 'rug_validation':
        return 'text-orange-400';
      case 'telegram_ai_token_analysis':
        return 'text-blue-400';
      default:
        return 'text-white';
    }
  };

  return (
    <div className={className}>
      <div className="w-full space-y-2">
        <h1 className="text-xl font-medium text-white">Realtime Updates</h1>

        {!textOnly && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black/20">
              {videoError ? (
                <div className="absolute inset-0 flex items-center justify-center text-white/60">
                  <p>Video loading failed... 💅</p>
                </div>
              ) : isClient ? (
                <video 
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  onError={handleVideoError}
                  style={{ 
                    filter: 'brightness(0.9) contrast(1.1)',
                    backgroundColor: 'rgba(0,0,0,0.2)'
                  }}
                >
                  <source src="/assets/new-video.mp4" type="video/mp4" />
                </video>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white/60">
                  <p>Loading video... 💅</p>
                </div>
              )}
            </div>
            <div className="flex items-center">
              <div className="space-y-2">
                <div className="text-[#FF1493] font-medium text-lg">Meet Angel 👋</div>
                <p className="text-white/80 text-sm leading-relaxed">
                  Your $ASScii video agent "Angel" will keep you updated in real-time about all the trades executed by our AI Trading agent. She'll announce each trade as it happen in a sexy way.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end px-2 -mt-1">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="text-only" 
              checked={textOnly}
              onCheckedChange={(checked) => setTextOnly(checked as boolean)}
              className="border-white/40"
            />
            <Label 
              htmlFor="text-only" 
              className="text-[10px] text-white cursor-pointer"
            >
              Text updates only
            </Label>
          </div>
        </div>

        <div className="h-[300px] bg-black/20 rounded-lg relative border border-[#FF1493]/40">
          {logs.length === 0 ? (
            <div className="flex items-center justify-center h-full text-white/60 text-xs">
              <div className="animate-pulse flex flex-col items-center gap-2">
                {isLoading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-t-transparent border-[#FF1493] rounded-full animate-spin mb-2"></div>
                    <span>Connecting to agent... 💅</span>
                  </>
                ) : error ? (
                  <>
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#FF1493] mb-1" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{error} 💅</span>
                    <span className="text-[9px] text-white/40 mt-1">Retrying in a moment...</span>
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#FF1493] mb-1" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>No recent logs... 💅</span>
                    <span className="text-[9px] text-white/40 mt-1">Angel will notify you when there's activity</span>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-1.5 p-2 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-pink-500/20 scrollbar-track-transparent">
              {logs.map((log, i) => (
                <div key={i} className="animate-fadeIn p-2 bg-black/40 backdrop-blur-sm rounded-lg mb-2">
                  <div className="flex items-center text-[10px] mb-1 justify-between">
                    <div className="flex items-center gap-1">
                      <span className={`${getTagColor(log.tag)}`}>[{log.tag}]</span>
                      <span className="text-white/60">{formatTime(log.date, log.time)}</span>
                    </div>
                    <span className="text-white/40">{log.module}</span>
                  </div>
                  
                  <div className="text-white/80 text-xs">
                    {log.message}
                  </div>
                  
                  {/* {log.data && (
                    <div className="text-[9px] text-white/60 mt-1 bg-black/20 p-1 rounded-sm">
                      {typeof log.data === 'string' 
                        ? log.data 
                        : JSON.stringify(log.data, null, 2)}
                    </div>
                  )} */}
                </div>
              ))}
            </div>
          )}
          {/* Gradient fade to black */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgb(0,0,0) 100%)'
            }}
          />
        </div>
      </div>
    </div>
  );
}
