/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { ReactiveControllerHost } from 'lit';
import { BaseCanvasController } from './base.controller.js';
import {
  WorkflowNodeType,
  type WorkflowNode,
  type NodeConfiguration,
} from '../workflow-canvas.types.js';
import type { CanvasHost } from '../interfaces/index.js';
import { ChatbotCoreController } from '../../chatbot/core/chatbot-core.controller.js';
import { ChatbotSender } from '../../chatbot/chatbot.types.js';
import { WorkflowSocketProvider } from '../../chatbot/providers/workflow-socket-provider.js';

/** Lightweight subset of NodeExecutionData used in this controller */
export interface NodeExecutionEntry {
  id: string;
  nodeId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  inputData?: any;
  outputData?: any;
  errorMessage?: string;
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
}

/**
 * Controller responsible for preview & execution management:
 * - Chat preview (WorkflowSocketProvider integration)
 * - HTTP preview (trigger workflow via REST)
 * - Execution data fetching and processing
 *
 * Extracted from WorkflowCanvasElement to reduce component size.
 */
export class PreviewController extends BaseCanvasController {

  // -- Chat preview --
  chatPreviewController: ChatbotCoreController | null = null;
  chatPreviewProvider: WorkflowSocketProvider | null = null;

  // -- HTTP preview --
  httpPreviewBody: string = '{\n  \n}';
  httpPreviewResponse: string = '';
  httpPreviewLoading: boolean = false;
  httpPreviewError: string = '';

  // -- Execution data --
  currentExecutionId: string | null = null;
  nodeExecutionData: Map<string, NodeExecutionEntry> = new Map();

  // -- Preview target --
  previewNodeId: string | null = null;

  /** External callback for updating node statuses on the canvas */
  private _onNodeStatusChange: (statuses: Record<string, string>) => void = () => {};
  private _nodeStatuses: Record<string, string> = {};

  constructor(host: CanvasHost & ReactiveControllerHost) {
    super(host);
  }

  /** Set callback for node-status changes (used to update canvas nodeStatuses) */
  setNodeStatusCallback(cb: (statuses: Record<string, string>) => void): void {
    this._onNodeStatusChange = cb;
  }

  private setNodeStatuses(statuses: Record<string, string>): void {
    this._nodeStatuses = statuses;
    this._onNodeStatusChange(statuses);
  }

  private mergeNodeStatus(nodeId: string, status: string): void {
    this._nodeStatuses = { ...this._nodeStatuses, [nodeId]: status };
    this._onNodeStatusChange(this._nodeStatuses);
  }

  override hostDisconnected(): void {
    this.cleanupChatPreview();
  }

  // ---- Preview panel ----

  async handleNodePreview(node: WorkflowNode): Promise<void> {
    if (this.previewNodeId === node.id) {
      this.closePreview();
    } else {
      await this.cleanupChatPreview();
      this.previewNodeId = node.id;

      if (node.type === WorkflowNodeType.CHAT_START && this._host.workflow?.id) {
        await this.initializeChatPreview(this._host.workflow.id, node.configuration);
      }
      this._host.requestUpdate();
    }
  }

  closePreview(): void {
    this.previewNodeId = null;
    this.cleanupChatPreview();
    this.resetHttpPreview();
    this._host.requestUpdate();
  }

  getPreviewNode(): WorkflowNode | null {
    if (!this.previewNodeId) return null;
    return this._host.workflow.nodes.find((n: WorkflowNode) => n.id === this.previewNodeId) || null;
  }

  getPreviewPanelPosition(zoom: number, panX: number, panY: number): { x: number; y: number } | null {
    const previewNode = this.getPreviewNode();
    if (!previewNode) return null;

    const previewPanelWidth = 340;
    const panelOffset = 20;

    return {
      x: (previewNode.position.x - previewPanelWidth - panelOffset) * zoom + panX,
      y: previewNode.position.y * zoom + panY,
    };
  }

  // ---- Chat preview ----

  async initializeChatPreview(workflowId: string, nodeConfig?: NodeConfiguration): Promise<void> {
    try {
      this.chatPreviewProvider = new WorkflowSocketProvider();

      const socketUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8000';

      await this.chatPreviewProvider.connect({
        workflowId,
        socketUrl,
        socketPath: '/socket.io/workflow',
        triggerEndpoint: '/api/v1/workflows/{workflowId}/trigger/chat',
        responseTimeout: 60000,
        onMessage: (message: string) => {
          if (this.chatPreviewController) {
            this.chatPreviewController.addMessage({
              id: `bot-${Date.now()}`,
              sender: ChatbotSender.Bot,
              text: message,
              timestamp: new Date().toISOString(),
            });
          }
        },
      });

      const socket = this.chatPreviewProvider.getSocket();
      if (socket) {
        this._attachSocketListeners(socket);
      }

      const enableFileUpload = nodeConfig?.enableFileUpload === true;
      this.chatPreviewController = new ChatbotCoreController({
        provider: this.chatPreviewProvider,
        enableFileUpload,
        ui: {
          onStateChange: () => {
            this._host.requestUpdate();
          },
        },
      });
    } catch (error) {
      console.error('[Canvas] Failed to initialize chat preview:', error);
      this.chatPreviewController = null;
      this.chatPreviewProvider = null;
    }
  }

  private _attachSocketListeners(socket: any): void {
    socket.on('execution:started', (event: any) => {
      const executionId = event.data?.executionId || event.executionId;
      if (executionId) {
        this.currentExecutionId = executionId;
        this.nodeExecutionData.clear();
      }
      this.setNodeStatuses({});
    });

    socket.on('execution:node-started', (event: any) => {
      const nodeId = event.data?.nodeId || event.nodeId;
      const data = event.data || event;
      if (nodeId) {
        this.mergeNodeStatus(nodeId, 'RUNNING');
        this.nodeExecutionData.set(nodeId, {
          id: data.nodeExecutionId || nodeId,
          nodeId,
          status: 'running',
          inputData: data.inputData,
          startedAt: data.startedAt || new Date().toISOString(),
        });
        this._host.requestUpdate();
      }
    });

    socket.on('execution:node-completed', (event: any) => {
      const nodeId = event.data?.nodeId || event.nodeId;
      const data = event.data || event;
      if (nodeId) {
        this.mergeNodeStatus(nodeId, 'COMPLETED');
        const existing = this.nodeExecutionData.get(nodeId) || { id: nodeId, nodeId, status: 'completed' as const };
        this.nodeExecutionData.set(nodeId, {
          ...existing,
          status: 'completed',
          outputData: data.outputData,
          completedAt: data.completedAt || new Date().toISOString(),
          durationMs: data.durationMs,
        });
        this._host.requestUpdate();
      }
    });

    socket.on('execution:node-failed', (event: any) => {
      const nodeId = event.data?.nodeId || event.nodeId;
      const data = event.data || event;
      if (nodeId) {
        this.mergeNodeStatus(nodeId, 'FAILED');
        const existing = this.nodeExecutionData.get(nodeId) || { id: nodeId, nodeId, status: 'failed' as const };
        this.nodeExecutionData.set(nodeId, {
          ...existing,
          status: 'failed',
          errorMessage: data.errorMessage || data.error,
          completedAt: data.completedAt || new Date().toISOString(),
          durationMs: data.durationMs,
        });
        this._host.requestUpdate();
      }
    });
  }

  async cleanupChatPreview(): Promise<void> {
    if (this.chatPreviewProvider) {
      try {
        await this.chatPreviewProvider.disconnect();
      } catch (error) {
        console.error('[Canvas] Error disconnecting chat preview:', error);
      }
      this.chatPreviewProvider = null;
    }
    this.chatPreviewController = null;
  }

  // ---- HTTP preview ----

  async sendHttpPreviewRequest(): Promise<void> {
    const previewNode = this.getPreviewNode();
    if (!previewNode || !this._host.workflow?.id) return;

    this.httpPreviewLoading = true;
    this.httpPreviewError = '';
    this.httpPreviewResponse = '';
    this.setNodeStatuses({});
    this._host.requestUpdate();

    try {
      let body: any;
      try {
        body = JSON.parse(this.httpPreviewBody);
      } catch {
        throw new Error('Invalid JSON in request body');
      }

      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8000';
      const triggerUrl = `${baseUrl}/api/v1/workflows/${this._host.workflow.id}/trigger/http`;

      const response = await fetch(triggerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const executionId = response.headers.get('X-Execution-Id');
      let responseData: any;

      try {
        responseData = await response.json();
      } catch {
        responseData = await response.text();
      }

      if (!response.ok) {
        throw new Error(responseData.message || responseData || `HTTP ${response.status}`);
      }

      this.httpPreviewResponse = JSON.stringify({
        status: response.status,
        executionId,
        data: responseData,
      }, null, 2);

      if (executionId) {
        this.currentExecutionId = executionId;
        this.fetchExecutionData(executionId);
      }
    } catch (error) {
      this.httpPreviewError = error instanceof Error ? error.message : String(error);
    } finally {
      this.httpPreviewLoading = false;
      this._host.requestUpdate();
    }
  }

  resetHttpPreview(): void {
    this.httpPreviewBody = '{\n  \n}';
    this.httpPreviewResponse = '';
    this.httpPreviewError = '';
    this.httpPreviewLoading = false;
  }

  // ---- Execution data ----

  updateNodeExecution(nodeExecution: NodeExecutionEntry): void {
    this.nodeExecutionData.set(nodeExecution.nodeId, nodeExecution);
    this._host.requestUpdate();
  }

  clearExecutionData(): void {
    this.currentExecutionId = null;
    this.nodeExecutionData.clear();
    this._host.requestUpdate();
  }

  async fetchExecutionData(executionId: string): Promise<void> {
    if (!executionId) return;

    try {
      const response = await fetch(`/api/v1/workflows/${this._host.workflow?.id}/executions/${executionId}/nodes`);
      if (!response.ok) {
        const altResponse = await fetch(`/api/v1/executions/${executionId}/nodes`);
        if (!altResponse.ok) {
          console.warn('[WorkflowCanvas] Failed to fetch node executions');
          return;
        }
        const nodeExecutions = await altResponse.json();
        this.processNodeExecutions(nodeExecutions);
        return;
      }
      const nodeExecutions = await response.json();
      this.processNodeExecutions(nodeExecutions);
    } catch (error) {
      console.warn('[WorkflowCanvas] Failed to fetch execution data:', error);
    }
  }

  processNodeExecutions(nodeExecutions: Array<{
    id: string;
    nodeId: string;
    status: string;
    inputData?: string;
    outputData?: string;
    errorMessage?: string;
    startedAt?: string;
    completedAt?: string;
    durationMs?: number;
  }>): void {
    this.nodeExecutionData.clear();
    for (const nodeExec of nodeExecutions) {
      let inputData = nodeExec.inputData;
      let outputData = nodeExec.outputData;
      try {
        if (typeof inputData === 'string') inputData = JSON.parse(inputData);
      } catch { /* keep as string */ }
      try {
        if (typeof outputData === 'string') outputData = JSON.parse(outputData);
      } catch { /* keep as string */ }

      this.nodeExecutionData.set(nodeExec.nodeId, {
        id: nodeExec.id,
        nodeId: nodeExec.nodeId,
        status: nodeExec.status?.toLowerCase() as 'pending' | 'running' | 'completed' | 'failed',
        inputData,
        outputData,
        errorMessage: nodeExec.errorMessage,
        startedAt: nodeExec.startedAt,
        completedAt: nodeExec.completedAt,
        durationMs: nodeExec.durationMs,
      });
    }
    this._host.requestUpdate();
  }
}
