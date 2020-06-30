const { rooms, checkRoom } = require("./roomArray");

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log(
            "Connected: " + socket.id + " " + socket.handshake.query.room
        );

        socket.on("strokes", (data) => {
            socket.broadcast.to(socket.room).emit("strokes", data);
        });
        
        socket.on("clearDrawing", () => {
            socket.broadcast.to(socket.room).emit("clearDrawing");
        });

        socket.on("redraw", (data) => {
            socket.broadcast.to(socket.room).emit("redraw", data);
        });

        socket.on("imageState", (data) => {
            socket.broadcast.to(socket.room).emit("getImageState", data);
        });

        socket.on("join", (data) => {
            socket.room = data.id;
            if (checkRoom(data.id, data.password) == "ok")
                socket.join(data.id);
            else
                socket.emit("seistronzo");
        });

        socket.on("startGame", () => {
            console.log(`Avvio game in room: ${socket.room}`);
            rooms[socket.room].start();
        });

        socket.on("disconnect", () => {
            console.log("disconnected" + socket.id);
        });
    });
};
