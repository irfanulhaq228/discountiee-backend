const { Server } = require('socket.io');

const io = new Server(8001, {
    cors: {
        origin: "*"
    }
});

const userNamespace = io.of('/user');

userNamespace.on('connection', (socket) => {
    console.log("User Connection with id", socket.id);

    socket.emit('welcome', 'User, Welcome to the Channel');

    socket.on('msg', (msg) => {
        agentNamespace.emit('msg', msg);
    });
});

const agentNamespace = io.of('/agent');

agentNamespace.on('connection', (socket) => {
    console.log("Agent connected with id", socket.id);

    socket.emit('welcome', 'Agent, Welcome to the Channel');

    socket.on('msg', (msg) => {
        userNamespace.emit('msg', msg);
    });
});

module.exports = io;