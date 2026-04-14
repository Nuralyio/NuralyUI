# @nuraly/lumenui — jsDelivr CDN Example

Minimal standalone demo that loads `@nuraly/lumenui` components straight from
`https://cdn.jsdelivr.net` — no build step, no bundler.

## Files

- `index.html` — demo page importing the bundle as an ES module
- `server.js` — dependency-free static server (Node >= 18)

## CDN URLs used

```
https://cdn.jsdelivr.net/npm/@nuraly/lumenui@latest/dist/cdn.js
https://cdn.jsdelivr.net/npm/@nuraly/lumenui@latest/packages/themes/dist/default.css
```

`dist/cdn.js` is a tiny loader: it injects the importmap for `socket.io-client`
and `mermaid` (the only deps not inlined in the bundle), then loads
`dist/nuralyui.bundle.js`. One `<script>` tag is enough.

## Run

```bash
node server.js
# then open http://localhost:6790
```

Override the port with `PORT=3000 node server.js`.
