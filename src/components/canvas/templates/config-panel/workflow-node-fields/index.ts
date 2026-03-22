/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

/**
 * Workflow node fields - organized by functional category
 *
 * Categories:
 * - communication/  — Email, Telegram, Twilio, SendGrid
 * - data-storage/   — File storage, cloud storage, message queues, vector databases
 * - ai-ml/          — Chat, embeddings, guardrails, MCP, OCR, RAG components
 * - integration/    — HubSpot, Shopify, Jira, Zendesk
 * - transform-logic/ — HTTP, functions, conditions, loops, transforms, variables, web ops
 * - document/       — Document loading and generation
 * - shared/         — Shared utilities (trigger status, KV credentials, file handling)
 */

// Communication
export * from './communication/index.js';

// Data & Storage
export * from './data-storage/index.js';

// AI/ML
export * from './ai-ml/index.js';

// Integration
export * from './integration/index.js';

// Transform & Logic
export * from './transform-logic/index.js';

// Document
export * from './document/index.js';

// Shared utilities
export { renderTriggerStatusSection, formatRelativeTime, getStatusDisplay } from './shared/index.js';
