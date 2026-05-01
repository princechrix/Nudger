const { app } = require('electron');

app.whenReady().then(() => {
  // Electron app boot — implemented in feature/electron-boot
});

app.on('window-all-closed', () => {
  app.quit();
});
