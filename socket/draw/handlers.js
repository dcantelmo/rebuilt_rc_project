const { rooms, checkRoom } = require("./roomArray");

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("Connected: " + socket.id);

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
            if (checkRoom(data.id, data.password) == "ok") {
                socket.join(data.id);
                rooms[socket.room].addUser(socket.id);
            }
            else {
                socket.emit("notExists");
                socket.room = '';
            }
        });

        socket.on("startGame", () => {
            console.log(`Avvio game in room: ${socket.room}`);
            if(socket.room && rooms[socket.room])
                rooms[socket.room].start();
        });

        socket.on("disconnect", () => {
            console.log("disconnected" + socket.id);
            if (socket.room && rooms[socket.room]) {
                rooms[socket.room].removeUser(socket.id);
                console.log('andato');
                if (rooms[socket.room].empty) {
                    if (rooms[socket.room].interval)
                        clearInterval(rooms[socket.room].interval)
                    delete rooms[socket.room];
                }
            }

        });

        //CHAT AREA

        socket.on("message", (data) => {
            if (data == rooms[socket.room].word) {
                console.log('ha vinto tutto: ' + socket.id);
                return;
            }

            let package = {
                user: socket.id,
                text: data,
            };

            io.to(socket.room).emit("message", package);
        })
    });
};
