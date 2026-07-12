import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Sparkles, Send, Bot, User, CheckCircle2 } from 'lucide-react';

export const AICopilot: React.FC = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    {
      sender: 'bot',
      text: "Hello! I am your EcoSphere ESG AI Copilot. I can analyze carbon ledger items, verify policy adherence compliance, or draft response summaries. What can I help you with today?",
    },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const newMessages = [...messages, { sender: 'user' as const, text: query }];
    setMessages(newMessages);
    setQuery('');

    // Simulate bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `Analyzing your request: "${query}". Based on GRI 305 emissions standards, I recommend reviewing Facilities Q2 Scope 2 electricity indexes, which currently account for 54% of your total environmental footprint. Reducing active off-hour energy consumption by 15% would align your target pathway back to carbon neutrality.`,
        },
      ]);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center space-x-2">
          <Sparkles className="h-8 w-8 text-primary animate-pulse shrink-0" />
          <span>EcoSphere AI Copilot</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Leverage generative AI to query corporate environmental databases, predict compliance anomalies, and generate policy content.
        </p>
      </div>

      {/* Chat structure */}
      <div className="grid gap-6 md:grid-cols-4">
        {/* Chat box */}
        <Card className="md:col-span-3 flex flex-col h-[500px]">
          <CardHeader className="border-b border-border/80 shrink-0">
            <CardTitle className="text-sm font-semibold flex items-center space-x-2">
              <Bot className="h-5 w-5 text-primary" />
              <span>ESG Copilot Assistant</span>
            </CardTitle>
            <CardDescription>Ask questions about your ESG data or compliance policies.</CardDescription>
          </CardHeader>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex space-x-3.5 max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-secondary text-white'
                      : 'bg-primary/10 text-primary'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="h-4.5 w-4.5" /> : <Bot className="h-4.5 w-4.5" />}
                </div>

                <div
                  className={`p-3.5 rounded-xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-secondary text-white rounded-tr-none'
                      : 'bg-muted rounded-tl-none text-foreground'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Form input */}
          <CardContent className="p-4 border-t border-border shrink-0">
            <form onSubmit={handleSend} className="flex space-x-2">
              <Input
                placeholder="Ask about carbon trends, volunteer metrics, or audit status..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" className="shrink-0 p-3 h-10 w-10 flex items-center justify-center">
                <Send className="h-4.5 w-4.5" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recommendations panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Queries</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <button
                onClick={() => setQuery("Show carbon trends for facilities department.")}
                className="w-full text-left p-2.5 rounded-lg border border-border hover:border-primary/50 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all duration-200"
              >
                Show carbon trends for facilities
              </button>
              <button
                onClick={() => setQuery("Are there any compliance warnings?")}
                className="w-full text-left p-2.5 rounded-lg border border-border hover:border-primary/50 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all duration-200"
              >
                Are there any compliance warnings?
              </button>
              <button
                onClick={() => setQuery("Summarize the Anti-Bribery Policy.")}
                className="w-full text-left p-2.5 rounded-lg border border-border hover:border-primary/50 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all duration-200"
              >
                Summarize the Anti-Bribery Policy
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Copilot Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-2 text-xs">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span className="text-muted-foreground">Audit data for Scope 3 emissions has been synced successfully.</span>
              </div>
              <div className="flex items-start space-x-2 text-xs">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span className="text-muted-foreground">Energy saving suggestions generated for Facilities.</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default AICopilot;
