import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatCenter } from './components/ChatCenter';
import { RightPanel } from './components/RightPanel';
import { HistoryView } from './components/HistoryView';
import { TabsView } from './components/TabsView';
import { SettingsView } from './components/SettingsView';
import {
  AgentPipelineStage,
  AgentStatus,
  ChatMessage,
  NavigationTab,
  PinnedTab,
  TargetTab,
} from '@/shared/types';
import { ShieldCheck, X } from 'lucide-react';

export const App: React.FC = () => {
  const [activeNav, setActiveNav] = useState<NavigationTab>('chat');
  const [chatTitle, setChatTitle] = useState('New Chat');
  const [status, setStatus] = useState<AgentStatus>('Ready');
  const [currentStage, setCurrentStage] = useState<AgentPipelineStage | undefined>(undefined);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Pinned tabs matching the reference image exactly
  const [pinnedTabs, setPinnedTabs] = useState<PinnedTab[]>([
    {
      id: 'tab-gh',
      title: 'GitHub',
      url: 'github.com',
      iconType: 'github',
      isActive: true,
    },
    {
      id: 'tab-yt',
      title: 'YouTube',
      url: 'youtube.com',
      iconType: 'youtube',
      isActive: false,
    },
    {
      id: 'tab-univ',
      title: 'College Portal',
      url: 'university.edu',
      iconType: 'portal',
      isActive: false,
    },
    {
      id: 'tab-custom',
      title: 'Custom Site',
      url: 'example.com',
      iconType: 'globe',
      isActive: false,
    },
  ]);

  // Target tabs (chrome.tabs fallback to realistic browser tabs)
  const [targetTabs, setTargetTabs] = useState<TargetTab[]>([
    {
      id: 1,
      title: 'GitHub - Issues & Pull Requests',
      url: 'https://github.com/issues',
      isLocked: false,
    },
    {
      id: 2,
      title: 'National Scholarship Portal - Application',
      url: 'https://scholarships.gov.in/apply',
      isLocked: false,
    },
    {
      id: 3,
      title: 'Flipkart - Electronics & Laptops',
      url: 'https://flipkart.com/laptops',
      isLocked: false,
    },
  ]);

  const [selectedTabId, setSelectedTabId] = useState<number | string | null>(1);

  // Detect real Chrome tabs if running inside Chromium extension
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
      chrome.tabs.query({}, (tabs) => {
        if (tabs && tabs.length > 0) {
          const loadedTabs: TargetTab[] = tabs
            .filter((t) => t.id !== undefined && t.title)
            .map((t) => ({
              id: t.id!,
              title: t.title || 'Untitled Tab',
              url: t.url || '',
              favicon: t.favIconUrl,
              isLocked: false,
            }));
          if (loadedTabs.length > 0) {
            setTargetTabs(loadedTabs);
            setSelectedTabId(loadedTabs[0].id);
          }
        }
      });
    }
  }, []);

  const handleSelectPinnedTab = (tabId: string) => {
    setPinnedTabs((prev) =>
      prev.map((t) => ({
        ...t,
        isActive: t.id === tabId,
      }))
    );
  };

  const handleSendMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (chatTitle === 'New Chat') {
      const generated = text.slice(0, 24) + (text.length > 24 ? '...' : '');
      setChatTitle(generated);
    }

    // Lock the selected target tab during execution
    if (selectedTabId) {
      setTargetTabs((prev) =>
        prev.map((t) => (t.id === selectedTabId ? { ...t, isLocked: true } : t))
      );
    }

    // Simulate the SEE -> PROTECT -> REASON -> ACT -> VERIFY core loop
    setStatus('Seeing');
    setCurrentStage('SEE');

    setTimeout(() => {
      setStatus('Protecting');
      setCurrentStage('PROTECT');
    }, 800);

    setTimeout(() => {
      setStatus('Reasoning');
      setCurrentStage('REASON');
    }, 1600);

    setTimeout(() => {
      setStatus('Acting');
      setCurrentStage('ACT');
    }, 2400);

    setTimeout(() => {
      setStatus('Verifying');
      setCurrentStage('VERIFY');
    }, 3200);

    setTimeout(() => {
      setStatus('Ready');
      setCurrentStage(undefined);

      // Unlock tab
      if (selectedTabId) {
        setTargetTabs((prev) =>
          prev.map((t) => (t.id === selectedTabId ? { ...t, isLocked: false } : t))
        );
      }

      const agentReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: `Completed workflow for: "${text}". Perception identified the relevant interactive controls, sensitive fields were automatically redacted on-device, and actions were verified.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        stage: 'VERIFY',
        isMock: true,
        confidence: 0.96,
        elementsFound: 14,
        piiRedacted: 2,
      };

      setMessages((prev) => [...prev, agentReply]);
    }, 4000);
  };

  const handleRunQuickAction = (actionType: 'capture' | 'summarize') => {
    if (actionType === 'capture') {
      handleSendMessage('Capture current page screenshot and ground interactive bounding boxes');
    } else {
      handleSendMessage('Summarize key points on the active page without leaking sensitive data');
    }
  };

  const handleResetChat = () => {
    setMessages([]);
    setChatTitle('New Chat');
    setStatus('Ready');
    setCurrentStage(undefined);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-obsidian-950 font-sans text-ivory-100 antialiased">
      {/* 1. Left Sidebar */}
      <Sidebar
        activeNav={activeNav}
        onSelectNav={setActiveNav}
        pinnedTabs={pinnedTabs}
        onSelectPinnedTab={handleSelectPinnedTab}
        onOpenPrivacyModal={() => setShowPrivacyModal(true)}
        onAddPinnedTab={() => {
          const newPinned: PinnedTab = {
            id: 'tab-' + Date.now(),
            title: 'New Page',
            url: 'example.org',
            iconType: 'globe',
            isActive: false,
          };
          setPinnedTabs([...pinnedTabs, newPinned]);
        }}
      />

      {/* 2. Main Content Area */}
      {activeNav === 'history' ? (
        <HistoryView />
      ) : activeNav === 'tabs' ? (
        <TabsView
          selectedTargetTabId={selectedTabId}
          onSelectTargetTab={(tabId) => setSelectedTabId(tabId)}
        />
      ) : activeNav === 'settings' ? (
        <SettingsView onClearHistory={handleResetChat} />
      ) : (
        <>
          <ChatCenter
            chatTitle={chatTitle}
            onRenameTitle={setChatTitle}
            status={status}
            currentStage={currentStage}
            messages={messages}
            onSendMessage={handleSendMessage}
            onResetChat={handleResetChat}
          />
          <RightPanel
            status={status}
            currentStage={currentStage}
            targetTabs={targetTabs}
            selectedTabId={selectedTabId}
            onSelectTargetTab={setSelectedTabId}
            onRunQuickAction={handleRunQuickAction}
          />
        </>
      )}

      {/* Privacy Guarantee Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#121622] border border-white/10 rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="absolute top-5 right-5 text-ivory-muted hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold-light">
                <ShieldCheck className="w-6 h-6 text-ivory-200" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-ivory-100">Privacy Boundary Guarantee</h3>
                <p className="text-xs text-ivory-muted/70">Local-first on-device enforcement</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-ivory-200 leading-relaxed mb-6">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <strong className="text-white block mb-1">Local Perception & Redaction:</strong>
                Screenshots, DOM metadata, OCR tokens, and sensitive values (passwords, emails, phone numbers) are processed 100% locally on your machine.
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <strong className="text-white block mb-1">Independent Leak Scanner:</strong>
                Before anything crosses the network boundary, an independent sanitizer verifies zero raw PII is present. Only abstract schema context is transmitted.
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <strong className="text-white block mb-1">Local Credential Store:</strong>
                Real values remain in your browser storage; the reasoner only manipulates references like <code>[EMAIL_1]</code>.
              </div>
            </div>

            <button
              onClick={() => setShowPrivacyModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#f4efe6] text-black font-medium text-xs hover:bg-white transition-all shadow-md"
            >
              Got it, keep my session safe
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
