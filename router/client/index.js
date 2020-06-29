const { Router } = require("express");
const room = require("./routes/room");
const home = require("./routes/home");


module.exports = () => {
    const router = Router();

    home(router);
    room(router);

    console.log('Client Routes - OK');
    return router;
};
