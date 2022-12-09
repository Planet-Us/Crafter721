const ipcRenderer = window.require('electron').ipcRenderer;

const electronStore = {
    get:  (key) => ipcRenderer.sendSync('electron-store-get', key)
    ,
    set: (key, value) => {
        ipcRenderer.send('electron-store-set', key, value);
    }
}

export default electronStore;

// ipcRenderer.send('electron-store-set', 'foo', 'bar');

    // console.log(ipcRenderer.sendSync('electron-store-get', 'foo'));