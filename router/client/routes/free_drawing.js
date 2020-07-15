const { Router } = require("express");
const router = Router();
//const { createRoom, checkRoom } = require("../../../socket/draw/roomArray");
const { io } = require("../../../socket");
module.exports = (app) => {
    app.use("/free_drawing", router);

    router.get("/", (req, res) => {
        error = req.query.err;
        if (error){
            res.render("errore");
        }
        else {
            res.render("free_drawing/free_drawing",{

            });
        }
    });
};

