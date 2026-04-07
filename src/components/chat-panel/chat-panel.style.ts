import { css } from 'lit';

export const chatPanelStyles = css`
  :host { display: flex; flex-direction: column; flex: 1; min-height: 0; overflow: hidden; }

  /* Messages */
  .chat-messages { flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 2px; }
  .chat-messages::before { content: ''; flex: 1; }
  .date-sep { align-self: center; font-size: 11px; color: var(--text-secondary, #536471); background: var(--input-bg, #f2f2f7); padding: 3px 10px; border-radius: 9999px; margin: 8px 0; }
  .msg-row { display: flex; gap: 6px; align-items: flex-end; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; }
  .msg-row .msg { -webkit-user-select: text; user-select: text; }
  .msg-row.me { flex-direction: row-reverse; }
  .msg-avatar { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 600; color: #fff; flex-shrink: 0; margin-bottom: 16px; }
  .msg-sender-name { font-size: 10px; font-weight: 600; padding: 0 4px; margin-bottom: 1px; }
  .msg-bubble { max-width: 75%; }
  .msg { padding: 7px 12px; border-radius: 16px; font-size: 13px; line-height: 1.4; word-wrap: break-word; }
  .msg.me { background: var(--accent, #7c3aed); color: #fff; border-bottom-right-radius: 4px; }
  .msg.them { background: var(--input-bg, #f2f2f7); color: var(--text, #1d1d1f); border-bottom-left-radius: 4px; }
  .msg-footer { display: flex; align-items: center; gap: 4px; margin-top: 1px; padding: 0 4px; }
  .msg-footer.me { justify-content: flex-end; }
  .msg-time { font-size: 10px; color: var(--text-secondary, #536471); }
  .msg-read { display: flex; align-items: center; }
  .msg-read svg { width: 14px; height: 14px; }

  /* Attachments */
  .msg-attachment { margin-top: 4px; }
  .msg-attachment img { max-width: 200px; border-radius: 8px; cursor: pointer; display: block; }
  .msg-attachment .file-card { display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: var(--input-bg, #f2f2f7); border-radius: 10px; font-size: 12px; text-decoration: none; color: var(--text); cursor: pointer; min-width: 160px; }
  .msg-attachment .file-card:hover { background: var(--border, #e5e7eb); }

  /* Audio player */
  .audio-msg { display: flex; align-items: center; gap: 6px; padding: 6px 10px; background: var(--input-bg, #f2f2f7); border-radius: 16px; min-width: 180px; }
  .audio-play-btn { width: 28px; height: 28px; border-radius: 50%; border: none; background: var(--accent, #7c3aed); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .audio-bars { flex: 1; display: flex; align-items: center; gap: 1.5px; height: 24px; }
  .a-bar { width: 2.5px; min-height: 3px; border-radius: 1.5px; background: rgba(0,0,0,0.2); transition: background 0.1s; }
  .a-bar.played { background: var(--accent, #7c3aed); }
  .audio-dur { font-size: 10px; color: var(--text-secondary); font-variant-numeric: tabular-nums; flex-shrink: 0; min-width: 28px; text-align: right; }
  .audio-msg audio { display: none; }
  .me .audio-msg { background: rgba(255,255,255,0.15); }
  .me .audio-play-btn { background: #fff; color: var(--accent, #7c3aed); }
  .me .a-bar { background: rgba(255,255,255,0.3); }
  .me .a-bar.played { background: #fff; }
  .me .audio-dur { color: rgba(255,255,255,0.7); }

  /* Call logs */
  .msg-call-log { display: flex; align-items: center; gap: 8px; padding: 6px 10px; background: var(--input-bg, #f2f2f7); border-radius: 10px; min-width: 160px; }
  .msg-call-info { flex: 1; }
  .msg-call-type { font-size: 12px; font-weight: 600; }
  .msg-call-status { font-size: 10px; color: var(--text-secondary); }
  .msg-call-status.missed, .msg-call-status.declined { color: #ef4444; }
  .msg-call-status.completed { color: #22c55e; }

  /* Reactions */
  .msg-reactions { display: flex; gap: 3px; margin-top: 2px; padding: 0 4px; flex-wrap: wrap; }
  .msg-reactions .reaction { display: inline-flex; align-items: center; gap: 2px; padding: 1px 6px; border-radius: 10px; background: var(--input-bg, #f2f2f7); font-size: 11px; cursor: pointer; border: 1px solid transparent; transition: transform 0.12s; }
  .msg-reactions .reaction:hover { border-color: var(--accent, #7c3aed); transform: scale(1.05); }
  .msg-reactions .reaction.mine { background: color-mix(in srgb, var(--accent, #7c3aed) 15%, transparent); border-color: var(--accent, #7c3aed); }
  .msg-reactions .reaction svg { width: 12px; height: 12px; }
  .msg-reactions .reaction .count { font-size: 10px; color: var(--text-secondary); }

  /* Reply quote */
  .msg-reply-quote { font-size: 10px; color: var(--text-secondary); padding: 3px 6px; margin-bottom: 2px; border-left: 2px solid var(--accent, #7c3aed); border-radius: 2px; background: rgba(124,58,237,0.05); }
  .reply-bar { display: flex; align-items: center; gap: 6px; padding: 4px 12px; background: var(--input-bg, #f2f2f7); border-left: 3px solid var(--accent, #7c3aed); font-size: 11px; color: var(--text-secondary); }
  .reply-bar .reply-text { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .reply-bar button { border: none; background: none; cursor: pointer; color: var(--text-secondary); font-size: 14px; padding: 2px; }

  /* Edited/deleted/encrypted */
  .msg-edited { font-size: 9px; color: var(--text-secondary); font-style: italic; }
  .msg-deleted { font-style: italic; color: var(--text-secondary); }
  .msg-e2e { font-size: 9px; margin-left: 3px; opacity: 0.6; }

  /* Inline edit */
  .edit-inline { display: flex; align-items: center; gap: 3px; }
  .edit-input { flex: 1; border: 1px solid var(--accent, #7c3aed); border-radius: 6px; padding: 3px 6px; font-size: 12px; outline: none; background: var(--bg, #fff); color: var(--text); min-width: 80px; }
  .edit-confirm, .edit-cancel { border: none; background: none; cursor: pointer; font-size: 13px; padding: 2px 3px; border-radius: 3px; }
  .edit-confirm { color: #16a34a; }
  .edit-cancel { color: #dc2626; }

  /* Context menu */
  .ctx-menu { position: fixed; background: var(--bg, #fff); border: 1px solid var(--border, #e5e7eb); border-radius: 12px; padding: 3px 0; box-shadow: 0 6px 24px rgba(0,0,0,0.12); z-index: 20; min-width: 120px; backdrop-filter: blur(12px); }
  .ctx-menu button { display: flex; align-items: center; gap: 6px; width: 100%; padding: 6px 12px; border: none; background: none; font-size: 12px; color: var(--text); cursor: pointer; text-align: left; }
  .ctx-menu button:hover { background: var(--input-bg); }
  .ctx-menu button.danger { color: #dc2626; }
  .ctx-reactions { display: flex; gap: 3px; padding: 6px 8px; border-bottom: 1px solid var(--border); }
  .ctx-reactions button { width: 30px; height: 30px; padding: 0; min-width: auto; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: transform 0.12s, background 0.12s; }
  .ctx-reactions button:hover { background: var(--input-bg); transform: scale(1.2); }
  .ctx-reactions button svg { width: 16px; height: 16px; }

  /* Emoji picker */
  .emoji-picker { position: absolute; bottom: 50px; left: 8px; background: var(--bg, #fff); border: 1px solid var(--border); border-radius: 12px; padding: 5px; box-shadow: 0 6px 24px rgba(0,0,0,0.12); z-index: 10; max-height: 200px; overflow-y: auto; }
  .emoji-picker .emoji-quick { display: flex; gap: 3px; padding: 3px 2px 5px; border-bottom: 1px solid var(--border); margin-bottom: 3px; }
  .emoji-picker .emoji-quick button { width: 30px; height: 30px; border: none; background: none; cursor: pointer; border-radius: 50%; display: flex; align-items: center; justify-content: center; padding: 0; }
  .emoji-picker .emoji-quick button:hover { background: var(--input-bg); transform: scale(1.2); }
  .emoji-picker .emoji-grid { display: grid; grid-template-columns: repeat(8, 1fr); gap: 1px; }
  .emoji-picker .emoji-grid button { width: 28px; height: 28px; border: none; background: none; font-size: 16px; cursor: pointer; border-radius: 5px; display: flex; align-items: center; justify-content: center; }
  .emoji-picker .emoji-grid button:hover { background: var(--input-bg); transform: scale(1.1); }

  /* Typing indicator */
  .typing-indicator { padding: 3px 12px; font-size: 11px; color: var(--text-secondary); font-style: italic; }

  /* Input bar */
  .chat-input { display: flex; gap: 6px; padding: 8px 10px; border-top: 1px solid var(--border, #e5e7eb); align-items: center; flex-shrink: 0; position: relative; }
  .chat-input textarea { flex: 1; padding: 8px 12px; border: 1px solid var(--border, #e5e7eb); border-radius: 18px; font-size: 13px; outline: none; background: var(--input-bg, #f2f2f7); resize: none; font-family: inherit; line-height: 1.4; max-height: 80px; overflow-y: auto; }
  .chat-input textarea:focus { border-color: var(--accent, #7c3aed); background: var(--bg, #fff); }
  .input-tools { display: flex; gap: 1px; }
  .input-tools button { width: 30px; height: 30px; border: none; background: none; color: var(--text-secondary); cursor: pointer; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  .input-tools button:hover { background: var(--input-bg); color: var(--accent); }
  .send-btn { width: 32px; height: 32px; border: none; background: var(--accent, #7c3aed); color: #fff; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .send-btn:hover { background: var(--accent-hover, #6d28d9); }

  /* Empty state */
  .empty-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-secondary); gap: 6px; padding: 24px; }
  .empty-state svg { width: 36px; height: 36px; opacity: 0.4; }
  .empty-state span { font-size: 12px; }

  /* Loading */
  .loading { flex: 1; display: flex; align-items: center; justify-content: center; color: var(--text-secondary); font-size: 12px; }

  /* Full-size mode overrides */
  :host(:not([compact])) .msg { font-size: 14px; padding: 8px 14px; border-radius: 18px; }
  :host(:not([compact])) .msg-bubble { max-width: 65%; }
  :host(:not([compact])) .msg-avatar { width: 24px; height: 24px; font-size: 10px; }
  :host(:not([compact])) .chat-messages { padding: 16px; }
  :host(:not([compact])) .chat-input textarea { font-size: 14px; padding: 10px 16px; }
  :host(:not([compact])) .chat-input { padding: 10px 16px; }
  :host(:not([compact])) .send-btn { width: 38px; height: 38px; }
`;
