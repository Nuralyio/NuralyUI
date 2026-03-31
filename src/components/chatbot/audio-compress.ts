/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 *
 * Re-encodes any browser-recorded audio blob to OGG Opus at 32 kbps.
 * Falls back to the original blob unchanged on browsers that do not support
 * OGG Opus MediaRecorder recording (e.g. Safari).
 *
 * Pipeline:
 *   input blob → AudioContext.decodeAudioData → BufferSource → MediaStreamDestination
 *   → MediaRecorder(ogg/opus, 32 kbps) → output blob
 */

export interface CompressResult {
  blob: Blob;
  mimeType: string;
  ext: string;
}

const OGG_OPUS_MIME = 'audio/ogg;codecs=opus';
const TARGET_BITRATE = 32_000; // 32 kbps

/** Returns true if the current browser can record OGG Opus via MediaRecorder (Chrome/Firefox). */
export function canEncodeOgg(): boolean {
  try {
    return typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(OGG_OPUS_MIME);
  } catch {
    return false;
  }
}

/**
 * Re-encodes `inputBlob` to OGG Opus at 32 kbps.
 * If the browser does not support OGG Opus recording (Safari), returns the original blob unchanged.
 */
export async function compressToOpus(inputBlob: Blob, originalMime: string): Promise<CompressResult> {
  if (!canEncodeOgg()) {
    const ext = originalMime.includes('mp4') ? 'mp4' : originalMime.includes('aac') ? 'aac' : 'webm';
    return { blob: inputBlob, mimeType: originalMime, ext };
  }

  const arrayBuffer = await inputBlob.arrayBuffer();
  const decodeCtx = new AudioContext();
  let audioBuffer: AudioBuffer;
  try {
    audioBuffer = await decodeCtx.decodeAudioData(arrayBuffer);
  } finally {
    decodeCtx.close().catch(() => {});
  }

  const encodeCtx = new AudioContext({ sampleRate: audioBuffer.sampleRate });
  const destination = encodeCtx.createMediaStreamDestination();

  const recorder = new MediaRecorder(destination.stream, {
    mimeType: OGG_OPUS_MIME,
    audioBitsPerSecond: TARGET_BITRATE,
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

  const done = new Promise<void>((resolve, reject) => {
    recorder.onstop = () => resolve();
    recorder.onerror = (e) => reject((e as any).error ?? new Error('MediaRecorder error'));
  });

  recorder.start(100);

  const source = encodeCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(destination);
  source.onended = () => {
    setTimeout(() => { if (recorder.state === 'recording') recorder.stop(); }, 120);
  };
  source.start(0);

  await done;
  encodeCtx.close().catch(() => {});

  return {
    blob: new Blob(chunks, { type: OGG_OPUS_MIME }),
    mimeType: OGG_OPUS_MIME,
    ext: 'ogg',
  };
}
