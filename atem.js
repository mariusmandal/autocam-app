const Net = require('net');
const { Atem } = require('atem-connection');
const port = 8080;

const Server = new Net.Server();
const atemClient = new Atem();


Server.on('connection', (socket) => {
    console.log('Connection established');
    socket.setEncoding("utf8");

    socket.write('Hello');

    socket.on('data', (chunk) => {
        console.log('DATA: ', chunk);
        let command = chunk.split('|');
        switch (command[0]) {
            case 'connect':
                connect(command[1]);
                break;
            case 'cut':
                cut(command[1]);
                break;
            default:
                console.log('Unsupported action: ', command);
                break;
        }
    });

    socket.on('end', () => {
        console.log('client left 😭');
    });

    socket.on('error', (err) => {
        console.warn('ERROR', err);
    });
});

atemClient.on('info', console.log);
atemClient.on('error', console.log);
atemClient.on('connected', () => {});


Server.listen(port, () => {
    console.log('Server listening @ ' + port);
});


function cut(input) {
    atemClient.changeProgramInput(input)
        .then(() => {
            console.log('Input should be changed now');
        })
        .catch((err) => {
            console.log('changeProgramInput() error: ', err);
        });
}

function connect(ip) {
    console.log('Connect to ATEM using NRK Sofie', ip);
    atemClient.connect(ip).then(() => {
        console.log('Atem connected');
    }).catch((err) => {
        console.log('Atem connection error: ', err);
    });
}