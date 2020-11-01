const SerialPort = require('serialport');
const EventEmitter = require('events');

module.exports = function(events) {
    return function SerialPortHelper() {
        let portList = [];

        const self = {
            getPorts: (...args) => {
                self.log('getPorts()', ...args);
                SerialPort.list()
                    .then((ports) => {
                        portList = [];
                        ports.forEach((port) => { portList.push(port); })
                        events.emit('PORTS.LIST.DONE', portList);
                    })
                    .catch((error) => {
                        events.emit('PORTS.LIST.ERROR', error);
                    });
                return;
            },

            log: (message, ...args) => {
                console.log('SerialPortHelper: ', message, ...args);
            },

            on: (message, callback, ...args) => {
                self.log('on(' + message + '):', ...args);
                events.on(message, callback);
            },
            emit: (message, data, ...args) => {
                self.log('emit(' + message + ')', ...args);
                events.emit(message, data, ...args);
            },
        }
        return self;
    }
}(new EventEmitter());