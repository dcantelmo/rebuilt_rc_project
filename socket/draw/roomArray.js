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
        this.round = 1;
        this.running = false;
        this.ended = false;
        this.empty = false;
        this.word = 'prova';
        this.interval = null;
    }
    addUser(user, username) {
        this.users.push({
            id: user,
            username: username,
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
        this.sendUsers();
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
        this.sendUsers();
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
            points: -1,
        }
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].points >= winner.points) {
                winner = this.users[i];
            }
        }
        return winner;
    }
    addPoints(userid){
        this.users.forEach((user) => {
            if(user.id == userid){
                user.points += (this.timer);
                this.io.to(this.id).emit("points", {id: user.username, points: user.points});
                return;
            }
        });
        this.sendUsers();
    }
    sendUsers(){
        console.log('sendingUsers')
        this.io.to(this.id).emit("users", this.users);
    }
    start() {
        if(this.ended){
            this.io.to(this.id).emit("winner", this.getWinner());
            console.log('vincitore: ', this.getWinner());
            return;
        }
        if (!this.running && this.round > 0) {
            getRandomWord.random().then((word) => this.word = word).then(() => {
                this.running = true;
                console.log(this.word);
                console.log(this.drawer);
                this.io.to(this.drawer.id).emit("word", this.word);
                this.interval = setInterval(
                    (() => {
                        this.io.to(this.id).emit("timerEvent", this.timer);
                        if (this.timer <= 0) {
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
