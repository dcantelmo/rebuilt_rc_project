const { Router } = require("express");
const config = require("../../../config");
const router = Router();

module.exports = (app) => {
    app.use("/login", router);

    router.get("/", (req, res) => {
        res.render("login/login", {
            client_name: req.connection.remoteAddress,
            players: [
                { name: "Daniele" },
                { name: "Capo" },
                { name: "Sandro" },
            ],
            play_link: `/room`,
        });
    });
};
