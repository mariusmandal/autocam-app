const { ipcMain } = require('electron');

module.exports = function WindowHelper(window) {
    if (typeof window === 'undefined') {
        console.warn('WindowHelper cannot help non-existent windows.');
        throw new Error('WindowHelper cannot help non-existent windows.');
    }

    const self = {
        send: (message, data) => {
            self.log('send(' + message + ')'); //, message, data);
            window.webContents.send(message, data);
        },

        sendListDone: (message, data) => {
            return self.send('serialport.list.done', message, data);
        },

        notifySelf: (message, data) => {
            return self.send(message, data);
        },

        on: (message, callback) => {
            ipcMain.on(message, callback);
        },

        emit: (message, data) => {
            self.send(message, data);
        },

        log(message, ...args) {
            return;
            console.log('WindowHelper: ', message, ...args);
        },
    }

    return self;
}