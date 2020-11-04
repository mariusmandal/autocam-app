const { Atem } = require('atem-connection');

let atemIsConnected = false;

const atemhelper = new Atem();

function connectToAtem(ip) {
    console.log('Connect to ATEM using NRK Sofie', ip);
    atemhelper.connect(ip).then(() => {
        console.log('Atem connected');
    }).catch((err) => {
        console.log('Atem connection error: ', err);
    });
}

connectToAtem('172.16.1.47');

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

atemhelper.on('info', console.log);
atemhelper.on('error', console.log);
atemhelper.on('connected', () => {
    atemIsConnected = true;
});


console.log(atemhelper);
setInterval(() => {
    let input = getRndInteger(1, 5);
    console.log('Change to: ', input);
    atemhelper.changeProgramInput(input)
        .then(() => {
            console.log('Input should be changed now');
        })
        .catch((err) => {
            console.log('changeProgramInput() error: ', err);
        });
}, 2500);