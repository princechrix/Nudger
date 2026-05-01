# Nudger

A Windows desktop app that enforces focus through interruptive, fullscreen nudges. It takes over your screen at set intervals and forces you to acknowledge before continuing — annoying enough to change behavior, not enough to uninstall.

## How It Works

1. **Create a session** — give it a name, interval (minutes), and a nudge message
2. **Start the session** — timer begins running in the background
3. **Get nudged** — at every interval, a fullscreen overlay covers all your monitors
4. **Acknowledge** — type `DONE` or click the button to dismiss (after a 5-second lockout)

## Features

- **Session management** — create, edit, delete, start/stop focus sessions
- **Fullscreen overlay** — frameless, always-on-top, covers every pixel
- **Multi-monitor** — one overlay per connected display
- **Forced acknowledgment** — 5-second delay, then type `DONE` or click to dismiss
- **Anti-escape** — blocks Alt+F4, Escape, Alt+Tab; auto-refocuses on blur
- **Persistent storage** — sessions survive app restarts (JSON in userData)

## Tech Stack

- **Electron** — main process + renderer
- **Node.js** — runtime
- **Vanilla JS** — no frameworks, no bloat
- **pnpm** — package manager

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [pnpm](https://pnpm.io/) v10+

### Install & Run

```bash
git clone https://github.com/princechrix/Nudger.git
cd Nudger
pnpm install
pnpm start
```

### Scripts

| Command | Description |
|---|---|
| `pnpm start` | Launch the app |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Auto-fix lint issues |
| `pnpm build` | Build Windows installer |
| `pnpm pack` | Build unpacked directory |

## Project Structure

```
src/
├── main/
│   ├── main.js              # App lifecycle, IPC handlers
│   ├── preload.js            # Secure bridge for main window
│   ├── overlayPreload.js     # Secure bridge for overlay window
│   ├── sessionManager.js     # Session CRUD + JSON persistence
│   ├── nudgeEngine.js        # Interval timer system
│   └── windowManager.js      # Overlay window creation + multi-monitor
├── renderer/
│   ├── index.html            # Main app shell
│   ├── styles.css            # Design system
│   ├── app.js                # Session UI logic
│   ├── overlay.html          # Fullscreen nudge overlay
│   └── overlayApp.js         # Overlay dismiss logic
└── storage/
    └── .gitkeep
```

## CI/CD

GitHub Actions runs on every PR:
- Install dependencies
- Lint check
- Build verification

## Author

**Prince Chrix**

## License

MIT
