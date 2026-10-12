import React, { useState } from 'react';
import {
  Eye,
  ShieldCheck,
  Sparkles,
  Zap,
  CheckCircle2,
  ChevronDown,
  Camera,
  FileText,
  Plus,
  Lock,
} from 'lucide-react';
import { AgentPipelineStage, AgentStatus, TargetTab } from '@/shared/types';

interface RightPanelProps {
  status: AgentStatus;
  currentStage?: AgentPipelineStage;
  targetTabs: TargetTab[];
  selectedTabId: number | string | null;
  onSelectTargetTab: (tabId: number | string) => void;
  onRunQuickAction: (actionType: 'capture' | 'summarize') => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  status,
  currentStage,
  targetTabs,
  selectedTabId,
  onSelectTargetTab,
  onRunQuickAction,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedTab = targetTabs.find((t) => t.id === selectedTabId);

  const capabilities = [
    {
      id: 'SEE' as AgentPipelineStage,
      name: 'See',
      desc: 'Understand screen visually',
      icon: Eye,
    },
    {
      id: 'PROTECT' as AgentPipelineStage,
      name: 'Protect',
      desc: 'Keep your data private',
      icon: ShieldCheck,
    },
    {
      id: 'REASON' as AgentPipelineStage,
      name: 'Reason',
      desc: 'Plan the next best action',
      icon: Sparkles,
    },
    {
      id: 'ACT' as AgentPipelineStage,
      name: 'Act',
      desc: 'Interact with the browser',
      icon: Zap,
    },
    {
      id: 'VERIFY' as AgentPipelineStage,
      name: 'Verify',
      desc: 'Confirm the result',
      icon: CheckCircle2,
    },
  ];

  return (
    <aside className="w-72 h-full bg-[#0d0f15]/95 border-l border-white/[0.06] backdrop-blur-xl p-3.5 flex flex-col justify-between overflow-y-auto z-10 shrink-0">
      <div className="space-y-4">
        {/* Agent Status */}
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-ivory-muted/70 mb-1.5">
            Agent Status
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981] shadow-[0_0_8px_#10b981]" />
              </span>
              <span className="text-xs font-medium text-ivory-100">
                {status}
              </span>
            </div>

            {/* Sparkline mini waveform from reference */}
            <div className="w-14 h-4 flex items-center">
              <svg className="w-full h-full stroke-ivory-300/60 fill-none" viewBox="0 0 60 20">
                <path
                  d="M 2 12 Q 10 2 18 14 T 34 8 T 46 16 T 58 4"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <p className="text-[10px] text-ivory-muted/70 mt-1 leading-relaxed">
            I can see, analyze and act on your open tabs.
          </p>
        </div>

        {/* Target Tab Selector */}
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-ivory-muted/70 mb-1.5">
            Target Tab
          </div>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full p-2.5 rounded-xl bg-[#121620] border border-white/[0.08] hover:border-white/15 transition-all text-left flex items-center justify-between group shadow-card-glow"
            >
              <div className="flex items-center gap-2 min-w-0">
                {/* Chrome Logo Icon from reference */}
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 48 48">
                    <circle cx="24" cy="24" r="10" fill="#ffffff" />
                    <circle cx="24" cy="24" r="8" fill="#1a73e8" />
                    <path
                      d="M24 14h18.2a20 20 0 0 0-36.4 0H24z"
                      fill="#ea4335"
                    />
                    <path
                      d="M24 14l-9.1 15.8A20 20 0 0 0 34.6 42.6L43.7 26.8H24z"
                      fill="#fbbc05"
                    />
                    <path
                      d="M5.8 14a20 20 0 0 0 28.8 28.6L24.5 24H14.9L5.8 14z"
                      fill="#34a853"
                    />
                  </svg>
                </div>

                <div className="truncate">
                  <div className="text-xs font-medium text-ivory-100 group-hover:text-white truncate flex items-center gap-1.5">
                    {selectedTab ? selectedTab.title : 'No tab selected'}
                    {selectedTab?.isLocked && (
                      <Lock className="w-3 h-3 text-amber-400 shrink-0" />
                    )}
                  </div>
                  <div className="text-[10px] text-ivory-muted/60 truncate">
                    {selectedTab ? selectedTab.url : 'Select a tab to start'}
                  </div>
                </div>
              </div>

              <ChevronDown
                className={`w-3.5 h-3.5 text-ivory-muted/70 transition-transform ${
                  dropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#121620] border border-white/15 rounded-xl p-1 shadow-2xl z-30 space-y-0.5">
                {targetTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onSelectTargetTab(tab.id);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left p-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      tab.id === selectedTabId
                        ? 'bg-white/10 text-white font-medium'
                        : 'text-ivory-muted hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="truncate mr-2">
                      <div className="truncate font-medium text-[11px]">{tab.title}</div>
                      <div className="text-[9px] opacity-60 truncate">
                        {tab.url}
                      </div>
                    </div>
                    {tab.isLocked && (
                      <span className="text-[9px] px-1 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                        LOCKED
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Capabilities (Core Loop) */}
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-ivory-muted/70 mb-2">
            Capabilities
          </div>

          <div className="space-y-1.5">
            {capabilities.map((cap) => {
              const Icon = cap.icon;
              const isCurrent = currentStage === cap.id;

              return (
                <div
                  key={cap.id}
                  className={`flex items-start gap-2.5 p-1.5 rounded-xl transition-all ${
                    isCurrent
                      ? 'bg-gold/10 border border-gold/30 shadow-[0_0_10px_rgba(212,175,55,0.15)]'
                      : 'hover:bg-white/[0.02]'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${
                      isCurrent
                        ? 'bg-gold/20 border-gold/50 text-gold-light'
                        : 'bg-white/[0.04] border-white/[0.06] text-ivory-muted'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  <div className="min-w-0">
                    <div
                      className={`text-xs font-medium ${
                        isCurrent ? 'text-gold-light font-semibold' : 'text-ivory-200'
                      }`}
                    >
                      {cap.name}
                    </div>
                    <div className="text-[10px] text-ivory-muted/60 leading-tight">
                      {cap.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-ivory-muted/70 mb-1.5">
            <span>Quick Actions</span>
            <button
              title="Add action"
              className="hover:text-ivory-200 p-0.5 rounded transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-1.5">
            <button
              onClick={() => onRunQuickAction('capture')}
              className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-[#121620] border border-white/[0.06] hover:border-white/15 text-left transition-all hover:bg-[#161a26] group"
            >
              <div className="w-5 h-5 rounded-md bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-ivory-muted group-hover:text-ivory-100 shrink-0">
                <Camera className="w-3 h-3" />
              </div>
              <span className="text-xs font-medium text-ivory-200 group-hover:text-white truncate">
                Capture current page
              </span>
            </button>

            <button
              onClick={() => onRunQuickAction('summarize')}
              className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-[#121620] border border-white/[0.06] hover:border-white/15 text-left transition-all hover:bg-[#161a26] group"
            >
              <div className="w-5 h-5 rounded-md bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-ivory-muted group-hover:text-ivory-100 shrink-0">
                <FileText className="w-3 h-3" />
              </div>
              <span className="text-xs font-medium text-ivory-200 group-hover:text-white truncate">
                Summarize this page
              </span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
