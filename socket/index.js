const socketIO = require('socket.io');
//const chat = require('chat/handlers');
const draw = require('./draw/handlers');

var io = {};

module.exports = {
    init(httpServer) { //subscribtion
        io = socketIO(httpServer);
        draw(io);
    },
    io
}