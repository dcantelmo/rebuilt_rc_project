const { Router } = require("express");
const router = Router();

module.exports = (app) => {
  app.use("/room", router);

  router.get("/", (req, res) => {
    res.render("room/room", {
      createRoom_link: `/room/create`,
      joinRoom_link: `/room/join`,
    });
  });

  router.post("/create", (req, res) => {
    res.send("nuova room");
  });

  router.post("/join", (req, res) => {
    res.send("join room");
  });

  router.get("/draw", (req, res) => {
    res.render("draw/draw", {
      ROOM: req.params.id,
    });
  });
};
