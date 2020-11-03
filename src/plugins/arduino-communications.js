const SerialPortHelper = require('./helpers/serialport');
const ArduinoHelper = require('./helpers/arduino');
const WindowHelper = require('./helpers/window');

module.exports = function ArduinoCommunications() {
    const serialports = new SerialPortHelper();
    const duino = new ArduinoHelper();

    let window;
    let didBindArduino = false;

    const self = {
        registerWindow: (_window) => {
            window = new WindowHelper(_window);
            self.bindSerialPortActions();
            self.bindWindowToArduinoOnce();
            self.bindArduinoToWindow();
        },

        bindSerialPortActions: () => {
            window.on('serialport.list.get', serialports.getPorts);
            serialports.on('serialports.list.done', window.sendListDone);
            window.on('serialport.selected', self.selectPort);
        },

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
                    // Forward the message from window to arduino
                    window.on('arduino.' + command, duino[command]);
                    // Notify self (since child component might wanna tell mom what they did)
                    window.on('arduino.' + command, (event, data) => {
                        window.notifySelf('arduino.' + command, data);
                    });
                });
                didBindArduino = true;
            }
        },

        selectPort: (event, port, ...args) => {
            window.send('arduino.open', false);
            self.setArduino(port, baudRate = 115200);
        },

        setArduino: (port, { baudRate = 115200 }) => {
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
                        case 'LEVELS':
                            self.levels(intel);
                            break;
                        case 'STATUS':
                            self.status(intel);
                            break;
                        default:
                            self.log('Unsupported arduino data action: ' + action);
                            self.log('Remaining infos: ', intel);
                    }
                    break;
                default:
                    self.log('Unsupported arduino event: ' + event);
                    break;
            }
        },

        cut: function(input, reason) {
            self.log('📸  ' + input + ' (' + reason + ')');
            window.send('arduino.cut', { input: input, reason: reason });
        },

        round: function(info) {
            window.send('arduino.round', info);
        },

        status: function(info) {
            self.log('STATUS:', info);
        },

        levels: function(info) {
            samples = info.shift();
            let data = {
                samples: samples.replace('SAMPLES:', '')
            };
            info.forEach((level) => {
                levelData = level.split(':');
                data[levelData[0]] = levelData[1];
            });
            window.send('arduino.levels', data);
        },

        log: (message, ...args) => {
            console.log('ArduinoCommunications: ', message, ...args);
        }
    }

    return self;
}