const dgram = require('dgram');
const readline = require('readline');
const client = dgram.createSocket('udp4');
const PORT = 4000;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

let nome;
rl.question(`Digite seu nick: `, (_nome) => {
    nome = Buffer.from(_nome);
    client.send(nome, PORT, 'localhost', (err) => {
        pedeMsg();
    });
});

function pedeMsg() {
    rl.question(``, (message) => {
        message = Buffer.from(`${nome}: ${message}`);
        client.send(message, PORT, 'localhost', (err) => {
            pedeMsg();
        });
    });
}

client.on('message', (msg, rinfo) => {
    console.log(`${msg}`);
});