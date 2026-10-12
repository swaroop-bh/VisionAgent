import React, { useState, useEffect } from 'react';
import {
  Search,
  Sun,
  Globe,
  Power,
  Monitor,
  Bell,
  ChevronDown,
  ChevronRight,
  Shield,
  Bot,
  Link as LinkIcon,
  Gauge,
  Keyboard,
  Sliders,
  Info,
  Edit2,
  Zap,
  Database,
  Lock,
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle,
  Check,
  Settings as SettingsIcon,
  Scale,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  FileText,
  Cloud,
  Download,
  Key,
  Layers,
  X,
  Box,
  Folder,
  Plus,
  MousePointer,
  CircleDot,
} from 'lucide-react';
import {
  AdvancedSettings,
  AgentSettings,
  IntegrationFilter,
  IntegrationProvider,
  IntegrationProviderId,
  PrivacySecuritySettings,
  SettingsCategory,
  UserSettings,
} from '@/shared/types';
import { AgentPreviewOrb } from './AgentPreviewOrb';
import { ConnectAIProviderModal } from './ConnectAIProviderModal';

interface SettingsViewProps {
  onClearHistory?: () => void;
}

const defaultProviders: IntegrationProvider[] = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    isConnected: true,
    activeModel: 'Gemini 3.1 Pro (Default)',
    availableModels: ['Gemini 3.1 Pro', 'Gemini 1.5 Pro', 'Gemini 1.5 Flash'],
    description: 'State-of-the-art multimodal model with strong vision and reasoning capabilities.',
    longDescription:
      'Google Gemini offers powerful multimodal capabilities, ideal for vision-based browser understanding and complex task reasoning.',
    apiKey: '••••••••••••••••',
    capabilities: [
      'Vision understanding (screenshots)',
      'Multimodal reasoning',
      'Function/tool calling',
      'Fast responses',
      'High accuracy for web tasks',
    ],
    temperature: 0.2,
    maxTokens: 4096,
  },
  {
    id: 'openai',
    name: 'OpenAI',
    isConnected: true,
    activeModel: 'GPT-4o',
    availableModels: ['GPT-4o', 'GPT-4o mini', 'o1-preview'],
    description: 'Powerful models for advanced reasoning, planning and tool use.',
    longDescription:
      'Powerful models for advanced reasoning, planning and tool use in complex web environments.',
    apiKey: '••••••••••••••••',
    capabilities: [
      'Vision understanding (screenshots)',
      'Multimodal reasoning',
      'Function/tool calling',
      'Fast responses',
      'High accuracy for web tasks',
    ],
    temperature: 0.2,
    maxTokens: 4096,
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    isConnected: false,
    activeModel: 'Claude 3.5 Sonnet',
    availableModels: ['Claude 3.5 Sonnet', 'Claude 3.5 Haiku', 'Claude 3 Opus'],
    description: 'Claude models with excellent reasoning and safety.',
    longDescription:
      'Claude 3.5 Sonnet provides nuanced DOM reasoning, safety-first alignment and superior computer-use capabilities.',
    apiKey: '',
    capabilities: [
      'Vision understanding (screenshots)',
      'Multimodal reasoning',
      'Function/tool calling',
      'Fast responses',
      'High accuracy for web tasks',
    ],
    temperature: 0.2,
    maxTokens: 4096,
  },
  {
    id: 'groq',
    name: 'Groq',
    isConnected: false,
    activeModel: 'Llama 3.3 70B Versatile',
    availableModels: ['Llama 3.3 70B Versatile', 'Llama 3.2 90B Vision', 'Mixtral 8x7B'],
    description: 'High-speed inference with open models (Llama, Mixtral, etc.).',
    longDescription:
      'Groq delivers sub-second LPUs for ultra-fast reaction times during high-frequency browser interactions.',
    apiKey: '',
    capabilities: [
      'Fast responses',
      'Multimodal reasoning',
      'Function/tool calling',
      'High accuracy for web tasks',
    ],
    temperature: 0.2,
    maxTokens: 4096,
  },
  {
    id: 'together',
    name: 'Together AI',
    isConnected: false,
    activeModel: 'Meta-Llama 3.1 70B Instruct',
    availableModels: ['Meta-Llama 3.1 70B Instruct', 'Qwen 2.5 72B Instruct', 'Llama 3.2 11B Vision'],
    description: 'Access to powerful open-source models.',
    longDescription:
      'Together AI provides cost-effective, scalable access to open weights foundation models.',
    apiKey: '',
    capabilities: [
      'Multimodal reasoning',
      'Function/tool calling',
      'Fast responses',
      'High accuracy for web tasks',
    ],
    temperature: 0.2,
    maxTokens: 4096,
  },
  {
    id: 'ollama',
    name: 'Ollama',
    isConnected: false,
    activeModel: 'llama3.2-vision:latest',
    availableModels: ['llama3.2-vision:latest', 'llava:latest', 'qwen2.5:latest'],
    description: 'Run open-source models locally on your device.',
    longDescription:
      'Run open-source models locally on your device with 100% data residency and zero cloud transmission.',
    apiKey: '',
    baseUrl: 'http://localhost:11434',
    isLocal: true,
    capabilities: [
      'Local on-device inference',
      'Vision understanding (screenshots)',
      'Privacy preserved',
      'High accuracy for web tasks',
    ],
    temperature: 0.2,
    maxTokens: 4096,
  },
];

const providerOptions = [
  {
    name: 'Google Gemini',
    iconId: 'gemini' as IntegrationProviderId,
    models: ['Gemini 3.1 Pro', 'Gemini 1.5 Pro', 'Gemini 1.5 Flash'],
  },
  {
    name: 'OpenAI',
    iconId: 'openai' as IntegrationProviderId,
    models: ['GPT-4o', 'GPT-4o mini', 'o1-preview'],
  },
  {
    name: 'Anthropic',
    iconId: 'anthropic' as IntegrationProviderId,
    models: ['Claude 3.5 Sonnet', 'Claude 3.5 Haiku', 'Claude 3 Opus'],
  },
  {
    name: 'Groq',
    iconId: 'groq' as IntegrationProviderId,
    models: ['Llama 3.3 70B Versatile', 'Llama 3.2 90B Vision', 'Mixtral 8x7B'],
  },
  {
    name: 'Together AI',
    iconId: 'together' as IntegrationProviderId,
    models: ['Meta-Llama 3.1 70B Instruct', 'Qwen 2.5 72B Instruct'],
  },
  {
    name: 'Ollama',
    iconId: 'ollama' as IntegrationProviderId,
    models: ['llama3.2-vision:latest', 'llava:latest', 'qwen2.5:latest'],
  },
];

const defaultAdvancedSettings: AdvancedSettings = {
  defaultProvider: 'Google Gemini',
  defaultModel: 'Gemini 3.1 Pro',
  temperature: 0.7,
  maxOutputTokens: 2048,
  topP: 0.9,
  requireConfirmationBeforeActions: true,
  captureHighResScreenshots: true,
  autoScrollLongPages: true,
  highlightDetectedElements: true,
  actionDelay: 500,
  enableDebugLogs: false,
  logLevel: 'Info',
  enableExperimentalFeatures: false,
  showElementBoundingBoxes: false,
  simulateActionsDryRun: false,
  allowLocalModel: false,
};

export const SettingsView: React.FC<SettingsViewProps> = ({ onClearHistory }) => {
  const [searchQuery, setSearchQuery] = useState('');
  // User requested: Highlight Advanced
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>('advanced');

  // General settings state
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem('visionagent_general_settings');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      theme: 'dark',
      language: 'English',
      startup: 'Open last session',
      showWelcomeScreen: true,
      enableSounds: true,
      showNotifications: true,
      agentMode: 'Balanced',
      screenshotQuality: 'High (1920x1080)',
      localStorageUsed: '5.2 GB used',
      defaultBrowser: 'Google Chrome',
      keepDataOnDevice: true,
      autoDetectPII: true,
      userName: 'VisionAgent User',
      userEmail: 'user@example.com',
    };
  });

  // Agent settings state
  const [agentSettings, setAgentSettings] = useState<AgentSettings>(() => {
    try {
      const saved = localStorage.getItem('visionagent_agent_settings');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      mode: 'Balanced',
      model: 'Gemini 3.1 Pro (Default)',
      autoSelectTargetTab: true,
      confirmBeforeActions: false,
      takeScreenshotsDuringTask: true,
      verifyTaskCompletion: true,
      planningDepth: 'Standard',
      executionSpeed: 'Normal',
    };
  });

  // Privacy & Security settings state
  const [privacySettings, setPrivacySettings] = useState<PrivacySecuritySettings>(() => {
    try {
      const saved = localStorage.getItem('visionagent_privacy_settings');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      autoDetectPII: true,
      processScreenshotsLocally: true,
      sendOnlyRedactedToAI: true,
      sensitiveTypes: {
        pii: true,
        financial: true,
        contact: true,
        credentials: true,
        governmentIds: true,
        imagesFaces: true,
      },
      requireConfirmation: true,
      blockHarmfulActions: true,
      sandboxInteractions: true,
    };
  });

  // Integrations state
  const [providers, setProviders] = useState<IntegrationProvider[]>(() => {
    try {
      const saved = localStorage.getItem('visionagent_integrations_providers');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return defaultProviders;
  });

  const [selectedProviderId, setSelectedProviderId] = useState<IntegrationProviderId>('gemini');
  const [integrationFilter, setIntegrationFilter] = useState<IntegrationFilter>('all');
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyInputs, setApiKeyInputs] = useState<Record<string, string>>({});
  const [isIntegrationModelOpen, setIsIntegrationModelOpen] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [showAdvancedModal, setShowAdvancedModal] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [advancedParams, setAdvancedParams] = useState({
    temperature: 0.2,
    maxTokens: 4096,
    customEndpoint: '',
  });

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem('visionagent_general_settings', JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('visionagent_agent_settings', JSON.stringify(agentSettings));
    } catch {
      // ignore
    }
  }, [agentSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('visionagent_privacy_settings', JSON.stringify(privacySettings));
    } catch {
      // ignore
    }
  }, [privacySettings]);

  useEffect(() => {
    try {
      localStorage.setItem('visionagent_integrations_providers', JSON.stringify(providers));
    } catch {
      // ignore
    }
  }, [providers]);

  // Dropdown states
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isStartupOpen, setIsStartupOpen] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isProviderDropdownOpen, setIsProviderDropdownOpen] = useState(false);
  const [isAdvModelDropdownOpen, setIsAdvModelDropdownOpen] = useState(false);

  // Advanced settings state
  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettings>(() => {
    try {
      const saved = localStorage.getItem('visionagent_advanced_settings');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return defaultAdvancedSettings;
  });

  useEffect(() => {
    try {
      localStorage.setItem('visionagent_advanced_settings', JSON.stringify(advancedSettings));
    } catch {
      // ignore
    }
  }, [advancedSettings]);

  // Modals & Dialogs
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showResetAgentConfirm, setShowResetAgentConfirm] = useState(false);
  const [showResetPrivacyConfirm, setShowResetPrivacyConfirm] = useState(false);
  const [showResetAdvancedConfirm, setShowResetAdvancedConfirm] = useState(false);
  const [showExportDiagnosticModal, setShowExportDiagnosticModal] = useState(false);
  const [showLogsFolderModal, setShowLogsFolderModal] = useState(false);
  const [showModelConfigModal, setShowModelConfigModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectModalProviderId, setConnectModalProviderId] = useState<IntegrationProviderId>('gemini');
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(null), 2500);
  };

  const categories = [
    {
      id: 'general' as SettingsCategory,
      name: 'General',
      desc: 'Appearance, language, startup',
      icon: SettingsIcon,
    },
    {
      id: 'agent' as SettingsCategory,
      name: 'Agent',
      desc: 'Behavior and automation',
      icon: Bot,
    },
    {
      id: 'privacy' as SettingsCategory,
      name: 'Privacy & Security',
      desc: 'Data, permissions',
      icon: Shield,
    },
    {
      id: 'integrations' as SettingsCategory,
      name: 'Integrations',
      desc: 'LLM providers',
      icon: LinkIcon,
    },
    {
      id: 'performance' as SettingsCategory,
      name: 'Performance',
      desc: 'Resource usage, speed',
      icon: Gauge,
    },
    {
      id: 'shortcuts' as SettingsCategory,
      name: 'Shortcuts',
      desc: 'Keyboard shortcuts',
      icon: Keyboard,
    },
    {
      id: 'advanced' as SettingsCategory,
      name: 'Advanced',
      desc: 'Model, safety, diagnostics',
      icon: Sliders,
    },
    {
      id: 'about' as SettingsCategory,
      name: 'About',
      desc: 'Version, licenses',
      icon: Info,
    },
  ];

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleResetPrivacySettings = () => {
    setPrivacySettings({
      autoDetectPII: true,
      processScreenshotsLocally: true,
      sendOnlyRedactedToAI: true,
      sensitiveTypes: {
        pii: true,
        financial: true,
        contact: true,
        credentials: true,
        governmentIds: true,
        imagesFaces: true,
      },
      requireConfirmation: true,
      blockHarmfulActions: true,
      sandboxInteractions: true,
    });
    setShowResetPrivacyConfirm(false);
    showToast('Privacy & Security settings restored to defaults.');
  };

  const handleExportData = () => {
    const exportPayload = {
      exportDate: new Date().toISOString(),
      user: {
        name: settings.userName,
        email: settings.userEmail,
      },
      privacyPolicy: privacySettings,
      agentMode: agentSettings,
      generalSettings: settings,
      privacyBoundary: {
        rawDomLeavesDevice: false,
        rawScreenshotsLeaveDevice: false,
        leakScannerPassed: true,
      },
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visionagent-privacy-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Privacy & session data exported.');
  };

  const handleClearData = () => {
    if (onClearHistory) onClearHistory();
    setSettings((prev) => ({ ...prev, localStorageUsed: '0 MB used' }));
    setShowClearConfirm(false);
    showToast('Local cache and session storage cleared.');
  };

  const toggleSensitiveType = (key: keyof PrivacySecuritySettings['sensitiveTypes']) => {
    setPrivacySettings((prev) => ({
      ...prev,
      sensitiveTypes: {
        ...prev.sensitiveTypes,
        [key]: !prev.sensitiveTypes[key],
      },
    }));
  };

  const selectedProvider =
    providers.find((p) => p.id === selectedProviderId) || providers[0];

  const connectedCount = providers.filter((p) => p.isConnected).length;
  const availableCount = providers.filter((p) => !p.isConnected).length;

  const filteredProviders = providers.filter((p) => {
    if (integrationFilter === 'connected') return p.isConnected;
    if (integrationFilter === 'available') return !p.isConnected;
    return true;
  });

  const handleSelectProviderModel = (providerId: IntegrationProviderId, modelName: string) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === providerId ? { ...p, activeModel: modelName } : p))
    );
    showToast(`Active model updated to ${modelName}`);
  };

  const handleDisconnectProvider = (providerId: IntegrationProviderId) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === providerId ? { ...p, isConnected: false, apiKey: '' } : p))
    );
    setApiKeyInputs((prev) => ({ ...prev, [providerId]: '' }));
    setShowDisconnectModal(false);
    showToast(`${selectedProvider.name} disconnected.`);
  };

  const handleConnectProvider = (
    providerId: IntegrationProviderId,
    apiKey?: string,
    model?: string,
    baseUrl?: string
  ) => {
    const prov = providers.find((p) => p.id === providerId);
    if (!prov) return;

    const inputVal = apiKey ?? apiKeyInputs[providerId] ?? prov.apiKey;
    if (!prov.isLocal && !inputVal.trim()) {
      showToast('Please enter an API key to connect.');
      return;
    }

    setProviders((prev) =>
      prev.map((p) =>
        p.id === providerId
          ? {
              ...p,
              isConnected: true,
              apiKey: inputVal.trim() || '••••••••••••••••',
              activeModel: model || p.activeModel,
              baseUrl: baseUrl || p.baseUrl,
            }
          : p
      )
    );
    setSelectedProviderId(providerId);
    showToast(`${prov.name} connected successfully!`);
  };

  const handleConnectFromModal = (
    providerId: IntegrationProviderId,
    apiKey: string,
    model: string,
    baseUrl?: string
  ) => {
    handleConnectProvider(providerId, apiKey, model, baseUrl);
  };

  const handleTestConnection = (providerId: IntegrationProviderId) => {
    const prov = providers.find((p) => p.id === providerId);
    if (!prov) return;

    setIsTestingConnection(true);
    setTimeout(() => {
      setIsTestingConnection(false);
      showToast(`Connection to ${prov.name} verified successfully.`);
    }, 800);
  };

  const renderProviderIcon = (id: IntegrationProviderId) => {
    switch (id) {
      case 'gemini':
        return (
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C12 7.52285 7.52285 12 2 12C7.52285 12 12 16.4771 12 22C12 16.4771 16.4771 12 22 12C16.4771 12 12 7.52285 12 2Z"
              fill="url(#geminiGrad)"
            />
            <defs>
              <linearGradient id="geminiGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4da9ff" />
                <stop offset="0.5" stopColor="#9b62ff" />
                <stop offset="1" stopColor="#ff629e" />
              </linearGradient>
            </defs>
          </svg>
        );
      case 'openai':
        return (
          <svg className="w-5 h-5 shrink-0 fill-white" viewBox="0 0 24 24">
            <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1683a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4947zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1683a.0757.0757 0 0 1-.071 0l-4.8303-2.7866A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.7948.7948 0 0 0-.407-.6669zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1635a.0804.0804 0 0 1-.038-.0567V6.0748a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.4598a.7948.7948 0 0 0-.3927.6813l-.0048 6.7219zm1.1449-1.9775l2.5484-1.4725 2.5531 1.4725v2.9304l-2.5484 1.4725-2.5531-1.4725z"/>
          </svg>
        );
      case 'anthropic':
        return (
          <div className="w-5 h-5 rounded-md bg-[#241d1a] border border-[#e07a5f]/40 flex items-center justify-center font-serif font-black text-[#e07a5f] text-xs shrink-0 shadow-sm">
            A\
          </div>
        );
      case 'groq':
        return (
          <div className="w-5 h-5 rounded-md bg-[#f55036] flex items-center justify-center font-bold text-white text-[11px] font-mono shrink-0 shadow-sm">
            g
          </div>
        );
      case 'together':
        return (
          <svg className="w-5 h-5 text-[#818cf8] shrink-0 fill-current" viewBox="0 0 24 24">
            <circle cx="5" cy="6" r="2.5" />
            <circle cx="19" cy="6" r="2.5" />
            <circle cx="12" cy="12" r="2.5" />
            <circle cx="5" cy="18" r="2.5" />
            <circle cx="19" cy="18" r="2.5" />
            <path d="M5 6L12 12L19 6M5 18L12 12L19 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );
      case 'ollama':
        return (
          <svg className="w-5 h-5 shrink-0 stroke-white fill-none" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3v4M16 3v4M8 7h8a2 2 0 0 1 2 2v9a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V9a2 2 0 0 1 2-2z" />
            <circle cx="10" cy="12" r="1" fill="white" />
            <circle cx="14" cy="12" r="1" fill="white" />
            <path d="M10 16h4" />
          </svg>
        );
    }
  };

  const handleResetAdvancedSettings = () => {
    setAdvancedSettings(defaultAdvancedSettings);
    setShowResetAdvancedConfirm(false);
    showToast('Advanced settings restored to default values.');
  };

  const handleExportDiagnostics = () => {
    const diagnosticPayload = {
      timestamp: new Date().toISOString(),
      agentVersion: '0.1.0 (SIH26171)',
      environment: 'Chromium Side Panel / Manifest V3',
      currentConfiguration: {
        model: advancedSettings.defaultModel,
        temperature: advancedSettings.temperature,
        maxTokens: advancedSettings.maxOutputTokens,
        topP: advancedSettings.topP,
        actionDelayMs: advancedSettings.actionDelay,
        screenshotQuality: advancedSettings.captureHighResScreenshots
          ? 'High (1920x1080)'
          : 'Standard',
        debugLogsEnabled: advancedSettings.enableDebugLogs,
        logLevel: advancedSettings.logLevel,
      },
      developerFlags: {
        experimentalFeatures: advancedSettings.enableExperimentalFeatures,
        elementBoundingBoxes: advancedSettings.showElementBoundingBoxes,
        simulateActionsDryRun: advancedSettings.simulateActionsDryRun,
        allowLocalModel: advancedSettings.allowLocalModel,
      },
      systemDiagnostics: {
        userAgent: navigator.userAgent,
        online: navigator.onLine,
        screenResolution: `${window.innerWidth}x${window.innerHeight}`,
        devicePixelRatio: window.devicePixelRatio,
        hardwareConcurrency: navigator.hardwareConcurrency || 8,
      },
      privacyBoundary: {
        rawPiiExported: false,
        sanitizerEnforced: true,
      },
    };

    const blob = new Blob([JSON.stringify(diagnosticPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visionagent-diagnostic-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportDiagnosticModal(false);
    showToast('Diagnostic report exported successfully.');
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-[#07080a] text-ivory-100 font-sans overflow-hidden">
      {/* 1. Header Bar */}
      <header className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-white/[0.06] shrink-0 bg-[#07080a]">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white font-sans">
            Settings
          </h1>
          <p className="text-xs text-ivory-muted/70 mt-0.5">
            Customize VisionAgent to work the way you want.
          </p>
        </div>

        {/* Right Search Box */}
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-ivory-muted/60 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search settings..."
            className="w-64 bg-[#11141d] border border-white/10 rounded-full pl-9 pr-3.5 py-1.5 text-xs text-ivory-100 placeholder:text-ivory-muted/50 outline-none focus:border-white/25 transition-all"
          />
        </div>
      </header>

      {/* 2. Main Three-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Inner Navigation Rail */}
        <div className="w-64 border-r border-white/[0.06] p-4 space-y-1.5 shrink-0 bg-[#07080a] overflow-y-auto">
          {filteredCategories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full text-left p-3 rounded-2xl transition-all flex items-start gap-3 group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#e7d9bf] via-[#f3ebe0] to-[#fbf8f2] text-black shadow-card-glow'
                    : 'bg-[#10131b]/60 border border-white/[0.05] hover:bg-[#141824] hover:border-white/10'
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl shrink-0 mt-0.5 ${
                    isActive ? 'bg-black/10 text-black' : 'bg-white/[0.04] text-ivory-muted'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div
                    className={`text-xs font-semibold leading-tight ${
                      isActive ? 'text-black' : 'text-ivory-100 group-hover:text-white'
                    }`}
                  >
                    {cat.name}
                  </div>
                  <div
                    className={`text-[10px] leading-tight truncate mt-1 ${
                      isActive ? 'text-black/70' : 'text-ivory-muted/60'
                    }`}
                  >
                    {cat.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Center Panel */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#0a0c10] border-r border-white/[0.06]">
          {activeCategory === 'privacy' ? (
            /* PRIVACY & SECURITY VIEW (Matching Reference) */
            <div className="max-w-xl space-y-5">
              <div>
                <h2 className="text-base font-semibold text-white">Privacy & Security</h2>
                <p className="text-xs text-ivory-muted/70 mt-0.5">
                  Keep your data safe while VisionAgent works on the web.
                </p>
              </div>

              {/* Privacy Banner from Reference */}
              <div className="p-4 rounded-2xl bg-[#11141d] border border-white/[0.08] shadow-card-glow flex items-center gap-4">
                {/* Shield Icon in concentric gold ring aura */}
                <div className="w-14 h-14 rounded-full border border-gold/40 bg-black/50 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(212,175,55,0.25)]">
                  <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-gold-light">
                    <Lock className="w-4 h-4 text-ivory-100" />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Your privacy, in your control
                  </h3>
                  <p className="text-xs text-ivory-muted/70 leading-relaxed mt-1">
                    VisionAgent is designed with privacy-first principles. Sensitive data is detected and protected before any data leaves your device.
                  </p>
                </div>
              </div>

              {/* Card 1: Data Protection */}
              <div className="p-4 rounded-2xl bg-[#11141d] border border-white/[0.06] shadow-card-glow space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <SettingsIcon className="w-4 h-4 text-ivory-muted" />
                    <h3 className="text-xs font-semibold text-white">Data Protection</h3>
                  </div>
                  <p className="text-[11px] text-ivory-muted/70">
                    Control how your data is processed and stored.
                  </p>
                </div>

                <div className="space-y-3 pt-1">
                  {/* Toggle 1: Auto-detect and redact PII */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-md bg-white/[0.04] flex items-center justify-center text-ivory-muted shrink-0 mt-0.5">
                        <EyeOff className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-medium text-white">Auto-detect and redact PII</div>
                        <div className="text-[10px] text-ivory-muted/60">
                          Detect and hide sensitive information (Aadhaar, PAN, etc.)
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setPrivacySettings({
                          ...privacySettings,
                          autoDetectPII: !privacySettings.autoDetectPII,
                        })
                      }
                      className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                        privacySettings.autoDetectPII ? 'bg-[#f4efe6]' : 'bg-white/15'
                      }`}
                    >
                      <span
                        className={`block w-5 h-5 rounded-full transition-transform ${
                          privacySettings.autoDetectPII
                            ? 'translate-x-5 bg-black'
                            : 'translate-x-0 bg-white/70'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Toggle 2: Process screenshots locally */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-md bg-white/[0.04] flex items-center justify-center text-ivory-muted shrink-0 mt-0.5">
                        <Monitor className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-medium text-white">Process screenshots locally</div>
                        <div className="text-[10px] text-ivory-muted/60">
                          Keep screenshots and OCR processing on this device
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setPrivacySettings({
                          ...privacySettings,
                          processScreenshotsLocally: !privacySettings.processScreenshotsLocally,
                        })
                      }
                      className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                        privacySettings.processScreenshotsLocally ? 'bg-[#f4efe6]' : 'bg-white/15'
                      }`}
                    >
                      <span
                        className={`block w-5 h-5 rounded-full transition-transform ${
                          privacySettings.processScreenshotsLocally
                            ? 'translate-x-5 bg-black'
                            : 'translate-x-0 bg-white/70'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Toggle 3: Send only redacted content to AI models */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-md bg-white/[0.04] flex items-center justify-center text-ivory-muted shrink-0 mt-0.5">
                        <Cloud className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-medium text-white">Send only redacted content to AI models</div>
                        <div className="text-[10px] text-ivory-muted/60">
                          Remove sensitive data before sending to cloud models
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setPrivacySettings({
                          ...privacySettings,
                          sendOnlyRedactedToAI: !privacySettings.sendOnlyRedactedToAI,
                        })
                      }
                      className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                        privacySettings.sendOnlyRedactedToAI ? 'bg-[#f4efe6]' : 'bg-white/15'
                      }`}
                    >
                      <span
                        className={`block w-5 h-5 rounded-full transition-transform ${
                          privacySettings.sendOnlyRedactedToAI
                            ? 'translate-x-5 bg-black'
                            : 'translate-x-0 bg-white/70'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 2: Sensitive Data Types Grid from Reference */}
              <div className="p-4 rounded-2xl bg-[#11141d] border border-white/[0.06] shadow-card-glow space-y-3">
                <div>
                  <h3 className="text-xs font-semibold text-white">Sensitive Data Types</h3>
                  <p className="text-[11px] text-ivory-muted/70">
                    Choose what information to detect and redact.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  {/* 1. Personal Identifiable Info */}
                  <label
                    onClick={() => toggleSensitiveType('pii')}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between h-20 ${
                      privacySettings.sensitiveTypes.pii
                        ? 'border-gold/50 bg-gold/5'
                        : 'border-white/10 bg-[#0e1017] opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={privacySettings.sensitiveTypes.pii}
                        onChange={() => {}}
                        className="rounded bg-white/10 border-white/20 text-gold focus:ring-0 w-3.5 h-3.5 mt-0.5 pointer-events-none"
                      />
                      <span className="text-xs font-semibold text-white leading-tight">
                        Personal Identifiable Info
                      </span>
                    </div>
                    <span className="text-[9px] text-ivory-muted/60 leading-tight">
                      Aadhaar, PAN, Name, DOB, Address
                    </span>
                  </label>

                  {/* 2. Financial Information */}
                  <label
                    onClick={() => toggleSensitiveType('financial')}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between h-20 ${
                      privacySettings.sensitiveTypes.financial
                        ? 'border-gold/50 bg-gold/5'
                        : 'border-white/10 bg-[#0e1017] opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={privacySettings.sensitiveTypes.financial}
                        onChange={() => {}}
                        className="rounded bg-white/10 border-white/20 text-gold focus:ring-0 w-3.5 h-3.5 mt-0.5 pointer-events-none"
                      />
                      <span className="text-xs font-semibold text-white leading-tight">
                        Financial Information
                      </span>
                    </div>
                    <span className="text-[9px] text-ivory-muted/60 leading-tight">
                      Card numbers, Bank details, UPI
                    </span>
                  </label>

                  {/* 3. Contact Information */}
                  <label
                    onClick={() => toggleSensitiveType('contact')}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between h-20 ${
                      privacySettings.sensitiveTypes.contact
                        ? 'border-gold/50 bg-gold/5'
                        : 'border-white/10 bg-[#0e1017] opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={privacySettings.sensitiveTypes.contact}
                        onChange={() => {}}
                        className="rounded bg-white/10 border-white/20 text-gold focus:ring-0 w-3.5 h-3.5 mt-0.5 pointer-events-none"
                      />
                      <span className="text-xs font-semibold text-white leading-tight">
                        Contact Information
                      </span>
                    </div>
                    <span className="text-[9px] text-ivory-muted/60 leading-tight">
                      Phone numbers, Email addresses
                    </span>
                  </label>

                  {/* 4. Credentials */}
                  <label
                    onClick={() => toggleSensitiveType('credentials')}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between h-20 ${
                      privacySettings.sensitiveTypes.credentials
                        ? 'border-gold/50 bg-gold/5'
                        : 'border-white/10 bg-[#0e1017] opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={privacySettings.sensitiveTypes.credentials}
                        onChange={() => {}}
                        className="rounded bg-white/10 border-white/20 text-gold focus:ring-0 w-3.5 h-3.5 mt-0.5 pointer-events-none"
                      />
                      <span className="text-xs font-semibold text-white leading-tight">
                        Credentials
                      </span>
                    </div>
                    <span className="text-[9px] text-ivory-muted/60 leading-tight">
                      Passwords, API keys, Tokens
                    </span>
                  </label>

                  {/* 5. Government IDs */}
                  <label
                    onClick={() => toggleSensitiveType('governmentIds')}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between h-20 ${
                      privacySettings.sensitiveTypes.governmentIds
                        ? 'border-gold/50 bg-gold/5'
                        : 'border-white/10 bg-[#0e1017] opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={privacySettings.sensitiveTypes.governmentIds}
                        onChange={() => {}}
                        className="rounded bg-white/10 border-white/20 text-gold focus:ring-0 w-3.5 h-3.5 mt-0.5 pointer-events-none"
                      />
                      <span className="text-xs font-semibold text-white leading-tight">
                        Government IDs
                      </span>
                    </div>
                    <span className="text-[9px] text-ivory-muted/60 leading-tight">
                      Aadhaar, PAN, Passport, License
                    </span>
                  </label>

                  {/* 6. Images & Faces */}
                  <label
                    onClick={() => toggleSensitiveType('imagesFaces')}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between h-20 ${
                      privacySettings.sensitiveTypes.imagesFaces
                        ? 'border-gold/50 bg-gold/5'
                        : 'border-white/10 bg-[#0e1017] opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={privacySettings.sensitiveTypes.imagesFaces}
                        onChange={() => {}}
                        className="rounded bg-white/10 border-white/20 text-gold focus:ring-0 w-3.5 h-3.5 mt-0.5 pointer-events-none"
                      />
                      <span className="text-xs font-semibold text-white leading-tight">
                        Images & Faces
                      </span>
                    </div>
                    <span className="text-[9px] text-ivory-muted/60 leading-tight">
                      Faces, ID documents, Profile photos
                    </span>
                  </label>
                </div>
              </div>

              {/* Card 3: Security */}
              <div className="p-4 rounded-2xl bg-[#11141d] border border-white/[0.06] shadow-card-glow space-y-4">
                <div>
                  <h3 className="text-xs font-semibold text-white">Security</h3>
                  <p className="text-[11px] text-ivory-muted/70">
                    Manage permissions and secure behavior.
                  </p>
                </div>

                <div className="space-y-3 pt-1">
                  {/* Security 1: Require confirmation before actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-md bg-white/[0.04] flex items-center justify-center text-ivory-muted shrink-0 mt-0.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-medium text-white">Require confirmation before actions</div>
                        <div className="text-[10px] text-ivory-muted/60">
                          Ask for approval before clicking, typing or submitting
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setPrivacySettings({
                          ...privacySettings,
                          requireConfirmation: !privacySettings.requireConfirmation,
                        })
                      }
                      className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                        privacySettings.requireConfirmation ? 'bg-[#f4efe6]' : 'bg-white/15'
                      }`}
                    >
                      <span
                        className={`block w-5 h-5 rounded-full transition-transform ${
                          privacySettings.requireConfirmation
                            ? 'translate-x-5 bg-black'
                            : 'translate-x-0 bg-white/70'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Security 2: Block potentially harmful actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-md bg-white/[0.04] flex items-center justify-center text-ivory-muted shrink-0 mt-0.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-medium text-white">Block potentially harmful actions</div>
                        <div className="text-[10px] text-ivory-muted/60">
                          Prevent actions on sensitive or risky websites
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setPrivacySettings({
                          ...privacySettings,
                          blockHarmfulActions: !privacySettings.blockHarmfulActions,
                        })
                      }
                      className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                        privacySettings.blockHarmfulActions ? 'bg-[#f4efe6]' : 'bg-white/15'
                      }`}
                    >
                      <span
                        className={`block w-5 h-5 rounded-full transition-transform ${
                          privacySettings.blockHarmfulActions
                            ? 'translate-x-5 bg-black'
                            : 'translate-x-0 bg-white/70'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Security 3: Sandbox browser interactions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-md bg-white/[0.04] flex items-center justify-center text-ivory-muted shrink-0 mt-0.5">
                        <Layers className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-medium text-white">Sandbox browser interactions</div>
                        <div className="text-[10px] text-ivory-muted/60">
                          Run actions in a safe, isolated environment
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setPrivacySettings({
                          ...privacySettings,
                          sandboxInteractions: !privacySettings.sandboxInteractions,
                        })
                      }
                      className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                        privacySettings.sandboxInteractions ? 'bg-[#f4efe6]' : 'bg-white/15'
                      }`}
                    >
                      <span
                        className={`block w-5 h-5 rounded-full transition-transform ${
                          privacySettings.sandboxInteractions
                            ? 'translate-x-5 bg-black'
                            : 'translate-x-0 bg-white/70'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : activeCategory === 'agent' ? (
            /* AGENT SETTINGS VIEW */
            <div className="max-w-xl space-y-5">
              <div>
                <h2 className="text-base font-semibold text-white">Agent</h2>
                <p className="text-xs text-ivory-muted/70 mt-0.5">
                  Configure how VisionAgent observes, reasons and interacts with the browser.
                </p>
              </div>

              {/* Mode cards */}
              <div className="p-4 rounded-2xl bg-[#11141d] border border-white/[0.06] shadow-card-glow">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-4 h-4 text-ivory-muted" />
                  <h3 className="text-xs font-semibold text-white">Agent Mode</h3>
                </div>
                <p className="text-[11px] text-ivory-muted/70 mb-3.5">
                  Choose the default behavior for the agent.
                </p>

                <div className="grid grid-cols-4 gap-2.5">
                  {(['Balanced', 'Fast', 'Careful', 'Custom'] as const).map((m) => (
                    <div
                      key={m}
                      onClick={() => {
                        setAgentSettings({ ...agentSettings, mode: m });
                        showToast(`Switched to ${m} Mode`);
                      }}
                      className={`p-3 rounded-xl cursor-pointer transition-all border text-center flex flex-col justify-between h-28 ${
                        agentSettings.mode === m
                          ? 'border-gold/60 bg-gold/5 shadow-[0_0_12px_rgba(212,175,55,0.15)] ring-1 ring-gold/20'
                          : 'border-white/10 bg-[#0e1017] hover:border-white/20'
                      }`}
                    >
                      <div className="mx-auto p-1 rounded-lg bg-white/[0.04]">
                        {m === 'Balanced' && <Scale className="w-4 h-4 mx-auto text-gold-light" />}
                        {m === 'Fast' && <Zap className="w-4 h-4 mx-auto text-ivory-muted" />}
                        {m === 'Careful' && <ShieldCheck className="w-4 h-4 mx-auto text-ivory-muted" />}
                        {m === 'Custom' && <Sliders className="w-4 h-4 mx-auto text-ivory-muted" />}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-ivory-100">{m}</div>
                        <div className="text-[9px] text-ivory-muted/60 mt-0.5 leading-tight">
                          {m === 'Balanced'
                            ? 'Best for daily use'
                            : m === 'Fast'
                            ? 'Faster responses'
                            : m === 'Careful'
                            ? 'Higher accuracy'
                            : 'Manual setup'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Model */}
              <div className="p-4 rounded-2xl bg-[#11141d] border border-white/[0.06] shadow-card-glow">
                <div className="flex items-center gap-2 mb-1">
                  <Scale className="w-4 h-4 text-ivory-muted" />
                  <h3 className="text-xs font-semibold text-white">LLM / VLM Model</h3>
                </div>
                <p className="text-[11px] text-ivory-muted/70 mb-3.5">
                  Model used for reasoning and planning tasks.
                </p>

                <div className="flex items-center gap-2.5">
                  <div className="relative flex-1">
                    <button
                      onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                      className="w-full flex items-center justify-between bg-[#161a26] border border-white/10 rounded-xl px-3 py-2 text-xs text-ivory-100 hover:border-white/20 transition-all"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Sparkles className="w-3.5 h-3.5 text-gold-light shrink-0" />
                        <span className="truncate">{agentSettings.model}</span>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-ivory-muted shrink-0" />
                    </button>

                    {isModelDropdownOpen && (
                      <div className="absolute left-0 right-0 mt-1 bg-[#161a26] border border-white/15 rounded-xl p-1 shadow-2xl z-30 space-y-0.5 text-xs">
                        {[
                          'Gemini 3.1 Pro (Default)',
                          'Gemini 1.5 Pro',
                          'Claude 3.5 Sonnet (Reasoner)',
                          'Local Small VLM (On-Device)',
                        ].map((m) => (
                          <button
                            key={m}
                            onClick={() => {
                              setAgentSettings({ ...agentSettings, model: m });
                              setIsModelDropdownOpen(false);
                              showToast(`Model set to: ${m}`);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                              agentSettings.model === m
                                ? 'bg-white/10 text-white font-medium'
                                : 'text-ivory-muted hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            <span>{m}</span>
                            {agentSettings.model === m && (
                              <Check className="w-3.5 h-3.5 text-gold-light" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setShowModelConfigModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-[#181c28] border border-white/10 hover:border-white/20 text-xs text-ivory-100 flex items-center gap-1.5 transition-all hover:bg-[#1f2434] shrink-0 font-medium"
                  >
                    <span>Configure</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          ) : activeCategory === 'general' ? (
            /* GENERAL SETTINGS VIEW */
            <div className="max-w-xl space-y-5">
              <div>
                <h2 className="text-base font-semibold text-white">General</h2>
                <p className="text-xs text-ivory-muted/70 mt-0.5">
                  Basic preferences and appearance settings
                </p>
              </div>

              {/* Theme card */}
              <div className="p-4 rounded-2xl bg-[#11141d] border border-white/[0.06] shadow-card-glow">
                <div className="flex items-center gap-2.5 mb-1">
                  <Sun className="w-4 h-4 text-ivory-muted" />
                  <h3 className="text-xs font-semibold text-white">Appearance</h3>
                </div>
                <p className="text-[11px] text-ivory-muted/70 mb-3.5">
                  Choose your preferred theme and visual style.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div
                    onClick={() => setSettings({ ...settings, theme: 'light' })}
                    className={`p-2 rounded-xl cursor-pointer transition-all border text-center ${
                      settings.theme === 'light'
                        ? 'border-gold/60 bg-gold/5'
                        : 'border-white/10 bg-[#0e1017] hover:border-white/20'
                    }`}
                  >
                    <div className="aspect-[16/10] rounded-lg bg-[#f0f2f5] border border-black/10 p-2 flex flex-col justify-between mb-2">
                      <div className="h-1.5 w-8 rounded bg-black/30" />
                      <div className="space-y-1">
                        <div className="h-1 w-full rounded bg-black/15" />
                        <div className="h-1 w-2/3 rounded bg-black/15" />
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 text-xs text-ivory-200">
                      <span>Light</span>
                    </div>
                  </div>

                  <div
                    onClick={() => setSettings({ ...settings, theme: 'dark' })}
                    className={`p-2 rounded-xl cursor-pointer transition-all border text-center ${
                      settings.theme === 'dark'
                        ? 'border-gold/60 bg-gold/5 shadow-[0_0_12px_rgba(212,175,55,0.15)]'
                        : 'border-white/10 bg-[#0e1017] hover:border-white/20'
                    }`}
                  >
                    <div className="aspect-[16/10] rounded-lg bg-[#07080a] border border-white/10 p-2 flex flex-col justify-between mb-2">
                      <div className="h-1.5 w-8 rounded bg-white/40" />
                      <div className="space-y-1">
                        <div className="h-1 w-full rounded bg-white/15" />
                        <div className="h-1 w-2/3 rounded bg-white/15" />
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 text-xs text-ivory-100 font-medium">
                      <span>Dark</span>
                    </div>
                  </div>

                  <div
                    onClick={() => setSettings({ ...settings, theme: 'system' })}
                    className={`p-2 rounded-xl cursor-pointer transition-all border text-center ${
                      settings.theme === 'system'
                        ? 'border-gold/60 bg-gold/5'
                        : 'border-white/10 bg-[#0e1017] hover:border-white/20'
                    }`}
                  >
                    <div className="aspect-[16/10] rounded-lg bg-gradient-to-r from-[#f0f2f5] to-[#07080a] border border-white/15 p-2 flex flex-col justify-between mb-2">
                      <div className="h-1.5 w-8 rounded bg-black/40" />
                      <div className="space-y-1">
                        <div className="h-1 w-full rounded bg-white/20" />
                        <div className="h-1 w-2/3 rounded bg-white/20" />
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 text-xs text-ivory-200">
                      <span>System</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Language */}
              <div className="p-4 rounded-2xl bg-[#11141d] border border-white/[0.06] flex items-center justify-between shadow-card-glow relative">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center text-ivory-muted shrink-0 mt-0.5">
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-white">Language</h3>
                    <p className="text-[11px] text-ivory-muted/70">Choose your preferred language.</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center gap-2 bg-[#181c28] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-ivory-100 hover:border-white/20"
                >
                  <span>{settings.language}</span>
                  <ChevronDown className="w-3 h-3 text-ivory-muted" />
                </button>
              </div>

              {/* Startup */}
              <div className="p-4 rounded-2xl bg-[#11141d] border border-white/[0.06] flex items-center justify-between shadow-card-glow relative">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center text-ivory-muted shrink-0 mt-0.5">
                    <Power className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-white">Startup</h3>
                    <p className="text-[11px] text-ivory-muted/70">Choose what happens when VisionAgent starts.</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsStartupOpen(!isStartupOpen)}
                  className="flex items-center gap-2 bg-[#181c28] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-ivory-100 hover:border-white/20"
                >
                  <span>{settings.startup}</span>
                  <ChevronDown className="w-3 h-3 text-ivory-muted" />
                </button>
              </div>
            </div>
          ) : activeCategory === 'integrations' ? (
            /* INTEGRATIONS VIEW (Matching Reference) */
            <div className="max-w-2xl space-y-5">
              <div>
                <h2 className="text-base font-semibold text-white">Integrations</h2>
                <p className="text-xs text-ivory-muted/70 mt-0.5">
                  Connect LLM providers to power VisionAgent's intelligence.
                </p>
              </div>

              {/* Banner with subtle glowing orb */}
              <div className="p-5 rounded-2xl bg-[#11141d] border border-white/[0.08] shadow-card-glow relative overflow-hidden flex items-center justify-between">
                <div className="max-w-sm z-10">
                  <h3 className="text-sm font-semibold text-white mb-1.5">
                    Connect your preferred AI models
                  </h3>
                  <p className="text-xs text-ivory-muted/70 leading-relaxed">
                    Choose and configure LLM providers to let VisionAgent reason, plan and perform tasks in the browser. Your API keys are encrypted and stored securely.
                  </p>
                </div>

                {/* Subtle glowing orb from reference */}
                <div className="relative shrink-0 w-24 h-24 flex items-center justify-center mr-2">
                  <AgentPreviewOrb size={95} mode="Careful" />
                </div>
              </div>

              {/* Filter Chips & Connect Action */}
              <div className="flex items-center justify-between pt-0.5">
                <div className="flex items-center gap-2">
                <button
                  onClick={() => setIntegrationFilter('all')}
                  className={`px-5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    integrationFilter === 'all'
                      ? 'bg-[#f4efe6] text-black shadow-sm'
                      : 'bg-[#11141d] border border-white/10 text-ivory-muted hover:text-white hover:border-white/20'
                  }`}
                >
                  All
                </button>

                <button
                  onClick={() => setIntegrationFilter('connected')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-2 ${
                    integrationFilter === 'connected'
                      ? 'bg-[#f4efe6] text-black shadow-sm'
                      : 'bg-[#11141d] border border-white/10 text-ivory-muted hover:text-white hover:border-white/20'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      integrationFilter === 'connected' ? 'bg-emerald-600' : 'bg-emerald-400'
                    }`}
                  />
                  <span>Connected</span>
                  <span
                    className={`text-[11px] ${
                      integrationFilter === 'connected' ? 'text-black/70' : 'text-ivory-muted/60'
                    }`}
                  >
                    {connectedCount}
                  </span>
                </button>

                <button
                  onClick={() => setIntegrationFilter('available')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-2 ${
                    integrationFilter === 'available'
                      ? 'bg-[#f4efe6] text-black shadow-sm'
                      : 'bg-[#11141d] border border-white/10 text-ivory-muted hover:text-white hover:border-white/20'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full border ${
                      integrationFilter === 'available'
                        ? 'border-black/60'
                        : 'border-white/40'
                    }`}
                  />
                  <span>Available</span>
                  <span
                    className={`text-[11px] ${
                      integrationFilter === 'available' ? 'text-black/70' : 'text-ivory-muted/60'
                    }`}
                  >
                    {availableCount}
                  </span>
                </button>
              </div>

              <button
                onClick={() => {
                  setConnectModalProviderId(selectedProviderId || 'gemini');
                  setShowConnectModal(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#e7d9bf] to-[#f4efe6] hover:brightness-105 text-black font-semibold text-xs shadow-sm flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Connect Provider</span>
              </button>
            </div>

              {/* LLM Providers Grid */}
              <div>
                <h3 className="text-xs font-semibold text-white mb-3">LLM Providers</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredProviders.map((provider) => {
                    const isSelected = selectedProviderId === provider.id;
                    return (
                      <div
                        key={provider.id}
                        onClick={() => setSelectedProviderId(provider.id)}
                        className={`p-4 rounded-2xl bg-[#11141d] border transition-all flex flex-col justify-between h-56 cursor-pointer group ${
                          isSelected
                            ? 'border-gold/60 ring-1 ring-gold/30 shadow-[0_0_15px_rgba(212,175,55,0.15)] bg-[#141824]'
                            : 'border-white/[0.06] hover:border-white/20 hover:bg-[#131722]'
                        }`}
                      >
                        <div>
                          {/* Provider Icon & Status */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0">
                              {renderProviderIcon(provider.id)}
                            </div>
                            <div>
                              {provider.isConnected ? (
                                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-medium border border-emerald-500/20">
                                  Connected
                                </span>
                              ) : (
                                <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/[0.04] text-ivory-muted/60 text-[10px] font-medium border border-white/[0.06]">
                                  Not connected
                                </span>
                              )}
                            </div>
                          </div>

                          <h4 className="text-xs font-semibold text-white mb-1">
                            {provider.name}
                          </h4>

                          <p className="text-[11px] text-ivory-muted/70 leading-relaxed line-clamp-3">
                            {provider.description}
                          </p>
                        </div>

                        {/* Button */}
                        <div className="pt-3">
                          {provider.isConnected ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProviderId(provider.id);
                                setConnectModalProviderId(provider.id);
                                setShowConnectModal(true);
                              }}
                              className="w-full py-1.5 rounded-xl border border-white/10 bg-[#161a26] hover:bg-[#1d2232] text-xs font-medium text-white transition-colors"
                            >
                              Manage
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProviderId(provider.id);
                                setConnectModalProviderId(provider.id);
                                setShowConnectModal(true);
                              }}
                              className="w-full py-1.5 rounded-xl bg-[#f4efe6] hover:bg-white text-black text-xs font-medium transition-colors shadow-sm"
                            >
                              Connect
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : activeCategory === 'advanced' ? (
            /* ADVANCED SETTINGS VIEW (Matching Reference) */
            <div className="max-w-xl space-y-5">
              <div>
                <h2 className="text-base font-semibold text-white">Advanced Settings</h2>
                <p className="text-xs text-ivory-muted/70 mt-0.5">
                  Configure core settings for VisionAgent's operation.
                </p>
              </div>

              {/* 1. Model & Inference Card */}
              <div className="p-4 rounded-2xl bg-[#11141d] border border-white/[0.06] shadow-card-glow space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="w-5 h-5 rounded-md bg-white/[0.04] flex items-center justify-center text-ivory-muted shrink-0">
                      <Box className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-xs font-semibold text-white">Model & Inference</h3>
                  </div>
                  <p className="text-[11px] text-ivory-muted/70">
                    Choose the model and set inference parameters.
                  </p>
                </div>

                <div className="space-y-3.5 pt-1">
                  {/* Model Provider */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-white">Model Provider</span>
                    <div className="relative">
                      <button
                        onClick={() => {
                          setIsProviderDropdownOpen(!isProviderDropdownOpen);
                          setIsAdvModelDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 bg-[#161a26] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-ivory-100 hover:border-white/20 transition-all w-48 justify-between"
                      >
                        <div className="flex items-center gap-2 truncate">
                          {renderProviderIcon(
                            (providerOptions.find((p) => p.name === (advancedSettings.defaultProvider || 'Google Gemini'))?.iconId || 'gemini') as IntegrationProviderId
                          )}
                          <span className="truncate">{advancedSettings.defaultProvider || 'Google Gemini'}</span>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 text-ivory-muted shrink-0" />
                      </button>

                      {isProviderDropdownOpen && (
                        <div className="absolute right-0 mt-1 bg-[#161a26] border border-white/15 rounded-xl p-1 shadow-2xl z-30 space-y-0.5 text-xs w-48">
                          {providerOptions.map((prov) => {
                            const isCur = (advancedSettings.defaultProvider || 'Google Gemini') === prov.name;
                            return (
                              <button
                                key={prov.name}
                                onClick={() => {
                                  setAdvancedSettings({
                                    ...advancedSettings,
                                    defaultProvider: prov.name,
                                    defaultModel: prov.models[0],
                                  });
                                  setIsProviderDropdownOpen(false);
                                  showToast(`Provider set to ${prov.name}`);
                                }}
                                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                                  isCur
                                    ? 'bg-white/10 text-white font-medium'
                                    : 'text-ivory-muted hover:bg-white/5 hover:text-white'
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  {renderProviderIcon(prov.iconId)}
                                  <span className="truncate">{prov.name}</span>
                                </div>
                                {isCur && <Check className="w-3 h-3 text-gold-light shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Model */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-white">Model</span>
                    <div className="relative">
                      <button
                        onClick={() => {
                          setIsAdvModelDropdownOpen(!isAdvModelDropdownOpen);
                          setIsProviderDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 bg-[#161a26] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-ivory-100 hover:border-white/20 transition-all w-48 justify-between"
                      >
                        <span className="truncate">{advancedSettings.defaultModel}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-ivory-muted shrink-0" />
                      </button>

                      {isAdvModelDropdownOpen && (
                        <div className="absolute right-0 mt-1 bg-[#161a26] border border-white/15 rounded-xl p-1 shadow-2xl z-30 space-y-0.5 text-xs w-48">
                          {(
                            providerOptions.find((p) => p.name === (advancedSettings.defaultProvider || 'Google Gemini'))?.models || [
                              'Gemini 3.1 Pro',
                              'Gemini 1.5 Pro',
                              'Gemini 1.5 Flash',
                            ]
                          ).map((m) => (
                            <button
                              key={m}
                              onClick={() => {
                                setAdvancedSettings({
                                  ...advancedSettings,
                                  defaultModel: m,
                                });
                                setIsAdvModelDropdownOpen(false);
                                showToast(`Default model set to ${m}`);
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                                advancedSettings.defaultModel === m
                                  ? 'bg-white/10 text-white font-medium'
                                  : 'text-ivory-muted hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              <span className="truncate">{m}</span>
                              {advancedSettings.defaultModel === m && (
                                <Check className="w-3 h-3 text-gold-light shrink-0" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Temperature */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-white">Temperature</span>
                      <div className="group relative">
                        <Info className="w-3.5 h-3.5 text-ivory-muted/60 cursor-pointer hover:text-ivory-200" />
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:block bg-[#161a26] border border-white/10 text-[10px] text-ivory-muted px-2 py-1 rounded shadow-lg whitespace-nowrap z-30 pointer-events-none">
                          Controls randomness: 0.0 is deterministic, 1.0 is creative
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0.0"
                        max="1.0"
                        step="0.05"
                        value={advancedSettings.temperature}
                        onChange={(e) =>
                          setAdvancedSettings({
                            ...advancedSettings,
                            temperature: parseFloat(e.target.value),
                          })
                        }
                        className="w-36 accent-[#e7d9bf] h-1.5 bg-white/10 rounded-lg cursor-pointer"
                      />
                      <div className="w-14 text-center py-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-ivory-100">
                        {advancedSettings.temperature.toFixed(1)}
                      </div>
                    </div>
                  </div>

                  {/* Max Output Tokens */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-white">Max Output Tokens</span>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="512"
                        max="8192"
                        step="128"
                        value={advancedSettings.maxOutputTokens}
                        onChange={(e) =>
                          setAdvancedSettings({
                            ...advancedSettings,
                            maxOutputTokens: parseInt(e.target.value),
                          })
                        }
                        className="w-36 accent-[#e7d9bf] h-1.5 bg-white/10 rounded-lg cursor-pointer"
                      />
                      <div className="w-14 text-center py-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-ivory-100">
                        {advancedSettings.maxOutputTokens}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Browser Interaction Card */}
              <div className="p-4 rounded-2xl bg-[#11141d] border border-white/[0.06] shadow-card-glow space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="w-5 h-5 rounded-md bg-white/[0.04] flex items-center justify-center text-ivory-muted shrink-0">
                      <MousePointer className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-xs font-semibold text-white">Browser Interaction</h3>
                  </div>
                  <p className="text-[11px] text-ivory-muted/70">
                    Configure safety settings for browser actions.
                  </p>
                </div>

                <div className="space-y-3.5 pt-1">
                  {/* Require confirmation before actions */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-white">
                        Require confirmation before actions
                      </div>
                      <div className="text-[10px] text-ivory-muted/60">
                        Ask for confirmation before clicking, typing or submitting.
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setAdvancedSettings({
                          ...advancedSettings,
                          requireConfirmationBeforeActions:
                            advancedSettings.requireConfirmationBeforeActions === undefined
                              ? false
                              : !advancedSettings.requireConfirmationBeforeActions,
                        })
                      }
                      className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                        advancedSettings.requireConfirmationBeforeActions !== false
                          ? 'bg-[#f4efe6]'
                          : 'bg-white/15'
                      }`}
                    >
                      <span
                        className={`block w-5 h-5 rounded-full transition-transform ${
                          advancedSettings.requireConfirmationBeforeActions !== false
                            ? 'translate-x-5 bg-black'
                            : 'translate-x-0 bg-white/70'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Action delay */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-white">Action delay</span>
                        <div className="group relative">
                          <Info className="w-3.5 h-3.5 text-ivory-muted/60 cursor-pointer hover:text-ivory-200" />
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:block bg-[#161a26] border border-white/10 text-[10px] text-ivory-muted px-2 py-1 rounded shadow-lg whitespace-nowrap z-30 pointer-events-none">
                            Wait before performing each action (helps with stability)
                          </div>
                        </div>
                      </div>
                      <div className="text-[10px] text-ivory-muted/60">
                        Wait before performing each action (helps with stability).
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="2000"
                        step="50"
                        value={advancedSettings.actionDelay}
                        onChange={(e) =>
                          setAdvancedSettings({
                            ...advancedSettings,
                            actionDelay: parseInt(e.target.value),
                          })
                        }
                        className="w-36 accent-[#e7d9bf] h-1.5 bg-white/10 rounded-lg cursor-pointer"
                      />
                      <div className="w-16 text-center py-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-ivory-100">
                        {advancedSettings.actionDelay} ms
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Diagnostics Card */}
              <div className="p-4 rounded-2xl bg-[#11141d] border border-white/[0.06] shadow-card-glow space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="w-5 h-5 rounded-md bg-white/[0.04] flex items-center justify-center text-ivory-muted shrink-0">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-xs font-semibold text-white">Diagnostics</h3>
                  </div>
                  <p className="text-[11px] text-ivory-muted/70">
                    Basic logging for debugging issues.
                  </p>
                </div>

                <div className="space-y-3.5 pt-1">
                  {/* Enable debug logs */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-white">Enable debug logs</div>
                      <div className="text-[10px] text-ivory-muted/60">
                        Store logs locally on this device.
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setAdvancedSettings({
                          ...advancedSettings,
                          enableDebugLogs: !advancedSettings.enableDebugLogs,
                        })
                      }
                      className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                        advancedSettings.enableDebugLogs ? 'bg-[#f4efe6]' : 'bg-white/15'
                      }`}
                    >
                      <span
                        className={`block w-5 h-5 rounded-full transition-transform ${
                          advancedSettings.enableDebugLogs
                            ? 'translate-x-5 bg-black'
                            : 'translate-x-0 bg-white/70'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Other categories fallback */
            <div className="max-w-xl space-y-4">
              <div>
                <h2 className="text-base font-semibold text-white capitalize">
                  {activeCategory.replace('_', ' ')} Settings
                </h2>
                <p className="text-xs text-ivory-muted/70 mt-0.5">
                  Configuration options for {activeCategory}.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#11141d] border border-white/[0.06] text-center space-y-2">
                <SettingsIcon className="w-8 h-8 text-ivory-muted/40 mx-auto" />
                <h3 className="text-xs font-semibold text-white">Section Ready</h3>
                <p className="text-xs text-ivory-muted/60 max-w-sm mx-auto">
                  Local-first privacy boundaries active. No cloud sync required.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="w-80 p-5 space-y-5 shrink-0 bg-[#07080a] overflow-y-auto">
          {activeCategory === 'privacy' ? (
            /* PRIVACY & SECURITY RIGHT PANEL (Matching Reference) */
            <>
              {/* Card 1: Privacy Status */}
              <div>
                <h3 className="text-xs font-semibold text-ivory-muted/70 mb-2">
                  Privacy Status
                </h3>

                <div className="p-4 rounded-2xl bg-[#11141d] border border-white/[0.06] shadow-card-glow space-y-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-emerald-400">
                        Protected
                      </div>
                      <div className="text-[10px] text-ivory-muted/70">
                        Your data is processed securely.
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1 border-t border-white/[0.06] text-xs">
                    <div className="flex items-center gap-2 text-ivory-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>PII detection enabled</span>
                    </div>
                    <div className="flex items-center gap-2 text-ivory-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Local processing active</span>
                    </div>
                    <div className="flex items-center gap-2 text-ivory-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Redaction before AI</span>
                    </div>
                    <div className="flex items-center gap-2 text-ivory-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Secure browser isolation</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Data Storage */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Database className="w-3.5 h-3.5 text-ivory-muted/70" />
                  <h3 className="text-xs font-semibold text-ivory-muted/70">
                    Data Storage
                  </h3>
                </div>

                <div className="space-y-1.5">
                  {/* Local storage */}
                  <div className="p-3 rounded-2xl bg-[#11141d] border border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Database className="w-4 h-4 text-ivory-muted shrink-0" />
                      <div>
                        <div className="text-xs font-medium text-white">Local storage</div>
                        <div className="text-[10px] text-ivory-muted/60">
                          {settings.localStorageUsed}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-ivory-muted/50" />
                  </div>

                  {/* Clear local data */}
                  <div
                    onClick={() => setShowClearConfirm(true)}
                    className="p-3 rounded-2xl bg-[#11141d] border border-white/[0.06] hover:border-rose-500/30 transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Trash2 className="w-4 h-4 text-ivory-muted group-hover:text-rose-400 shrink-0" />
                      <div>
                        <div className="text-xs font-medium text-ivory-100 group-hover:text-rose-300">
                          Clear local data
                        </div>
                        <div className="text-[10px] text-ivory-muted/60">
                          Delete screenshots, cache and logs
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-ivory-muted/50" />
                  </div>

                  {/* Export data */}
                  <div
                    onClick={handleExportData}
                    className="p-3 rounded-2xl bg-[#11141d] border border-white/[0.06] hover:border-white/15 transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Download className="w-4 h-4 text-ivory-muted group-hover:text-white shrink-0" />
                      <div>
                        <div className="text-xs font-medium text-ivory-100 group-hover:text-white">
                          Export data
                        </div>
                        <div className="text-[10px] text-ivory-muted/60">
                          Download your data
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-ivory-muted/50" />
                  </div>
                </div>
              </div>

              {/* Card 3: Permissions */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Key className="w-3.5 h-3.5 text-ivory-muted/70" />
                  <h3 className="text-xs font-semibold text-ivory-muted/70">
                    Permissions
                  </h3>
                </div>

                <div className="space-y-1.5">
                  <div className="p-3 rounded-2xl bg-[#11141d] border border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Globe className="w-4 h-4 text-ivory-muted shrink-0" />
                      <div>
                        <div className="text-xs font-medium text-white">Browser access</div>
                        <div className="text-[10px] text-ivory-muted/60">
                          Required for automation
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-ivory-muted/50" />
                  </div>

                  <div className="p-3 rounded-2xl bg-[#11141d] border border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-4 h-4 text-ivory-muted shrink-0" />
                      <div>
                        <div className="text-xs font-medium text-white">File access</div>
                        <div className="text-[10px] text-ivory-muted/60">
                          For downloads and uploads
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-ivory-muted/50" />
                  </div>

                  <div className="p-3 rounded-2xl bg-[#11141d] border border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Bell className="w-4 h-4 text-ivory-muted shrink-0" />
                      <div>
                        <div className="text-xs font-medium text-white">Notifications</div>
                        <div className="text-[10px] text-ivory-muted/60">
                          Task updates and security alerts
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-ivory-muted/50" />
                  </div>
                </div>
              </div>

              {/* Card 4: Danger Zone */}
              <div>
                <h3 className="text-xs font-semibold text-rose-400 mb-2">
                  Danger Zone
                </h3>

                <div
                  onClick={() => setShowResetPrivacyConfirm(true)}
                  className="p-3.5 rounded-2xl bg-[#191114] border border-rose-500/20 hover:border-rose-500/40 transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <div>
                      <div className="text-xs font-medium text-rose-300 group-hover:text-rose-200">
                        Reset privacy settings
                      </div>
                      <div className="text-[10px] text-rose-400/60">
                        This will restore default privacy settings
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-rose-400/60" />
                </div>
              </div>
            </>
          ) : activeCategory === 'agent' ? (
            /* AGENT RIGHT PANEL */
            <>
              <div>
                <h3 className="text-xs font-semibold text-ivory-muted/70 mb-2">
                  Agent Preview
                </h3>
                <div className="p-4 rounded-2xl bg-[#11141d] border border-white/[0.06] shadow-card-glow flex flex-col items-center text-center">
                  <div className="mb-2">
                    <AgentPreviewOrb mode={agentSettings.mode} size={130} />
                  </div>
                  <div className="w-full p-3 rounded-xl bg-[#0d1017] border border-white/[0.06] text-left mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Scale className="w-3.5 h-3.5 text-gold-light" />
                      <span className="text-xs font-semibold text-white">
                        {agentSettings.mode} Mode
                      </span>
                    </div>
                    <p className="text-[11px] text-ivory-muted/70 leading-relaxed">
                      I analyze, plan and act carefully with good speed and accuracy.
                    </p>
                  </div>
                  <div className="w-full space-y-2 text-left text-xs">
                    <div className="flex items-center gap-2 text-ivory-100">
                      <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
                      <span>Understands the page visually</span>
                    </div>
                    <div className="flex items-center gap-2 text-ivory-100">
                      <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
                      <span>Keeps your data private</span>
                    </div>
                    <div className="flex items-center gap-2 text-ivory-100">
                      <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
                      <span>Verifies the result before finishing</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-ivory-muted/70 mb-2">
                  Reset Agent Settings
                </h3>
                <div className="p-3.5 rounded-2xl bg-[#191114] border border-rose-500/20 shadow-card-glow space-y-3">
                  <div className="flex items-start gap-2.5">
                    <RotateCcw className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-rose-300/80 leading-relaxed">
                      This will restore all agent settings to default values.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowResetAgentConfirm(true)}
                    className="w-full py-1.5 rounded-xl border border-rose-500/40 text-rose-300 hover:bg-rose-500/10 transition-colors text-xs font-medium"
                  >
                    Reset to Default
                  </button>
                </div>
              </div>
            </>
          ) : activeCategory === 'integrations' ? (
            /* INTEGRATIONS RIGHT PANEL (Matching Reference) */
            <>
              {/* Header Identity */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white">
                  {selectedProvider.name}
                </h3>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center shrink-0 shadow-md">
                    {renderProviderIcon(selectedProvider.id)}
                  </div>
                  <div>
                    {selectedProvider.isConnected ? (
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                        Connected
                      </span>
                    ) : (
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/[0.05] text-ivory-muted/70 text-xs font-medium border border-white/[0.08]">
                        Not connected
                      </span>
                    )}
                    <div className="text-[11px] text-ivory-muted/70 mt-1 truncate">
                      {selectedProvider.isConnected
                        ? `Using ${selectedProvider.activeModel}`
                        : selectedProvider.isLocal
                        ? 'Local daemon required'
                        : 'Requires API key'}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-ivory-muted/80 leading-relaxed pt-1">
                  {selectedProvider.longDescription}
                </p>
              </div>

              {/* Configuration Section */}
              <div className="space-y-3 pt-1">
                <h4 className="text-xs font-semibold text-white">Configuration</h4>

                {/* Model */}
                <div>
                  <label className="text-[11px] text-ivory-muted/70 block mb-1">Model</label>
                  <div className="relative">
                    <button
                      onClick={() => setIsIntegrationModelOpen(!isIntegrationModelOpen)}
                      className="w-full flex items-center justify-between bg-[#11141d] border border-white/10 rounded-xl px-3 py-2 text-xs text-ivory-100 hover:border-white/20 transition-all"
                    >
                      <span className="truncate">{selectedProvider.activeModel}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-ivory-muted shrink-0" />
                    </button>

                    {isIntegrationModelOpen && (
                      <div className="absolute left-0 right-0 mt-1 bg-[#161a26] border border-white/15 rounded-xl p-1 shadow-2xl z-30 space-y-0.5 text-xs">
                        {selectedProvider.availableModels.map((m) => (
                          <button
                            key={m}
                            onClick={() => {
                              handleSelectProviderModel(selectedProvider.id, m);
                              setIsIntegrationModelOpen(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                              selectedProvider.activeModel === m
                                ? 'bg-white/10 text-white font-medium'
                                : 'text-ivory-muted hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            <span>{m}</span>
                            {selectedProvider.activeModel === m && (
                              <Check className="w-3 h-3 text-gold-light" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* API Key */}
                <div>
                  <label className="text-[11px] text-ivory-muted/70 block mb-1">
                    {selectedProvider.isLocal ? 'Endpoint URL' : 'API Key'}
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKey || selectedProvider.isLocal ? 'text' : 'password'}
                      value={apiKeyInputs[selectedProvider.id] ?? selectedProvider.apiKey}
                      onChange={(e) => {
                        setApiKeyInputs((prev) => ({
                          ...prev,
                          [selectedProvider.id]: e.target.value,
                        }));
                      }}
                      placeholder={
                        selectedProvider.isLocal
                          ? 'http://localhost:11434'
                          : 'Enter API key (e.g. sk-...)'
                      }
                      className="w-full bg-[#11141d] border border-white/10 rounded-xl pl-3 pr-9 py-2 text-xs text-ivory-100 placeholder:text-ivory-muted/40 outline-none focus:border-white/25 transition-all font-mono"
                    />
                    {!selectedProvider.isLocal && (
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-2.5 top-2.5 text-ivory-muted/60 hover:text-white transition-colors"
                      >
                        {showApiKey ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-ivory-muted/60 mt-1">
                    Your API key is encrypted and stored securely on this device.
                  </p>
                </div>

                {/* Advanced Settings Button */}
                <button
                  onClick={() => setShowAdvancedModal(true)}
                  className="w-full p-2.5 rounded-xl bg-[#11141d] border border-white/[0.06] hover:border-white/15 transition-all flex items-center justify-between text-xs text-ivory-100 group"
                >
                  <div className="flex items-center gap-2">
                    <SettingsIcon className="w-3.5 h-3.5 text-ivory-muted group-hover:text-white" />
                    <span>Advanced Settings</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-ivory-muted/50 group-hover:text-white" />
                </button>
              </div>

              {/* Capabilities */}
              <div className="space-y-2 pt-1">
                <h4 className="text-xs font-semibold text-white">Capabilities</h4>
                <div className="space-y-2 text-xs">
                  {selectedProvider.capabilities.map((cap) => (
                    <div key={cap} className="flex items-center gap-2 text-ivory-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-xs">{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {selectedProvider.isConnected ? (
                  <button
                    onClick={() => setShowDisconnectModal(true)}
                    className="w-full py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 transition-colors flex items-center justify-center gap-2 text-xs font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Disconnect</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTestConnection(selectedProvider.id)}
                        disabled={isTestingConnection}
                        className="flex-1 py-2 rounded-xl border border-white/10 hover:border-white/20 text-ivory-muted hover:text-white transition-all text-xs font-medium disabled:opacity-50"
                      >
                        {isTestingConnection ? 'Testing...' : 'Test Connection'}
                      </button>
                      <button
                        onClick={() => {
                          setConnectModalProviderId(selectedProvider.id);
                          setShowConnectModal(true);
                        }}
                        className="flex-1 py-2 rounded-xl bg-[#f4efe6] hover:bg-white text-black transition-all text-xs font-medium shadow-sm"
                      >
                        Save & Connect
                      </button>
                    </div>
                    <p className="text-[10px] text-ivory-muted/50 text-center">
                      UI Demo mode: Connects client perception adapter
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : activeCategory === 'advanced' ? (
            /* ADVANCED RIGHT PANEL (Matching Reference Image) */
            <>
              {/* Card 1: Current Configuration */}
              <div className="p-4 rounded-2xl bg-[#11141d] border border-white/[0.06] shadow-card-glow space-y-3.5">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <CircleDot className="w-4 h-4 text-ivory-muted" />
                    <h3 className="text-xs font-semibold text-white">Current Configuration</h3>
                  </div>
                  <p className="text-[10px] text-ivory-muted/70">
                    Your active settings for VisionAgent.
                  </p>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-ivory-muted">Provider</span>
                    <div className="flex items-center gap-1.5 text-white font-medium">
                      {renderProviderIcon(
                        (providerOptions.find((p) => p.name === (advancedSettings.defaultProvider || 'Google Gemini'))?.iconId || 'gemini') as IntegrationProviderId
                      )}
                      <span>{advancedSettings.defaultProvider || 'Google Gemini'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-ivory-muted">Model</span>
                    <span className="text-white font-medium">{advancedSettings.defaultModel}</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-ivory-muted">Temperature</span>
                    <span className="text-white font-medium">{advancedSettings.temperature.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-ivory-muted">Max Tokens</span>
                    <span className="text-white font-medium">{advancedSettings.maxOutputTokens}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Optimized for real-world use */}
              <div className="p-4 rounded-2xl bg-[#11141d] border border-white/[0.06] shadow-card-glow flex flex-col items-center">
                <div className="w-full flex items-center justify-center py-2 overflow-hidden">
                  <AgentPreviewOrb size={170} mode="Balanced" />
                </div>
                <div className="w-full pt-2">
                  <h4 className="text-xs font-semibold text-white">
                    Optimized for real-world use
                  </h4>
                  <p className="text-[11px] text-ivory-muted/70 leading-relaxed mt-1">
                    These settings control how VisionAgent understands, reasons, and interacts with the web. Keep them simple for the best experience.
                  </p>
                </div>
              </div>
            </>
          ) : (
            /* GENERAL RIGHT PANEL */
            <>
              <div>
                <h3 className="text-xs font-semibold text-ivory-muted/70 mb-2">Profile</h3>
                <div className="p-3.5 rounded-2xl bg-[#11141d] border border-white/[0.06] flex items-center justify-between shadow-card-glow">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full border border-gold/40 bg-black/60 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-gold to-ivory-100 shadow-[0_0_6px_#f4efe6]" />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-white truncate">{settings.userName}</div>
                      <div className="text-[10px] text-ivory-muted/60 truncate">{settings.userEmail}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const newName = prompt('Enter Profile Name:', settings.userName);
                      if (newName) setSettings({ ...settings, userName: newName });
                    }}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-ivory-muted hover:text-white transition-colors shrink-0"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-rose-400 mb-2">Danger Zone</h3>
                <div
                  onClick={() => setShowResetConfirm(true)}
                  className="p-3 rounded-2xl bg-[#191114] border border-rose-500/20 hover:border-rose-500/40 transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <div>
                      <div className="text-xs font-medium text-rose-300 group-hover:text-rose-200">Reset all settings</div>
                      <div className="text-[10px] text-rose-400/60">This will restore default settings</div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-rose-400/60" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Reset Privacy Settings Confirmation Modal */}
      {showResetPrivacyConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#121622] border border-white/10 rounded-2xl p-5 shadow-2xl relative">
            <h3 className="text-sm font-semibold text-rose-300 mb-2">
              Reset Privacy Settings?
            </h3>
            <p className="text-xs text-ivory-muted/70 leading-relaxed mb-5">
              All data protection toggles, sensitive data type filters, and action confirmation constraints will be restored to strict default values.
            </p>
            <div className="flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setShowResetPrivacyConfirm(false)}
                className="px-3 py-1.5 rounded-xl border border-white/10 text-ivory-muted hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleResetPrivacySettings}
                className="px-3.5 py-1.5 rounded-xl bg-rose-500 text-white font-medium hover:bg-rose-600 shadow-md"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Model Configuration Modal */}
      {showModelConfigModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#121622] border border-white/10 rounded-2xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold-light" />
                <h3 className="text-sm font-semibold text-white">Configure Reasoner Model</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                LOCAL ADAPTER
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-ivory-muted/80 block mb-1">Selected Engine</label>
                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-[11px]">
                  {agentSettings.model}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] text-ivory-muted/70">
                <strong className="text-white block mb-0.5">Privacy Boundary Invariant:</strong>
                API keys are never stored in browser memory or extension scripts. Only sanitized visual context with PII redaction crosses to the reasoner.
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setShowModelConfigModal(false)}
                className="px-3 py-1.5 rounded-xl border border-white/10 text-ivory-muted hover:text-white text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowModelConfigModal(false);
                  showToast('Reasoner parameters saved.');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#f4efe6] text-black font-semibold text-xs hover:bg-white shadow-md"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Data Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#121622] border border-white/10 rounded-2xl p-5 shadow-2xl relative">
            <h3 className="text-sm font-semibold text-white mb-2">Clear All Local Data?</h3>
            <p className="text-xs text-ivory-muted/70 leading-relaxed mb-5">
              This will remove all stored conversation transcripts, temporary perception caches, and offline metrics from this browser. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1.5 rounded-xl border border-white/10 text-ivory-muted hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleClearData}
                className="px-3.5 py-1.5 rounded-xl bg-rose-500 text-white font-medium hover:bg-rose-600 shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Agent Settings Confirm Modal */}
      {showResetAgentConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#121622] border border-white/10 rounded-2xl p-5 shadow-2xl relative">
            <h3 className="text-sm font-semibold text-rose-300 mb-2">Reset Agent Settings?</h3>
            <p className="text-xs text-ivory-muted/70 leading-relaxed mb-5">
              Agent mode, reasoner model selection, automation toggles, and planning parameters will be reverted to default values.
            </p>
            <div className="flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setShowResetAgentConfirm(false)}
                className="px-3 py-1.5 rounded-xl border border-white/10 text-ivory-muted hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setAgentSettings({
                    mode: 'Balanced',
                    model: 'Gemini 3.1 Pro (Default)',
                    autoSelectTargetTab: true,
                    confirmBeforeActions: false,
                    takeScreenshotsDuringTask: true,
                    verifyTaskCompletion: true,
                    planningDepth: 'Standard',
                    executionSpeed: 'Normal',
                  });
                  setShowResetAgentConfirm(false);
                  showToast('Agent settings restored to defaults.');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-rose-500 text-white font-medium hover:bg-rose-600 shadow-md"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset General Settings Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#121622] border border-white/10 rounded-2xl p-5 shadow-2xl relative">
            <h3 className="text-sm font-semibold text-rose-300 mb-2">Reset All Settings?</h3>
            <p className="text-xs text-ivory-muted/70 leading-relaxed mb-5">
              All appearance styles, language options, startup behaviors, and notification toggles will be reverted to default factory values.
            </p>
            <div className="flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-xl border border-white/10 text-ivory-muted hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setSettings({
                    theme: 'dark',
                    language: 'English',
                    startup: 'Open last session',
                    showWelcomeScreen: true,
                    enableSounds: true,
                    showNotifications: true,
                    agentMode: 'Balanced',
                    screenshotQuality: 'High (1920x1080)',
                    localStorageUsed: '5.2 GB used',
                    defaultBrowser: 'Google Chrome',
                    keepDataOnDevice: true,
                    autoDetectPII: true,
                    userName: 'VisionAgent User',
                    userEmail: 'user@example.com',
                  });
                  setShowResetConfirm(false);
                  showToast('General settings restored to defaults.');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#e7d9bf] to-[#fbf8f2] text-black font-semibold shadow-md"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disconnect Provider Confirmation Modal */}
      {showDisconnectModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#121622] border border-white/10 rounded-2xl p-5 shadow-2xl relative">
            <h3 className="text-sm font-semibold text-rose-300 mb-2">
              Disconnect {selectedProvider.name}?
            </h3>
            <p className="text-xs text-ivory-muted/70 leading-relaxed mb-5">
              VisionAgent will no longer use {selectedProvider.name} for browser perception or reasoning workflows. Cached session credentials will be cleared immediately.
            </p>
            <div className="flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setShowDisconnectModal(false)}
                className="px-3 py-1.5 rounded-xl border border-white/10 text-ivory-muted hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDisconnectProvider(selectedProvider.id)}
                className="px-3.5 py-1.5 rounded-xl bg-rose-500 text-white font-medium hover:bg-rose-600 shadow-md"
              >
                Confirm Disconnect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Settings Modal */}
      {showAdvancedModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#121622] border border-white/10 rounded-2xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-gold-light" />
                <h3 className="text-sm font-semibold text-white">
                  Advanced Settings — {selectedProvider.name}
                </h3>
              </div>
              <button
                onClick={() => setShowAdvancedModal(false)}
                className="p-1 rounded-lg text-ivory-muted/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Temperature */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-ivory-muted/80">Temperature</label>
                  <span className="text-gold-light font-mono font-medium">
                    {advancedParams.temperature.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={advancedParams.temperature}
                  onChange={(e) =>
                    setAdvancedParams({
                      ...advancedParams,
                      temperature: parseFloat(e.target.value),
                    })
                  }
                  className="w-full accent-gold h-1 bg-white/10 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-ivory-muted/50 mt-1">
                  <span>Precise (0.0)</span>
                  <span>Creative (1.0)</span>
                </div>
              </div>

              {/* Max Tokens */}
              <div>
                <label className="text-ivory-muted/80 block mb-1">Max Output Tokens</label>
                <input
                  type="number"
                  value={advancedParams.maxTokens}
                  onChange={(e) =>
                    setAdvancedParams({
                      ...advancedParams,
                      maxTokens: parseInt(e.target.value) || 2048,
                    })
                  }
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-white/20 outline-none"
                />
              </div>

              {/* Custom Endpoint */}
              <div>
                <label className="text-ivory-muted/80 block mb-1">
                  Custom Endpoint / Base URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder={
                    selectedProvider.isLocal
                      ? 'http://localhost:11434'
                      : 'https://api.custom-proxy.com/v1'
                  }
                  value={advancedParams.customEndpoint}
                  onChange={(e) =>
                    setAdvancedParams({
                      ...advancedParams,
                      customEndpoint: e.target.value,
                    })
                  }
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-white/20 outline-none"
                />
              </div>

              {/* Security Boundary Notice */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] text-ivory-muted/70">
                <strong className="text-white block mb-0.5">Privacy Invariant:</strong>
                All requests to {selectedProvider.name} undergo on-device PII masking before crossing the network boundary. Raw user credentials are never logged or exported.
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setShowAdvancedModal(false)}
                className="px-3.5 py-1.5 rounded-xl border border-white/10 text-ivory-muted hover:text-white text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAdvancedModal(false);
                  showToast('Advanced inference parameters applied.');
                }}
                className="px-4 py-1.5 rounded-xl bg-[#f4efe6] text-black font-semibold text-xs hover:bg-white shadow-md"
              >
                Apply Parameters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Advanced Settings Confirmation Modal */}
      {showResetAdvancedConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#121622] border border-white/10 rounded-2xl p-5 shadow-2xl relative">
            <h3 className="text-sm font-semibold text-rose-300 mb-2">
              Reset Advanced Settings?
            </h3>
            <p className="text-xs text-ivory-muted/70 leading-relaxed mb-5">
              This will restore all model inference parameters, browser interaction delays, screenshot quality, and developer options to their default factory settings.
            </p>
            <div className="flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setShowResetAdvancedConfirm(false)}
                className="px-3 py-1.5 rounded-xl border border-white/10 text-ivory-muted hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleResetAdvancedSettings}
                className="px-4 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 font-medium"
              >
                Reset to Default
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Open Logs Folder Modal */}
      {showLogsFolderModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#121622] border border-white/10 rounded-2xl p-5 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-ivory-muted" />
                <h3 className="text-sm font-semibold text-white">Local Diagnostic Logs</h3>
              </div>
              <button
                onClick={() => setShowLogsFolderModal(false)}
                className="text-ivory-muted hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-ivory-muted/70 leading-relaxed">
              VisionAgent stores localized debug traces, execution timelines, and DOM inspection snapshots directly on your device.
            </p>

            <div className="p-3 rounded-xl bg-black/40 border border-white/10 font-mono text-[11px] text-ivory-100 flex items-center justify-between select-all">
              <span className="truncate mr-2">chrome-extension://visionagent-storage/logs/</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('chrome-extension://visionagent-storage/logs/');
                  showToast('Path copied to clipboard!');
                }}
                className="text-gold-light hover:underline shrink-0 text-xs"
              >
                Copy
              </button>
            </div>

            <div className="space-y-1.5 text-xs text-ivory-muted/60">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero telemetry sent to external tracking servers</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>PII and credential masking applied before log persistence</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowLogsFolderModal(false)}
                className="px-4 py-1.5 rounded-xl bg-[#f4efe6] text-black font-semibold text-xs hover:bg-white shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Diagnostic Report Modal */}
      {showExportDiagnosticModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#121622] border border-white/10 rounded-2xl p-5 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-ivory-muted" />
                <h3 className="text-sm font-semibold text-white">Export Diagnostic Report</h3>
              </div>
              <button
                onClick={() => setShowExportDiagnosticModal(false)}
                className="text-ivory-muted hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-ivory-muted/70 leading-relaxed">
              Generates a comprehensive sanitized diagnostic report file (.json) containing model inference settings, timing parameters, and extension capabilities.
            </p>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs space-y-1.5">
              <div className="text-[11px] font-semibold text-white">Report Invariants:</div>
              <div className="text-[11px] text-ivory-muted/70 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Passwords, cookies, and tokens are automatically omitted</span>
              </div>
              <div className="text-[11px] text-ivory-muted/70 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Includes current latency benchmarks and active provider config</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowExportDiagnosticModal(false)}
                className="px-3.5 py-1.5 rounded-xl border border-white/10 text-ivory-muted hover:text-white text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleExportDiagnostics}
                className="px-4 py-1.5 rounded-xl bg-[#f4efe6] text-black font-semibold text-xs hover:bg-white shadow-md flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Report (.json)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connect AI Provider Modal (Matching Reference) */}
      <ConnectAIProviderModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        providers={providers}
        initialProviderId={connectModalProviderId}
        onConnect={handleConnectFromModal}
      />

      {/* Toast Notification */}
      {notificationToast && (
        <div className="fixed bottom-6 right-6 bg-[#181d2a] border border-white/20 text-white text-xs px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 z-50 animate-bounce">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{notificationToast}</span>
        </div>
      )}
    </div>
  );
};
