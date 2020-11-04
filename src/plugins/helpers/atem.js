const { EventEmitter } = require('events');
const Net = require('net');

const port = 8081;

module.exports = function(events) {

    return function AtemHelper(port, { host = 'localhost' }) {
        let reconnectInterval = null;
        let atemIp = null;
        const client = new Net.Socket();

        client.on('data', (chunk) => {
            console.log('DATAfromATEM: ', chunk.toString());
            //self.emit('data', chunk);
        });

        client.on('end', () => {
            console.log('END');
            self.reconnect();
        });

        const self = {
            setIp: (ip) => {
                console.log('Should set Ip', ip);
            },
            reconnect: () => {
                reconnectInterval = setInterval(self.connect, 1000);
            },
            connect: (ip) => {
                atemIp = ip;
                client.connect({ port, host }, () => {
                    console.log('ATEM: connect');
                    reconnectInterval = null;
                    client.write('connect|' + atemIp);
                });
            },
            cut: (input) => {
                console.log('CUT', input);
                client.write('cut|' + input);
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
            log(message, ...args) {
                console.log('AtemHelper: ', message, ...args);
            },
        }

        return self;
    }
}(new EventEmitter());