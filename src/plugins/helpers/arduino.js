const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const EventEmitter = require('events');

module.exports = function(events) {
    return function ArduinoHelper(_port, { baudRate = 115200 }) {

        console.log('ArduionoHelper:setPort()', _port);
        events.removeAllListeners();
        const port = new SerialPort(_port, { baudRate });
        const arduino = port.pipe(new Readline({ delimiter: '\n' }));

        const LEVELS = [0, 1, 2, 4, 8, 16];

        const self = {
            log: (message, ...args) => {
                console.log('ArduinoHelper: ', message, ...args);
            },

            on: (message, callback) => {
                self.log('on(' + message + ')');
                events.on(message, callback);
            },

            emit: (message, data, ...args) => {
                self.log('emit(' + message + ')', data);
                events.emit(message, data, ...args);
            },

            restart: (event, data) => {
                self.send('RESETCPU,');
                self.emit('restarting');
            },

            threshold: (event, data) => {
                self.send('THRESHOLD,' + data);
            },

            gain: (event, data) => {
                self.send('GAIN,' + LEVELS[data]);
            },

            total: (event, data) => {
                self.send('TOTAL,' + data);
            },

            send: (command) => {
                const command_send = '$AC,' + command + ' \n';
                console.log('🙋🏼‍♂️ ' + command_send);
                port.write(command_send);
            },

            bind: () => {
                self.log('bind');
                port.on('open', (...args) => { self.emit('open', ...args); });
                arduino.on('data', (...args) => { self.emit('data', ...args); });
                arduino.on('close', (...args) => { self.emit('close', ...args); });
            },
            close: () => {
                if (port && port.isOpen) {
                    port.close();
                }
            }
        }
        self.bind();

        return self;
    }
}(new EventEmitter());