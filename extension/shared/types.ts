export type NavigationTab = 'chat' | 'history' | 'tabs' | 'settings';

export type AgentPipelineStage = 'SEE' | 'PROTECT' | 'REASON' | 'ACT' | 'VERIFY';

export type AgentStatus = 'Ready' | 'Seeing' | 'Protecting' | 'Reasoning' | 'Acting' | 'Verifying' | 'Paused' | 'Error';

export interface PinnedTab {
  id: string;
  title: string;
  url: string;
  iconType: 'github' | 'youtube' | 'portal' | 'globe' | 'custom';
  isActive: boolean;
}

export interface TargetTab {
  id: number | string;
  title: string;
  url: string;
  favicon?: string;
  isLocked?: boolean;
}

export interface CapabilityItem {
  id: AgentPipelineStage;
  name: string;
  description: string;
  iconName: 'see' | 'protect' | 'reason' | 'act' | 'verify';
  status: 'idle' | 'active' | 'passed';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  stage?: AgentPipelineStage;
  isMock?: boolean;
  elementsFound?: number;
  piiRedacted?: number;
  confidence?: number;
}

export interface QuickAction {
  id: string;
  title: string;
  iconName: 'capture' | 'summarize' | 'analyze';
  prompt: string;
}

export interface ActionCard {
  id: string;
  title: string;
  subtitle: string;
  iconName: 'analyze' | 'summarize' | 'find' | 'automate';
  prompt: string;
}

export type TaskStatus = 'Completed' | 'Paused' | 'Failed';

export type DetailTabType = 'overview' | 'conversation' | 'actions' | 'results' | 'screenshots';

export interface KeyResultItem {
  id: string;
  title: string;
  tags: string[];
  severity: 'High' | 'Medium' | 'Low';
}

export interface HistoryTaskItem {
  id: string;
  title: string;
  url: string;
  siteType: 'github' | 'youtube' | 'portal' | 'globe' | 'doc';
  status: TaskStatus;
  time: string;
  dateGroup: 'Today' | 'Yesterday' | 'Sep 20, 2026' | string;
  fullTimestamp: string;
  summary: string;
  metrics: {
    issuesFound?: number;
    highSeverity?: number;
    completionTime: string;
    taskSuccess: string;
    piiRedacted?: number;
  };
  keyResults: KeyResultItem[];
  targetTab: {
    title: string;
    url: string;
    previewThumb?: string;
  };
  conversationSnippets?: {
    role: 'user' | 'agent';
    text: string;
    time: string;
  }[];
  actionsTrace?: {
    stage: AgentPipelineStage;
    detail: string;
    status: 'ok' | 'failed';
  }[];
}

export type TabStatusFilter = 'all' | 'active' | 'locked' | 'completed' | 'inactive';

export interface BrowserTabItem {
  id: number | string;
  title: string;
  url: string;
  domain: string;
  favicon?: string;
  siteType: 'github' | 'youtube' | 'portal' | 'globe' | 'doc';
  status: 'active' | 'locked' | 'completed' | 'inactive';
  isAgentTarget: boolean;
  windowId: number | string;
  windowName: string;
  elementCount: number;
  piiShielded: boolean;
  lastUpdated: string;
}

export type SettingsCategory =
  | 'general'
  | 'agent'
  | 'privacy'
  | 'integrations'
  | 'performance'
  | 'shortcuts'
  | 'advanced'
  | 'about';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface UserSettings {
  theme: ThemeMode;
  language: string;
  startup: string;
  showWelcomeScreen: boolean;
  enableSounds: boolean;
  showNotifications: boolean;
  agentMode: 'Balanced' | 'Fast' | 'Thorough';
  screenshotQuality: string;
  localStorageUsed: string;
  defaultBrowser: string;
  keepDataOnDevice: boolean;
  autoDetectPII: boolean;
  userName: string;
  userEmail: string;
}

export type AgentModeOption = 'Balanced' | 'Fast' | 'Careful' | 'Custom';

export interface AgentSettings {
  mode: AgentModeOption;
  model: string;
  autoSelectTargetTab: boolean;
  confirmBeforeActions: boolean;
  takeScreenshotsDuringTask: boolean;
  verifyTaskCompletion: boolean;
  planningDepth: string;
  executionSpeed: string;
}

export interface SensitiveDataTypesConfig {
  pii: boolean;
  financial: boolean;
  contact: boolean;
  credentials: boolean;
  governmentIds: boolean;
  imagesFaces: boolean;
}

export interface PrivacySecuritySettings {
  autoDetectPII: boolean;
  processScreenshotsLocally: boolean;
  sendOnlyRedactedToAI: boolean;
  sensitiveTypes: SensitiveDataTypesConfig;
  requireConfirmation: boolean;
  blockHarmfulActions: boolean;
  sandboxInteractions: boolean;
}

export type IntegrationProviderId =
  | 'gemini'
  | 'openai'
  | 'anthropic'
  | 'groq'
  | 'together'
  | 'ollama';

export interface IntegrationProvider {
  id: IntegrationProviderId;
  name: string;
  isConnected: boolean;
  activeModel: string;
  availableModels: string[];
  description: string;
  longDescription: string;
  apiKey: string;
  capabilities: string[];
  isLocal?: boolean;
  baseUrl?: string;
  temperature?: number;
  maxTokens?: number;
}

export type IntegrationFilter = 'all' | 'connected' | 'available';

export interface AdvancedSettings {
  defaultProvider?: string;
  defaultModel: string;
  temperature: number;
  maxOutputTokens: number;
  topP: number;
  requireConfirmationBeforeActions?: boolean;
  captureHighResScreenshots: boolean;
  autoScrollLongPages: boolean;
  highlightDetectedElements: boolean;
  actionDelay: number;
  enableDebugLogs: boolean;
  logLevel: 'Debug' | 'Info' | 'Warn' | 'Error';
  enableExperimentalFeatures: boolean;
  showElementBoundingBoxes: boolean;
  simulateActionsDryRun: boolean;
  allowLocalModel: boolean;
}
