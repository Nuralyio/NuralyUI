# @nuraly/lumenui — jsDelivr CDN Example

Minimal standalone demo that loads `@nuraly/lumenui` components straight from
`https://cdn.jsdelivr.net` — no build step, no bundler.

## Files

- `index.html` — demo page importing the bundle as an ES module
- `server.js` — dependency-free static server (Node >= 18)

## CDN URLs used

```
https://cdn.jsdelivr.net/npm/@nuraly/lumenui@latest/dist/cdn.js
```

`dist/cdn.js` is a tiny loader: it injects the importmap for `socket.io-client`
and `mermaid` (the only deps not inlined in the bundle), then loads
`dist/nuralyui.bundle.js`. One `<script>` tag is enough — components have
built-in fallback values for every design token and render correctly without
any theme CSS.

Include the themes stylesheet only when you need it:

```
https://cdn.jsdelivr.net/npm/@nuraly/lumenui@latest/packages/themes/dist/default.css
```

Use it if you want to switch themes at runtime (light/dark/carbon/...) or
globally override design tokens from your own app.

## Run

```bash
node server.js
# then open http://localhost:6790
```

Override the port with `PORT=3000 node server.js`.
