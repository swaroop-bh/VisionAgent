import React, { useState } from 'react';
import {
  MessageSquare,
  Clock,
  LayoutGrid,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  ShieldCheck,
  ChevronRight as ChevronRightSmall,
  GraduationCap,
  Globe,
} from 'lucide-react';
import { NavigationTab, PinnedTab } from '@/shared/types';

interface SidebarProps {
  activeNav: NavigationTab;
  onSelectNav: (tab: NavigationTab) => void;
  pinnedTabs: PinnedTab[];
  onSelectPinnedTab: (tabId: string) => void;
  onOpenPrivacyModal?: () => void;
  onAddPinnedTab?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeNav,
  onSelectNav,
  pinnedTabs,
  onSelectPinnedTab,
  onOpenPrivacyModal,
  onAddPinnedTab,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const renderSiteIcon = (type: PinnedTab['iconType']) => {
    switch (type) {
      case 'github':
        return (
          <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </div>
        );
      case 'youtube':
        return (
          <div className="w-5 h-5 rounded-md bg-[#e60000] flex items-center justify-center text-white shrink-0">
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </div>
        );
      case 'portal':
        return (
          <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-ivory-200 shrink-0">
            <GraduationCap className="w-3.5 h-3.5" />
          </div>
        );
      case 'globe':
      default:
        return (
          <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-ivory-200 shrink-0">
            <Globe className="w-3.5 h-3.5" />
          </div>
        );
    }
  };

  return (
    <aside
      className={`relative flex flex-col justify-between h-full bg-[#0d0f15]/95 border-r border-white/[0.06] backdrop-blur-xl transition-all duration-300 z-20 shrink-0 ${
        collapsed ? 'w-16 px-2 py-3' : 'w-60 p-3.5'
      }`}
    >
      {/* Top Header & Navigation */}
      <div className="flex flex-col min-h-0">
        <div className="flex items-center justify-between pb-4 pt-0.5 px-1">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {/* VisionAgent concentric circle logo from reference */}
            <div className="relative w-6 h-6 rounded-full border border-white/40 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(255,255,255,0.12)]">
              <div className="w-2 h-2 rounded-full bg-ivory-100 shadow-[0_0_6px_rgba(244,239,230,0.9)]" />
            </div>
            {!collapsed && (
              <span className="font-semibold tracking-[0.18em] text-[11px] text-ivory-200 uppercase font-sans">
                VisionAgent
              </span>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="p-1 rounded-lg hover:bg-white/5 text-ivory-muted/70 hover:text-ivory-200 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Primary Navigation */}
        <nav className="space-y-1" aria-label="Main Navigation">
          <button
            onClick={() => onSelectNav('chat')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-xs transition-all duration-200 ${
              activeNav === 'chat'
                ? 'bg-gradient-to-r from-[#e7d9bf] via-[#f3ebe0] to-[#fbf8f2] text-black shadow-[0_0_16px_rgba(240,230,210,0.22)]'
                : 'text-ivory-muted hover:text-ivory-100 hover:bg-white/[0.04]'
            }`}
          >
            <MessageSquare
              className={`w-4 h-4 shrink-0 ${
                activeNav === 'chat' ? 'text-black fill-current' : 'text-ivory-muted'
              }`}
            />
            {!collapsed && <span className="font-semibold">Chat</span>}
          </button>

          <button
            onClick={() => onSelectNav('history')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-xs transition-all duration-200 ${
              activeNav === 'history'
                ? 'bg-gradient-to-r from-[#e7d9bf] via-[#f3ebe0] to-[#fbf8f2] text-black shadow-[0_0_16px_rgba(240,230,210,0.22)]'
                : 'text-ivory-muted hover:text-ivory-100 hover:bg-white/[0.04]'
            }`}
          >
            <Clock
              className={`w-4 h-4 shrink-0 ${
                activeNav === 'history' ? 'text-black fill-current' : 'text-ivory-muted'
              }`}
            />
            {!collapsed && <span className={activeNav === 'history' ? 'font-semibold' : ''}>History</span>}
          </button>

          <button
            onClick={() => onSelectNav('tabs')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-xs transition-all duration-200 ${
              activeNav === 'tabs'
                ? 'bg-gradient-to-r from-[#e7d9bf] via-[#f3ebe0] to-[#fbf8f2] text-black shadow-[0_0_16px_rgba(240,230,210,0.22)]'
                : 'text-ivory-muted hover:text-ivory-100 hover:bg-white/[0.04]'
            }`}
          >
            <LayoutGrid
              className={`w-4 h-4 shrink-0 ${
                activeNav === 'tabs' ? 'text-black fill-current' : 'text-ivory-muted'
              }`}
            />
            {!collapsed && <span className={activeNav === 'tabs' ? 'font-semibold' : ''}>Tabs</span>}
          </button>

          <button
            onClick={() => onSelectNav('settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-xs transition-all duration-200 ${
              activeNav === 'settings'
                ? 'bg-gradient-to-r from-[#e7d9bf] via-[#f3ebe0] to-[#fbf8f2] text-black shadow-[0_0_16px_rgba(240,230,210,0.22)]'
                : 'text-ivory-muted hover:text-ivory-100 hover:bg-white/[0.04]'
            }`}
          >
            <Settings
              className={`w-4 h-4 shrink-0 ${
                activeNav === 'settings' ? 'text-black fill-current' : 'text-ivory-muted'
              }`}
            />
            {!collapsed && <span className={activeNav === 'settings' ? 'font-semibold' : ''}>Settings</span>}
          </button>
        </nav>

        {/* Connected Sites Section */}
        {!collapsed && (
          <div className="mt-4 pt-1">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-ivory-muted/60 px-1 mb-1.5">
              <span>Connected</span>
              <button
                onClick={onAddPinnedTab}
                title="Add tab"
                className="hover:text-ivory-200 p-0.5 rounded transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-0.5">
              {pinnedTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onSelectPinnedTab(tab.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left transition-all group ${
                    tab.isActive
                      ? 'bg-white/[0.06] border border-white/10'
                      : 'hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {renderSiteIcon(tab.iconType)}
                    <div className="truncate">
                      <div className="text-xs font-medium text-ivory-100 group-hover:text-white truncate">
                        {tab.title}
                      </div>
                      <div className="text-[10px] text-ivory-muted/60 truncate">
                        {tab.url}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 pl-1.5">
                    {tab.isActive ? (
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#10b981] shadow-[0_0_6px_#10b981]" />
                    ) : (
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/20" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom: Privacy Protected Card */}
      {!collapsed ? (
        <div
          onClick={onOpenPrivacyModal}
          role="button"
          tabIndex={0}
          className="mt-3 p-2.5 rounded-2xl bg-[#121620]/90 border border-white/[0.07] hover:border-white/15 cursor-pointer transition-all flex items-center justify-between group shadow-card-glow shrink-0"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-gold/10 border border-gold/25 flex items-center justify-center shrink-0 text-gold-light">
              <ShieldCheck className="w-3.5 h-3.5 text-ivory-200" />
            </div>
            <div className="truncate">
              <div className="text-xs font-medium text-ivory-100 group-hover:text-white">
                Privacy Protected
              </div>
              <div className="text-[10px] text-ivory-muted/70">
                Your data stays on this device
              </div>
            </div>
          </div>
          <ChevronRightSmall className="w-3.5 h-3.5 text-ivory-muted/60 group-hover:text-ivory-200 shrink-0 ml-1" />
        </div>
      ) : (
        <div
          onClick={onOpenPrivacyModal}
          title="Privacy Protected: Your data stays on this device"
          className="w-9 h-9 mx-auto rounded-xl bg-gold/10 border border-gold/25 flex items-center justify-center text-ivory-200 cursor-pointer hover:bg-gold/20 transition-colors shrink-0"
        >
          <ShieldCheck className="w-4 h-4" />
        </div>
      )}
    </aside>
  );
};
