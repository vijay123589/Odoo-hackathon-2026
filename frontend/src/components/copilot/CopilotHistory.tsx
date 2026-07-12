import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Search, Pin, MessageSquare, Edit2, Trash2, Check, X, Bookmark, Plus } from 'lucide-react';

export interface ChatSession {
  id: string;
  title: string;
  isPinned: boolean;
  dateGroup: 'Today' | 'Yesterday' | 'Last Week';
}

interface CopilotHistoryProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onDeleteSession: (id: string) => void;
  onTogglePinSession: (id: string) => void;
  savedInsightsCount: number;
  onViewInsights: () => void;
  className?: string;
}

export const CopilotHistory: React.FC<CopilotHistoryProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onRenameSession,
  onDeleteSession,
  onTogglePinSession,
  savedInsightsCount,
  onViewInsights,
  className = '',
}) => {
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleStartEdit = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditId(session.id);
    setEditTitle(session.title);
  };

  const handleSaveEdit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameSession(id, editTitle);
    }
    setEditId(null);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditId(null);
  };

  // Filter sessions
  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`flex flex-col h-full space-y-5 bg-card/45 p-4 border border-border/40 rounded-2xl ${className}`}>
      {/* New conversation button */}
      <Button
        variant="primary"
        onClick={onNewSession}
        className="w-full h-10 text-xs font-bold inline-flex items-center justify-center space-x-1.5 shadow-sm"
      >
        <Plus className="h-4 w-4" />
        <span>New Analysis Session</span>
      </Button>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
        <input
          type="text"
          placeholder="Search sessions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 bg-muted/30 focus:bg-card border border-border/50 rounded-xl text-xs font-semibold focus:outline-none transition-colors"
        />
      </div>

      {/* Sessions list */}
      <div className="flex-1 overflow-y-auto space-y-1.5 max-h-[360px] pr-1">
        <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest px-2 block mb-1">
          Recent Sessions
        </span>
        <div className="space-y-0.5">
          {filteredSessions.map((session) => {
            const isActive = session.id === activeSessionId;
            const isEditing = session.id === editId;

            return (
              <div
                key={session.id}
                onClick={() => !isEditing && onSelectSession(session.id)}
                className={`group flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/5 shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  <MessageSquare className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground/60'}`} />
                  {isEditing ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-card text-foreground px-1 py-0.5 rounded border border-border focus:outline-none text-xs font-semibold w-full"
                    />
                  ) : (
                    <span className="truncate leading-none pr-1">
                      {session.title}
                    </span>
                  )}
                </div>

                {/* Session Action Buttons */}
                <div className="flex items-center space-x-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  {isEditing ? (
                    <>
                      <button
                        onClick={(e) => handleSaveEdit(session.id, e)}
                        className="p-1 hover:bg-muted rounded text-primary transition-colors"
                        title="Save Title"
                      >
                        <Check className="h-3 w-3" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                        title="Cancel"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onTogglePinSession(session.id);
                        }}
                        className={`p-1 hover:bg-muted rounded transition-colors ${
                          session.isPinned ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                        }`}
                        title={session.isPinned ? 'Unpin' : 'Pin Session'}
                      >
                        <Pin className={`h-3 w-3 ${session.isPinned ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={(e) => handleStartEdit(session, e)}
                        className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                        title="Rename"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(session.id);
                        }}
                        className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredSessions.length === 0 && (
          <div className="text-center py-6 text-xs text-muted-foreground/60">
            No history found
          </div>
        )}
      </div>

      {/* Saved Insights Footer Tab */}
      <div className="border-t border-border/40 pt-4 mt-auto">
        <button
          onClick={onViewInsights}
          className="flex items-center justify-between w-full p-3 border border-border/60 hover:bg-muted/40 rounded-xl transition-all duration-200"
        >
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/5">
              <Bookmark className="h-3.5 w-3.5 fill-current" />
            </div>
            <span className="text-xs font-bold text-foreground/80">Saved AI Insights</span>
          </div>
          <span className="bg-primary/20 text-primary text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0">
            {savedInsightsCount}
          </span>
        </button>
      </div>
    </div>
  );
};
export default CopilotHistory;
