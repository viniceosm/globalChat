const dgram = require('dgram');
const server = dgram.createSocket('udp4');

let usuarios = [];

server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
});
server.on('message', (msg, rinfo) => {
    let usuarioJaCadastrado = (usuarios.find((u)=> {
        return u.address === rinfo.address && u.port === rinfo.port;
    }) !== undefined);

    if (!usuarioJaCadastrado || usuarioJaCadastrado.length === 0) {
        // ta recebendo do nome de usuario
        usuarios.push({
            nome: Buffer.from(msg),
            address: rinfo.address,
            port: rinfo.port
        });
        
        msg = Buffer.from(`Sistema: ${msg.toString()} acabou de entrar.`);
        console.log(`${msg}`);
    } else {
        // ta recebendo mensagem
        console.log(`${msg}`);
    }

    let usuariosMenosQuemEnviou = usuarios.filter((u) => {
        return (u.address + ':' + u.port !== rinfo.address + ':' + rinfo.port);
    });
    
    usuariosMenosQuemEnviou.forEach(u => {
        server.send(msg, u.port, u.address, (err) => { });
    });
});

server.on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
});

server.bind({
    address: 'localhost',
    port: 4000,
    exclusive: true
});