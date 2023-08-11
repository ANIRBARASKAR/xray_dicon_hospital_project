
const { BrowserWindow, app, ipcMain, Notification } = require('electron');
const path = require('path');

const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: "white",
    webPreferences: {
      nodeIntegration: false,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false
    }
  })

  win.loadFile('index.html');
  if (isDev) win.webContents.openDevTools()
}

if (isDev) {
  const ignoredPattern = /Input|Output|node_modules|[\/\\]\./;
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
    ignored: ignoredPattern
  })
}

ipcMain.on('notify', (_, message) => {
  new Notification({ title: 'Notifiation', body: message }).show();
})

ipcMain.handle('get-app-path', () => {
  return app.getAppPath();
});


app.whenReady().then(createWindow)
