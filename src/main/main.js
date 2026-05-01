const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const sessionManager = require('./sessionManager');

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

app.whenReady().then(createMainWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
