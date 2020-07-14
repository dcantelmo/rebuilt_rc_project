const getRandomWord = require('../../randomWord');

var rooms = {};

class Room {
    constructor(id, password, io) {
        this.id = id;
        this.password = password;
        this.users = [];
        this.drawer = null;
        this.io = io;
        this.timer = 10;
        this.round = 3;
        this.running = false;
        this.ended = false;
        this.empty = false;
        this.word = 'prova';
        this.interval = null;
    }
    addUser(user) {
        this.users.push({
            id: user,
            points: 0,
        });
        if (this.users.length == 1)
            this.drawer = {
                id: user,
                position: 0,
            };
        if(user == this.drawer.id)
            this.io.to(user).emit("setMode", "drawer");
        else
            this.io.to(user).emit("setMode", "watch");
    }
    removeUser(user) {
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].id == user) {
                if (user == this.drawer.id){
                    this.assignDrawer();
                    if(this.drawer.position > 0)
                        this.drawer.position--;
                    console.log('uscito il disegnatore');
                }
                this.users.splice(i, 1);
                if (this.users.length <= 0)
                    this.empty = true;
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
        } else 
            this.empty = true;
        
        this.users.forEach((user) => {
            console.log(user.id, this.drawer.id)
            if(user.id == this.drawer.id)
                this.io.to(user.id).emit("setMode", "drawer");
            else
                this.io.to(user.id).emit("setMode", "watch");
        })
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
    addPoints(socket){
        this.users.forEach((user) => {
            if(user.id == socket.id){
                user.points += (this.timer);
                this.io.to(socket.room).emit("points", {id: socket.id, points: user.points});
                return;
            }
        });
    }
    start() {
        if (!this.running && this.round > 0) {
            getRandomWord.random().then((word) => this.word = word).then(() => {
                this.running = true;
                if (this.ended) {
                    
                    this.ended = false;
                }
                console.log(this.word);
                console.log(this.drawer);
                this.io.to(this.drawer.id).emit("word", this.word);
                this.interval = setInterval(
                    (() => {
                        this.io.to(this.id).emit("timerEvent", this.timer);
                        if (this.timer <= 0) {
                            this.ended = true;
                            this.timer = 10;
                            this.running = false;
                            this.assignDrawer();                     
                            clearInterval(this.interval);
                        }
                        else this.timer--;
                    }).bind(this),
                    1000
                );
            });
        }
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
