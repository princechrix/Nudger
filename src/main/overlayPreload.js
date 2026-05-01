const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('overlay', {
  onData: (callback) => {
    ipcRenderer.on('overlay:data', (_e, data) => callback(data));
  },
  dismiss: () => ipcRenderer.send('overlay:dismiss'),
});
