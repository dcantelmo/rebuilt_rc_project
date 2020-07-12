const getRandomWord = require('../../randomWord');

var rooms = {};

class Room {
    constructor(id, password, io) {
        this.id = id;
        this.password = password;
        this.users = [];
        this.drawer = {
            id: "",
            position: 0,
        };
        this.io = io;
        this.timer = 90;
        this.round = 3;
        this.ended = false;
        this.empty = false;
        this.word = 'prova';
    }
    addUser(user) {
        this.users.push({
            id: user,
            points: 0,
        });
        if (this.users.length == 1)
            this.drawer = this.users[0];
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
            this.drawer.id = this.users[++this.drawer.position].id;
        } else if (this.users[0]) {
            this.drawer.id = this.users[0].id;
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
        getRandomWord.random().then((word) => this.word = word).then(() => {
            this.assignDrawer();
            console.log(this.word);
            console.log(this.drawer);
            this.io.to(this.drawer.id).emit("word", this.word);
            var interval = setInterval(
            (() => {
                this.io.to(this.id).emit("timerEvent", this.timer);
                if (this.timer <= 0) clearInterval(interval);
                else this.timer--;
            }).bind(this),
            1000
        );});
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
