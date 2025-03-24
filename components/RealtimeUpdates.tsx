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
  const [displayedLogs, setDisplayedLogs] = useState<ApiLog[]>([]);
  const [allLogs, setAllLogs] = useState<ApiLog[]>([]);
  const [logQueue, setLogQueue] = useState<ApiLog[]>([]);
  const [isBlinking, setIsBlinking] = useState(false);
  const [textOnly, setTextOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isClient, setIsClient] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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
        // Process new logs
        processNewLogs(data.data.logs);
      }
      
      setIsLoading(false);
      setError(null);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setError('Failed to fetch updates');
      setIsLoading(false);
    }
  };

  // Process new logs and update state
  const processNewLogs = (newLogs: ApiLog[]) => {
    setAllLogs(prevAllLogs => {
      // Combine existing and new logs
      const combinedLogs = [...prevAllLogs, ...newLogs];
      
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
      
      // Find new logs that aren't in the current display queue
      const currentLogIds = new Set([...displayedLogs, ...logQueue].map(log => log.id));
      const newLogsToQueue = uniqueLogs.filter(log => !currentLogIds.has(log.id));
      
      // Add new logs to the queue
      if (newLogsToQueue.length > 0) {
        // Sort new logs oldest first for proper sequential display
        newLogsToQueue.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time}`);
          const dateB = new Date(`${b.date}T${b.time}`);
          return dateA.getTime() - dateB.getTime();
        });
        
        // On initial load (if no logs are displayed yet), immediately display the first log
        if (displayedLogs.length === 0 && newLogsToQueue.length > 0 && prevAllLogs.length === 0) {
          const firstLog = newLogsToQueue[0];
          setDisplayedLogs([firstLog]);
          newLogsToQueue.shift(); // Remove the first log from the queue
        }
        
        setLogQueue(prevQueue => [...prevQueue, ...newLogsToQueue]);
      }
      
      return uniqueLogs.slice(0, 50); // Keep a reasonable amount of logs in memory
    });
    
    // Set overall logs for reference (we'll show the 10 most recent in the UI)
    setLogs(prevLogs => {
      // Combine existing and new logs
      const combinedLogs = [...prevLogs, ...newLogs];
      
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
      
      return uniqueLogs.slice(0, 10); // Keep only the latest 10 logs for full display
    });
  };

  // Process the next log from the queue every 5 seconds
  useEffect(() => {
    // Function to display the next log
    const displayNextLog = () => {
      if (logQueue.length > 0) {
        // Get the next log from the queue
        const nextLog = logQueue[0];
        const remainingQueue = logQueue.slice(1);
        
        // Add the log to displayed logs
        setDisplayedLogs(prevDisplayed => {
          const newDisplayed = [nextLog, ...prevDisplayed];
          return newDisplayed.slice(0, 10); // Keep only latest 10 for display
        });
        
        // Remove the log from the queue
        setLogQueue(remainingQueue);
        
        // Reset blinking state when adding a new log
        setIsBlinking(false);
      } else if (displayedLogs.length > 0) {
        // If queue is empty but we have displayed logs, blink the most recent one
        // Set blinking to true for 2.5 seconds (half of the 5 second interval)
        setIsBlinking(true);
        const blinkTimeout = setTimeout(() => setIsBlinking(false), 2500);
        
        return () => clearTimeout(blinkTimeout);
      }
      
      // Schedule the next display
      timeoutRef.current = setTimeout(displayNextLog, 5000);
    };
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Start displaying logs
    if (displayedLogs.length === 0 && logQueue.length === 0) {
      // On first load with no logs, don't set a timeout yet
      return;
    } else {
      timeoutRef.current = setTimeout(displayNextLog, 5000);
    }
    
    // Clean up on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [logQueue, displayedLogs]);

  // Add a separate effect for the initial load
  useEffect(() => {
    // If we just got our first logs in the queue but haven't displayed any yet
    if (logQueue.length > 0 && displayedLogs.length === 0) {
      // Display the first log immediately without waiting for the 5-second timeout
      const firstLog = logQueue[0];
      const remainingQueue = logQueue.slice(1);
      
      setDisplayedLogs([firstLog]);
      setLogQueue(remainingQueue);
    }
  }, [logQueue, displayedLogs]);

  // Initial fetch and polling for updates
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

  // Determine which logs to show
  const logsToDisplay = displayedLogs.length > 0 ? displayedLogs : logs;

  return (
    <div className={className}>
      <style jsx global>{`
        @keyframes blink {
          0% { 
            opacity: 1;
            box-shadow: 0 0 0 #FF1493;
          }
          50% { 
            opacity: 0.7;
            box-shadow: 0 0 8px #FF1493;
          }
          100% { 
            opacity: 1;
            box-shadow: 0 0 0 #FF1493;
          }
        }
        
        .animate-blink {
          animation: blink 2.5s ease-in-out infinite;
          border: 1px solid #FF1493;
          transition: all 0.3s ease;
        }
      `}</style>
      
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
          {logsToDisplay.length === 0 ? (
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
              {logsToDisplay.map((log, i) => (
                <div 
                  key={i} 
                  className={`animate-fadeIn p-2 bg-black/40 backdrop-blur-sm rounded-lg mb-2 ${i === 0 && isBlinking ? 'animate-blink' : ''}`}
                >
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
