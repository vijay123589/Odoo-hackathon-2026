import React, { useState } from 'react';
import { Bot, User, Copy, ThumbsUp, ThumbsDown, Bookmark, Share2, RefreshCw, Check } from 'lucide-react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../ui/Table';
import { BarChart } from '../charts/BarChart';
import { AreaChart } from '../charts/AreaChart';
import { PieChart } from '../charts/PieChart';
import { RadarChart } from '../charts/RadarChart';

export interface Message {
  sender: 'user' | 'bot';
  text: string;
  timestamp?: string;
  chartType?: 'area' | 'bar' | 'line' | 'pie' | 'radar' | null;
  tableData?: Array<Record<string, any>> | null;
  tableColumns?: string[] | null;
}

interface CopilotMessageProps {
  message: Message;
  onLike?: () => void;
  onDislike?: () => void;
  onBookmark?: () => void;
  onShare?: () => void;
  onRegenerate?: () => void;
}

export const CopilotMessage: React.FC<CopilotMessageProps> = ({
  message,
  onLike,
  onDislike,
  onBookmark,
  onShare,
  onRegenerate,
}) => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);
  const [bookmarked, setBookmarked] = useState(false);

  const isBot = message.sender === 'bot';

  // Copy handler
  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLikeToggle = (type: 'like' | 'dislike') => {
    if (type === 'like') {
      setLiked(liked === true ? null : true);
      if (onLike) onLike();
    } else {
      setLiked(liked === false ? null : false);
      if (onDislike) onDislike();
    }
  };

  const handleBookmarkToggle = () => {
    setBookmarked(!bookmarked);
    if (onBookmark) onBookmark();
  };

  // Recharts Dummy Datasets for inline responses
  const deptEmissions = [
    { name: 'Engineering', emissions: 85 },
    { name: 'Logistics', emissions: 140 },
    { name: 'Facilities', emissions: 210 },
    { name: 'HR', emissions: 20 },
    { name: 'Sales', emissions: 65 },
  ];

  const emissionsTrend = [
    { name: 'Jan', value: 187 },
    { name: 'Feb', value: 176 },
    { name: 'Mar', value: 179 },
    { name: 'Apr', value: 151 },
    { name: 'May', value: 155 },
    { name: 'Jun', value: 126 },
  ];

  const complianceScore = [
    { subject: 'Emissions Control', target: 80, actual: 84 },
    { subject: 'CSR Hours', target: 90, actual: 95 },
    { subject: 'Diversity Index', target: 85, actual: 88 },
    { subject: 'Policy Attended', target: 100, actual: 100 },
    { subject: 'Audit Score', target: 95, actual: 96 },
  ];

  const esgCategoryDistribution = [
    { name: 'Environmental', value: 45 },
    { name: 'Social', value: 30 },
    { name: 'Governance', value: 25 },
  ];

  // Simple parser to render markdown text paragraphs and bullet items
  const renderTextContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return (
          <li key={idx} className="ml-4 list-disc font-semibold text-foreground/80 leading-relaxed mt-1">
            {line.trim().substring(2)}
          </li>
        );
      }
      if (line.trim().match(/^\d+\.\s/)) {
        return (
          <li key={idx} className="ml-4 list-decimal font-semibold text-foreground/80 leading-relaxed mt-1">
            {line.trim().replace(/^\d+\.\s/, '')}
          </li>
        );
      }
      if (line.trim().startsWith('### ')) {
        return (
          <h4 key={idx} className="text-xs font-bold uppercase tracking-wider text-primary mt-3 mb-1">
            {line.trim().substring(4)}
          </h4>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }
      return (
        <p key={idx} className="font-semibold text-foreground/85 leading-relaxed mt-1">
          {line}
        </p>
      );
    });
  };

  return (
    <div className={`flex space-x-3.5 max-w-[85%] ${!isBot ? 'ml-auto flex-row-reverse space-x-reverse' : ''}`}>
      {/* Icon */}
      <div
        className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${
          !isBot
            ? 'bg-secondary text-secondary-foreground border-secondary/10'
            : 'bg-primary/10 text-primary border-primary/5'
        }`}
      >
        {!isBot ? <User className="h-4.5 w-4.5" /> : <Bot className="h-4.5 w-4.5" />}
      </div>

      {/* Bubble Body */}
      <div className="space-y-2.5">
        <div
          className={`p-4 rounded-2xl text-xs font-semibold leading-relaxed shadow-[0_2px_12px_rgba(28,38,30,0.015)] border transition-all duration-200 ${
            !isBot
              ? 'bg-primary text-primary-foreground border-primary/20'
              : 'bg-card border-border/50 text-foreground/90'
          }`}
        >
          {/* Main textual message */}
          <div className="space-y-1">{renderTextContent(message.text)}</div>

          {/* Inline Table Content */}
          {isBot && message.tableData && message.tableColumns && (
            <div className="border border-border/40 rounded-xl overflow-hidden mt-4 bg-muted/10 shadow-[0_2px_8px_rgba(28,38,30,0.002)]">
              <Table className="w-full text-[10px] border-collapse">
                <TableHeader className="bg-muted/40 border-b border-border/30">
                  <TableRow>
                    {message.tableColumns.map((col) => (
                      <TableHead key={col} className="py-2 px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {col}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {message.tableData.map((row, rIdx) => (
                    <TableRow key={rIdx} className="hover:bg-muted/20 border-b border-border/10 last:border-0">
                      {message.tableColumns!.map((col) => (
                        <TableCell key={col} className="py-2 px-3 font-semibold text-foreground/80">
                          {row[col]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Inline Charts Visualisation */}
          {isBot && message.chartType && (
            <div className="border border-border/30 rounded-2xl p-4 mt-4 bg-[#FAF8F4]/30 dark:bg-card flex flex-col justify-center items-center min-h-[220px]">
              {message.chartType === 'bar' && (
                <div className="w-full">
                  <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest block text-center mb-3">Carbon emissions Comparison</span>
                  <BarChart data={deptEmissions} xKey="name" dataKeys={['emissions']} height={160} />
                </div>
              )}
              {message.chartType === 'area' && (
                <div className="w-full">
                  <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest block text-center mb-3">Monthly Carbon footprints Reduction (tCO2e)</span>
                  <AreaChart data={emissionsTrend} xKey="name" dataKeys={['value']} height={160} />
                </div>
              )}
              {message.chartType === 'radar' && (
                <div className="w-full">
                  <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest block text-center mb-3">Audit target vs actual index percentage</span>
                  <RadarChart data={complianceScore} xKey="subject" dataKeys={['target', 'actual']} height={160} />
                </div>
              )}
              {message.chartType === 'pie' && (
                <div className="w-full max-w-[200px]">
                  <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest block text-center mb-3">ESG category weightage</span>
                  <PieChart data={esgCategoryDistribution} height={160} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Feedback Controls (Bot Only) */}
        {isBot && (
          <div className="flex items-center space-x-3 text-muted-foreground/60 px-1">
            <button
              onClick={handleCopy}
              className="hover:text-foreground p-0.5 rounded transition-colors"
              title="Copy Answer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
            
            <button
              onClick={() => handleLikeToggle('like')}
              className={`p-0.5 rounded transition-colors ${liked === true ? 'text-primary' : 'hover:text-foreground'}`}
              title="Thumbs Up"
            >
              <ThumbsUp className={`h-3.5 w-3.5 ${liked === true ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={() => handleLikeToggle('dislike')}
              className={`p-0.5 rounded transition-colors ${liked === false ? 'text-red-500' : 'hover:text-foreground'}`}
              title="Thumbs Down"
            >
              <ThumbsDown className={`h-3.5 w-3.5 ${liked === false ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleBookmarkToggle}
              className={`p-0.5 rounded transition-colors ${bookmarked ? 'text-primary' : 'hover:text-foreground'}`}
              title="Save Insight"
            >
              <Bookmark className={`h-3.5 w-3.5 ${bookmarked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={onShare}
              className="hover:text-foreground p-0.5 rounded transition-colors"
              title="Share Response"
            >
              <Share2 className="h-3.5 w-3.5" />
            </button>

            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="hover:text-foreground p-0.5 rounded transition-colors"
                title="Regenerate"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default CopilotMessage;
