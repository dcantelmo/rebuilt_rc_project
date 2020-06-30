const { rooms, checkRoom } = require("./roomArray");
const { response } = require("express");
const room = require("../../router/client/routes/room");

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log(
            "Connected: " + socket.id + " " + socket.handshake.query.room
        );

        socket.on("strokes", (data) => {
            for (stanza in socket.rooms) 
                socket.broadcast.to(socket.rooms[stanza]).emit("strokes", data);
        });
        socket.on("clearDrawing", () => {
            for (stanza in socket.rooms)
                socket.broadcast.to(socket.rooms[stanza]).emit("clearDrawing");
        });
        socket.on("redraw", (data) => {
            for (stanza in socket.rooms)
            socket.broadcast.to(socket.rooms[stanza]).emit("redraw", data);
        });
        socket.on("imageState", (data) => {
            for (stanza in socket.rooms)
            socket.broadcast.to(socket.rooms[stanza]).emit("getImageState", data);
        });

        socket.on("join", (data) => {
            if (checkRoom(data.id, data.password) == "ok") socket.join(data.id);
            else socket.emit("seistronzo");
        });

        socket.on("disconnect", () => {
            console.log("disconnected" + socket.id);
        });
    });
};
