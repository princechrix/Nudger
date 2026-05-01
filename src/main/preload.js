const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('nudger', {
  minimize: () => ipcRenderer.send('window:minimize'),
  close: () => ipcRenderer.send('window:close'),
});
