/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { WorkflowNodeType } from '../../workflow-canvas.types.js';

export interface NodeHelpContent {
  title: string;
  description: string;
}

const NODE_HELP: Partial<Record<string, NodeHelpContent>> = {
  [WorkflowNodeType.LOOP]: {
    title: 'How the Loop node works',
    description:
      'Iterates over the array resolved from "arrayExpression" and runs the item-port subgraph once per element. ' +
      'Each iteration binds the current value to ${variables.<iteratorVariable>} and its position to ${variables.<iteratorVariable>_index}. ' +
      'Wire downstream nodes to the "item" port to run them per element, and to the "done" port for whatever should run after the loop finishes. ' +
      'A Break node anywhere in the item subgraph short-circuits the remaining iterations.',
  },
};

export function getNodeHelp(nodeType: string): NodeHelpContent | undefined {
  return NODE_HELP[nodeType];
}
