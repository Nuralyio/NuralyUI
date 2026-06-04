# Prompt: use the lumenui docflow diff in the main app

Paste this to an agent (or follow it yourself) when wiring the new diff feature
into the main app's docflow chat.

---

## Context

`@nuraly/lumenui@0.15.0` adds a native artifact diff view. The chatbot owns all
the rendering. The consumer app only ships data: the new docflow JSON, the
previous one, and an `isEdit` flag. From that, lumenui renders:

- the docflow flow editor (left = JSON, right = live diagram), and
- when `previousContent` is present, the JSON side shows a line-by-line **diff**
  (no tab bar), and the **diagram highlights** which step nodes were added,
  changed, or deleted. Hovering a node scrolls the diff to that step's JSON
  object and highlights the whole block.

Nothing in the app needs a diff library, a subclass, or any Lit template.

## Your task

In the main app's chatbot wiring, surface docflow **edits** with the diff view.

### 1. Upgrade the dependency

```
@nuraly/lumenui@^0.15.0
```

### 2. Register the plugins on the chatbot controller

Order matters: `FlowDiagramPlugin` must be present so docflow JSON renders as
the flow editor.

```ts
import {
  MarkdownPlugin,
  ArtifactPlugin,
  FlowDiagramPlugin,
} from '@nuraly/lumenui/chatbot/plugins';

const artifactPlugin = new ArtifactPlugin();

const controller = new ChatbotCoreController({
  provider,
  plugins: [new MarkdownPlugin(), artifactPlugin, new FlowDiagramPlugin()],
  ui: { /* existing onStateChange etc. */ },
});
chatbot.controller = controller;
chatbot.enableArtifacts = true;
```

Keep a reference to `artifactPlugin`; you call it below.

### 3. When the agent returns an EDITED docflow, push it as an edit artifact

You must keep the previous version of the docflow JSON around (the one the user
is editing). When the new version arrives, attach it to the bot message:

```ts
artifactPlugin.addArtifact({
  messageId: botMessage.id,            // the bot message the card belongs to
  language: 'json',
  title: `${docflow.Name}.json`,       // optional
  content: JSON.stringify(newDocflow, null, 2),
  metadata: {
    previousContent: JSON.stringify(prevDocflow, null, 2), // enables the diff
    isEdit: true,
    // optional extras:
    // patch: rfc6902Ops,              // adds a Patch tab in the generic view
    // canonicalize: 'json',           // ignore key-reorder-only noise in the diff
  },
});
```

That is the whole integration. Clicking the card opens the flow editor with the
diff on the JSON side and the highlighted diagram on the right.

### 3b. Conversation reload: persist artifacts, delete the rehydrator (0.16.0+)

For history that reloads from the DB, persist a structured `artifacts` array on
the message envelope (alongside the existing `text` with its ```json fence).
When you call `controller.loadConversations(threads)`, fence extraction reads
that array and treats its `metadata` and `title` as authoritative, so the diff
view comes back on reload with NO consumer-side rehydration:

```ts
controller.loadConversations([{
  id: threadId,
  title,
  messagesLoaded: true,
  messages: [
    { id: 'u1', sender: 'user', text: 'Add a transform step.' },
    {
      id: 'b1',
      sender: 'bot',
      text: 'Updated:\n```json\n' + newDocflowJson + '\n```',
      artifacts: [{
        id: 'art-b1',                 // stable id; survives reloads
        language: 'json',
        content: newDocflowJson,
        title: 'invoice-pipeline.json',
        metadata: { previousContent: prevDocflowJson, isEdit: true, canonicalize: 'json' },
      }],
    },
  ],
}]);
```

Precedence: `message.artifacts[].metadata` > metadata from a host `addArtifact()`
call > `{}`. Fence extraction never clears metadata it did not set, and
`addArtifact` is now an **upsert by id** (calling it again for the same id merges
metadata and keeps a non-default title rather than overwriting). So your old
"rehydrate artifact metadata after load" module can be deleted.

### 4. First-time generation (no diff)

For a brand-new docflow with no prior version, omit `previousContent` (or pass
`isEdit: false`). The editor renders the normal editable JSON + diagram, exactly
as before. Backward compatible.

## What you get for free

- **Diff** of `previousContent` to `content` on the JSON side, no tab bar.
- **Diagram highlighting**: a step node is `Added` (green) when new, `Changed`
  (amber) when its config or its outgoing transition target changed, and a
  removed step shows as a struck-through `Deleted` ghost anchored where it used
  to sit. Unchanged steps render plain.
- **Hover linking**: hovering a node scrolls the diff to that step's `"Name": {`
  object and highlights the full block.

## Contract notes / gotchas

- `addArtifact` needs the target bot message to already exist in the controller
  and to be a bot message; it returns the created artifact or `undefined`.
- The flow editor (and its node highlighting) only triggers for JSON whose
  parsed object has both `Steps` and `Transitions`. Other JSON edits fall back
  to the generic diff view (JSON / Diff / Patch tabs).
- Node-change detection compares each step's config and its outgoing transition
  target, with JSON keys normalized, so a pure re-serialize is not flagged.
- The diff is line-based with optional `canonicalize: 'json'`. Use it when the
  backend may re-emit JSON with different key order.
- Do not diff in the app and pass HTML. Pass the two raw JSON strings; lumenui
  renders the diff.

## Acceptance check

1. Send a message that edits an existing docflow.
2. The bot message shows an artifact card; clicking it opens the flow editor.
3. Left pane shows red/green diff lines (no JSON/Diff tabs).
4. Right diagram shows Added/Changed/Deleted badges on the right nodes.
5. Hovering a node scrolls + highlights its JSON object block in the diff.

Storybook reference (lumenui repo): Components > Chatbot > Plugins > Flow Diagram
> "Complex Pipeline Diff".
