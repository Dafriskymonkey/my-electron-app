const { contextBridge, ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.on('render-log', (_event, value) => {
        console.info(`main-log: ${value}`);
    });
});

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    // we can also expose variables, not just functions
    ping: () => ipcRenderer.invoke('ping')
});

contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title) => ipcRenderer.send('set-title', title),
    openFile: () => ipcRenderer.invoke('open-file'),
    handleCounter: (callback) => ipcRenderer.on('update-counter', callback)
});