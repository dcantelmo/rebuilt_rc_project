const { Router } = require("express");
const config = require("../../../config");
const router = Router();

module.exports = (app) => {
    app.use("/", router);

    router.get("/", (req, res) => {
        if (!req.session.count) {
            req.session.count=1
        }
        else
            console.log(req.session.count++)
        
        res.render("home/home", {
            client_name: req.connection.remoteAddress,
            players: [
                { name: "Daniele" },
                { name: "Capo" },
                { name: "Sandro" },
            ],
        });
    });
};
