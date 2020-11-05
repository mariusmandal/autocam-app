const Net = require('net');
const { Atem } = require('atem-connection');
const AtemSupport = require('./atem-helper');
const port = 8090;

const Server = new Net.Server();
const atemClient = new Atem();
const atemHelper = new AtemSupport(atemClient);


function debug(message, ...args) {
    console.log(message, ...args);
}

Server.on('connection', (socket) => {
    debug('Connection established');
    socket.setEncoding("utf8");
    socket.write('ATEM|init');

    socket.on('data', (chunk) => {
        debug('DATA: ', chunk);
        let command = chunk.split('|');
        atemHelper.exec(command[0], command[1]);
    });

    socket.on('end', () => {
        debug('client left 😭');
    });

    socket.on('error', (err) => {
        console.warn('Socket error:', err);
    });
});

atemHelper.bind();
Server.listen(port, () => {
    debug('Server listening @ ' + port);
});