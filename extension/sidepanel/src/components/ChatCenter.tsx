import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Edit2,
  MoreVertical,
  Maximize2,
  Search,
  FileText,
  Sparkles,
  Cog,
  Paperclip,
  Mic,
  ArrowUp,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { ParticleOrb } from './ParticleOrb';
import {
  ActionCard,
  AgentPipelineStage,
  AgentStatus,
  ChatMessage,
} from '@/shared/types';

interface ChatCenterProps {
  chatTitle: string;
  onRenameTitle: (newTitle: string) => void;
  status: AgentStatus;
  currentStage?: AgentPipelineStage;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onResetChat: () => void;
}

export const ChatCenter: React.FC<ChatCenterProps> = ({
  chatTitle,
  onRenameTitle,
  status,
  messages,
  onSendMessage,
  onResetChat,
}) => {
  const [inputText, setInputText] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(chatTitle);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const actionCards: ActionCard[] = [
    {
      id: 'analyze',
      title: 'Analyze',
      subtitle: 'this page',
      iconName: 'analyze',
      prompt: 'Analyze this page for key elements, privacy risks, and interactive controls',
    },
    {
      id: 'summarize',
      title: 'Summarize',
      subtitle: 'content',
      iconName: 'summarize',
      prompt: 'Summarize the core content on this page while keeping personal data private',
    },
    {
      id: 'find',
      title: 'Find',
      subtitle: 'information',
      iconName: 'find',
      prompt: 'Find key information, links, and documents on this target tab',
    },
    {
      id: 'automate',
      title: 'Automate',
      subtitle: 'this task',
      iconName: 'automate',
      prompt: 'Automate filling out the form on this page with safe placeholder inputs',
    },
  ];

  const suggestedPrompts = [
    'Find open GitHub issues',
    'Fill a college application form',
    'Compare laptop prices',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleCardClick = (prompt: string) => {
    onSendMessage(prompt);
  };

  const toggleVoiceMode = () => {
    setIsVoiceActive(!isVoiceActive);
    if (!isVoiceActive) {
      setInputText('Listening to voice command...');
      setTimeout(() => {
        setInputText('Summarize the top GitHub issues on this tab');
      }, 1400);
    } else {
      setInputText('');
    }
  };

  return (
    <main className="flex-1 h-full flex flex-col justify-between bg-[#08090d] relative overflow-hidden">
      {/* Top Header Bar */}
      <header className="h-12 border-b border-white/[0.06] px-5 flex items-center justify-between shrink-0 bg-[#08090d]/90 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-ivory-muted/70" />
          {isEditingTitle ? (
            <input
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={() => {
                setIsEditingTitle(false);
                if (tempTitle.trim()) onRenameTitle(tempTitle.trim());
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsEditingTitle(false);
                  if (tempTitle.trim()) onRenameTitle(tempTitle.trim());
                }
              }}
              autoFocus
              className="bg-panel border border-white/20 rounded px-2 py-0.5 text-xs text-white outline-none"
            />
          ) : (
            <div className="flex items-center gap-1.5 group cursor-pointer" onClick={() => setIsEditingTitle(true)}>
              <span className="text-xs font-medium text-ivory-100 group-hover:text-white">
                {chatTitle}
              </span>
              <Edit2 className="w-3 h-3 text-ivory-muted/40 group-hover:text-ivory-muted transition-colors" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-ivory-muted/70">
          <button
            onClick={onResetChat}
            title="Options & Mock Reset"
            className="p-1 rounded-lg hover:bg-white/5 hover:text-white transition-colors"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>
          <button
            title="Expand View"
            className="p-1 rounded-lg hover:bg-white/5 hover:text-white transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Workspace Area */}
      <div className="flex-1 overflow-y-auto px-5 py-3 flex flex-col justify-between">
        {messages.length === 0 ? (
          /* Empty / Welcome State from Reference Image */
          <div className="my-auto flex flex-col items-center justify-center max-w-xl mx-auto w-full text-center">
            {/* Animated Particle Orb */}
            <div className="mb-2">
              <ParticleOrb status={status} size={180} />
            </div>

            {/* Welcome Typography matching Reference */}
            <h1 className="text-2xl font-medium tracking-tight text-[#f7f4ee] font-sans">
              Hello, I'm VisionAgent.
            </h1>
            <p className="text-xs text-ivory-muted/70 tracking-wide font-sans mt-1 mb-5">
              See. Protect. Reason. Act. Verify.
            </p>

            {/* 4 Action Cards Grid from Reference */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full mb-3">
              {actionCards.map((card) => {
                const getIcon = () => {
                  switch (card.iconName) {
                    case 'analyze':
                      return <Search className="w-3.5 h-3.5 text-ivory-100" />;
                    case 'summarize':
                      return <FileText className="w-3.5 h-3.5 text-ivory-100" />;
                    case 'find':
                      return <Sparkles className="w-3.5 h-3.5 text-ivory-100" />;
                    case 'automate':
                      return <Cog className="w-3.5 h-3.5 text-ivory-100" />;
                  }
                };

                return (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card.prompt)}
                    className="p-3 rounded-2xl bg-[#11141d] border border-white/[0.06] hover:border-white/15 text-left transition-all hover:bg-[#151924] hover:-translate-y-0.5 group flex flex-col justify-between h-[84px] shadow-card-glow"
                  >
                    <div className="p-1.5 rounded-lg bg-white/[0.04] w-fit border border-white/[0.06] group-hover:bg-white/[0.08] transition-colors">
                      {getIcon()}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-ivory-100 group-hover:text-white leading-tight">
                        {card.title}
                      </div>
                      <div className="text-[10px] text-ivory-muted/60 leading-tight">
                        {card.subtitle}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Active Chat Conversation */
          <div className="max-w-xl mx-auto w-full space-y-4 pb-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                {msg.sender === 'user' ? (
                  <div className="max-w-[85%] rounded-2xl px-3.5 py-2.5 bg-[#1e2330] border border-white/10 text-xs text-ivory-100 shadow-md">
                    {msg.text}
                  </div>
                ) : (
                  <div className="max-w-[95%] rounded-2xl p-4 bg-[#11141d] border border-white/[0.08] text-xs text-ivory-200 shadow-panel space-y-2.5">
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-1.5 text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                        <span className="font-semibold text-ivory-100 text-[11px]">VisionAgent Engine</span>
                      </div>
                      {msg.isMock && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                          MOCK REASONER ACTIVE
                        </span>
                      )}
                    </div>

                    <p className="leading-relaxed text-ivory-200 text-xs">{msg.text}</p>

                    {/* Pipeline Verification Stage Badges */}
                    {msg.stage && (
                      <div className="mt-2 pt-2 border-t border-white/[0.04] grid grid-cols-5 gap-1 text-[9px] text-center font-mono">
                        <span className="p-0.5 rounded bg-white/[0.05] text-emerald-400 flex items-center justify-center gap-1">
                          <CheckCircle className="w-2.5 h-2.5" /> SEE
                        </span>
                        <span className="p-0.5 rounded bg-white/[0.05] text-emerald-400 flex items-center justify-center gap-1">
                          <ShieldCheck className="w-2.5 h-2.5" /> PROTECT
                        </span>
                        <span className="p-0.5 rounded bg-white/[0.05] text-emerald-400 flex items-center justify-center gap-1">
                          <CheckCircle className="w-2.5 h-2.5" /> REASON
                        </span>
                        <span className="p-0.5 rounded bg-white/[0.05] text-emerald-400 flex items-center justify-center gap-1">
                          <CheckCircle className="w-2.5 h-2.5" /> ACT
                        </span>
                        <span className="p-0.5 rounded bg-white/[0.05] text-emerald-400 flex items-center justify-center gap-1">
                          <CheckCircle className="w-2.5 h-2.5" /> VERIFY
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-ivory-muted/60 pt-0.5">
                      <span>PII leaks: 0 • Elements: 14</span>
                      <span>Confidence: {msg.confidence ? `${(msg.confidence * 100).toFixed(0)}%` : '98%'}</span>
                    </div>
                  </div>
                )}
                <span className="text-[9px] text-ivory-muted/40 mt-0.5 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Message Composer & Suggestions Container */}
        <div className="max-w-xl mx-auto w-full mt-auto pt-1">
          {/* Message Input Capsule from Reference */}
          <form
            onSubmit={handleSubmit}
            className="relative flex items-center rounded-full bg-[#11141d] border border-white/10 px-3.5 py-1.5 shadow-panel focus-within:border-white/20 transition-all"
          >
            {/* Attachment Button */}
            <button
              type="button"
              title="Attach context or screenshot"
              className="p-1 rounded-full hover:bg-white/5 text-ivory-muted hover:text-ivory-200 transition-colors"
            >
              <Paperclip className="w-4 h-4 -rotate-45" />
            </button>

            {/* Input Field */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask VisionAgent..."
              className="flex-1 bg-transparent border-none outline-none text-xs text-ivory-100 placeholder:text-ivory-muted/50 px-2.5 py-1 font-sans"
            />

            {/* Shortcut Badge: ⌘ ↵ */}
            <div className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-[9px] font-mono text-ivory-muted/60 mr-1.5">
              <span>⌘</span>
              <span>↵</span>
            </div>

            {/* Microphone Button */}
            <button
              type="button"
              onClick={toggleVoiceMode}
              title={isVoiceActive ? 'Stop listening' : 'Start voice mode'}
              className={`p-1.5 rounded-full transition-all mr-1 ${
                isVoiceActive
                  ? 'bg-amber-400/20 text-amber-300 animate-pulse'
                  : 'hover:bg-white/5 text-ivory-muted hover:text-ivory-200'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
            </button>

            {/* Circular Ivory Send Button from Reference */}
            <button
              type="submit"
              disabled={!inputText.trim()}
              title="Send message"
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 ${
                inputText.trim()
                  ? 'bg-[#f4efe6] text-black hover:bg-white shadow-[0_0_10px_rgba(244,239,230,0.35)] active:scale-95'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
              }`}
            >
              <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </form>

          {/* Suggested Prompts Pills Row from Reference */}
          <div className="flex items-center justify-center gap-1.5 mt-2 flex-wrap pb-1">
            {suggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleCardClick(prompt)}
                className="px-3 py-1 rounded-full bg-[#121620] border border-white/[0.07] hover:border-white/20 text-[10px] text-ivory-muted/80 hover:text-ivory-100 transition-all hover:bg-[#161b27]"
              >
                {prompt}
              </button>
            ))}
            <button
              title="More suggestions"
              className="px-2 py-1 rounded-full bg-[#121620] border border-white/[0.07] hover:border-white/20 text-[10px] text-ivory-muted/80 hover:text-ivory-100 transition-all hover:bg-[#161b27]"
            >
              •••
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
