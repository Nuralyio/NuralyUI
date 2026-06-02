import type { ChatbotFile } from '../chatbot.types.js';

const TEXT_MIME_PREFIXES = ['text/'];
const TEXT_MIME_EXACT = new Set([
  'application/json',
  'application/xml',
  'application/yaml',
  'application/x-yaml',
  'application/sql',
  'application/javascript',
  'application/typescript',
  'application/x-sh',
  'application/x-httpd-php',
  'application/x-www-form-urlencoded',
  'application/graphql',
  'application/ld+json',
  'image/svg+xml',
]);
const TEXT_EXTENSIONS = new Set([
  'json','xml','yaml','yml','md','markdown','csv','tsv','sql','toml','ini','conf','env','log','txt',
  'ts','tsx','js','jsx','mjs','cjs','py','rb','go','rs','java','kt','swift','c','h','cpp','hpp',
  'sh','bash','zsh','fish','ps1','bat','make','dockerfile','tf','hcl',
  'css','scss','sass','less','html','htm','svg','vue','svelte',
  'docflow','graphql','gql','proto',
]);

export const MAX_TEXTUAL_PREVIEW_BYTES = 512 * 1024;
export const SNIPPET_LINES = 3;
export const SNIPPET_COMPACT_THRESHOLD = 4;

export function fileExtension(file: ChatbotFile): string {
  const dot = file.name.lastIndexOf('.');
  return dot >= 0 && dot < file.name.length - 1 ? file.name.slice(dot + 1).toLowerCase() : '';
}

export function isTextualFile(file: ChatbotFile): boolean {
  const mime = (file.mimeType || '').toLowerCase();
  if (TEXT_MIME_EXACT.has(mime)) return true;
  for (const p of TEXT_MIME_PREFIXES) if (mime.startsWith(p)) return true;
  const ext = fileExtension(file);
  if (ext && TEXT_EXTENSIONS.has(ext)) return true;
  return false;
}

export interface TextualContentSuccess {
  text: string;
  truncated: boolean;
  lineCount: number;
}
export interface TextualContentError {
  error: string;
}
export type TextualContent = TextualContentSuccess | TextualContentError;

const textCache = new Map<string, Promise<TextualContent>>();

export function loadTextualContent(file: ChatbotFile): Promise<TextualContent> {
  const key = file.id || file.url || file.name;
  const cached = textCache.get(key);
  if (cached) return cached;
  const url = file.url || file.previewUrl;
  if (!url) {
    const p = Promise.resolve<TextualContent>({error: 'no-url'});
    textCache.set(key, p);
    return p;
  }
  const p = fetch(url)
    .then(async (res): Promise<TextualContent> => {
      if (!res.ok) return {error: `HTTP ${res.status}`};
      const blob = await res.blob();
      const truncated = blob.size > MAX_TEXTUAL_PREVIEW_BYTES;
      const slice = truncated ? blob.slice(0, MAX_TEXTUAL_PREVIEW_BYTES) : blob;
      const text = await slice.text();
      const lineCount = text.split('\n').length;
      return {text, truncated, lineCount};
    })
    .catch((err): TextualContent => ({error: err?.message || 'fetch-failed'}));
  textCache.set(key, p);
  return p;
}

export function snippetOf(text: string, lines = SNIPPET_LINES): string {
  return text.split('\n').slice(0, lines).join('\n');
}
