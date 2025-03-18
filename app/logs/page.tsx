'use client'

import { useState } from 'react'
import { format, subDays } from 'date-fns'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const BOTS = ['tracker-bot', 'telegram-trading-bot', 'solana-sniper-bot']

type Log = {
    id: number,
    date: string,
    time: string,
    run_prefix: string,
    full_message: string,
    message: string,
    module: string,
    function: string,
    type: string,
    data: string,
    cycle: number,
    tag: string
}

type LogResponse = {
  logs: Log[]
}

export default function LogsPage() {
  const [selectedBot, setSelectedBot] = useState(BOTS[0])
  const [logs, setLogs] = useState<Record<string, LogResponse>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  // Generate last 10 days
  const dates = Array.from({ length: 10 }).map((_, i) => {
    const date = subDays(new Date(), i)
    return format(date, 'yyyy-MM-dd')
  })

  const fetchLogs = async (date: string) => {
    if (logs[`${selectedBot}-${date}`]) return // Already loaded

    setLoading({ ...loading, [`${selectedBot}-${date}`]: true })
    try {
      const response = await fetch(`/api/logs?module=${selectedBot}&date=${date}`)
      const data = await response.json()
      setLogs(prev => ({
        ...prev,
        [`${selectedBot}-${date}`]: data
      }))
    } catch (error) {
      console.error('Error fetching logs:', error)
    } finally {
      setLoading({ ...loading, [`${selectedBot}-${date}`]: false })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Bot Logs</h1>

      <Tabs value={selectedBot} onValueChange={setSelectedBot}>
        <TabsList className="mb-4">
          {BOTS.map(bot => (
            <TabsTrigger key={bot} value={bot} className="capitalize">
              {bot.replace(/-/g, ' ')}
            </TabsTrigger>
          ))}
        </TabsList>

        {BOTS.map(bot => (
          <TabsContent key={bot} value={bot} className="bg-black">
            <Accordion type="single" collapsible>
              {dates.map(date => (
                <AccordionItem key={date} value={date}>
                  <AccordionTrigger 
                    onClick={() => fetchLogs(date)}
                    className="flex justify-between p-4 bg-black text-white"
                  >
                    <span>{date}</span>
                    {loading[`${bot}-${date}`] && (
                      <span className="text-sm text-gray-500">Loading...</span>
                    )}
                  </AccordionTrigger>
                  <AccordionContent className="bg-black text-white">
                    {logs[`${bot}-${date}`] ? (
                      <LogsTable logs={logs[`${bot}-${date}`].logs} />
                    ) : (
                      <div className="p-4 text-gray-500">
                        Click to load logs
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
} 

function LogsTable({ logs }: { logs: Log[] }) {
  if (!logs || logs.length === 0) return null
  
  // First group logs by run_prefix, then by cycle
  const logsByRunPrefix = logs.reduce((acc, log) => {
    if (!acc[log.run_prefix]) {
      acc[log.run_prefix] = {};
    }
    if (!acc[log.run_prefix][log.cycle]) {
      acc[log.run_prefix][log.cycle] = [];
    }
    acc[log.run_prefix][log.cycle].push(log);
    return acc;
  }, {} as Record<string, Record<number, Log[]>>);

  return (
    <div className="space-y-4">
      {Object.entries(logsByRunPrefix).map(([runPrefix, cyclesLogs]) => (
        <Accordion type="single" collapsible className="w-full" key={runPrefix}>
          <AccordionItem value={runPrefix}>
            <AccordionTrigger className="flex justify-between p-2 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-blue-500"> Run: {runPrefix.slice(0, 10)}...</span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-400">
                  {Object.values(cyclesLogs).flat().length} total events
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pl-4">
                {Object.entries(cyclesLogs).map(([cycle, cycleLogs]) => (
                  <Accordion type="single" collapsible className="w-full" key={`${runPrefix}-${cycle}`}>
                    <AccordionItem value={cycle}>
                      <AccordionTrigger className="flex justify-between w-full p-2 hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-500">
                            {cycleLogs[0]?.time} - {cycleLogs[cycleLogs.length - 1]?.time}
                          </span>
                          {cycle ? <span className="text-pink-500">Cycle {cycle}</span> : "Main Process Logs"}
                          <span className="text-gray-400">|</span>
                          <span className="text-gray-400">{cycleLogs.length} events</span>
                        </div>
                        <div className="flex items-center gap-2 ml-auto">
                          {cycleLogs.some(log => log.type === 'error') && (
                            <span className="inline-flex px-2 py-1 rounded-full text-xs bg-red-500/10 text-red-500 border border-red-500/20">
                              {cycleLogs.filter(log => log.type === 'error').length} errors
                            </span>
                          )}
                          {cycleLogs.some(log => log.type === 'warning') && (
                            <span className="inline-flex px-2 py-1 rounded-full text-xs bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                              {cycleLogs.filter(log => log.type === 'warning').length} warnings
                            </span>
                          )}
                          {(() => {
                            const tags = new Map();
                            cycleLogs.forEach(log => {
                              if (log.tag) {
                                tags.set(log.tag, (tags.get(log.tag) || 0) + 1);
                              }
                            });
                            return Array.from(tags).map(([tag, count]) => (
                              <span key={tag} className="inline-flex px-2 py-1 rounded-full text-xs bg-pink-500/10 text-pink-500 border border-pink-500/20">
                                {count} {tag}
                              </span>
                            ));
                          })()}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pl-4">
                          {cycleLogs.map((log) => (
                            log.data ? (
                              <Accordion type="single" collapsible className="w-full" key={log.id}>
                                <AccordionItem value={log.id.toString()}>
                                  <AccordionTrigger className="flex justify-between p-2 text-sm hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-3">
                                      <span className={`${log.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                                        [{log.type}]
                                      </span>
                                      <span className="text-gray-300">{log.time}</span>
                                      <span className="text-gray-300">{log.function}</span>
                                      <span className="text-white">{log.message}</span>
                                      {log.tag && (
                                        <>
                                          <span className="text-gray-400">•</span>
                                          <span className="text-pink-500">{log.tag}</span>
                                        </>
                                      )}
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <div className="pl-4 py-2 text-sm bg-white/5 rounded">
                                      <pre className="whitespace-pre-wrap text-gray-300">
                                        {typeof log.data === 'string' 
                                          ? log.data 
                                          : JSON.stringify(log.data, null, 2)
                                            .split('\n')
                                            .map((line, i) => {
                                              // Add syntax highlighting classes
                                              const coloredLine = line
                                                .replace(/"([^"]+)":/g, '<span class="text-yellow-500">"$1"</span>:') // keys
                                                .replace(/: "([^"]+)"/g, ': <span class="text-green-500">"$1"</span>') // string values
                                                .replace(/: (\d+)/g, ': <span class="text-blue-500">$1</span>') // number values
                                                .replace(/: (true|false)/g, ': <span class="text-purple-500">$1</span>') // boolean values
                                                .replace(/: (null)/g, ': <span class="text-gray-500">$1</span>'); // null values
                                              
                                              return (
                                                <div 
                                                  key={i} 
                                                  className="hover:bg-white/5"
                                                  dangerouslySetInnerHTML={{ __html: coloredLine }}
                                                />
                                              );
                                            })
                                        }
                                      </pre>
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            ) : (
                              <div key={log.id} className="flex items-center gap-3 p-2 text-sm hover:bg-white/5 transition-colors">
                                <span className={`${log.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                                  [{log.type}]
                                </span>
                                <span className="text-gray-300">{log.time}</span>
                                <span className="text-gray-300">{log.function}</span>
                                <span className="text-white">{log.message}</span>
                                {log.tag && (
                                  <>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-pink-500">{log.tag}</span>
                                  </>
                                )}
                              </div>
                            )
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
}
