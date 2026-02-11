/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { ReactiveControllerHost } from 'lit';
import { BaseCanvasController } from './base.controller.js';
import {
  isPersistentTriggerNode,
  TriggerConnectionState,
  type WorkflowNode,
} from '../workflow-canvas.types.js';
import type { CanvasHost } from '../interfaces/index.js';

/**
 * Trigger status information for a persistent trigger node
 */
export interface TriggerStatus {
  triggerId: string;
  connectionState: TriggerConnectionState;
  health?: string;
  messagesReceived?: number;
  lastMessageAt?: string;
  stateReason?: string;
}

/**
 * Controller responsible for polling and managing persistent trigger statuses
 * (e.g., Telegram bots, Slack sockets, Discord bots, WebSocket connections).
 *
 * Extracted from the main WorkflowCanvasElement to reduce component size
 * and improve separation of concerns.
 */
export class TriggerController extends BaseCanvasController {
  /** Map of node ID -> trigger status */
  triggerStatuses: Map<string, TriggerStatus> = new Map();

  /** Polling interval handle */
  private pollingInterval: ReturnType<typeof setInterval> | null = null;

  /** Polling frequency in ms */
  private static readonly POLL_INTERVAL = 10_000;

  /** Persistent trigger node types */
  private static readonly PERSISTENT_TYPES = new Set([
    'TELEGRAM_BOT', 'SLACK_SOCKET', 'DISCORD_BOT', 'WHATSAPP_WEBHOOK', 'CUSTOM_WEBSOCKET',
  ]);

  constructor(host: CanvasHost & ReactiveControllerHost) {
    super(host);
  }

  override hostDisconnected(): void {
    this.stopPolling();
  }

  /**
   * Check if the workflow contains any persistent trigger nodes
   */
  hasPersistentTriggerNodes(): boolean {
    return this._host.workflow.nodes.some((n: WorkflowNode) => isPersistentTriggerNode(n.type));
  }

  /**
   * Start polling for trigger statuses if there are persistent trigger nodes.
   * Call this whenever the workflow changes (nodes may be added/removed).
   */
  startPollingIfNeeded(): void {
    if (this.hasPersistentTriggerNodes() && !this.pollingInterval) {
      // Fetch immediately, then poll at interval
      this.fetchStatuses();
      this.pollingInterval = setInterval(
        () => this.fetchStatuses(),
        TriggerController.POLL_INTERVAL
      );
    } else if (!this.hasPersistentTriggerNodes() && this.pollingInterval) {
      this.stopPolling();
    }
  }

  /**
   * Stop the trigger polling interval
   */
  stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  /**
   * Fetch trigger statuses from the API for all persistent trigger nodes
   */
  async fetchStatuses(): Promise<void> {
    const workflowId = this._host.workflow.id;
    if (!workflowId) return;

    try {
      // Step 1: Get all triggers for this workflow
      const triggersRes = await fetch(`/api/v1/workflows/${workflowId}/triggers`);
      if (!triggersRes.ok) return;
      const triggers: Array<{ id: string; type: string; name: string }> = await triggersRes.json();

      // Step 2: For each persistent trigger, fetch its status
      const persistentTriggers = triggers.filter(
        t => TriggerController.PERSISTENT_TYPES.has(t.type)
      );

      const statusPromises = persistentTriggers.map(async (trigger) => {
        try {
          const statusRes = await fetch(`/api/v1/triggers/${trigger.id}/status`);
          if (!statusRes.ok) return null;
          const status = await statusRes.json();
          return { trigger, status };
        } catch {
          return null;
        }
      });

      const results = await Promise.all(statusPromises);

      // Step 3: Map trigger statuses to node types
      const newStatuses = new Map<string, TriggerStatus>();

      for (const result of results) {
        if (!result) continue;
        const { trigger, status } = result;
        // Find the node in the workflow that matches this trigger type
        const matchingNode = this._host.workflow.nodes.find((n: WorkflowNode) => n.type === trigger.type);
        if (matchingNode) {
          newStatuses.set(matchingNode.id, {
            triggerId: trigger.id,
            connectionState: (status.connectionState || 'DISCONNECTED') as TriggerConnectionState,
            health: status.health,
            messagesReceived: status.messagesReceived,
            lastMessageAt: status.lastMessageAt,
            stateReason: status.stateReason,
          });
        }
      }

      this.triggerStatuses = newStatuses;
      this._host.requestUpdate();
    } catch {
      // Silently fail - trigger status is non-critical
    }
  }

  /**
   * Activate a persistent trigger (start its connection)
   */
  async activate(triggerId: string): Promise<void> {
    try {
      const res = await fetch(`/api/v1/triggers/${triggerId}/activate`, { method: 'POST' });
      if (res.ok) {
        await this.fetchStatuses();
      }
    } catch {
      // Silently fail
    }
  }

  /**
   * Deactivate a persistent trigger (stop its connection)
   */
  async deactivate(triggerId: string): Promise<void> {
    try {
      const res = await fetch(`/api/v1/triggers/${triggerId}/deactivate`, { method: 'POST' });
      if (res.ok) {
        await this.fetchStatuses();
      }
    } catch {
      // Silently fail
    }
  }

  /**
   * Get the trigger status for a specific node
   */
  getStatusForNode(nodeId: string): TriggerStatus | undefined {
    return this.triggerStatuses.get(nodeId);
  }
}
