const { Router } = require("express");
const room = require("./routes/room");
const home = require("./routes/home");
const login = require("./routes/login");


module.exports = () => {
    const router = Router();

    home(router);
    room(router);
    login(router)

    console.log('Client Routes - OK');
    return router;
};

