const SerialPortHelper = require('./helpers/serialport');
const ArduinoHelper = require('./helpers/arduino');
const WindowHelper = require('./helpers/window');
const arduino = require('./helpers/arduino');

module.exports = function ArduinoCommunications() {
    console.log('new ArduinoCommunications();');

    const serialports = new SerialPortHelper();
    let duino;
    let window;

    const self = {
        registerWindow: (_window) => {
            self.log('registerWindow()');
            window = new WindowHelper(_window);
            self.bindWindowActions();
        },

        bindWindowActions: () => {
            self.log('bindWindowActions()');

            serialports.on('PORTS.LIST.DONE', window.sendListDone);
            window.on('SERIALPORT.LIST.GET', serialports.getPorts);

            window.on('SERIALPORT.SELECTED', self.selectPort);
            //window.on('SERIALPORT.SELECTED', window.setPort);
        },

        selectPort: (event, port, ...args) => {
            window.send('arduino.ready', false);
            self.log('selectPort()', port, ...args);
            self.setArduino(port, baudRate = 115200);
        },

        setArduino: (port, { baudRate = 115200 }) => {
            self.log('setArduino()', port);
            // close previously initiated arduino helpers
            if (duino) {
                duino.close();
            }
            duino = new ArduinoHelper(port, { baudRate });
            duino.on('open', (data) => {
                window.send('arduino.ready', true);
            });
            duino.on('data', (data) => {
                console.log('ArduinoData: ', data);
                window.send('arduino.data', data);
            });
            self.bindWhenWeHaveArduino();
        },

        bindWhenWeHaveArduino: () => {
            window.on('ARDUINO.RESTART', duino.restart);
        },

        log: (message, ...args) => {
            console.log('ArduinoCommunications: ', message, ...args);
        }
    }
    return self;
}