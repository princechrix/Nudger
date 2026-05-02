const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('overlay', {
  onData: (callback) => {
    ipcRenderer.on('overlay:data', (_e, data) => callback(data));
  },
  dismiss: () => {
    window.dispatchEvent(new Event('nudger:stop-audio'));
    ipcRenderer.send('overlay:dismiss');
  },
});
