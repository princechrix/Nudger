const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('nudger', {
  minimize: () => ipcRenderer.send('window:minimize'),
  close: () => ipcRenderer.send('window:close'),

  sessions: {
    getAll: () => ipcRenderer.invoke('sessions:getAll'),
    get: (id) => ipcRenderer.invoke('sessions:get', id),
    create: (data) => ipcRenderer.invoke('sessions:create', data),
    update: (id, updates) => ipcRenderer.invoke('sessions:update', id, updates),
    delete: (id) => ipcRenderer.invoke('sessions:delete', id),
    toggleMute: (id) => ipcRenderer.invoke('sessions:toggleMute', id),
  },

  engine: {
    start: (sessionId) => ipcRenderer.invoke('engine:start', sessionId),
    stop: () => ipcRenderer.invoke('engine:stop'),
    status: () => ipcRenderer.invoke('engine:status'),
    timeRemaining: () => ipcRenderer.invoke('engine:timeRemaining'),
  },

  pickRingtone: () => ipcRenderer.invoke('dialog:pickRingtone'),

  onNudge: (callback) => {
    ipcRenderer.on('nudge:triggered', (_e, session) => callback(session));
  },
});
