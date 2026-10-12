import React, { useState, useMemo } from 'react';
import {
  Search,
  Calendar,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  ExternalLink,
  Shield,
  FileText,
  Clock,
  CheckCircle2,
  Globe,
  GraduationCap,
  MessageSquare,
  Activity,
  CheckSquare,
  Camera,
  Layers,
} from 'lucide-react';
import {
  DetailTabType,
  HistoryTaskItem,
  TaskStatus,
} from '@/shared/types';

export const HistoryView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('All time');
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('task-1');
  const [activeDetailTab, setActiveDetailTab] = useState<DetailTabType>('overview');

  // Realistic mock history items matching reference image
  const initialHistoryItems: HistoryTaskItem[] = [
    {
      id: 'task-1',
      title: 'Find security issues',
      url: 'github.com/microsoft/vscode',
      siteType: 'github',
      status: 'Completed',
      time: '2:14 PM',
      dateGroup: 'Today',
      fullTimestamp: 'Today, 2:14 PM',
      summary:
        'I found 14 open security-related issues in the Microsoft VS Code repository and summarized the key details.',
      metrics: {
        issuesFound: 14,
        highSeverity: 3,
        completionTime: '2m 14s',
        taskSuccess: '100%',
        piiRedacted: 0,
      },
      keyResults: [
        {
          id: 'res-1',
          title: 'Potential XSS in Markdown Preview',
          tags: ['security', 'xss', 'markdown'],
          severity: 'High',
        },
        {
          id: 'res-2',
          title: 'Extension can access sensitive file paths',
          tags: ['security', 'extension', 'filesystem'],
          severity: 'Medium',
        },
        {
          id: 'res-3',
          title: 'Improper CSP configuration',
          tags: ['security', 'csp', 'webview'],
          severity: 'Medium',
        },
      ],
      targetTab: {
        title: 'GitHub — Issues',
        url: 'github.com/microsoft/vscode',
      },
      conversationSnippets: [
        {
          role: 'user',
          text: 'Find open security issues in microsoft/vscode repo and categorize their severity.',
          time: '2:12 PM',
        },
        {
          role: 'agent',
          text: 'Navigated to github.com/microsoft/vscode/issues with filter "is:issue is:open label:security". Found 14 matching tickets and analyzed potential impact.',
          time: '2:14 PM',
        },
      ],
      actionsTrace: [
        { stage: 'SEE', detail: 'Perception identified 28 UI elements (search input, filters, issue list).', status: 'ok' },
        { stage: 'PROTECT', detail: 'Local privacy policy verified: Public open-source repository, 0 PII leaks.', status: 'ok' },
        { stage: 'REASON', detail: 'Server reasoner determined filter query "label:security" and parsed list.', status: 'ok' },
        { stage: 'ACT', detail: 'Local executor typed query and clicked submit button with tab lock.', status: 'ok' },
        { stage: 'VERIFY', detail: 'Post-action frame captured: Verified issue listing matches filter criteria.', status: 'ok' },
      ],
    },
    {
      id: 'task-2',
      title: 'Summarize video content',
      url: 'youtube.com',
      siteType: 'youtube',
      status: 'Completed',
      time: '11:32 AM',
      dateGroup: 'Today',
      fullTimestamp: 'Today, 11:32 AM',
      summary:
        'Extracted automated transcript, parsed core topics, and structured a 5-point executive summary without storing user watch history.',
      metrics: {
        issuesFound: 5,
        highSeverity: 0,
        completionTime: '1m 08s',
        taskSuccess: '100%',
        piiRedacted: 1,
      },
      keyResults: [
        {
          id: 'res-4',
          title: 'Core architecture overview & benchmarks',
          tags: ['summary', 'benchmarks'],
          severity: 'Low',
        },
        {
          id: 'res-5',
          title: 'Key takeaways and roadmap highlights',
          tags: ['roadmap', 'highlights'],
          severity: 'Low',
        },
      ],
      targetTab: {
        title: 'YouTube — Tech Talk',
        url: 'youtube.com/watch?v=demo',
      },
    },
    {
      id: 'task-3',
      title: 'Fill college application form',
      url: 'university.edu',
      siteType: 'doc',
      status: 'Paused',
      time: '10:18 AM',
      dateGroup: 'Today',
      fullTimestamp: 'Today, 10:18 AM',
      summary:
        'Form fields identified and grounded. Execution paused to request user authorization before submitting profile details.',
      metrics: {
        issuesFound: 8,
        highSeverity: 1,
        completionTime: '45s',
        taskSuccess: 'Paused',
        piiRedacted: 4,
      },
      keyResults: [
        {
          id: 'res-6',
          title: 'User confirmation required for final submit',
          tags: ['auth', 'user-approval', 'form'],
          severity: 'Medium',
        },
      ],
      targetTab: {
        title: 'University Portal — Application',
        url: 'university.edu/admissions',
      },
    },
    {
      id: 'task-4',
      title: 'Compare laptop prices',
      url: 'amazon.in',
      siteType: 'globe',
      status: 'Completed',
      time: '9:05 AM',
      dateGroup: 'Today',
      fullTimestamp: 'Today, 9:05 AM',
      summary:
        'Extracted pricing specifications across 4 models and structured a comparison matrix of RAM, processor, and battery ratings.',
      metrics: {
        issuesFound: 4,
        highSeverity: 0,
        completionTime: '1m 42s',
        taskSuccess: '100%',
        piiRedacted: 0,
      },
      keyResults: [
        {
          id: 'res-7',
          title: 'Lowest price detected on model B',
          tags: ['shopping', 'price-check'],
          severity: 'Low',
        },
      ],
      targetTab: {
        title: 'Amazon.in — Laptops',
        url: 'amazon.in/laptops',
      },
    },
    {
      id: 'task-5',
      title: 'Analyze research paper',
      url: 'arxiv.org',
      siteType: 'globe',
      status: 'Completed',
      time: '6:20 PM',
      dateGroup: 'Yesterday',
      fullTimestamp: 'Yesterday, 6:20 PM',
      summary:
        'Analyzed PDF paper abstract and methodology sections. Synthesized experimental contributions into structured bullet points.',
      metrics: {
        issuesFound: 6,
        highSeverity: 0,
        completionTime: '2m 02s',
        taskSuccess: '100%',
        piiRedacted: 0,
      },
      keyResults: [
        {
          id: 'res-8',
          title: 'Theoretical model convergence proof',
          tags: ['arxiv', 'deep-learning'],
          severity: 'Low',
        },
      ],
      targetTab: {
        title: 'arXiv — Paper Abstract',
        url: 'arxiv.org/abs/2409.1234',
      },
    },
    {
      id: 'task-6',
      title: 'Review pull requests',
      url: 'github.com',
      siteType: 'github',
      status: 'Completed',
      time: '4:11 PM',
      dateGroup: 'Yesterday',
      fullTimestamp: 'Yesterday, 4:11 PM',
      summary:
        'Reviewed 3 open pull requests, checked automated test statuses, and flagged merge conflict dependencies.',
      metrics: {
        issuesFound: 3,
        highSeverity: 1,
        completionTime: '1m 20s',
        taskSuccess: '100%',
        piiRedacted: 0,
      },
      keyResults: [
        {
          id: 'res-9',
          title: 'CI test suite failure on PR #412',
          tags: ['ci', 'tests', 'failing'],
          severity: 'High',
        },
      ],
      targetTab: {
        title: 'GitHub — Pull Requests',
        url: 'github.com/pulls',
      },
    },
    {
      id: 'task-7',
      title: 'Find best learning resources',
      url: 'youtube.com',
      siteType: 'youtube',
      status: 'Completed',
      time: '12:03 PM',
      dateGroup: 'Yesterday',
      fullTimestamp: 'Yesterday, 12:03 PM',
      summary:
        'Compiled high-rating tutorials with timestamps, code links, and course summaries for React & TypeScript full-stack mastery.',
      metrics: {
        issuesFound: 7,
        highSeverity: 0,
        completionTime: '1m 55s',
        taskSuccess: '100%',
        piiRedacted: 0,
      },
      keyResults: [
        {
          id: 'res-10',
          title: 'Top-ranked comprehensive playlist identified',
          tags: ['tutorials', 'courses'],
          severity: 'Low',
        },
      ],
      targetTab: {
        title: 'YouTube — Tutorials',
        url: 'youtube.com/results',
      },
    },
    {
      id: 'task-8',
      title: 'Summarize Python documentation',
      url: 'docs.python.org',
      siteType: 'doc',
      status: 'Completed',
      time: '8:44 PM',
      dateGroup: 'Sep 20, 2026',
      fullTimestamp: 'Sep 20, 2026, 8:44 PM',
      summary:
        'Extracted asyncio task groups and exception groups specifications and created a cheat sheet.',
      metrics: {
        issuesFound: 5,
        highSeverity: 0,
        completionTime: '1m 30s',
        taskSuccess: '100%',
        piiRedacted: 0,
      },
      keyResults: [
        {
          id: 'res-11',
          title: 'TaskGroup exception handling best practices',
          tags: ['python', 'asyncio'],
          severity: 'Low',
        },
      ],
      targetTab: {
        title: 'Python Documentation',
        url: 'docs.python.org/3/library/asyncio',
      },
    },
    {
      id: 'task-9',
      title: 'Extract data from website',
      url: 'example.com',
      siteType: 'globe',
      status: 'Failed',
      time: '3:27 PM',
      dateGroup: 'Sep 20, 2026',
      fullTimestamp: 'Sep 20, 2026, 3:27 PM',
      summary:
        'Target element table was obscured by an unrecognized anti-bot CAPTCHA layer. Aborted locally to prevent false action execution.',
      metrics: {
        issuesFound: 0,
        highSeverity: 2,
        completionTime: '18s',
        taskSuccess: 'Failed',
        piiRedacted: 0,
      },
      keyResults: [
        {
          id: 'res-12',
          title: 'CAPTCHA barrier blocked automated navigation',
          tags: ['blocked', 'captcha', 'security'],
          severity: 'High',
        },
      ],
      targetTab: {
        title: 'Example Domain',
        url: 'example.com/data',
      },
    },
  ];

  // Filter items by search query and time range
  const filteredItems = useMemo(() => {
    return initialHistoryItems.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.url.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (timeFilter === 'Today') return item.dateGroup === 'Today';
      if (timeFilter === 'Yesterday') return item.dateGroup === 'Yesterday';
      if (timeFilter === 'Past 7 days') return item.dateGroup === 'Today' || item.dateGroup === 'Yesterday';
      return true;
    });
  }, [searchQuery, timeFilter]);

  // Group items by dateGroup
  const groupedItems = useMemo(() => {
    const groups: { [key: string]: HistoryTaskItem[] } = {};
    filteredItems.forEach((item) => {
      if (!groups[item.dateGroup]) {
        groups[item.dateGroup] = [];
      }
      groups[item.dateGroup].push(item);
    });
    return groups;
  }, [filteredItems]);

  const selectedTask =
    initialHistoryItems.find((t) => t.id === selectedTaskId) || initialHistoryItems[0];

  const renderSiteIcon = (type: HistoryTaskItem['siteType']) => {
    switch (type) {
      case 'github':
        return (
          <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </div>
        );
      case 'youtube':
        return (
          <div className="w-7 h-7 rounded-md bg-[#e60000] flex items-center justify-center text-white shrink-0">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </div>
        );
      case 'doc':
        return (
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-ivory-200 shrink-0">
            <FileText className="w-4 h-4" />
          </div>
        );
      case 'portal':
        return (
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-ivory-200 shrink-0">
            <GraduationCap className="w-4 h-4" />
          </div>
        );
      case 'globe':
      default:
        return (
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-ivory-200 shrink-0">
            <Globe className="w-4 h-4" />
          </div>
        );
    }
  };

  const renderStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/25">
            Completed
          </span>
        );
      case 'Paused':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#f59e0b]/15 text-[#fbbf24] border border-[#f59e0b]/25">
            Paused
          </span>
        );
      case 'Failed':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#ef4444]/15 text-[#f87171] border border-[#ef4444]/25">
            Failed
          </span>
        );
    }
  };

  const renderSeverityBadge = (severity: 'High' | 'Medium' | 'Low') => {
    switch (severity) {
      case 'High':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#ef4444]/15 text-[#f87171] border border-[#ef4444]/25">
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#f59e0b]/15 text-[#fbbf24] border border-[#f59e0b]/25">
            Medium
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/25">
            Low
          </span>
        );
    }
  };

  const handleOpenTab = (url: string) => {
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
      chrome.tabs.create({ url: fullUrl });
    } else {
      window.open(fullUrl, '_blank');
    }
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-[#07080a] text-ivory-100 font-sans overflow-hidden">
      {/* Top Header Bar from Reference */}
      <header className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-white/[0.06] shrink-0 bg-[#07080a]">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white font-sans">
            History
          </h1>
          <p className="text-xs text-ivory-muted/70 mt-0.5">
            Your past tasks and conversations
          </p>
        </div>

        {/* Right Search & Filter Controls */}
        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-ivory-muted/60 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history..."
              className="w-56 bg-[#11141d] border border-white/10 rounded-full pl-9 pr-3.5 py-1.5 text-xs text-ivory-100 placeholder:text-ivory-muted/50 outline-none focus:border-white/25 transition-all"
            />
          </div>

          {/* Time Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
              className="flex items-center gap-2 bg-[#11141d] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-ivory-200 hover:border-white/25 transition-all"
            >
              <Calendar className="w-3.5 h-3.5 text-ivory-muted" />
              <span>{timeFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-ivory-muted" />
            </button>

            {isTimeDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-36 bg-[#121622] border border-white/15 rounded-xl p-1 shadow-2xl z-30 space-y-0.5">
                {['All time', 'Today', 'Yesterday', 'Past 7 days'].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setTimeFilter(option);
                      setIsTimeDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      timeFilter === option
                        ? 'bg-white/10 text-white font-medium'
                        : 'text-ivory-muted hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Two-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Grouped History List */}
        <div className="w-[380px] border-r border-white/[0.06] overflow-y-auto p-4 space-y-5 shrink-0 bg-[#07080a]">
          {Object.keys(groupedItems).length === 0 ? (
            <div className="text-center py-12 text-xs text-ivory-muted/60">
              No tasks match your search or filter.
            </div>
          ) : (
            Object.entries(groupedItems).map(([dateGroup, items]) => (
              <div key={dateGroup}>
                <div className="text-[11px] font-medium text-ivory-muted/60 px-1 mb-2">
                  {dateGroup}
                </div>

                <div className="space-y-1.5">
                  {items.map((item) => {
                    const isSelected = item.id === selectedTaskId;

                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedTaskId(item.id)}
                        className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between group ${
                          isSelected
                            ? 'bg-[#181c27] border border-white/20 shadow-card-glow'
                            : 'bg-[#10131b]/80 border border-white/[0.05] hover:bg-[#141824] hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 pr-2">
                          {renderSiteIcon(item.siteType)}
                          <div className="truncate">
                            <div className="text-xs font-semibold text-ivory-100 group-hover:text-white truncate">
                              {item.title}
                            </div>
                            <div className="text-[10px] text-ivory-muted/60 truncate mt-0.5">
                              {item.url}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          <div className="flex flex-col items-end">
                            {renderStatusBadge(item.status)}
                            <span className="text-[9px] text-ivory-muted/50 mt-1">
                              {item.time}
                            </span>
                          </div>
                          <ChevronRight
                            className={`w-3.5 h-3.5 transition-transform ${
                              isSelected
                                ? 'text-ivory-100 translate-x-0.5'
                                : 'text-ivory-muted/40 group-hover:text-ivory-muted'
                            }`}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Selected Task Details */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#0a0c11]">
          {selectedTask && (
            <div className="max-w-2xl mx-auto space-y-5">
              {/* Task Header Card */}
              <div className="flex items-start justify-between pb-2">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-[#141824] border border-white/10 flex items-center justify-center">
                    {renderSiteIcon(selectedTask.siteType)}
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-white">
                      {selectedTask.title}
                    </h2>
                    <p className="text-xs text-ivory-muted/70 mt-0.5">
                      {selectedTask.url}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    {renderStatusBadge(selectedTask.status)}
                    <span className="text-[10px] text-ivory-muted/50 mt-1">
                      {selectedTask.fullTimestamp}
                    </span>
                  </div>
                  <button
                    title="Task options"
                    className="p-1 rounded-lg hover:bg-white/5 text-ivory-muted hover:text-white transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Detail Navigation Tabs */}
              <div className="flex items-center gap-6 border-b border-white/[0.08] pb-1 text-xs">
                {[
                  { id: 'overview' as DetailTabType, label: 'Overview', icon: Layers },
                  { id: 'conversation' as DetailTabType, label: 'Conversation', icon: MessageSquare },
                  { id: 'actions' as DetailTabType, label: 'Actions', icon: Activity },
                  { id: 'results' as DetailTabType, label: 'Results', icon: CheckSquare },
                  { id: 'screenshots' as DetailTabType, label: 'Screenshots', icon: Camera },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeDetailTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveDetailTab(tab.id)}
                      className={`flex items-center gap-1.5 pb-2.5 transition-all relative font-medium ${
                        isActive
                          ? 'text-white'
                          : 'text-ivory-muted/60 hover:text-ivory-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#e7d9bf] to-[#fbf8f2] rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content Rendering */}
              {activeDetailTab === 'overview' && (
                <div className="space-y-4 pt-1">
                  {/* Task Summary Card from Reference */}
                  <div className="p-4 rounded-2xl bg-[#11141d] border border-white/[0.07] flex items-start gap-3 shadow-panel">
                    <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-ivory-200 shrink-0 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-white">
                        Task Summary
                      </h3>
                      <p className="text-xs text-ivory-200/80 leading-relaxed mt-1">
                        {selectedTask.summary}
                      </p>
                    </div>
                  </div>

                  {/* Metrics 4-Card Grid from Reference */}
                  <div className="grid grid-cols-4 gap-2.5">
                    {/* Metric 1: Issues found */}
                    <div className="p-3.5 rounded-2xl bg-[#11141d] border border-white/[0.06] flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center text-ivory-200 shrink-0">
                        <Shield className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-base font-semibold text-white leading-tight">
                          {selectedTask.metrics.issuesFound ?? 0}
                        </div>
                        <div className="text-[10px] text-ivory-muted/60">
                          Issues found
                        </div>
                      </div>
                    </div>

                    {/* Metric 2: High severity */}
                    <div className="p-3.5 rounded-2xl bg-[#11141d] border border-white/[0.06] flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center text-ivory-200 shrink-0">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-base font-semibold text-white leading-tight">
                          {selectedTask.metrics.highSeverity ?? 0}
                        </div>
                        <div className="text-[10px] text-ivory-muted/60">
                          High severity
                        </div>
                      </div>
                    </div>

                    {/* Metric 3: Completion time */}
                    <div className="p-3.5 rounded-2xl bg-[#11141d] border border-white/[0.06] flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center text-ivory-200 shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-base font-semibold text-white leading-tight">
                          {selectedTask.metrics.completionTime}
                        </div>
                        <div className="text-[10px] text-ivory-muted/60">
                          Completion time
                        </div>
                      </div>
                    </div>

                    {/* Metric 4: Task success */}
                    <div className="p-3.5 rounded-2xl bg-[#11141d] border border-white/[0.06] flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center text-ivory-200 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-base font-semibold text-white leading-tight">
                          {selectedTask.metrics.taskSuccess}
                        </div>
                        <div className="text-[10px] text-ivory-muted/60">
                          Task success
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Results Section from Reference */}
                  <div>
                    <h3 className="text-xs font-semibold text-ivory-muted/80 uppercase tracking-wider mb-2 px-0.5">
                      Key Results
                    </h3>

                    <div className="space-y-1.5">
                      {selectedTask.keyResults.map((result) => (
                        <div
                          key={result.id}
                          className="p-3 rounded-2xl bg-[#11141d] border border-white/[0.06] hover:border-white/12 transition-all flex items-center justify-between group"
                        >
                          <div className="space-y-1.5 min-w-0 pr-3">
                            <div className="text-xs font-medium text-ivory-100 group-hover:text-white truncate">
                              {result.title}
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {result.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 rounded-md text-[9px] font-mono bg-white/[0.04] text-ivory-muted/70 border border-white/[0.05]"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 shrink-0">
                            {renderSeverityBadge(result.severity)}
                            <ChevronRight className="w-3.5 h-3.5 text-ivory-muted/40 group-hover:text-ivory-muted" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Target Tab Section from Reference */}
                  <div>
                    <h3 className="text-xs font-semibold text-ivory-muted/80 uppercase tracking-wider mb-2 px-0.5">
                      Target Tab
                    </h3>

                    <div className="p-3 rounded-2xl bg-[#11141d] border border-white/[0.06] flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Mini browser preview thumbnail */}
                        <div className="w-12 h-8 rounded-lg bg-[#181c28] border border-white/10 flex items-center justify-center shrink-0">
                          <Globe className="w-4 h-4 text-ivory-muted/60" />
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-medium text-white truncate">
                            {selectedTask.targetTab.title}
                          </div>
                          <div className="text-[10px] text-ivory-muted/60 flex items-center gap-1 mt-0.5 truncate">
                            <span>{selectedTask.targetTab.url}</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenTab(selectedTask.targetTab.url)}
                        className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-xs text-ivory-100 flex items-center gap-1.5 transition-colors shrink-0 font-medium"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Open Tab</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Conversation Tab */}
              {activeDetailTab === 'conversation' && (
                <div className="space-y-3 pt-1">
                  {selectedTask.conversationSnippets ? (
                    selectedTask.conversationSnippets.map((snip, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-2xl border text-xs leading-relaxed ${
                          snip.role === 'user'
                            ? 'bg-[#181d29] border-white/15 text-white ml-8'
                            : 'bg-[#11141d] border-white/[0.07] text-ivory-200 mr-8'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-ivory-muted/60 mb-1 font-mono">
                          <span>{snip.role === 'user' ? 'USER REQUEST' : 'VISIONAGENT'}</span>
                          <span>{snip.time}</span>
                        </div>
                        <p>{snip.text}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-2xl bg-[#11141d] border border-white/[0.06] text-xs text-ivory-muted/70">
                      Standard execution trace for {selectedTask.title}. Sanitized prompt and responses archived locally.
                    </div>
                  )}
                </div>
              )}

              {/* Actions Tab */}
              {activeDetailTab === 'actions' && (
                <div className="space-y-2 pt-1">
                  {selectedTask.actionsTrace ? (
                    selectedTask.actionsTrace.map((act, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-[#11141d] border border-white/[0.06] flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="px-2 py-0.5 rounded-md bg-white/[0.06] text-gold-light font-mono text-[10px]">
                            {act.stage}
                          </span>
                          <span className="text-ivory-200">{act.detail}</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-mono">VERIFIED</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-2xl bg-[#11141d] border border-white/[0.06] text-xs text-ivory-muted/70">
                      Actions verified by local runtime validator. No raw clicks permitted without bounding-box perception grounding.
                    </div>
                  )}
                </div>
              )}

              {/* Results Tab */}
              {activeDetailTab === 'results' && (
                <div className="p-4 rounded-2xl bg-[#11141d] border border-white/[0.06] space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-white">Full Structured Results</h4>
                    <button
                      onClick={() => alert('Results copied to clipboard (Mock export)')}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/10 text-[11px] text-ivory-200 transition-colors"
                    >
                      Copy JSON
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-ivory-muted/80 overflow-x-auto">
{JSON.stringify(
  {
    task_id: selectedTask.id,
    target: selectedTask.url,
    status: selectedTask.status,
    metrics: selectedTask.metrics,
    findings: selectedTask.keyResults,
  },
  null,
  2
)}
                  </pre>
                </div>
              )}

              {/* Screenshots Tab */}
              {activeDetailTab === 'screenshots' && (
                <div className="p-4 rounded-2xl bg-[#11141d] border border-white/[0.06] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-white">Local Sanitized Frame Capture</h4>
                      <p className="text-[11px] text-ivory-muted/60">Raw screenshots never leave the client device.</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                      LEAK SCAN: PASSED
                    </span>
                  </div>

                  <div className="relative aspect-video rounded-xl bg-[#161a26] border border-white/10 flex flex-col items-center justify-center p-6 text-center">
                    <Camera className="w-8 h-8 text-ivory-muted/40 mb-2" />
                    <p className="text-xs text-ivory-200 font-medium">Visual Grounding Overlay</p>
                    <p className="text-[10px] text-ivory-muted/60 max-w-sm mt-1">
                      14 interactive element boxes grounded. Sensitive input fields protected with solid-fill redaction before reasoner submission.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
