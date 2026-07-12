import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CopilotHistory, ChatSession } from '@/components/copilot/CopilotHistory';
import { CopilotMessage, Message } from '@/components/copilot/CopilotMessage';
import {
  Sparkles,
  Send,
  Bot,
  ChevronRight,
} from 'lucide-react';

export const AICopilot: React.FC = () => {

  // History list state
  const [sessions, setSessions] = useState<ChatSession[]>([
    { id: '1', title: 'Carbon footprint audit Q1', isPinned: true, dateGroup: 'Today' },
    { id: '2', title: 'Facilities energy mitigation', isPinned: false, dateGroup: 'Today' },
    { id: '3', title: 'CSR volunteering ledger', isPinned: false, dateGroup: 'Yesterday' },
    { id: '4', title: 'GRI compliance checks', isPinned: false, dateGroup: 'Last Week' },
  ]);

  const [activeSessionId, setActiveSessionId] = useState<string>('1');
  const [query, setQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [savedInsightsCount, setSavedInsightsCount] = useState(4);

  // Grouped messages per session
  const [sessionsMessages, setSessionsMessages] = useState<Record<string, Message[]>>({
    '1': [
      {
        sender: 'bot',
        text: 'Hello. I am the EcoSphere ESG Copilot. I have loaded your carbon footprint audit statistics. Ask me to compare departments, inspect specific scopes, or analyze compliance risks.',
      },
    ],
    '2': [
      {
        sender: 'bot',
        text: 'Facilities energy mitigations ledger loaded. Facilities accounts for 54% of Scope 2 metrics. Powering down systems post-18:00 could yield a 15% reduction.',
      },
    ],
  });

  const messages = useMemo(() => {
    return sessionsMessages[activeSessionId] || [
      {
        sender: 'bot',
        text: 'New analysis session started. Query our ESG databases for carbon reduction milestones, social contributions, or governance audits.',
      },
    ];
  }, [sessionsMessages, activeSessionId]);

  // Messages list ref for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Suggested preset questions
  const suggestedPrompts = [
    'Summarize ESG performance',
    'Which department emits the most carbon?',
    'Show compliance risks',
    'Predict sustainability trends',
  ];

  // Streaming Typewriter simulation
  const simulateBotResponse = (text: string, chartType: any = null, tableCols: any = null, tableData: any = null) => {
    setIsStreaming(true);
    let currentLen = 0;
    const fullText = text;
    
    const newBotMsg: Message = {
      sender: 'bot',
      text: '',
      chartType,
      tableColumns: tableCols,
      tableData: tableData,
    };

    setSessionsMessages((prev) => {
      const currentMsgs = prev[activeSessionId] || [];
      return {
        ...prev,
        [activeSessionId]: [...currentMsgs, newBotMsg],
      };
    });

    const timer = setInterval(() => {
      currentLen += 8;
      if (currentLen >= fullText.length) {
        clearInterval(timer);
        setIsStreaming(false);
        setSessionsMessages((prev) => {
          const currentMsgs = [...(prev[activeSessionId] || [])];
          if (currentMsgs.length > 0) {
            currentMsgs[currentMsgs.length - 1].text = fullText;
          }
          return {
            ...prev,
            [activeSessionId]: currentMsgs,
          };
        });
      } else {
        setSessionsMessages((prev) => {
          const currentMsgs = [...(prev[activeSessionId] || [])];
          if (currentMsgs.length > 0) {
            currentMsgs[currentMsgs.length - 1].text = fullText.slice(0, currentLen);
          }
          return {
            ...prev,
            [activeSessionId]: currentMsgs,
          };
        });
      }
    }, 25);
  };

  const handleSendQuery = async (customQuery?: string) => {
    const textToSend = customQuery || query;
    if (!textToSend.trim() || isThinking || isStreaming) return;

    // Save user message
    const userMsg: Message = { sender: 'user', text: textToSend };
    setSessionsMessages((prev) => {
      const currentMsgs = prev[activeSessionId] || [];
      return {
        ...prev,
        [activeSessionId]: [...currentMsgs, userMsg],
      };
    });
    setQuery('');
    setIsThinking(true);

    try {
      // 1. Attempt to fetch from the Express AI endpoint
      const response = await fetch('/api/v1/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend }),
      });

      if (!response.ok) {
        throw new Error('API limit reached or backend offline');
      }

      const data = await response.json();
      setIsThinking(false);

      // Parse AI response for custom chart keywords
      let chartType: any = null;
      let cleanedText = data.text || '';
      
      if (cleanedText.includes('[CHART:bar]')) {
        chartType = 'bar';
        cleanedText = cleanedText.replace('[CHART:bar]', '');
      } else if (cleanedText.includes('[CHART:area]')) {
        chartType = 'area';
        cleanedText = cleanedText.replace('[CHART:area]', '');
      } else if (cleanedText.includes('[CHART:radar]')) {
        chartType = 'radar';
        cleanedText = cleanedText.replace('[CHART:radar]', '');
      } else if (cleanedText.includes('[CHART:pie]')) {
        chartType = 'pie';
        cleanedText = cleanedText.replace('[CHART:pie]', '');
      }

      // Stream the live AI response
      simulateBotResponse(cleanedText, chartType);

    } catch (err) {
      // 2. FALLBACK: Execute the local rules engine if backend is offline or API limit exceeded
      console.log('AI Endpoint offline/limited. Falling back to local intelligence ledger...', err);
      
      setTimeout(() => {
        setIsThinking(false);
        const qLower = textToSend.toLowerCase();
        
        if (qLower.includes('summarize esg') || qLower.includes('performance')) {
          simulateBotResponse(
            "EcoSphere ESG performance summary for FY2026 shows positive trends:\n- Carbon Intensity decreased by 12.4% vs Q1.\n- CSR volunteering aggregates reached 465 total hours.\n- Compliance auditor logs scored 96.2%.\n\nSee distribution weightages below:",
            'pie'
          );
        } else if (qLower.includes('department') || qLower.includes('emits') || qLower.includes('most carbon')) {
          simulateBotResponse(
            "Facilities department leads corporate emissions under grid electricity usage (Scope 2). Let's inspect department logs:",
            'bar',
            ['Department', 'Activity Type', 'Annual CO2 Equivalent'],
            [
              { 'Department': 'Facilities', 'Activity Type': 'Electricity usage', 'Annual CO2 Equivalent': '210 t' },
              { 'Department': 'Logistics', 'Activity Type': 'Diesel distribution', 'Annual CO2 Equivalent': '140 t' },
              { 'Department': 'Engineering', 'Activity Type': 'Systems build', 'Annual CO2 Equivalent': '85 t' },
            ]
          );
        } else if (qLower.includes('compliance') || qLower.includes('risk')) {
          simulateBotResponse(
            "ESG compliance scan indicates a low overall risk profile. Check priority items below:\n- Logistics Scope 1 diesel audits are due in 8 days.\n- Scope 3 supply chain logs show vendor reporting gaps in Facilities.\n\nCompliance benchmarks compared below:",
            'radar'
          );
        } else if (qLower.includes('trend') || qLower.includes('predict')) {
          simulateBotResponse(
            "Sustainability forecasting indicates a steady decline in Scope 2 footprints due to scheduled renewable energy transfers. Our 6-month carbon ledger trend line is projected as follows:",
            'area'
          );
        } else if (qLower.includes('audit') || qLower.includes('overdue')) {
          simulateBotResponse(
            "There are currently 0 overdue audits. However, 2 compliance reviews are approaching their dates:\n1. Scope 3 Supply Chain Audit (Due in 8 days)\n2. CSR Volunteering Log Verification (Due in 12 days)",
            null,
            ['Audit Task', 'Scope Domain', 'Due Date', 'Status'],
            [
              { 'Audit Task': 'Scope 3 Supply Chain', 'Scope Domain': 'Environmental', 'Due Date': 'July 20, 2026', 'Status': 'PENDING' },
              { 'Audit Task': 'CSR volunteer ledger verify', 'Scope Domain': 'Social', 'Due Date': 'July 24, 2026', 'Status': 'DRAFT' },
            ]
          );
        } else {
          simulateBotResponse(
            `I've analyzed your inquiry regarding "${textToSend}". Based on our active ledger scopes, Facilities Scope 2 accounts for 54% of emissions. Shift logistics flights to high-speed rail to maintain net-zero target paths.`
          );
        }
      }, 1000);
    }
  };

  // Session management hooks
  const handleNewSession = () => {
    const newId = `sess-${Date.now()}`;
    const newSess: ChatSession = {
      id: newId,
      title: `Analysis Session #${sessions.length + 1}`,
      isPinned: false,
      dateGroup: 'Today',
    };
    setSessions([newSess, ...sessions]);
    setActiveSessionId(newId);
    setSessionsMessages((prev) => ({
      ...prev,
      [newId]: [
        {
          sender: 'bot',
          text: 'New session started. Ask me to predict sustainability trends or compare department emissions.',
        },
      ],
    }));
  };

  const handleRenameSession = (id: string, newTitle: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: newTitle } : s))
    );
  };

  const handleDeleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeSessionId === id) {
      const remaining = sessions.filter((s) => s.id !== id);
      if (remaining.length > 0) {
        setActiveSessionId(remaining[0].id);
      }
    }
  };

  const handleTogglePin = (id: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isPinned: !s.isPinned } : s))
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground/90 flex items-center space-x-2.5">
            <Sparkles className="h-8 w-8 text-primary animate-pulse shrink-0" />
            <span>AI Copilot Intelligence Workspace</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Query environmental ledgers, predict compliance anomalies, and automate audit drafts using generative intelligence.
          </p>
        </div>
      </div>

      {/* Workspace 2-pane grid layout */}
      <div className="grid gap-6 lg:grid-cols-4 items-start">
        {/* Left column: Session History (1 part) */}
        <div className="lg:col-span-1 h-[600px]">
          <CopilotHistory
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={setActiveSessionId}
            onNewSession={handleNewSession}
            onRenameSession={handleRenameSession}
            onDeleteSession={handleDeleteSession}
            onTogglePinSession={handleTogglePin}
            savedInsightsCount={savedInsightsCount}
            onViewInsights={() => setSavedInsightsCount((c) => c + 1)}
            className="h-full"
          />
        </div>

        {/* Center column: Interactive chat canvas (3 parts) */}
        <Card className="lg:col-span-3 flex flex-col h-[600px] bg-card border border-border/50 relative overflow-hidden shadow-[0_20px_50px_-12px_rgba(28,38,30,0.03)] p-0">
          {/* Subtle decoration circles */}
          <div className="absolute top-[-10%] right-[-10%] w-[35%] h-[35%] rounded-full bg-primary/3 filter blur-[80px] pointer-events-none" />

          {/* Header */}
          <div className="px-6 py-4 border-b border-border/55 flex items-center justify-between shrink-0 bg-card z-10">
            <div className="flex items-center space-x-3">
              <div className="h-8.5 w-8.5 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/5">
                <Bot className="h-4.5 w-4.5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-foreground/90 leading-none mb-1">EcoSphere Intelligence AI</h3>
                <span className="text-[9px] text-green-600 dark:text-green-400 font-bold uppercase tracking-wider">Verified Analytics Agent</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Badge variant="primary" className="scale-90 px-2">GRI v4</Badge>
            </div>
          </div>

          {/* Messages or Empty state */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAF8F4]/20 dark:bg-card/25 z-10">
            {messages.length <= 1 && !isThinking ? (
              // Enhanced Empty State
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6 max-w-md mx-auto pt-6 animate-in fade-in duration-300">
                <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shadow-sm border border-primary/5 relative">
                  <Bot className="h-7 w-7" />
                  <Sparkles className="absolute -top-1.5 -right-1.5 h-4 w-4 text-primary animate-bounce" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-foreground/90 uppercase tracking-wider">EcoSphere ESG Analytics</h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed font-semibold">
                    I can generate compliance summaries, predict carbon reduction rates, or locate active audit anomalies.
                  </p>
                </div>

                {/* Suggested prompt chips */}
                <div className="grid gap-2.5 w-full pt-2">
                  <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest block text-left">Suggested Investigations</span>
                  {suggestedPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSendQuery(prompt)}
                      className="w-full text-left p-3 border border-border hover:border-primary/20 hover:bg-primary/5 rounded-2xl text-xs font-bold text-foreground/80 transition-all duration-200 shadow-[0_2px_8px_rgba(28,38,30,0.003)] flex justify-between items-center group"
                    >
                      <span>{prompt}</span>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/45 group-hover:text-primary transition-colors shrink-0 ml-1" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Chat conversation
              <div className="space-y-6">
                {messages.map((msg, index) => (
                  <CopilotMessage
                    key={index}
                    message={msg}
                    onBookmark={() => setSavedInsightsCount((c) => c + 1)}
                    onRegenerate={() => handleSendQuery(messages[messages.length - 2]?.text)}
                  />
                ))}

                {/* Thinking indicator bouncing dots */}
                {isThinking && (
                  <div className="flex space-x-3.5 max-w-[80%] animate-in fade-in duration-100">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/5 shadow-sm">
                      <Bot className="h-4.5 w-4.5" />
                    </div>
                    <div className="p-4 rounded-2xl bg-card border border-border/55 flex items-center justify-center space-x-1.5 shadow-sm min-h-[40px] px-5">
                      <div className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Chat Form panel */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuery();
            }}
            className="p-4 border-t border-border/55 shrink-0 bg-card flex items-center space-x-3.5 z-10"
          >
            <input
              type="text"
              placeholder="Ask Copilot about carbon forecasts or compliance checklists..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isThinking || isStreaming}
              className="flex-1 px-4 py-3 bg-muted/20 border border-border/60 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary/30 transition-colors disabled:opacity-50"
            />
            <Button
              type="submit"
              variant="primary"
              disabled={!query.trim() || isThinking || isStreaming}
              className="h-10.5 w-10.5 p-0 flex items-center justify-center rounded-xl shrink-0 shadow-sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
export default AICopilot;
