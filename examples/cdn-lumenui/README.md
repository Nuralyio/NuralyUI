# @nuraly/lumenui — jsDelivr CDN Example

Minimal standalone demo that loads `@nuraly/lumenui` components straight from
`https://cdn.jsdelivr.net` — no build step, no bundler.

## Files

- `index.html` — demo page importing the bundle as an ES module
- `server.js` — dependency-free static server (Node >= 18)

## CDN URLs used

```
https://cdn.jsdelivr.net/npm/@nuraly/lumenui@0.2.2/dist/nuralyui.bundle.js
https://cdn.jsdelivr.net/npm/@nuraly/lumenui@0.2.2/packages/themes/dist/default.css
```

## Run

```bash
node server.js
# then open http://localhost:6790
```

Override the port with `PORT=3000 node server.js`.
