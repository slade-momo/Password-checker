// ====================================================
//  main.js  — Processus principal Electron
// ====================================================

const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 700,
    height: 820,   // un peu plus haut pour la nouvelle zone d'alerte
    title: 'PassGuard',
    webPreferences: {
      nodeIntegration: false,   // la page web N'a PAS accès à Node.js directement
      contextIsolation: true,   // preload et page web sont dans des contextes séparés
      preload: path.join(__dirname, 'preload.js')  // ← on branche le preload ici
    }
  });

  //win.loadFile('checker.html');
  // Dans main.js, remplace win.loadFile('index.html') par :
    win.loadURL('https://www.youtube.com');
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
