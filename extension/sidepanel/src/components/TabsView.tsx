import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  Lock,
  Unlock,
  CheckCircle2,
  MoreVertical,
  X,
  ShieldCheck,
  Globe,
  GraduationCap,
  FileText,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { BrowserTabItem, TabStatusFilter } from '@/shared/types';

interface TabsViewProps {
  selectedTargetTabId: number | string | null;
  onSelectTargetTab: (tabId: number | string) => void;
}

export const TabsView: React.FC<TabsViewProps> = ({
  selectedTargetTabId,
  onSelectTargetTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TabStatusFilter>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [windowFilter, setWindowFilter] = useState<string>('Current Window');
  const [isWindowDropdownOpen, setIsWindowDropdownOpen] = useState(false);
  const [selectedTabIds, setSelectedTabIds] = useState<Set<number | string>>(new Set());
  const [activeMenuTabId, setActiveMenuTabId] = useState<number | string | null>(null);

  // Tabs initial dataset matching reference architecture
  const [tabs, setTabs] = useState<BrowserTabItem[]>([
    {
      id: 1,
      title: 'GitHub — Issues & Pull Requests',
      url: 'https://github.com/microsoft/vscode/issues',
      domain: 'github.com',
      siteType: 'github',
      status: 'active',
      isAgentTarget: selectedTargetTabId === 1,
      windowId: 1,
      windowName: 'Current Window',
      elementCount: 28,
      piiShielded: true,
      lastUpdated: 'Just now',
    },
    {
      id: 2,
      title: 'National Scholarship Portal — Application Form',
      url: 'https://scholarships.gov.in/apply',
      domain: 'scholarships.gov.in',
      siteType: 'doc',
      status: 'locked',
      isAgentTarget: selectedTargetTabId === 2,
      windowId: 1,
      windowName: 'Current Window',
      elementCount: 42,
      piiShielded: true,
      lastUpdated: '2m ago',
    },
    {
      id: 3,
      title: 'Flipkart — Electronics & Laptop Deals',
      url: 'https://flipkart.com/laptops',
      domain: 'flipkart.com',
      siteType: 'globe',
      status: 'completed',
      isAgentTarget: selectedTargetTabId === 3,
      windowId: 1,
      windowName: 'Current Window',
      elementCount: 36,
      piiShielded: false,
      lastUpdated: '15m ago',
    },
    {
      id: 4,
      title: 'YouTube — Deep Learning Architecture Explained',
      url: 'https://youtube.com/watch?v=model-arch',
      domain: 'youtube.com',
      siteType: 'youtube',
      status: 'completed',
      isAgentTarget: selectedTargetTabId === 4,
      windowId: 1,
      windowName: 'Current Window',
      elementCount: 19,
      piiShielded: false,
      lastUpdated: '45m ago',
    },
    {
      id: 5,
      title: 'University Portal — Student Dashboard',
      url: 'https://university.edu/student/portal',
      domain: 'university.edu',
      siteType: 'portal',
      status: 'inactive',
      isAgentTarget: selectedTargetTabId === 5,
      windowId: 1,
      windowName: 'Current Window',
      elementCount: 14,
      piiShielded: true,
      lastUpdated: '1h ago',
    },
    {
      id: 6,
      title: 'Python 3.12 Documentation — AsyncIO Tasks',
      url: 'https://docs.python.org/3/library/asyncio.html',
      domain: 'docs.python.org',
      siteType: 'doc',
      status: 'inactive',
      isAgentTarget: selectedTargetTabId === 6,
      windowId: 1,
      windowName: 'Current Window',
      elementCount: 22,
      piiShielded: false,
      lastUpdated: '2h ago',
    },
    // Window 2 Tabs
    {
      id: 7,
      title: 'arXiv — Multi-Modal Vision Agents Survey',
      url: 'https://arxiv.org/abs/2409.0001',
      domain: 'arxiv.org',
      siteType: 'globe',
      status: 'inactive',
      isAgentTarget: selectedTargetTabId === 7,
      windowId: 2,
      windowName: 'Window 2',
      elementCount: 12,
      piiShielded: false,
      lastUpdated: '3h ago',
    },
    {
      id: 8,
      title: 'Stack Overflow — Chromium Extension Sidepanel API',
      url: 'https://stackoverflow.com/questions/chrome-sidepanel',
      domain: 'stackoverflow.com',
      siteType: 'globe',
      status: 'completed',
      isAgentTarget: selectedTargetTabId === 8,
      windowId: 2,
      windowName: 'Window 2',
      elementCount: 31,
      piiShielded: false,
      lastUpdated: '4h ago',
    },
  ]);

  // Read real Chrome tabs if running inside Chromium extension
  React.useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
      chrome.tabs.query({}, (chromeTabs) => {
        if (chromeTabs && chromeTabs.length > 0) {
          const loaded: BrowserTabItem[] = chromeTabs.map((ct) => {
            let siteType: BrowserTabItem['siteType'] = 'globe';
            const url = ct.url || '';
            if (url.includes('github.com')) siteType = 'github';
            else if (url.includes('youtube.com')) siteType = 'youtube';
            else if (url.includes('.edu')) siteType = 'portal';
            else if (url.includes('doc')) siteType = 'doc';

            let domain = 'localhost';
            try {
              if (url) domain = new URL(url).hostname;
            } catch {
              domain = 'browser';
            }

            return {
              id: ct.id || Math.random(),
              title: ct.title || 'Untitled Tab',
              url: ct.url || '',
              domain,
              siteType,
              status: ct.active ? 'active' : 'inactive',
              isAgentTarget: ct.id === selectedTargetTabId,
              windowId: ct.windowId || 1,
              windowName: ct.windowId === 1 ? 'Current Window' : `Window ${ct.windowId}`,
              elementCount: 18,
              piiShielded: true,
              lastUpdated: ct.active ? 'Active now' : 'Background',
            };
          });
          setTabs(loaded);
        }
      });
    }
  }, [selectedTargetTabId]);

  // Calculate status counts
  const counts = useMemo(() => {
    return {
      all: tabs.length,
      active: tabs.filter((t) => t.status === 'active').length,
      locked: tabs.filter((t) => t.status === 'locked').length,
      completed: tabs.filter((t) => t.status === 'completed').length,
      inactive: tabs.filter((t) => t.status === 'inactive').length,
    };
  }, [tabs]);

  // Filter tabs
  const filteredTabs = useMemo(() => {
    return tabs.filter((tab) => {
      const matchesSearch =
        tab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tab.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tab.url.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (statusFilter !== 'all' && tab.status !== statusFilter) {
        return false;
      }

      if (windowFilter !== 'All Windows' && tab.windowName !== windowFilter) {
        return false;
      }

      return true;
    });
  }, [tabs, searchQuery, statusFilter, windowFilter]);

  const handleOpenNewTab = () => {
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
      chrome.tabs.create({ url: 'https://google.com' });
    } else {
      const newTab: BrowserTabItem = {
        id: Date.now(),
        title: 'New Tab — Browser',
        url: 'https://example.com/new',
        domain: 'example.com',
        siteType: 'globe',
        status: 'active',
        isAgentTarget: false,
        windowId: 1,
        windowName: 'Current Window',
        elementCount: 10,
        piiShielded: true,
        lastUpdated: 'Just created',
      };
      setTabs([newTab, ...tabs]);
    }
  };

  const handleToggleLock = (tabId: number | string) => {
    setTabs((prev) =>
      prev.map((t) => {
        if (t.id === tabId) {
          const nextStatus = t.status === 'locked' ? 'active' : 'locked';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
    setActiveMenuTabId(null);
  };

  const handleCloseTab = (tabId: number | string) => {
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.remove && typeof tabId === 'number') {
      chrome.tabs.remove(tabId);
    }
    setTabs((prev) => prev.filter((t) => t.id !== tabId));
    setActiveMenuTabId(null);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTabIds(new Set(filteredTabs.map((t) => t.id)));
    } else {
      setSelectedTabIds(new Set());
    }
  };

  const toggleSelectTab = (tabId: number | string) => {
    setSelectedTabIds((prev) => {
      const next = new Set(prev);
      if (next.has(tabId)) next.delete(tabId);
      else next.add(tabId);
      return next;
    });
  };

  const renderSiteIcon = (type: BrowserTabItem['siteType']) => {
    switch (type) {
      case 'github':
        return (
          <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
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
          <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center text-ivory-200 shrink-0">
            <GraduationCap className="w-3.5 h-3.5" />
          </div>
        );
      case 'doc':
        return (
          <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center text-ivory-200 shrink-0">
            <FileText className="w-3.5 h-3.5" />
          </div>
        );
      case 'globe':
      default:
        return (
          <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center text-ivory-200 shrink-0">
            <Globe className="w-3.5 h-3.5" />
          </div>
        );
    }
  };

  const renderStatusBadge = (status: BrowserTabItem['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/25 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
            Active
          </span>
        );
      case 'locked':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#f59e0b]/15 text-[#fbbf24] border border-[#f59e0b]/25 flex items-center gap-1">
            <Lock className="w-2.5 h-2.5" />
            Locked
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Perception Ready
          </span>
        );
      case 'inactive':
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/5 text-ivory-muted/70 border border-white/10">
            Inactive
          </span>
        );
    }
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-[#07080a] text-ivory-100 font-sans overflow-hidden">
      {/* 1. Header Bar */}
      <header className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-white/[0.06] shrink-0 bg-[#07080a]">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white font-sans">
            Tabs
          </h1>
          <p className="text-xs text-ivory-muted/70 mt-0.5">
            Manage and select browser tabs for agent perception & multi-tab control
          </p>
        </div>

        {/* Right Search & New Tab Button */}
        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-ivory-muted/60 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tabs by title or domain..."
              className="w-64 bg-[#11141d] border border-white/10 rounded-full pl-9 pr-3.5 py-1.5 text-xs text-ivory-100 placeholder:text-ivory-muted/50 outline-none focus:border-white/25 transition-all"
            />
          </div>

          {/* Open New Tab Button */}
          <button
            onClick={handleOpenNewTab}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#e7d9bf] via-[#f3ebe0] to-[#fbf8f2] text-black font-semibold text-xs flex items-center gap-1.5 hover:opacity-95 transition-all shadow-md active:scale-95 shrink-0"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Open New Tab</span>
          </button>
        </div>
      </header>

      {/* 2. Filter Toolbar */}
      <div className="px-6 py-3 border-b border-white/[0.06] flex items-center justify-between shrink-0 bg-[#0a0c10] text-xs">
        {/* Status Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'all' as TabStatusFilter, label: 'All Tabs', count: counts.all },
            { id: 'active' as TabStatusFilter, label: 'Active', count: counts.active },
            { id: 'locked' as TabStatusFilter, label: 'Locked', count: counts.locked },
            { id: 'completed' as TabStatusFilter, label: 'Completed', count: counts.completed },
            { id: 'inactive' as TabStatusFilter, label: 'Inactive', count: counts.inactive },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
                statusFilter === f.id
                  ? 'bg-white/10 text-white border border-white/15'
                  : 'text-ivory-muted hover:text-ivory-100 hover:bg-white/[0.03]'
              }`}
            >
              <span>{f.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  statusFilter === f.id
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-ivory-muted/60'
                }`}
              >
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {/* Right Tools: Window Selector, Select All, Grid/List view */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Current Window Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsWindowDropdownOpen(!isWindowDropdownOpen)}
              className="flex items-center gap-1.5 bg-[#121622] border border-white/10 rounded-xl px-2.5 py-1 text-xs text-ivory-200 hover:border-white/25 transition-all"
            >
              <Layers className="w-3.5 h-3.5 text-ivory-muted" />
              <span>{windowFilter}</span>
              <ChevronDown className="w-3 h-3 text-ivory-muted" />
            </button>

            {isWindowDropdownOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-[#121622] border border-white/15 rounded-xl p-1 shadow-2xl z-30 space-y-0.5">
                {['Current Window', 'Window 2', 'All Windows'].map((win) => (
                  <button
                    key={win}
                    onClick={() => {
                      setWindowFilter(win);
                      setIsWindowDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      windowFilter === win
                        ? 'bg-white/10 text-white font-medium'
                        : 'text-ivory-muted hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {win}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Select All Checkbox */}
          <label className="flex items-center gap-1.5 cursor-pointer text-ivory-muted/80 hover:text-ivory-100 select-none">
            <input
              type="checkbox"
              checked={
                filteredTabs.length > 0 &&
                selectedTabIds.size === filteredTabs.length
              }
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="rounded bg-white/10 border-white/20 text-gold focus:ring-0 w-3.5 h-3.5"
            />
            <span className="text-[11px]">Select All</span>
          </label>

          {/* Grid / List Toggle */}
          <div className="flex items-center bg-[#121622] border border-white/10 rounded-xl p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={`p-1 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white/15 text-white'
                  : 'text-ivory-muted hover:text-ivory-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              title="List View"
              className={`p-1 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-white/15 text-white'
                  : 'text-ivory-muted hover:text-ivory-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Tabs Content (Grid or List) */}
      <div className="flex-1 overflow-y-auto p-6 bg-[#07080a]">
        {filteredTabs.length === 0 ? (
          <div className="text-center py-16 text-xs text-ivory-muted/60">
            No tabs found matching your query or filter.
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View Layout */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTabs.map((tab) => {
              const isTarget = tab.id === selectedTargetTabId;
              const isChecked = selectedTabIds.has(tab.id);

              return (
                <div
                  key={tab.id}
                  className={`rounded-2xl border transition-all flex flex-col justify-between overflow-hidden relative group ${
                    isTarget
                      ? 'bg-[#151926] border-white/25 shadow-card-glow ring-1 ring-gold/20'
                      : 'bg-[#10131b] border-white/[0.06] hover:bg-[#131722] hover:border-white/15'
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-4 pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Checkbox */}
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectTab(tab.id)}
                          className="rounded bg-white/10 border-white/20 text-gold focus:ring-0 w-3.5 h-3.5 shrink-0"
                        />
                        {renderSiteIcon(tab.siteType)}
                        <div className="truncate">
                          <h3
                            title={tab.title}
                            className="text-xs font-semibold text-ivory-100 group-hover:text-white truncate leading-tight"
                          >
                            {tab.title}
                          </h3>
                          <p className="text-[10px] text-ivory-muted/60 truncate mt-0.5">
                            {tab.domain}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="shrink-0 flex items-center gap-1.5">
                        {renderStatusBadge(tab.status)}
                        {/* Three dots menu */}
                        <div className="relative">
                          <button
                            onClick={() =>
                              setActiveMenuTabId(
                                activeMenuTabId === tab.id ? null : tab.id
                              )
                            }
                            className="p-1 rounded-md hover:bg-white/10 text-ivory-muted hover:text-white transition-colors"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>

                          {activeMenuTabId === tab.id && (
                            <div className="absolute right-0 mt-1 w-36 bg-[#161b27] border border-white/15 rounded-xl p-1 shadow-2xl z-30 space-y-0.5 text-[11px]">
                              <button
                                onClick={() => handleToggleLock(tab.id)}
                                className="w-full text-left px-2 py-1 rounded-lg text-ivory-200 hover:bg-white/10 flex items-center gap-1.5"
                              >
                                {tab.status === 'locked' ? (
                                  <>
                                    <Unlock className="w-3 h-3 text-amber-400" />
                                    <span>Unlock Tab</span>
                                  </>
                                ) : (
                                  <>
                                    <Lock className="w-3 h-3 text-amber-400" />
                                    <span>Lock Tab</span>
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => handleCloseTab(tab.id)}
                                className="w-full text-left px-2 py-1 rounded-lg text-rose-300 hover:bg-rose-500/20 flex items-center gap-1.5"
                              >
                                <X className="w-3 h-3" />
                                <span>Close Tab</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Preview Thumbnail: Mock Browser Frame */}
                    <div className="mt-3 aspect-[16/9] rounded-xl bg-[#0c0e14] border border-white/[0.06] p-2.5 flex flex-col justify-between relative overflow-hidden group-hover:border-white/15 transition-all">
                      {/* Top URL Bar in Thumbnail */}
                      <div className="flex items-center gap-1.5 opacity-60">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                        <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                        <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                        <div className="h-2 flex-1 rounded bg-white/10 ml-1" />
                      </div>

                      {/* Perception Wireframe Indicators */}
                      <div className="space-y-1.5 my-auto">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-16 rounded bg-white/20" />
                          <div className="h-2 w-10 rounded bg-white/10" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="h-5 flex-1 rounded bg-white/[0.04] border border-white/[0.08] flex items-center justify-between px-2">
                            <span className="text-[8px] font-mono text-emerald-400">
                              {tab.elementCount} elements grounded
                            </span>
                            {tab.piiShielded && (
                              <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[9px] text-ivory-muted/50 font-mono">
                        <span>{tab.windowName}</span>
                        <span>{tab.lastUpdated}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Use for Agent Button */}
                  <div className="p-3 pt-0 flex items-center justify-between">
                    <button
                      onClick={() => onSelectTargetTab(tab.id)}
                      className={`w-full py-1.5 px-3 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                        isTarget
                          ? 'bg-gradient-to-r from-[#e7d9bf] via-[#f3ebe0] to-[#fbf8f2] text-black font-semibold shadow-[0_0_12px_rgba(240,230,210,0.25)]'
                          : 'bg-white/[0.05] hover:bg-white/10 text-ivory-200 border border-white/10'
                      }`}
                    >
                      {isTarget ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 fill-black text-ivory-100" />
                          <span>Active Agent Target</span>
                        </>
                      ) : (
                        <>
                          <span>Use for Agent</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View Layout */
          <div className="space-y-2">
            {filteredTabs.map((tab) => {
              const isTarget = tab.id === selectedTargetTabId;
              const isChecked = selectedTabIds.has(tab.id);

              return (
                <div
                  key={tab.id}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between group ${
                    isTarget
                      ? 'bg-[#151926] border-white/25 shadow-card-glow ring-1 ring-gold/20'
                      : 'bg-[#10131b] border-white/[0.06] hover:bg-[#131722] hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-4">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleSelectTab(tab.id)}
                      className="rounded bg-white/10 border-white/20 text-gold focus:ring-0 w-3.5 h-3.5 shrink-0"
                    />
                    {renderSiteIcon(tab.siteType)}
                    <div className="truncate">
                      <div className="text-xs font-semibold text-ivory-100 group-hover:text-white truncate">
                        {tab.title}
                      </div>
                      <div className="text-[10px] text-ivory-muted/60 truncate flex items-center gap-2 mt-0.5">
                        <span>{tab.domain}</span>
                        <span>•</span>
                        <span className="font-mono text-emerald-400">
                          {tab.elementCount} elements
                        </span>
                        {tab.piiShielded && (
                          <span className="text-emerald-400 flex items-center gap-0.5">
                            <ShieldCheck className="w-2.5 h-2.5" /> PII Shielded
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {renderStatusBadge(tab.status)}

                    <button
                      onClick={() => onSelectTargetTab(tab.id)}
                      className={`py-1 px-3 rounded-xl text-xs font-medium transition-all ${
                        isTarget
                          ? 'bg-gradient-to-r from-[#e7d9bf] via-[#f3ebe0] to-[#fbf8f2] text-black font-semibold shadow-md'
                          : 'bg-white/[0.05] hover:bg-white/10 text-ivory-200 border border-white/10'
                      }`}
                    >
                      {isTarget ? 'Active Target' : 'Use for Agent'}
                    </button>

                    <button
                      onClick={() => handleCloseTab(tab.id)}
                      title="Close tab"
                      className="p-1 rounded-lg hover:bg-white/10 text-ivory-muted hover:text-rose-300 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
