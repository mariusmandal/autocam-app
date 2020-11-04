const { EventEmitter } = require('events');
const Net = require('net');

module.exports = function(events) {

    return function AtemHelper(port, { host = 'localhost' }) {
        let reconnectInterval = false;
        let connected = false;
        let atemIp = null;
        let reconnectAttempt = 0;
        const client = new Net.Socket();

        client.on('data', (chunk) => {
            data = chunk.toString();
            console.log('DATAfromATEM: ', data);

            // Wrong application's answering our request
            // Will it help to retry? IDK. 
            // Anything better to do? IDK.
            if (data.includes('HTTP/1.1 400')) {
                self.emit('error', 'Someone who\'s not ATEM-helper is answering at port ' + port + ' 😬');
                try {
                    client.end();
                } catch (error) {
                    // noooothing todo? or should we reconnect
                }
                return;
            }

            self.parse(chunk.toString());
        });

        client.on('ready', () => {
            try {
                client.write('connect|' + atemIp);
                self.log('ATEM:connect:write');
            } catch (error) {
                self.log('ATEM:connect:error', error);
            }
        });
        
        client.on('error', (error) => {
            console.log("caught error in net.js." + error);
        });

        client.on('close', () => {
            self.reconnect();
        });

        const self = {
            setIp: (ip) => {
                self.connect(ip);
            },

            connect: (ip) => {
                atemIp = ip;
                try {
                    self.log('ATEM:connect');
                    client.connect({ port, host }, () => {
                        self.connected();
                    });

                } catch (error) {
                    self.log('ATEM connect major error:', error);
                };
            },

            reconnect: () => {
                self.log('reconnect(' + (reconnectAttempt++) + ')');
                self.disconnected();
                if (!reconnectInterval) {
                    self.log('Start reconnecting');
                    reconnectInterval = setInterval(self.connect, 5000);
                } else {
                    self.log('Already reconnecting');
                }
            },

            connected: () => {
                self.log('connected()');
                if (reconnectInterval) {
                    self.log('clearing reconnect interval');
                    clearInterval(reconnectInterval);
                    reconnectInterval = false;
                }
                connected = true;
            },

            disconnected: () => {
                connected = false;
            },

            cut: (input) => {
                self.log('CUT', input);
                if (connected) {
                    client.write('cut|' + input);
                } else {
                    self.log('Command not sent - not connected to socket');
                }
            },

            parse: (data) => {
                self.log('PARSE:', data);
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