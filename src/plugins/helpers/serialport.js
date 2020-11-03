const SerialPort = require('serialport');
const EventEmitter = require('events');

module.exports = function(events) {
    return function SerialPortHelper() {
        let portList = [];
        events.removeAllListeners();

        const self = {
            getPorts: (...args) => {
                SerialPort.list()
                    .then((ports) => {
                        portList = [];
                        ports.forEach((port) => { portList.push(port); })
                        events.emit('serialports.list.done', portList);
                    })
                    .catch((error) => {
                        events.emit('serialports.list.error', error);
                    });
                return;
            },

            log: (message, ...args) => {
                return;
                console.log('SerialPortHelper: ', message, ...args);
            },

            on: (message, callback, ...args) => {
                self.log('on(' + message + ')');
                events.on(message, callback);
            },
            emit: (message, data, ...args) => {
                self.log('emit(' + message + ')', ...args);
                events.emit(message, data, ...args);
            },
            removeAllListeners: () => {
                events.removeAllListeners();
            },
        }
        return self;
    }
}(new EventEmitter());