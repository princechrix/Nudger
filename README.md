# Nudger

A desktop focus tool that enforces intentional work through interruptive, fullscreen nudges. It takes over your screen at set intervals and forces you to acknowledge before continuing — annoying enough to change behavior, not enough to uninstall.

## How It Works

1. **Create a session** — give it a name, interval (minutes), nudge message, and optional ringtone
2. **Start the session** — timer begins running in the background with a live countdown
3. **Get nudged** — at every interval, a fullscreen overlay covers all your monitors with optional looping audio
4. **Acknowledge** — wait out the lock period, then type `DONE` or click the button to dismiss

## Features

- **Session management** — create, edit, delete, start/stop focus sessions
- **Fullscreen overlay** — frameless, always-on-top, covers every pixel on every monitor
- **Multi-monitor** — one overlay per connected display, all locked simultaneously
- **Forced acknowledgment** — configurable lock duration (3–120s), then type `DONE` or click to dismiss
- **Anti-escape** — blocks Alt+F4, Escape, Alt+Tab; auto-refocuses on blur
- **Per-session ringtone** — assign an MP3/WAV/OGG file that loops during the nudge overlay
- **Mute toggle** — mute/unmute ringtone per session directly from the session card
- **Live countdown** — active session card shows a progress bar and MM:SS timer to the next nudge
- **Configurable lock duration** — set how long the overlay stays locked before dismiss is allowed (per session)
- **Persistent storage** — sessions survive app restarts (JSON in userData)

## Installation

### Windows

Download the latest **Nudger Setup x.x.x.exe** from [Releases](https://github.com/princechrix/Nudger/releases) and run the installer.

Or build from source:

```bash
git clone https://github.com/princechrix/Nudger.git
cd Nudger
pnpm install
pnpm build:win
```

The installer will be at `dist/Nudger Setup x.x.x.exe`.

### macOS

macOS builds must be created on a Mac. Clone the repo and build:

```bash
git clone https://github.com/princechrix/Nudger.git
cd Nudger
pnpm install
pnpm build:mac
```

The DMG installer will be at `dist/Nudger-x.x.x.dmg`.

> **Note:** The macOS build is not code-signed. You may need to right-click and select "Open" on first launch, or allow it in System Settings > Privacy & Security.

## Development

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
| `pnpm start` | Launch the app in development |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Auto-fix lint issues |
| `pnpm build` | Build installers for Windows + macOS |
| `pnpm build:win` | Build Windows installer (NSIS) |
| `pnpm build:mac` | Build macOS installer (DMG) — requires macOS |
| `pnpm pack` | Build unpacked directory |

## Tech Stack

- **Electron** — main process + renderer
- **Node.js** — runtime
- **Vanilla JS** — no frameworks, no bloat
- **pnpm** — package manager
- **electron-builder** — packaging for Windows (NSIS) and macOS (DMG)

## Project Structure

```
src/
├── main/
│   ├── main.js              # App lifecycle, IPC handlers, custom protocol
│   ├── preload.js            # Secure bridge for main window
│   ├── overlayPreload.js     # Secure bridge for overlay window
│   ├── sessionManager.js     # Session CRUD + JSON persistence
│   ├── nudgeEngine.js        # Interval timer with countdown tracking
│   └── windowManager.js      # Overlay window creation + multi-monitor
├── renderer/
│   ├── index.html            # Main app shell
│   ├── styles.css            # Design system
│   ├── app.js                # Session UI logic + countdown
│   ├── overlay.html          # Fullscreen nudge overlay
│   └── overlayApp.js         # Overlay dismiss logic + ring countdown
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
