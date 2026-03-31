/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { createComponent } from '@lit-labs/react';
import * as React from 'react';
import { NrPresenceElement } from './presence.component.js';
import { NrPresenceAvatarsElement } from './presence-avatars.component.js';
import { NrPresenceChatElement } from './presence-chat.component.js';

export const NrPresence = createComponent({
  tagName: 'nr-presence',
  elementClass: NrPresenceElement,
  react: React,
  events: {
    'presence-changed': 'presence-changed',
  },
});

export const NrPresenceAvatars = createComponent({
  tagName: 'nr-presence-avatars',
  elementClass: NrPresenceAvatarsElement,
  react: React,
  events: {
    'user-click': 'user-click',
  },
});

export const NrPresenceChat = createComponent({
  tagName: 'nr-presence-chat',
  elementClass: NrPresenceChatElement,
  react: React,
  events: {
    'drag-start': 'drag-start',
    'minimize': 'minimize',
    'restore': 'restore',
    'float': 'float',
    'close': 'close',
    'send': 'send',
    'focus': 'focus',
  },
});
