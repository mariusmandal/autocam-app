module.exports = function AtemSupport(atemClient) {
    const self = {
        exec: (command, data) => {
            switch (command) {
                case 'connect':
                    self.connect(data);
                    break;
                case 'cut':
                    self.cut(data);
                    break;
                default:
                    if (atemClient[command] && typeof atemClient[command] == 'function') {
                        return atemClient[command](data);
                    }
                    self.log('Unsupported action: ', command);
                    break;
            }
        },
        cut: (input) => {
            atemClient.changeProgramInput(input)
                .then(() => {
                    self.log('Input should be changed now');
                })
                .catch((err) => {
                    self.log('changeProgramInput() error: ', err);
                });
        },

        connect: (ip) => {
            self.log('Connect to ATEM using NRK Sofie', ip);
            atemClient.connect(ip).then(() => {
                self.log('Atem connected');
            }).catch((err) => {
                self.log('Atem connection error: ', err);
            });
        },

        bind: () => {
            atemClient.on('info', self.log);
            atemClient.on('error', self.log);
            atemClient.on('connected', self.log);
        },

        log: (message, ...args) => {
            console.log(message, ...args);
        }
    }
    return self;
};