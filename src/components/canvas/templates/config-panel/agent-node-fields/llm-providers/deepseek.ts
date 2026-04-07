/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { ProviderConfig } from './types.js';

export const deepseekConfig: ProviderConfig = {
  id: 'deepseek',
  label: 'DeepSeek',
  defaultModel: 'deepseek-chat',
  modelPlaceholder: 'deepseek-chat, deepseek-reasoner...',
  modelOptions: [
    { label: 'DeepSeek-V3 (Chat)', value: 'deepseek-chat' },
    { label: 'DeepSeek-R1 (Reasoner)', value: 'deepseek-reasoner' },
  ],
  requiresApiKey: true,
  requiresApiUrl: false,
  apiKeyDescription: 'Select or create a DeepSeek API key',
  defaultMaxTokens: 4096,
};
