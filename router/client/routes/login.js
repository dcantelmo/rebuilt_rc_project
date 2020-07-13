const { Router } = require("express");
const config = require("../../../config");
const db = require("node-couchdb");
const router = Router();

const couch = new db({
    auth: {
        user: config.db_username,
        password: config.db_password,
    },
});

module.exports = (app) => {
    app.use("/login", router);

    router.get("/", (req, res) => {
        res.render("login/login", {
            errLoginUsername: "display:none;",
            errLoginPassword: "display:none;",
            errRegistrazioneUsername: "display:none;",
        });
    });

    router.post("/login", (req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        couch.get(config.db_database_name, config.db_document).then(
            function (data, headers, status) {
                if (data.data.users.hasOwnProperty(username)) {
                    //se esiste username
                    if (data.data.users[username].password == password) {
                        //se la password è corretta
                        res.redirect("/room");
                    } else {
                        //se la password è sbagliata
                        res.render("login/login", {
                            errLoginUsername: "display:none;",
                            errLoginPassword: "display:;",
                            errRegistrazioneUsername: "display:none;",
                        });
                    }
                } else {
                    //se non esiste username
                    res.render("login/login", {
                        errLoginUsername: "display:;",
                        errLoginPassword: "display:none;",
                        errRegistrazioneUsername: "display:none;",
                    });
                }
            },
            function (err) {
                res.send(err);
            }
        );


    });

    router.post("/registrazione", (req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        couch.get(config.db_database_name, config.db_document).then(
            function (data, headers, status) {
                if (data.data.users.hasOwnProperty(username)) {
                    res.render("login/login", {
                        errLoginUsername: "display:none;",
                        errLoginPassword: "display:none;",
                        errRegistrazioneUsername: "display:;",
                    });
                } else {
                    data.data.users[username] = {
                        username: username,
                        password: password,
                    };
                    couch.update(config.db_database_name, data.data).then(
                        function (data, headers, status) {
                            res.redirect("/room");
                        },
                        function (err) {
                            console.log(err);
                        }
                    );
                }
            },
            function (err) {
                res.send(err);
            }
        );
    });

    router.get("/oauth", (req, res) => {
        res.send("oauth");
    });
};
