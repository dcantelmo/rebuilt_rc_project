

var rooms = [];

class Room {
    constructor(id, password) {
        this.id = id;
        this.password = password;
        this.users = [];
        this.drawer = {
            user: '',
            position: 0,
        };
        this.timer = 90;
        this.empty = false;
    }
    addUser(user) {
        this.users.push({
            id: user,
            points: 0,
        });
    }
    removeUser(user) {
        for (let i = 0; i < this.users.length; i++){
            if (this.users[i].id == user) {
                this.users.splice(i, 1);
                if (user == this.drawer.id && this.drawer.position >= this.users.length)
                    this.assignDrawer();
            }
        }
    };
    assignDrawer() {
        if (this.users[this.drawer.position+1]) {
            this.drawer.user = this.users[++this.drawer.position]
        }
        else if (this.users[0]) {
            this.drawer.user = this.users[0];
            this.drawer.position = 0;
        }
        else
            this.empty = true;
    }
}

module.exports = (io) => {
  io.on("connection", (socket) => {
      
      console.log(
        "Connected: " + socket.id + " " + socket.handshake.query.room
      );

      socket.on("strokes", (data) => {
          socket.broadcast.emit("strokes", data);
      });
      socket.on("clearDrawing", () => {
            socket.broadcast.emit("clearDrawing");
      });
      socket.on("redraw", (data) => {
        socket.broadcast.emit("redraw", data);
      });
      socket.on("imageState", (data) => {
        socket.broadcast.emit("getImageState", data);
      });

      socket.on("join", (data) => {
      })

      socket.on("disconnect", () => {
        console.log('ok');
      })
    });
}