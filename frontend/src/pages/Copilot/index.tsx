import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Bot, User, HelpCircle, Lightbulb, CheckCircle2 } from 'lucide-react';

export const AICopilot: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    {
      sender: 'bot',
      text: 'Hello. I am the EcoSphere ESG Copilot. Ask me anything about environmental footprints, CSR targets, or governance compliance policies.',
    },
  ]);
  const [query, setQuery] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userQuery = query;
    const newMessages = [...messages, { sender: 'user' as const, text: userQuery }];
    setMessages(newMessages);
    setQuery('');

    // Simulate bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `Analyzing your request: "${userQuery}". Based on GRI 305 emissions standards, I recommend reviewing Facilities Q2 Scope 2 electricity indexes, which currently account for 54% of your total environmental footprint. Reducing active off-hour energy consumption by 15% would align your target pathway back to carbon neutrality.`,
        },
      ]);
    }, 700);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground/90 flex items-center space-x-2.5">
            <Sparkles className="h-8 w-8 text-primary animate-pulse shrink-0" />
            <span>AI Copilot</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Query environmental databases, predict compliance anomalies, and automate disclosure drafting using generative intelligence.
          </p>
        </div>
      </div>

      {/* Main chat layout */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Left Side: Chat Workspace (3 parts) */}
        <Card className="lg:col-span-3 flex flex-col h-[580px] bg-card border border-border/50 relative overflow-hidden shadow-[0_20px_50px_-12px_rgba(28,38,30,0.03)]">
          {/* Subtle background blur spots */}
          <div className="absolute top-[-10%] right-[-10%] w-[35%] h-[35%] rounded-full bg-primary/3 filter blur-[80px] pointer-events-none" />
          
          <div className="px-6 py-4 border-b border-border/55 flex items-center justify-between shrink-0 bg-card z-10">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/5">
                <Bot className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-foreground/90 leading-none mb-1">ESG Copilot Assistant</h3>
                <span className="text-[9px] text-green-600 dark:text-green-400 font-bold uppercase tracking-wider">Online & Verified</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold" onClick={() => setMessages([messages[0]])}>
              Clear Session
            </Button>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-card/40 z-10">
            <AnimatePresence initial={false}>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className={`flex space-x-3.5 max-w-[85%] ${
                    msg.sender === 'user' ? 'ml-auto flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-secondary text-secondary-foreground border-secondary/10'
                        : 'bg-primary/10 text-primary border-primary/5'
                    }`}
                  >
                    {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl text-xs font-semibold leading-relaxed shadow-[0_2px_8px_rgba(28,38,30,0.01)] ${
                      msg.sender === 'user'
                        ? 'bg-secondary text-secondary-foreground rounded-tr-none'
                        : 'bg-muted/70 text-foreground border border-border/30 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Form input */}
          <div className="p-4 border-t border-border/55 shrink-0 bg-card z-10">
            <form onSubmit={handleSend} className="flex space-x-2.5 items-center">
              <Input
                placeholder="Ask about carbon trends, volunteer metrics, or audit status..."
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                className="flex-1 bg-muted/30 focus:bg-card transition-colors duration-200 border-border/60"
              />
              <Button type="submit" className="shrink-0 h-10 w-10 p-0 flex items-center justify-center rounded-xl shadow-sm">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>

        {/* Right Side: Info & Shortcuts (1 part) */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-1">
            <CardHeader>
              <CardTitle className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest flex items-center space-x-1.5">
                <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                <span>Suggested Queries</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <button
                onClick={() => setQuery("Show carbon trends for facilities department.")}
                className="w-full text-left p-3 rounded-xl border border-border/70 hover:border-primary/20 hover:bg-primary/5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all duration-200"
              >
                Show carbon trends for facilities
              </button>
              <button
                onClick={() => setQuery("Are there any compliance warnings?")}
                className="w-full text-left p-3 rounded-xl border border-border/70 hover:border-primary/20 hover:bg-primary/5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all duration-200"
              >
                Are there any compliance warnings?
              </button>
              <button
                onClick={() => setQuery("Summarize the Anti-Bribery Policy.")}
                className="w-full text-left p-3 rounded-xl border border-border/70 hover:border-primary/20 hover:bg-primary/5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all duration-200"
              >
                Summarize the Anti-Bribery Policy
              </button>
            </CardContent>
          </Card>

          <Card className="bg-muted/10 border border-border/50 p-1">
            <CardHeader>
              <CardTitle className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest flex items-center space-x-1.5">
                <Lightbulb className="h-4 w-4 text-primary shrink-0 animate-pulse" />
                <span>Copilot Feed</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="flex items-start space-x-2.5 text-xs">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground leading-relaxed">Scope 3 supply chain data is synced and ready.</span>
              </div>
              <div className="flex items-start space-x-2.5 text-xs">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground leading-relaxed">Generated Q2 energy reduction recommendation report.</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default AICopilot;
