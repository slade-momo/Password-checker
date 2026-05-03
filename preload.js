const { contextBridge } = require('electron');

// Exposer des APIs sécurisées au processus renderer
contextBridge.exposeInMainWorld('electronAPI', {
    platform: process.platform,
    nodeVersion: process.versions.node,
    electronVersion: process.versions.electron
});