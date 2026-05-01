const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('nudger', {
  // API exposed in later features
});
