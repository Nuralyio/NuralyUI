/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import virtual from '@rollup/plugin-virtual';
import gzipPlugin from 'rollup-plugin-gzip';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Helper to format bytes as human-readable
const formatBytes = (bytes) => {
  if (!bytes || bytes <= 0) return '0 B';
  const KB = 1024;
  const MB = KB * 1024;
  if (bytes >= MB) return `${(bytes / MB).toFixed(2)} MB`;
  if (bytes >= KB) return `${(bytes / KB).toFixed(2)} kB`;
  return `${bytes} B`;
};

// Custom summary that shows raw and gzip sizes in a single table per bundle
const gzipSummary = () => ({
  name: 'gzip-summary',
  generateBundle(outputOptions, bundle) {
    // Find the main JS and its gzip asset
    const files = Object.values(bundle);
    const js = files.find((f) => f.fileName && f.fileName.endsWith('bundle.js'));
    const jsBytes = js
      ? (js.type === 'chunk'
          ? Buffer.byteLength(js.code || '', 'utf8')
          : (typeof js.source === 'string' ? Buffer.byteLength(js.source, 'utf8') : (js.source?.byteLength || 0)))
      : 0;
    // Compute gzip size directly from JS code to ensure availability in summary
    const jsContent = js
      ? (js.type === 'chunk' ? (js.code || '') : (typeof js.source === 'string' ? js.source : (js.source?.toString('utf8') || '')))
      : '';
    let gzBytes = 0;
    try {
      const gzBuf = zlib.gzipSync(jsContent, { level: 9 });
      gzBytes = gzBuf.length;
    } catch (e) {
      gzBytes = 0;
    }

    const header = `Build summary for ${outputOptions.file} - es`;
    const rows = [
      ['File name', 'Size', 'Gzip'],
      ['---------', '----------', '----------'],
      ['bundle.js', formatBytes(jsBytes), formatBytes(gzBytes)],
    ];

    const colWidths = [
      Math.max(...rows.map((r) => r[0].length)),
      Math.max(...rows.map((r) => r[1].length)),
      Math.max(...rows.map((r) => r[2].length)),
    ];

    const pad = (str, len) => str + ' '.repeat(len - str.length);
    const line = (lhs, mid, rhs) => `│ ${pad(lhs, colWidths[0])} │ ${pad(mid, colWidths[1])} │ ${pad(rhs, colWidths[2])} │`;
    const top = `┌${'─'.repeat(colWidths[0] + 2)}┬${'─'.repeat(colWidths[1] + 2)}┬${'─'.repeat(colWidths[2] + 2)}┐`;
    const sep = `│ ${'-'.repeat(colWidths[0])} │ ${'-'.repeat(colWidths[1])} │ ${'-'.repeat(colWidths[2])} │`;
    const bot = `└${'─'.repeat(colWidths[0] + 2)}┴${'─'.repeat(colWidths[1] + 2)}┴${'─'.repeat(colWidths[2] + 2)}┘`;

    // Print table
    console.log('\n' + header);
    console.log(top);
    console.log(line(rows[0][0], rows[0][1], rows[0][2]));
    console.log(sep);
    console.log(line(rows[2][0], rows[2][1], rows[2][2]));
    console.log(bot + '\n');
  },
});

// Discover components dynamically from built JS in dist/src/components
const distComponentsDir = path.join(process.cwd(), 'dist', 'src', 'components');
let components = [];
try {
  components = fs
    .readdirSync(distComponentsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .filter((d) => fs.existsSync(path.join(distComponentsDir, d.name, 'index.js')))
    .map((d) => d.name)
    .sort();
} catch (e) {
  // If dist not built yet, fallback to previous static list
  components = [
  ];
}

const createConfig = (component) => ({
  input: `dist/src/components/${component}/index.js`,
  output: {
    file: `dist/src/components/${component}/bundle.js`,
    format: 'esm',
    inlineDynamicImports: true,
  },
  // Externalize shared deps so they are loaded once by the host (lean bundles)
  external: (id) => (
    id === 'lit' || id.startsWith('lit/') ||
    id === 'socket.io-client' || id.startsWith('socket.io-client/') ||
    id === 'codejar' || id.startsWith('codejar/') ||
    id === 'highlight.js' || id.startsWith('highlight.js/') ||
    id === 'mermaid' || id.startsWith('mermaid/') ||
    id === 'hls.js' || id.startsWith('hls.js/')
  ),
  onwarn(warning) {
    if (warning.code !== 'THIS_IS_UNDEFINED') {
      console.error(`(!) ${warning.message}`);
    }
  },
  plugins: [
    replace({ 'Reflect.decorate': 'undefined', preventAssignment: true }),
    resolve(),
    // Minify HTML and CSS inside template literals (lit html`` and css``)
    // minifyHTML({
    //   // aggressively minify CSS in css`` literals
    //   minifyCSS: true,
    //   // keep JS as-is; terser will handle it
    //   minifyJS: false,
    // }),
    terser({
      ecma: 2017,
      module: true,
      warnings: true,
      mangle: {
        properties: {
          regex: /^__/,
        },
      },
    }),
    // Emit precompressed gzip alongside bundle.js -> bundle.js.gz
    // The default naming is <asset>.gz; use fileName to force bundle.js.gz for clarity
    gzipPlugin({
      minSize: 0,
      fileName: (assetInfo) => {
        // Always emit alongside the JS as bundle.js.gz
        return 'bundle.js.gz';
      },
    }),
    gzipSummary(),
  ],
});

// Unified CDN bundle: all components in a single standalone ESM file
// Deps that can't be inlined into a browser bundle without extra plugins:
//   - socket.io-client pulls in engine.io-client → ws (Node-only)
//   - mermaid pulls in d3/chevrotain/langium (CJS + circulars)
// These stay external in the unified CDN bundle; the cdn.js loader maps them
// to ESM URLs via importmap so consumers still get a single <script> tag.
const CDN_EXTERNALS = {
  'socket.io-client': 'https://esm.sh/socket.io-client@4',
  'mermaid': 'https://esm.sh/mermaid@11',
};
const isCdnExternal = (id) => Object.keys(CDN_EXTERNALS).some(
  (dep) => id === dep || id.startsWith(dep + '/')
);

const createUnifiedConfig = () => {
  const allExportsCode = components
    .map((c) => `export * from './dist/src/components/${c}/index.js';`)
    .join('\n');

  return {
    input: 'nuralyui-all',
    output: {
      file: 'dist/nuralyui.bundle.js',
      format: 'esm',
      inlineDynamicImports: true,
    },
    external: isCdnExternal,
    onwarn(warning) {
      if (warning.code !== 'THIS_IS_UNDEFINED' && warning.code !== 'NAMESPACE_CONFLICT') {
        console.error(`(!) ${warning.message}`);
      }
    },
    plugins: [
      virtual({ 'nuralyui-all': allExportsCode }),
      replace({ 'Reflect.decorate': 'undefined', preventAssignment: true }),
      resolve({ browser: true, preferBuiltins: false }),
      commonjs({ transformMixedEsModules: true, ignoreTryCatch: true }),
      terser({
        ecma: 2017,
        module: true,
        warnings: true,
        mangle: {
          properties: {
            regex: /^__/,
          },
        },
      }),
      gzipPlugin({
        minSize: 0,
        fileName: () => 'nuralyui.bundle.js.gz',
      }),
      gzipSummary(),
    ],
  };
};

// CDN loader: one <script src=".../dist/cdn.js"> sets up the importmap for
// externalized deps then loads the unified bundle. Emitted as a classic script
// (not a module) so the importmap is injected before any module resolution.
const createCdnLoaderConfig = () => ({
  input: 'cdn-loader',
  output: {
    file: 'dist/cdn.js',
    format: 'iife',
  },
  plugins: [
    virtual({
      'cdn-loader': `
        (function () {
          var s = document.currentScript;
          var base = s && s.src ? s.src.replace(/\\/cdn\\.js(?:\\?.*)?$/, '') : '';
          var bundleUrl = base + '/nuralyui.bundle.js';
          // Importmap MUST be registered before any modulepreload / module script,
          // otherwise the browser freezes an empty map when it starts the preload.
          if (!document.querySelector('script[type="importmap"][data-nuralyui]')) {
            var im = document.createElement('script');
            im.type = 'importmap';
            im.dataset.nuralyui = '';
            im.textContent = JSON.stringify({ imports: ${JSON.stringify(CDN_EXTERNALS)} });
            document.head.appendChild(im);
          }
          var pre = document.createElement('link');
          pre.rel = 'modulepreload';
          pre.href = bundleUrl;
          pre.crossOrigin = 'anonymous';
          document.head.appendChild(pre);
          var mod = document.createElement('script');
          mod.type = 'module';
          mod.src = bundleUrl;
          document.head.appendChild(mod);
        })();
      `,
    }),
    terser({ ecma: 2017 }),
  ],
});

const configs = components.map(createConfig);
if (components.length > 0) {
  configs.push(createUnifiedConfig());
  configs.push(createCdnLoaderConfig());
}
export default configs;
