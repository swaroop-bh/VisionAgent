import React from 'react';
import { MessageSquare, LayoutGrid, ShieldCheck, ArrowRight } from 'lucide-react';

export const App: React.FC = () => {
  const openSidePanel = () => {
    if (typeof chrome !== 'undefined' && chrome.sidePanel && chrome.sidePanel.open) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.sidePanel.open({ tabId: tabs[0].id });
        }
      });
    } else {
      window.open('/extension/sidepanel/index.html', '_blank');
    }
  };

  return (
    <div className="w-[360px] h-[480px] bg-[#090b10] text-[#f4efe6] p-5 flex flex-col justify-between font-sans border border-white/10 select-none">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_6px_#fff]" />
            </div>
            <span className="font-semibold text-xs tracking-widest uppercase">VisionAgent</span>
          </div>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> READY
          </span>
        </div>

        <div className="mt-5 space-y-2.5">
          <button
            onClick={openSidePanel}
            className="w-full p-3 rounded-2xl bg-gradient-to-r from-[#f0e6d2] to-[#faefe0] text-black font-semibold text-xs flex items-center justify-between hover:opacity-95 transition-all shadow-md"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span>Launch Agent Side Panel</span>
            </div>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="p-3.5 rounded-2xl bg-[#121622] border border-white/[0.08] text-xs">
            <div className="flex items-center gap-2 text-ivory-100 font-medium mb-1">
              <LayoutGrid className="w-3.5 h-3.5 text-ivory-muted" />
              <span>Active Target Tab</span>
            </div>
            <p className="text-[11px] text-ivory-muted/70">
              Select or lock tabs directly in the full Side Panel workspace.
            </p>
          </div>
        </div>
      </div>

      <div className="p-3 rounded-2xl bg-[#11141c] border border-white/[0.06] flex items-center gap-2.5 text-[11px] text-ivory-muted/80">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>Privacy boundary verified: Local perception only.</span>
      </div>
    </div>
  );
};

export default App;
