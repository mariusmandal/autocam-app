const SerialPortHelper = require('./helpers/serialport');
const ArduinoHelper = require('./helpers/arduino');
const WindowHelper = require('./helpers/window');

module.exports = function ArduinoCommunications() {
    console.log('new ArduinoCommunications();');

    const serialports = new SerialPortHelper();
    let duino;
    let window;
    let didBindArduino = false;

    const self = {
        registerWindow: (_window) => {
            self.log('registerWindow()');
            window = new WindowHelper(_window);
            self.bindSerialPortActions();
        },

        bindSerialPortActions: () => {
            self.log('bindSerialPortActions()');
            window.on('serialport.list.get', serialports.getPorts);
            serialports.on('serialports.list.done', window.sendListDone);
            window.on('serialport.selected', self.selectPort);
        },

        selectPort: (event, port, ...args) => {
            self.log('selectPort()', port, ...args);
            window.send('arduino.open', false);
            self.setArduino(port, baudRate = 115200);
        },

        setArduino: (port, { baudRate = 115200 }) => {
            self.log('setArduino()', port);
            // close previously initiated arduino helpers
            if (duino) {
                duino.close();
            }
            duino = new ArduinoHelper(port, { baudRate });
            self.bindArduinoToWindow();
            self.bindWindowToArduinoOnce();
        },

        bindArduinoToWindow: () => {
            duino.getAvailableListeners().forEach((listener) => {
                duino.on(listener, (data) => {
                    console.log('arduino.' + listener + ':', data);
                    window.send('arduino.' + listener, data);
                });
            });
        },

        bindWindowToArduinoOnce: () => {
            if (!didBindArduino) {
                duino.getAvailableCommands().forEach((command) => {
                    window.on('arduino.' + command, duino[command]);
                });
                didBindArduino = true;
            }
        },

        log: (message, ...args) => {
            console.log('ArduinoCommunications: ', message, ...args);
        }
    }
    return self;
}