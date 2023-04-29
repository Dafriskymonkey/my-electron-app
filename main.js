const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const path = require('path');

const DBManager = require('./db-manager');
const dbManager = new DBManager();

let mainWindow = null;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
        nodeIntegration: true,
        nodeIntegrationInWorker: true
    });

    const menu = Menu.buildFromTemplate([
        {
            label: app.name,
            submenu: [
                {
                    click: () => mainWindow.webContents.send('update-counter', 1),
                    label: 'Increment'
                },
                {
                    click: () => mainWindow.webContents.send('update-counter', -1),
                    label: 'Decrement'
                }
            ]
        }
    ]);
    Menu.setApplicationMenu(menu);

    mainWindow.loadFile('index.html');

    mainWindow.webContents.openDevTools();
}

const render = {
    log: (message) => {
        mainWindow.webContents.send('render-log', message);
    }
};

if (require('electron-squirrel-startup')) app.quit();

app.enableSandbox();

app.whenReady().then(async () => {

    await dbManager.init();

    ipcMain.handle('ping', () => 'pong');

    ipcMain.on('set-title', (event, title) => {
        // const webContents = event.sender;
        // const win = BrowserWindow.fromWebContents(webContents);
        render.log('got "set-title"');
        mainWindow.setTitle(title);
    });

    ipcMain.handle('open-file', async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog();
        if (canceled) {
            console.info('canceled dialog');
        } else {
            return filePaths[0];
        }
    });

    ipcMain.handle('db:add-item', async (event, item) => {
        console.info('db:add-item', item);
        await dbManager.addOne('items', item);
        return item;
    });

    ipcMain.handle('db:get-items', (event) => {
        console.info('db:get-item');
        let items = dbManager.getAll('items');
        return items;
    });

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});