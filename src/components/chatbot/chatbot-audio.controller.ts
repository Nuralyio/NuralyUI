/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import type { ReactiveController, ReactiveControllerHost } from 'lit';

export interface AudioRecordingState {
  active: boolean;
  duration: string;  // "MM:SS"
  bars: number[];    // 0–1 amplitude samples, last 40 shown live
}

export interface AudioRecordResult {
  blob: Blob;
  mimeType: string;
  duration: string;
}

const INITIAL_STATE: AudioRecordingState = { active: false, duration: '00:00', bars: [] };

export class ChatbotAudioController implements ReactiveController {
  host: ReactiveControllerHost;
  state: AudioRecordingState = { ...INITIAL_STATE };

  private _mediaRecorder: MediaRecorder | null = null;
  private _audioChunks: Blob[] = [];
  private _waveformSamples: number[] = [];
  private _analyser: AnalyserNode | null = null;
  private _timer: ReturnType<typeof setInterval> | null = null;
  private _animFrame = 0;
  private _startTime = 0;
  private _stopResolve: ((chunks: Blob[]) => void) | null = null;

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    host.addController(this);
  }

  hostConnected() {}
  hostDisconnected() { this.cancel(); }

  async start(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this._audioChunks = [];
      this._waveformSamples = [];

      // Pick best supported mime type (Safari only supports mp4/aac)
      const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/aac', '']
        .find(t => !t || MediaRecorder.isTypeSupported(t)) || '';
      this._mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

      // Web Audio analyser for live waveform
      const audioCtx = new AudioContext();
      if (audioCtx.state === 'suspended') await audioCtx.resume();
      const source = audioCtx.createMediaStreamSource(stream);
      this._analyser = audioCtx.createAnalyser();
      this._analyser.fftSize = 256;
      this._analyser.smoothingTimeConstant = 0.3;
      source.connect(this._analyser);

      this._mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) this._audioChunks.push(e.data);
      };

      this._mediaRecorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        audioCtx.close().catch(() => {});
        if (this._timer) clearInterval(this._timer);
        cancelAnimationFrame(this._animFrame);
        this._analyser = null;
        this._stopResolve?.([...this._audioChunks]);
        this._stopResolve = null;
      };

      this._mediaRecorder.start(100);
      this._startTime = Date.now();
      this.state = { active: true, duration: '00:00', bars: [] };
      this.host.requestUpdate();

      // Duration timer
      this._timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - this._startTime) / 1000);
        const m = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const s = (elapsed % 60).toString().padStart(2, '0');
        this.state = { ...this.state, duration: `${m}:${s}` };
        this.host.requestUpdate();
      }, 500);

      // Live waveform at ~12fps
      let lastSampleTime = 0;
      const sampleWaveform = () => {
        if (!this._analyser || !this.state.active) return;
        const now = performance.now();
        if (now - lastSampleTime > 80) {
          lastSampleTime = now;
          const bufLen = this._analyser.frequencyBinCount;
          const data = new Uint8Array(bufLen);
          this._analyser.getByteFrequencyData(data);
          let avg = data.reduce((sum, v) => sum + v, 0) / bufLen;
          if (avg < 1) {
            // Safari fallback: use time domain amplitude
            this._analyser.getByteTimeDomainData(data);
            let peak = 0;
            for (let j = 0; j < bufLen; j++) {
              const v = Math.abs(data[j] - 128);
              if (v > peak) peak = v;
            }
            avg = peak;
          }
          const normalized = Math.min(1, avg / 128);
          this._waveformSamples.push(normalized);
          const liveBars = this._waveformSamples.slice(-40).map(v => Math.max(0.08, v));
          this.state = { ...this.state, bars: liveBars };
          this.host.requestUpdate();
        }
        this._animFrame = requestAnimationFrame(sampleWaveform);
      };
      this._animFrame = requestAnimationFrame(sampleWaveform);
    } catch {
      console.error('[ChatbotAudio] Mic access denied');
    }
  }

  cancel(): void {
    if (this._mediaRecorder?.state === 'recording') {
      this._stopResolve = null;
      this._mediaRecorder.stop();
    }
    this._audioChunks = [];
    this._waveformSamples = [];
    if (this._timer) clearInterval(this._timer);
    cancelAnimationFrame(this._animFrame);
    this._analyser = null;
    this.state = { ...INITIAL_STATE };
    this.host.requestUpdate();
  }

  async stop(): Promise<AudioRecordResult | null> {
    if (!this._mediaRecorder || this._mediaRecorder.state !== 'recording') return null;

    const duration = this.state.duration;

    const chunks = await new Promise<Blob[]>((resolve) => {
      this._stopResolve = resolve;
      this._mediaRecorder!.stop();
    });

    // 200ms grace for final chunk flush
    await new Promise(r => setTimeout(r, 200));

    this.state = { ...INITIAL_STATE };
    this.host.requestUpdate();

    const recMime = this._mediaRecorder?.mimeType || 'audio/webm';
    const rawBlob = new Blob(chunks, { type: recMime });
    this._audioChunks = [];
    this._waveformSamples = [];

    try {
      const { compressToOpus } = await import('./audio-compress.js');
      const { blob, mimeType } = await compressToOpus(rawBlob, recMime);
      return { blob, mimeType, duration };
    } catch {
      return { blob: rawBlob, mimeType: recMime, duration };
    }
  }
}
