
const { ipcRenderer, contextBridge } = require('electron');
const path = require('path');
// const dicomParser = require('dicom-parser');

const config = require('./constants.js')

// contextBridge.exposeInMainWorld('db', require('./db/index.js'))


contextBridge.exposeInMainWorld('electron', {
  notificationApi: {
    sendNotification(message) {
      ipcRenderer.send('notify', message);
    }
  },
  batteryApi: {

  },
  filesApi: {

  },
  getResourcesPath: () => process.resourcesPath,
  getAppPath: () => ipcRenderer.invoke('get-app-path'),
  db: require(path.join(__dirname, '/modules/db')),
  auth: require(path.join(__dirname, '/modules/auth')),
  fileHandler: require(path.join(__dirname, '/modules/fileHandler')),
  scripts: require(path.join(__dirname, '/modules/scripts')),
  config,

  // dicomParser
  //for dev
})
