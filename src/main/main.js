const { app, BrowserWindow, ipcMain, dialog, protocol } = require('electron');
const path = require('path');
const fs = require('fs');
const sessionManager = require('./sessionManager');
const nudgeEngine = require('./nudgeEngine');
const windowManager = require('./windowManager');

protocol.registerSchemesAsPrivileged([
  { scheme: 'nudger-media', privileges: { stream: true, bypassCSP: true } },
]);

let mainWindow = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 480,
    height: 640,
    minWidth: 400,
    minHeight: 500,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#0a0a0a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

ipcMain.on('window:minimize', () => {
  mainWindow?.minimize();
});

ipcMain.on('window:close', () => {
  mainWindow?.close();
});

ipcMain.handle('sessions:getAll', () => sessionManager.getAllSessions());
ipcMain.handle('sessions:get', (_e, id) => sessionManager.getSession(id));
ipcMain.handle('sessions:create', (_e, data) => sessionManager.createSession(data));
ipcMain.handle('sessions:update', (_e, id, updates) => sessionManager.updateSession(id, updates));
ipcMain.handle('sessions:delete', (_e, id) => sessionManager.deleteSession(id));

ipcMain.handle('engine:start', (_e, sessionId) => {
  const session = sessionManager.getSession(sessionId);
  if (!session) return { ok: false };
  nudgeEngine.start(session, () => {
    const fresh = sessionManager.getSession(sessionId) || session;
    windowManager.showOverlay(fresh);
    mainWindow?.webContents.send('nudge:triggered', fresh);
  });
  return { ok: true, session };
});

ipcMain.handle('engine:stop', () => {
  nudgeEngine.stop();
  return { ok: true };
});

ipcMain.handle('engine:status', () => ({
  running: nudgeEngine.isRunning(),
  session: nudgeEngine.getActive(),
}));

ipcMain.handle('engine:timeRemaining', () => nudgeEngine.getTimeRemaining());

ipcMain.handle('sessions:toggleMute', (_e, id) => {
  const session = sessionManager.getSession(id);
  if (!session) return null;
  return sessionManager.updateSession(id, { muted: !session.muted });
});

ipcMain.on('overlay:dismiss', () => {
  windowManager.closeOverlay();
});

ipcMain.handle('dialog:pickRingtone', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Choose Ringtone',
    filters: [{ name: 'Audio Files', extensions: ['mp3', 'wav', 'ogg'] }],
    properties: ['openFile'],
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  return result.filePaths[0];
});

app.whenReady().then(() => {
  protocol.handle('nudger-media', (request) => {
    const filePath = decodeURIComponent(request.url.replace('nudger-media://file/', ''));
    try {
      fs.accessSync(filePath, fs.constants.R_OK);
    } catch {
      return new Response('Not found', { status: 404 });
    }
    const stream = fs.createReadStream(filePath);
    const ext = path.extname(filePath).toLowerCase().slice(1);
    const mimeMap = { mp3: 'audio/mpeg', wav: 'audio/wav', ogg: 'audio/ogg' };
    return new Response(stream, {
      headers: { 'Content-Type': mimeMap[ext] || 'audio/mpeg' },
    });
  });

  createMainWindow();
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
