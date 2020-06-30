const { Router } = require("express");
const router = Router();
const { io } = require("../../../socket");
const {
    createRoom,
    checkRoom,
    rooms,
} = require("../../../socket/draw/roomArray");

module.exports = (app) => {
    app.use("/room", router);

    router.get("/", (req, res) => {
        error = req.query.err;
        if (error) {
            res.render("room/room", {
                room_link: `/room/draw`,
                error: "Insisci la password corretta per la stanza!",
            });
        } else {
            res.render("room/room", {
                room_link: `/room/draw`,
            });
        }
    });

    router.get("/prova", (req, res) => {
        getRoom();
        res.send("ok");
    });

    router.get("/result", (req, res) => {
        prova();
        res.send("ok");
    });

    router.post("/draw", (req, res) => {
        if (req.body) {
            if (checkRoom(req.body.id, req.body.password) == "ok")
                res.render("draw/draw", {
                    ROOM: req.body.id,
                    PASSWORD: req.body.password
                });
            else if (checkRoom(req.body.id, req.body.password) == "password") {
                res.redirect(`/room?err=password&roomName=${req.body.id}`);
            } else {
                createRoom(req.body.id, req.body.password, io);
                res.render("draw/draw", {
                    ROOM: req.body.id,
                    PASSWORD: req.body.password
                });
            }
        } else res.sendStatus(400);
    });
};
