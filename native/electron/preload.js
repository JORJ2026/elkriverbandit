const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("erbNative", {
  platform: process.platform,
  toggleFullscreen: () => ipcRenderer.send("erb:fullscreen")
});
