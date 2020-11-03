const SerialPortHelper = require('./helpers/serialport');
const ArduinoHelper = require('./helpers/arduino');
const WindowHelper = require('./helpers/window');

module.exports = function ArduinoCommunications() {
    console.log('new ArduinoCommunications();');

    const serialports = new SerialPortHelper();
    const duino = new ArduinoHelper();

    let window;
    let didBindArduino = false;

    const self = {
        registerWindow: (_window) => {
            self.log('registerWindow()');
            window = new WindowHelper(_window);
            self.bindSerialPortActions();
            self.bindWindowToArduinoOnce();
            self.bindArduinoToWindow();
        },

        bindSerialPortActions: () => {
            self.log('bindSerialPortActions()');
            window.on('serialport.list.get', serialports.getPorts);
            serialports.on('serialports.list.done', window.sendListDone);
            window.on('serialport.selected', self.selectPort);
        },

        setArduino: (port, { baudRate = 115200 }) => {
            duino = new ArduinoHelper(port, { baudRate });
        bindArduinoToWindow: () => {
            duino.getAvailableListeners().forEach((listener) => {
                duino.on(listener, (data) => {
                    self.translateArduinoSpeak(listener, data);
                });
            });
        },

        bindWindowToArduinoOnce: () => {
            if (!didBindArduino) {
                duino.getAvailableCommands().forEach((command) => {
                    window.on('arduino.' + command, duino[command]);
                });
                window.on('arduino.total', window.sendTotal);
                didBindArduino = true;
            }
        },

        selectPort: (event, port, ...args) => {
            self.log('selectPort()', port, ...args);
            window.send('arduino.open', false);
            self.setArduino(port, baudRate = 115200);
        },

        setArduino: (port, { baudRate = 115200 }) => {
            self.log('setArduino()', port);
            duino.setPort(port, { baudRate });
        },


        translateArduinoSpeak: function(event, data) {
            if (typeof data == 'string') {
                data = data.trim();
            }

            switch (event) {
                case 'open':
                case 'close':
                    window.send('arduino.' + event, data);
                    break;
                case 'data':
                    let intel = data.split('|');
                    let action = intel[0].replace('$ACR.', '');
                    intel.shift();

                    switch (action) {
                        case 'ROUND':
                            self.round(intel);
                            break;
                        case 'CUT':
                            self.cut(intel[0], intel[1].replace('REASON:', ''));
                            break;
                        case 'STATUS':
                            self.status(intel);
                            break;
                        default:
                            console.log('Unsupported arduino data action: ' + action);
                            console.log('Remaining infos: ', intel);
                    }
                    break;
                default:
                    console.log('Unsupported arduino event: ' + event);
                    break;
            }
        },

        cut: function(input, reason) {
            console.log('📸  ' + input + ' (' + reason + ')');
            window.send('arduino.cut', { input: input, reason: reason });
        },

        round: function(info) {
            window.send('arduino.round', info);
        },

        status: function(info) {
            console.log('STATUS:', info);
        },

        log: (message, ...args) => {
            console.log('ArduinoCommunications: ', message, ...args);
        }
    }

    return self;
}