# Nudger — UI/UX Design Brief

**Author:** Prince Chrix
**Date:** May 2, 2026
**Platform:** Windows desktop (Electron)
**Status:** Functional prototype — needs a real design system

---

## What is Nudger?

Nudger is a **desktop focus tool** for Windows. It interrupts you on purpose.

You create "sessions" — each one defines a recurring interval (e.g., every 25 minutes), a message (e.g., "Are you still on track?"), and optionally a ringtone. When the timer fires, Nudger takes over your entire screen with a fullscreen overlay that you **cannot dismiss immediately**. You must wait out a configurable lock period (3–120 seconds), then either type a confirmation word ("DONE") or click a button to get your screen back.

The idea: it's too easy to lose 3 hours to autopilot. Nudger forces you to consciously acknowledge where your attention is.

**This is not a timer app. It's not a Pomodoro clone. It's an interruption engine.** The overlay is deliberately aggressive — always-on-top, covers all monitors, blocks Alt+Tab and Escape. The discomfort is the feature.

---

## Who uses it?

Solo knowledge workers, developers, students, writers — anyone who sits at a computer for long stretches and needs an external "tap on the shoulder" to stay intentional. They're not casual users; they chose to install a tool that interrupts them. Respect that by making the app feel **precise and purposeful**, not playful or soft.

---

## The two surfaces

Nudger has exactly **two UI surfaces**. They serve opposite purposes and should feel like different experiences.

### Surface 1: The Main Window (Control Panel)

A small, narrow window (480 x 640px, resizable, min 400 x 500). This is where you manage your sessions. It is **calm, utilitarian, and fast.** You glance at it, tap a button, and minimize it. It should feel like a dashboard instrument, not a social app.

**What's in this window:**

**Custom Titlebar**
- Frameless window with a draggable titlebar
- App name on the left, minimize + close buttons on the right
- Close fully exits the app (no tray icon currently)

**Session List View (default)**
- Header row: "Sessions" title on the left, "+ New" button on the right
- Below: a vertical scrollable list of **session cards**
- If no sessions exist: an empty state with a hint to create one

**Session Card anatomy (each card shows):**
- **Name** — e.g., "Deep work block" (left-aligned, truncated if long)
- **Meta badges** — interval + lock duration (e.g., "25m / 5s lock"), displayed in monospace
- **Mute toggle** — a speaker icon button, only visible if the session has a ringtone assigned. Toggles between muted/unmuted. When muted, the icon is dimmed. This is persisted.
- **Message preview** — the nudge text, one line, truncated with ellipsis
- **Countdown** (only on the active/running session) — a live `MM:SS` countdown to the next nudge, ticking every second, in monospace
- **Status indicator** (only on the active session) — a green "Running" label with a pulsing dot
- **Action buttons:**
  - **Start** (inactive sessions) — begins the timer
  - **Stop** (active session) — kills the timer
  - **Edit** — opens the session form pre-filled
  - **Delete** — removes the session (if active, stops it first)

**Important card states:**
1. **Idle** — default, neutral styling
2. **Active/Running** — visually distinct (currently uses an accent-tinted background and accent border). Shows the countdown and running status. Only one session can be active at a time.
3. **Hover** — subtle border lift

**Session Form View (create / edit)**
- Reached by clicking "+ New" or "Edit" on a card
- Header: a back arrow button + title ("New Session" or "Edit Session")
- Form fields, all stacked vertically:

| Field | Type | Constraints | Notes |
|---|---|---|---|
| Name | Text input | Required, max 60 chars | e.g., "Deep work block" |
| Interval | Number input | Required, 1–480 minutes | How often the nudge fires |
| Lock duration | Number input | Required, 3–120 seconds | How long the overlay is locked before dismiss is allowed |
| Message | Textarea | Required, max 200 chars, 3 rows | The text shown on the overlay |
| Ringtone | File picker | Optional, MP3/WAV/OGG | A "Choose file..." button opens a native OS file dialog. Selected filename is displayed. A clear (x) button removes it. |

- Submit button: "Create Session" or "Save Changes"
- No delete from this view — that's on the card

**Footer**
- Fixed at the bottom center: "Developed by Prince Chrix" in small caps, very subtle

---

### Surface 2: The Nudge Overlay (Fullscreen Interruption)

This is the core experience. When a nudge fires, this overlay covers **every connected monitor** simultaneously — one window per display, all fullscreen, always-on-top, blocking keyboard shortcuts.

**This screen must command attention without feeling hostile.** It's an interruption, but it should feel like a deliberate pause, not an error screen or a punishment. Think: a theater going dark before the show starts. The user chose this.

**Overlay anatomy (centered vertically and horizontally):**

1. **Label** — small uppercase "NUDGE" in accent color, letterspaced, at the top
2. **Message** — the session's nudge text, large (32px), bold, centered, max-width 600px
3. **Session name** — small, dim, below the message
4. **Lock countdown** — "Dismiss available in Xs" — ticks down second by second, then disappears
5. **Acknowledgment area** (appears after lock countdown reaches 0, fades in):
   - Hint text: "Type DONE to dismiss"
   - A text input, monospace, centered, uppercase, letterspaced — user types "DONE" to confirm
   - "or" separator
   - A button: "I'm on it" as an alternative dismiss
6. **Ringtone** — if the session has a non-muted ringtone, audio plays in a loop from the moment the overlay appears until it's dismissed

**Overlay behavior:**
- Blocks `Escape`, `Alt+F4`, `Alt+Tab` (as much as Electron allows)
- If the window loses focus, it re-focuses itself every 500ms
- Typing "DONE" (case-insensitive) instantly dismisses all overlay windows
- Wrong input shakes the text field (shake animation)
- Correct input briefly highlights the field green, then closes
- Audio stops the instant the overlay is dismissed

**Footer:** Same "Developed by Prince Chrix" credit, fixed bottom center

---

## Current design problems (be honest with these)

The prototype works, but visually it reads as **"developer built this in a weekend"** — which is exactly what happened. Here's what needs attention:

1. **Generic dark theme.** Near-black background (#0a0a0a), gray text, orange accent. It's the default "dark mode starter kit." There's no personality, no visual identity. Swap out the colors and it could be any app.

2. **No typographic identity.** Using Segoe UI (Windows system font) everywhere. No hierarchy beyond size. The monospace secondary font (Cascadia Code) is the most interesting choice and it's buried in tiny metadata.

3. **Flat card layout.** Session cards are rectangles in a vertical list with a bottom border. No rhythm, no visual tension. They all look the same until one turns orange.

4. **The overlay is too plain.** For the single most important screen in the app — the one the user stares at every 25 minutes — it's just centered text on a black background. No atmosphere, no visual weight, no sense of occasion.

5. **The form is purely functional.** Labels, inputs, a button. No grouping, no visual flow, no personality.

6. **Button soup.** Start, Stop, Edit, Delete, Mute — all jammed into a small row at the bottom of each card. No visual hierarchy. They're all the same size.

7. **No iconography.** The only icons are Unicode characters (speaker emoji for mute, a circle for the empty state). No consistent icon language.

8. **No motion design.** There's a single fadeIn animation on view switch and a shake on error. No transitions on card state changes, no overlay entrance choreography, no micro-interactions.

9. **No brand.** No logo, no icon, no visual element that says "this is Nudger." The titlebar just says the name in letterspaced uppercase.

---

## Design direction guidance

**Do not make this look like a typical productivity app.** No pastel colors, no rounded-everything, no friendly illustrations, no "you got this!" energy. This app exists to interrupt you. It should feel **sharp, precise, and slightly intense** — like a well-made instrument.

**Reference points for tone** (not to copy, but to calibrate):
- **Linear** — the density and purposefulness of the UI, the way every element earns its space
- **Vercel dashboard** — the dark theme done with intention, the monospace accents, the restraint
- **Nothing Phone UI** — the dot-matrix aesthetic, bold typographic choices, tension between minimal and expressive
- **A flight instrument panel** — information-dense but readable, where every indicator has a clear purpose

**What we're NOT going for:**
- Notion (too casual/friendly)
- Generic SaaS dashboard (too corporate)
- Neon/cyberpunk (too edgy/gimmicky)
- Glassmorphism or neumorphism (too trendy, ages badly)

---

## Specific design asks

### 1. Establish a visual identity
- Pick a distinctive color system. The accent doesn't have to be orange. It could be a sharp teal, an electric white, a warm amber — whatever creates contrast and intention. But commit to it.
- Choose a typeface pairing with personality. One for UI, one for data/mono elements. Consider: JetBrains Mono, Space Grotesk, Inter (only if you do something interesting with weight/tracking), Geist, Instrument Sans, DM Sans, or something we haven't seen in every AI demo.
- Design a simple wordmark or logotype for the titlebar. Not a full logo — just the app name rendered with enough craft that it looks intentional.

### 2. Redesign the session cards
- Give the active session dramatically different visual treatment — not just an orange border. The user should be able to identify the running session in their peripheral vision.
- The countdown timer is the most dynamic element in the app. It deserves prominence on the active card — it's the heartbeat.
- Consider how mute state, ringtone presence, and interval metadata are communicated without adding visual clutter. Icon + tooltip? Color coding? Badge?
- Re-think the action buttons. Start/Stop are primary actions. Edit/Delete are secondary. Mute is a toggle. They shouldn't all be the same visual weight. Consider: contextual menus, icon buttons, swipe actions, or hover-reveal for destructive actions.

### 3. Redesign the overlay
This is the signature screen. Users see it dozens of times a day. It should feel like a **moment** — not a popup.

Ideas to explore (not prescriptions):
- Atmospheric background treatment — subtle grain, a radial gradient, a slow ambient animation, a vignette
- Typography as the hero — make the nudge message feel monumental. Scale, weight, tracking.
- The lock countdown could be a visual element, not just text — a ring, a bar, a dissolving shape
- The "type DONE" interaction is interesting and tactile. Lean into it — the input field could feel more like a physical control than a form field
- Entry animation choreography: maybe the message doesn't all appear at once. Maybe there's a beat.
- Consider how the ringtone affects the visual mood — if audio is playing, the overlay could subtly pulse or breathe

### 4. Redesign the form
- Group related fields logically (timing fields together, content fields together)
- The ringtone picker should feel native and confident, not like an afterthought
- Consider inline validation and smart defaults
- The form should feel fast to fill out — a power user creates sessions in under 10 seconds

### 5. Empty state
- The current empty state is a circle and two lines of text. This is the first thing a new user sees. Make it count. Guide them toward creating their first session with clarity and a little bit of energy.

### 6. Micro-interactions and motion
- Card state transitions (idle → active, active → idle)
- Overlay entrance and exit choreography
- Countdown tick — the number changing could be more than just a text swap
- Mute toggle feedback
- Form field focus states
- Button hover/active states with physicality (not just color changes)

---

## Technical constraints

- **Electron app** — renders in Chromium, so you have full access to modern CSS (grid, custom properties, animations, backdrop-filter, etc.)
- **Vanilla HTML/CSS/JS** — no React, no Tailwind, no component framework. Styles are in plain CSS files. BEM naming convention is used.
- **Two HTML files:**
  - `index.html` — the main window (loads `styles.css` + `app.js`)
  - `overlay.html` — the fullscreen overlay (styles are inline in `<style>`, loads `overlayApp.js`)
- **Custom titlebar** — the window is `frame: false`. The titlebar is a `<header>` with `-webkit-app-region: drag`. Window controls are custom buttons.
- **Window size:** 480 x 640px default, min 400 x 500px, resizable. Design should work across this range.
- **Overlay:** Always fullscreen, one per monitor. Must work on any resolution / aspect ratio.
- **Fonts:** Must be loaded locally (bundled or system fonts) or from a CDN that works offline. The app should work without internet.
- **No images in the current build.** If your design uses icons, provide them as SVG inline or via a lightweight icon font. No PNG/JPG icon sheets.
- **CSP is strict:** `default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'`. External resources won't load unless CSP is updated.
- **Dark theme only** for now. No light mode required, but design the color system so it could support one later if needed.

---

## Deliverables

1. **High-fidelity mockups** for both surfaces:
   - Main window: empty state, session list (idle + 1 active with countdown), session form (new + edit)
   - Overlay: locked state (countdown ticking), unlocked state (type input + button visible), dismiss animation
2. **Design tokens:** color palette, typography scale, spacing system, border radii, shadows/glows — documented as CSS custom properties
3. **Component spec:** buttons (all variants), inputs, cards (all states), the ringtone picker, the mute toggle, the countdown display, the overlay acknowledgment area
4. **Motion spec:** describe or prototype the key transitions and micro-interactions. Timing, easing, choreography order.
5. **The "one thing":** name the single visual detail that makes this app recognizable — the thing someone would screenshot and share. Every good tool has one.

---

## What success looks like

A user opens Nudger and thinks: *"Someone cared about this."* It doesn't look like a template. It doesn't look like a framework demo. It doesn't look like an AI generated it. It looks like a small, sharp tool built by someone with opinions — because it was.

---

*Questions? Reach out to prince.mfashingabo@ivas.rw*
