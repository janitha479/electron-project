const { contextBridge, ipcRenderer } = require('electron')

// contextBridge.exposeInMainWorld('versions', {
//   node: () => process.versions.node,
//   chrome: () => process.versions.chrome,
//   electron: () => process.versions.electron
// })

contextBridge.exposeInMainWorld('api', {
  scanWifi: async () => {
    return ipcRenderer.invoke('scan-wifi')
  }
})