const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    // Créer la fenêtre principale
    mainWindow = new BrowserWindow({
        width: 800,
        height: 900,
        minWidth: 600,
        minHeight: 700,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname, 'icon.png'),
        title: 'Analyseur de Force de Mot de Passe',
        backgroundColor: '#667eea',
        show: false // Ne pas montrer tout de suite pour éviter le flash blanc
    });

    // Charger le fichier HTML
    mainWindow.loadFile('index.html');

    // Montrer la fenêtre quand elle est prête
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Créer un menu personnalisé
    const menuTemplate = [
        {
            label: 'Fichier',
            submenu: [
                {
                    label: 'Quitter',
                    accelerator: 'CmdOrCtrl+Q',
                    click: () => app.quit()
                }
            ]
        },
        {
            label: 'Édition',
            submenu: [
                { label: 'Copier', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
                { label: 'Coller', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
                { label: 'Couper', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
                { label: 'Sélectionner tout', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
            ]
        },
        {
            label: 'Affichage',
            submenu: [
                {
                    label: 'Recharger',
                    accelerator: 'CmdOrCtrl+R',
                    click: () => mainWindow.reload()
                },
                {
                    label: 'Ouvrir les outils de développement',
                    accelerator: 'F12',
                    click: () => mainWindow.webContents.openDevTools()
                },
                { type: 'separator' },
                {
                    label: 'Plein écran',
                    accelerator: 'F11',
                    click: () => mainWindow.setFullScreen(!mainWindow.isFullScreen())
                }
            ]
        },
        {
            label: 'Aide',
            submenu: [
                {
                    label: 'Documentation',
                    click: () => shell.openExternal('https://github.com/electron/electron')
                },
                {
                    label: 'À propos',
                    click: () => {
                        console.log('Application d\'analyse de mot de passe');
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);

    // Gérer la fermeture
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Quand Electron est prêt
app.whenReady().then(() => {
    createWindow();

    // Sur macOS, recréer la fenêtre quand on clique sur l'icône du dock
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quitter quand toutes les fenêtres sont fermées (sauf sur macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});