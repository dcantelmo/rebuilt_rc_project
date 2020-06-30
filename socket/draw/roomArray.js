var rooms = {};

class Room {
    constructor(id, password, io) {
        this.id = id;
        this.password = password;
        this.users = [];
        this.drawer = {
            user: "",
            position: 0,
        };
        this.io = io;
        this.timer = 90;
        this.round = 3;
        this.ended = false;
        this.empty = false;
    }
    addUser(user) {
        this.users.push({
            id: user,
            points: 0,
        });
    }
    removeUser(user) {
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].id == user) {
                this.users.splice(i, 1);
                if (
                    user == this.drawer.id &&
                    this.drawer.position >= this.users.length
                )
                    this.assignDrawer();
            }
        }
    }
    assignDrawer() {
        if (this.users[this.drawer.position + 1]) {
            this.drawer.user = this.users[++this.drawer.position];
        } else if (this.users[0]) {
            this.drawer.user = this.users[0];
            this.drawer.position = 0;
            if (this.round == 1) this.ended = true;
            else this.round--;
        } else this.empty = true;
    }
    getWinner() {
        let winner = {
            user: "",
            points: 0,
        };
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].points >= winner.points) {
                winner = this.users[i];
            }
        }
        return winner;
    }
    start() {
        var interval = setInterval(
            (() => {
                this.io.to(this.id).emit("timerEvent", this.timer);
                if (this.timer <= 0) clearInterval(interval);
                else this.timer--;
            }).bind(this),
            1000
        );
    }
}

module.exports = {
    rooms,
    createRoom(id, password, io) {
        rooms[id] = new Room(id, password, io);
        return id;
    },
    checkRoom(id, password) {
        if (rooms[id]) {
            //corrisponde ID
            if (rooms[id].password == password) return "ok";
            //password errata
            else return "password";
        } else return "notExist";
    },
};
