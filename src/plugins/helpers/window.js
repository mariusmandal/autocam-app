const { ipcMain } = require('electron');
const EventEmitter = require('events');

module.exports = function(events) {
    return function WindowHelper(window) {

        if (typeof window === 'undefined') {
            console.warn('WindowHelper cannot help non-existent windows.');
            throw new Error('WindowHelper cannot help non-existent windows.');
        }

        const self = {
            send: (message, data) => {
                self.log('send()', message, data);
                window.webContents.send(message, data);
            },

            sendListDone: (message, data) => {
                return self.send('PORTS.LIST.DONE', message, data);
            },

            on: (message, callback) => {
                self.log('on()', message, callback);
                events.on(message, callback);
                ipcMain.on(message, callback);
            },
            emit: (message, data) => {
                events.emit(message, data);
            },

            log(message, ...args) {
                console.log('WindowHelper: ', message, ...args);
            },

            setPort: (event, data) => {
                self.log('setPort()', data);
                self.emit('port.set', data);
            }
        }

        return self;
    }
}(new EventEmitter());