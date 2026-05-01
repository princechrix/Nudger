const { BrowserWindow, screen } = require('electron');
const path = require('path');

let overlayWindows = [];

function createOverlayForDisplay(display, session) {
  const { x, y, width, height } = display.bounds;

  const overlay = new BrowserWindow({
    x,
    y,
    width,
    height,
    fullscreen: true,
    alwaysOnTop: true,
    frame: false,
    skipTaskbar: true,
    resizable: false,
    movable: false,
    minimizable: false,
    closable: false,
    focusable: true,
    backgroundColor: '#0a0a0a',
    webPreferences: {
      preload: path.join(__dirname, 'overlayPreload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  overlay.setAlwaysOnTop(true, 'screen-saver');
  overlay.setVisibleOnAllWorkspaces(true);

  overlay.loadFile(path.join(__dirname, '..', 'renderer', 'overlay.html'));

  overlay.webContents.on('did-finish-load', () => {
    overlay.webContents.send('overlay:data', {
      message: session.message,
      name: session.name,
    });
  });

  overlay.on('blur', () => {
    if (!overlay.isDestroyed()) overlay.focus();
  });

  return overlay;
}

function showOverlay(session) {
  closeOverlay();

  const displays = screen.getAllDisplays();

  displays.forEach((display) => {
    const overlay = createOverlayForDisplay(display, session);
    overlayWindows.push(overlay);
  });
}

function closeOverlay() {
  overlayWindows.forEach((w) => {
    if (!w.isDestroyed()) w.destroy();
  });
  overlayWindows = [];
}

function isOverlayOpen() {
  return overlayWindows.some((w) => !w.isDestroyed());
}

module.exports = { showOverlay, closeOverlay, isOverlayOpen };
