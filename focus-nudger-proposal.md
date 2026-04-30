# ⚙️ Project Proposal: Focus Nudger (Desktop App)

---

## 1. Objective (Non-negotiable clarity)

Build a Windows desktop application that enforces user focus through interruptive nudging sessions.

**Core behavior:**

- User creates a session
- Starts session
- App interrupts at defined intervals
- Takes over screen and forces user acknowledgment

---

## 2. Core Features (MVP Scope)

### 2.1 Session Management

- Create session with:
  - `name`
  - `interval` (in seconds or minutes)
  - `message` (what user sees during nudge)
- Edit / delete sessions
- Persist locally (JSON or SQLite)

### 2.2 Nudging Engine

When session starts:

- Timer runs continuously
- Every `interval` → trigger nudge

Must:

- Run in background
- Survive window minimize

### 2.3 Fullscreen Interrupt Overlay

When triggered:

- Open fullscreen window
- Cover entire screen (all monitors)
- Always on top
- No visible OS chrome (no close/minimize buttons)

Display:

- Session message
- Optional countdown (e.g. "You can dismiss in 5s")

### 2.4 Forced Acknowledgment

User must:

- Click button, **OR**
- Type a short confirmation (e.g. `DONE`)

> **Optional (stretch):** Prevent instant dismissal (3–5 second delay)

### 2.5 Multi-Monitor Support

- Detect all displays
- Spawn one fullscreen window per display

### 2.6 Session Controls

- Start / Stop session
- Show active session state
- Prevent multiple sessions running simultaneously

---

## 3. Technical Requirements

### 3.1 Stack

- Electron
- Node.js
- Minimal frontend (React optional, but not required)

### 3.2 Window Configuration (Critical)

Overlay window must use:

```js
fullscreen: true
alwaysOnTop: true
frame: false
skipTaskbar: true
// Focused on open
```

### 3.3 Timer System

- Use `setInterval`
- Must not drift significantly
- Clear interval on session stop

### 3.4 State Management

Keep simple:

- In-memory state for active session
- Persistent storage for saved sessions

### 3.5 File Structure (Suggested)

```
/main
  main.js
  windowManager.js
  nudgeEngine.js

/renderer
  index.html
  app.js

/storage
  sessions.json
```

---

## 4. Behavioral Design (This is where most fail)

**Rules:**

- ✅ Nudges must be interruptive, not ignorable
- ✅ UI must be minimal and aggressive
- ✅ No distractions inside overlay

**Anti-patterns to avoid:**

- ❌ Toast notifications (too weak)
- ❌ Silent reminders (ignored)
- ❌ Complex UI (reduces impact)

---

## 5. Edge Cases

Must handle:

- ✅ Multiple monitors
- ✅ App minimized
- ✅ User tries to alt-tab away
- ✅ Rapid session start/stop
- ✅ Invalid interval values

---

## 6. Stretch Features (DO NOT BUILD IN MVP)

Only after MVP works:

- Adaptive intervals (based on user behavior)
- Statistics (how often dismissed)
- "Strict mode" (longer forced lock)
- Sound alerts
- Keyboard blocking (advanced, optional)

---

## 7. Acceptance Criteria (Definition of Done)

App is complete when:

- ✅ User can create and start a session
- ✅ Screen is interrupted at correct intervals
- ✅ Overlay appears on all monitors
- ✅ User cannot ignore it easily
- ✅ Session can be stopped cleanly

---

## ⚠️ Final Instruction

> **Do NOT over-engineer.**
> **Do NOT add unnecessary UI or features.**
> **Focus on reliability of the nudging system and fullscreen enforcement.**

---

## 📌 Strategic Note (Read This Carefully)

This idea only becomes valuable if:

- It's **annoying enough** to change behavior
- But **not so annoying** that you uninstall it

That balance is the real product.

Right now, you're building mechanics. The leverage comes when you start **tuning behavioral response loops**.
