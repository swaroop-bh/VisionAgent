import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ExternalLink,
  Eye,
  EyeOff,
  ChevronDown,
  Check,
  Image as ImageIcon,
  MessageSquare,
  Code,
  Zap,
  Shield,
  Lock,
  Monitor,
  Cpu,
  Layers,
  Database,
  AlertCircle,
  Share2,
} from 'lucide-react';
import { IntegrationProvider, IntegrationProviderId } from '@/shared/types';

interface ProviderMeta {
  id: IntegrationProviderId;
  name: string;
  tagline: string;
  docsUrl: string;
  description: string;
  isLocal?: boolean;
  defaultBaseUrl?: string;
  capabilities: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
  }[];
  models: string[];
}

const PROVIDER_METAS: ProviderMeta[] = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    tagline: 'Best for multimodal & vision',
    docsUrl: 'https://ai.google.dev/docs',
    description:
      'State-of-the-art multimodal model with strong vision and reasoning capabilities.',
    capabilities: [
      { icon: ImageIcon, label: 'Vision & Images' },
      { icon: MessageSquare, label: 'Text & Reasoning' },
      { icon: Code, label: 'Function Calling' },
      { icon: Zap, label: 'Fast Responses' },
    ],
    models: ['Gemini 3.1 Pro', 'Gemini 1.5 Pro', 'Gemini 1.5 Flash'],
  },
  {
    id: 'openai',
    name: 'OpenAI',
    tagline: 'Powerful & versatile',
    docsUrl: 'https://platform.openai.com/docs',
    description:
      'Powerful models for advanced reasoning, planning and tool use.',
    capabilities: [
      { icon: ImageIcon, label: 'Vision & Images' },
      { icon: MessageSquare, label: 'Text & Reasoning' },
      { icon: Code, label: 'Function Calling' },
      { icon: Zap, label: 'Fast Responses' },
    ],
    models: ['GPT-4o', 'GPT-4o mini', 'o1-preview'],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    tagline: 'Safe & reliable',
    docsUrl: 'https://docs.anthropic.com',
    description:
      'Claude models with excellent reasoning, DOM perception and computer safety alignment.',
    capabilities: [
      { icon: ImageIcon, label: 'Vision & Images' },
      { icon: MessageSquare, label: 'Text & Reasoning' },
      { icon: Monitor, label: 'Computer Use' },
      { icon: Shield, label: 'Safety Alignment' },
    ],
    models: ['Claude 3.5 Sonnet', 'Claude 3.5 Haiku', 'Claude 3 Opus'],
  },
  {
    id: 'groq',
    name: 'Groq',
    tagline: 'Ultra-fast inference',
    docsUrl: 'https://wow.groq.com/docs',
    description:
      'High-speed inference with open models (Llama, Mixtral) powered by LPU architecture.',
    capabilities: [
      { icon: Cpu, label: 'LPU Acceleration' },
      { icon: Zap, label: 'Fast Responses' },
      { icon: MessageSquare, label: 'Text & Reasoning' },
      { icon: Layers, label: 'Open Weights' },
    ],
    models: ['Llama 3.3 70B Versatile', 'Llama 3.2 90B Vision', 'Mixtral 8x7B'],
  },
  {
    id: 'together',
    name: 'Together AI',
    tagline: 'Open-source models',
    docsUrl: 'https://docs.together.ai',
    description:
      'Access to powerful open-source models with cost-effective serverless inference.',
    capabilities: [
      { icon: Layers, label: 'Open Weights' },
      { icon: ImageIcon, label: 'Vision & Images' },
      { icon: Code, label: 'Function Calling' },
      { icon: Zap, label: 'Fast Responses' },
    ],
    models: ['Meta-Llama 3.1 70B Instruct', 'Qwen 2.5 72B Instruct', 'Llama 3.2 11B Vision'],
  },
  {
    id: 'ollama',
    name: 'Ollama',
    tagline: 'Run models locally',
    docsUrl: 'https://ollama.com',
    description:
      'Run open-source models locally on your device with 100% data residency.',
    isLocal: true,
    defaultBaseUrl: 'http://localhost:11434',
    capabilities: [
      { icon: Shield, label: '100% On-Device' },
      { icon: Lock, label: 'Zero Cloud Sync' },
      { icon: ImageIcon, label: 'Vision & Images' },
      { icon: Database, label: 'Custom GGUF' },
    ],
    models: ['llama3.2-vision:latest', 'llava:latest', 'qwen2.5:latest'],
  },
];

interface ConnectAIProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  providers: IntegrationProvider[];
  initialProviderId?: IntegrationProviderId;
  onConnect: (
    providerId: IntegrationProviderId,
    apiKey: string,
    model: string,
    baseUrl?: string
  ) => void;
}

export const ConnectAIProviderModal: React.FC<ConnectAIProviderModalProps> = ({
  isOpen,
  onClose,
  providers,
  initialProviderId = 'gemini',
  onConnect,
}) => {
  const [selectedId, setSelectedId] = useState<IntegrationProviderId>(initialProviderId);
  const [apiKey, setApiKey] = useState('');
  const [endpointUrl, setEndpointUrl] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync state whenever selectedId changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedId(initialProviderId);
    }
  }, [isOpen, initialProviderId]);

  const currentMeta =
    PROVIDER_METAS.find((p) => p.id === selectedId) || PROVIDER_METAS[0];
  const existingProvider = providers.find((p) => p.id === selectedId);

  useEffect(() => {
    if (existingProvider) {
      setApiKey(existingProvider.apiKey === '••••••••••••••••' ? '' : existingProvider.apiKey || '');
      setEndpointUrl(existingProvider.baseUrl || currentMeta.defaultBaseUrl || '');
      setSelectedModel(existingProvider.activeModel?.replace(' (Default)', '') || currentMeta.models[0]);
    } else {
      setApiKey('');
      setEndpointUrl(currentMeta.defaultBaseUrl || '');
      setSelectedModel(currentMeta.models[0]);
    }
    setTestStatus(null);
    setValidationError(null);
    setIsModelDropdownOpen(false);
  }, [selectedId, existingProvider, currentMeta]);

  // Keyboard navigation & accessibility
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const renderIcon = (id: IntegrationProviderId, size: 'sm' | 'lg' = 'sm') => {
    const isLg = size === 'lg';
    const dim = isLg ? 'w-10 h-10' : 'w-5 h-5';

    switch (id) {
      case 'gemini':
        return (
          <svg className={`${dim} shrink-0`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 2C12 7.52285 7.52285 12 2 12C7.52285 12 12 16.4771 12 22C12 16.4771 16.4771 12 22 12C16.4771 12 12 7.52285 12 2Z"
              fill="url(#modalGeminiGrad)"
            />
            <defs>
              <linearGradient
                id="modalGeminiGrad"
                x1="2"
                y1="2"
                x2="22"
                y2="22"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4da9ff" />
                <stop offset="0.5" stopColor="#9b62ff" />
                <stop offset="1" stopColor="#ff629e" />
              </linearGradient>
            </defs>
          </svg>
        );
      case 'openai':
        return (
          <svg className={`${dim} shrink-0 fill-white`} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1683a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4947zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1683a.0757.0757 0 0 1-.071 0l-4.8303-2.7866A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.7948.7948 0 0 0-.407-.6669zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1635a.0804.0804 0 0 1-.038-.0567V6.0748a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.4598a.7948.7948 0 0 0-.3927.6813l-.0048 6.7219zm1.1449-1.9775l2.5484-1.4725 2.5531 1.4725v2.9304l-2.5484 1.4725-2.5531-1.4725z" />
          </svg>
        );
      case 'anthropic':
        return (
          <div
            className={`${dim} rounded-xl bg-[#241d1a] border border-[#e07a5f]/40 flex items-center justify-center font-serif font-black text-[#e07a5f] ${
              isLg ? 'text-lg' : 'text-xs'
            } shrink-0 shadow-sm`}
            aria-hidden="true"
          >
            A\
          </div>
        );
      case 'groq':
        return (
          <div
            className={`${dim} rounded-xl bg-[#f55036] flex items-center justify-center font-bold text-white ${
              isLg ? 'text-base' : 'text-[11px]'
            } font-mono shrink-0 shadow-sm`}
            aria-hidden="true"
          >
            g
          </div>
        );
      case 'together':
        return (
          <svg className={`${dim} text-[#818cf8] shrink-0 fill-current`} viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="5" cy="6" r="2.5" />
            <circle cx="19" cy="6" r="2.5" />
            <circle cx="12" cy="12" r="2.5" />
            <circle cx="5" cy="18" r="2.5" />
            <circle cx="19" cy="18" r="2.5" />
            <path
              d="M5 6L12 12L19 6M5 18L12 12L19 18"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        );
      case 'ollama':
        return (
          <svg
            className={`${dim} shrink-0 stroke-white fill-none`}
            viewBox="0 0 24 24"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M8 3v4M16 3v4M8 7h8a2 2 0 0 1 2 2v9a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V9a2 2 0 0 1 2-2z" />
            <circle cx="10" cy="12" r="1" fill="white" />
            <circle cx="14" cy="12" r="1" fill="white" />
            <path d="M10 16h4" />
          </svg>
        );
    }
  };

  const handleTestConnection = () => {
    setValidationError(null);

    if (currentMeta.isLocal) {
      if (!endpointUrl.trim()) {
        setValidationError('Endpoint URL is required to test connection.');
        return;
      }
    } else {
      if (!apiKey.trim() && (!existingProvider || !existingProvider.apiKey)) {
        setValidationError(`API Key is required to test ${currentMeta.name}.`);
        return;
      }
    }

    setIsTesting(true);
    setTestStatus(null);

    // Realistic behavior: Never report false positive success if actual backend is absent
    setTimeout(() => {
      setIsTesting(false);
      setTestStatus('Demo only — backend integration required.');
    }, 600);
  };

  const handleConnect = () => {
    setValidationError(null);

    if (currentMeta.isLocal) {
      if (!endpointUrl.trim()) {
        setValidationError('Please specify a valid local endpoint URL (e.g. http://localhost:11434).');
        return;
      }
    } else {
      const activeKey = apiKey.trim() || (existingProvider?.apiKey !== '••••••••••••••••' ? existingProvider?.apiKey : '');
      if (!activeKey) {
        setValidationError(`Please enter a valid API key for ${currentMeta.name}.`);
        return;
      }
    }

    onConnect(
      selectedId,
      currentMeta.isLocal ? '' : (apiKey.trim() || existingProvider?.apiKey || '••••••••••••••••'),
      selectedModel,
      currentMeta.isLocal ? endpointUrl.trim() : undefined
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="connect-provider-modal-title"
      aria-describedby="connect-provider-modal-desc"
    >
      {/* Modal Container */}
      <div
        ref={modalRef}
        className="w-full max-w-2xl bg-[#0e111a] border border-white/10 rounded-2xl shadow-2xl p-6 relative text-white"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/[0.06]">
          <div>
            <h2 id="connect-provider-modal-title" className="text-base font-semibold text-white">
              Connect AI Provider
            </h2>
            <p id="connect-provider-modal-desc" className="text-xs text-ivory-muted/70 mt-0.5">
              Add your API credentials to start using this provider with VisionAgent.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-ivory-muted hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Two-Column Body */}
        <div className="grid grid-cols-[220px_1fr] gap-4 py-4">
          {/* Left Column: Selectable Providers */}
          <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
            {PROVIDER_METAS.map((p) => {
              const isSelected = p.id === selectedId;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className={`w-full text-left p-2.5 rounded-xl flex items-center gap-2.5 transition-all relative ${
                    isSelected
                      ? 'border border-[#d4af37]/70 bg-white/[0.04] shadow-[0_0_12px_rgba(212,175,55,0.1)]'
                      : 'border border-white/[0.04] bg-transparent hover:bg-white/[0.02] hover:border-white/10'
                  }`}
                >
                  <div className="shrink-0">{renderIcon(p.id, 'sm')}</div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-white truncate">
                      {p.name}
                    </div>
                    <div className="text-[10px] text-ivory-muted/60 truncate mt-0.5">
                      {p.tagline}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Panel: Provider Details & Configuration */}
          <div className="p-4 rounded-xl bg-[#121520] border border-white/[0.06] space-y-4">
            {/* Provider Summary & Docs */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="shrink-0 pt-0.5">{renderIcon(currentMeta.id, 'lg')}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white">{currentMeta.name}</h3>
                  </div>
                  <p className="text-xs text-ivory-muted/70 leading-relaxed mt-1">
                    {currentMeta.description}
                  </p>
                </div>
              </div>

              <a
                href={currentMeta.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.06] text-ivory-muted hover:text-white px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1.5 transition-colors"
                aria-label={`View ${currentMeta.name} documentation (opens in a new tab)`}
              >
                <span>Docs</span>
                <ExternalLink className="w-3 h-3 text-ivory-muted/80" />
              </a>
            </div>

            {/* Capability Badges */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {currentMeta.capabilities.map((cap, idx) => {
                const IconComp = cap.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03] border border-white/[0.05]"
                  >
                    <IconComp className="w-3.5 h-3.5 text-ivory-muted/80 shrink-0" />
                    <span className="text-[11px] font-medium text-ivory-100">{cap.label}</span>
                  </div>
                );
              })}
            </div>

            {/* API Configuration */}
            <div className="space-y-3 pt-1 border-t border-white/[0.06]">
              <h4 className="text-xs font-semibold text-white">API Configuration</h4>

              {/* API Key / Endpoint input */}
              <div>
                <label
                  htmlFor="provider-credential-input"
                  className="text-[11px] text-ivory-muted/70 block mb-1 font-medium"
                >
                  {currentMeta.isLocal ? 'Endpoint URL' : 'API Key'}
                </label>
                <div className="relative">
                  <input
                    id="provider-credential-input"
                    ref={inputRef}
                    type={showKey || currentMeta.isLocal ? 'text' : 'password'}
                    value={currentMeta.isLocal ? endpointUrl : apiKey}
                    onChange={(e) => {
                      if (currentMeta.isLocal) {
                        setEndpointUrl(e.target.value);
                      } else {
                        setApiKey(e.target.value);
                      }
                      if (validationError) setValidationError(null);
                    }}
                    placeholder={
                      currentMeta.isLocal
                        ? 'http://localhost:11434'
                        : existingProvider?.apiKey
                        ? '••••••••••••••••••••••••••••••••'
                        : 'Enter API key (e.g. sk-...)'
                    }
                    className={`w-full bg-black/40 border rounded-xl pl-3 pr-9 py-2 text-xs font-mono text-white focus:outline-none transition-all ${
                      validationError ? 'border-rose-500/50' : 'border-white/10 focus:border-white/20'
                    }`}
                  />
                  {!currentMeta.isLocal && (
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      aria-label={showKey ? 'Hide API key' : 'Show API key'}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ivory-muted hover:text-white"
                    >
                      {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-ivory-muted/50 mt-1">
                  {currentMeta.isLocal
                    ? 'Local Ollama endpoint must be accessible via HTTP (e.g. http://localhost:11434).'
                    : 'Your API key is encrypted and stored securely on this device.'}
                </p>
              </div>

              {/* Model Dropdown */}
              <div>
                <label className="text-[11px] text-ivory-muted/70 block mb-1 font-medium">
                  Model
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white flex items-center justify-between hover:border-white/20 transition-all"
                  >
                    <span>{selectedModel}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-ivory-muted" />
                  </button>

                  {isModelDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-1 bg-[#161a26] border border-white/15 rounded-xl p-1 shadow-2xl z-30 space-y-0.5 text-xs">
                      {currentMeta.models.map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => {
                            setSelectedModel(m);
                            setIsModelDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                            selectedModel === m
                              ? 'bg-white/10 text-white font-medium'
                              : 'text-ivory-muted hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <span>{m}</span>
                          {selectedModel === m && <Check className="w-3 h-3 text-gold-light" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-ivory-muted/50 mt-1">
                  Choose the model you want to use.
                </p>
              </div>

              {/* Test Connection Button & Status */}
              <div className="pt-1 flex flex-col gap-2">
                <div>
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    className="inline-flex items-center gap-2 border border-white/10 hover:border-white/20 bg-[#161a26] hover:bg-[#1d2232] text-xs font-medium text-white px-3.5 py-1.5 rounded-xl transition-all shadow-sm disabled:opacity-50"
                  >
                    <Share2 className="w-3.5 h-3.5 text-ivory-muted" />
                    <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
                  </button>
                </div>

                {testStatus && (
                  <div className="text-[10px] text-amber-300/90 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{testStatus}</span>
                  </div>
                )}

                {validationError && (
                  <div className="text-[10px] text-rose-300 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.06]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-white/10 hover:border-white/20 text-ivory-muted hover:text-white transition-all text-xs font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConnect}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#e7d9bf] to-[#f4efe6] hover:brightness-105 text-black font-semibold text-xs shadow-md transition-all"
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};
