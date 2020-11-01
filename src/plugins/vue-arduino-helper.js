import electron from "electron";

export default {
    on: function(message, callback) {
        return electron.ipcRenderer.on(message, callback);
    },
    send: function(message, data) {
        return electron.ipcRenderer.send(message, data);
    }
}