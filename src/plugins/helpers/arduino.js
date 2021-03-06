const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const EventEmitter = require('events');

module.exports = function(events) {
    return function ArduinoHelper() {
        events.removeAllListeners();

        const LEVELS = [0, 1, 2, 4, 8, 16];
        const COMMANDS = [
            'restart',
            'gain',
            'threshold',
            'total',
            'status',
            'inputs'
        ];
        const LISTENERS = [
            'open',
            'data',
            'close'
        ];

        let port;
        let arduino;

        const self = {
            setPort: function(_port, { baudRate = 115200 }) {
                self.log('ArduinoHelper:setPort()', _port);
                // Close current port (if one is current)
                self.close();
                // Set up new port
                port = new SerialPort(_port, { baudRate });
                arduino = port.pipe(new Readline({ delimiter: '\n' }));
                // Bind port and arduino to self
                self.bind();
            },

            bind: () => {
                port.on('open', (...args) => { self.emit('open', true); });
                arduino.on('data', (...args) => { self.emit('data', ...args); });
                arduino.on('close', (...args) => { self.emit('close', ...args); });
            },

            log: (message, ...args) => {
                return;
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

            removeAllListeners: () => {
                events.removeAllListeners();
            },

            getAvailableCommands: () => {
                return COMMANDS;
            },

            getAvailableListeners: () => {
                return LISTENERS;
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

            inputs: (event, data) => {
                self.send('NUM_INPUTS,' + data);
            },

            status: (event, data) => {
                self.send('STATUS');
            },

            send: (command) => {
                const command_send = '$AC,' + command + ',' + "\n";
                console.log('🙋🏼‍♂️ ' + command_send);
                port.write(command_send);
            },

            close: () => {
                if (port && port.isOpen) {
                    port.close();

                    // Removing listeners is most likely redundant
                    port.removeAllListeners();
                    if (arduino) {
                        arduino.removeAllListeners();
                    }
                }
            }
        }

        return self;
    }
}(new EventEmitter());