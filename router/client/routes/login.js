const { Router } = require("express");
const config = require("../../../config");
const db = require("node-couchdb");
const router = Router();
const axios = require("axios");
const middleware = require("../../middleware");

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
        req.session.cookie.nickname = username;
        couch.get(config.db_database_name, config.db_document).then(
            function (data, headers, status) {
                if (data.data.users.hasOwnProperty(username)) {
                    //se esiste username
                    if (data.data.users[username].password == password) {
                        //se la password è corretta
                        req.session.loggedin = true;
                        req.session.username = username;
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
        req.session.cookie.nickname = username;
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
        //prendo access code
        res.redirect(
            "https://www.facebook.com/v7.0/dialog/oauth?client_id=" +
                config.fb_client_id +
                "&redirect_uri=" +
                config.fb_redirect_uri +
                "&state=" +
                config.fb_state_param +
                "&response_type=code"
        );
    });

    router.get("/oauth/token", (req, res) => {
        let code = req.query.code;
        let access_token;
        //scambio code per accesso token del client
        axios
            .get(
                "https://graph.facebook.com/v7.0/oauth/access_token?client_id=" +
                    config.fb_client_id +
                    "&redirect_uri=" +
                    config.fb_redirect_uri +
                    "&client_secret=" +
                    config.fb_client_secret +
                    "&code=" +
                    code
            )
            .then((response) => {
                access_token = response.data.access_token;

                console.log("Token client ottenuto");
                req.session.cookie.token = access_token;

                let appToken =
                    config.fb_client_id + "|" + config.fb_client_secret;
                //controllo token client tramite token app
                axios
                    .get(
                        `https://graph.facebook.com/debug_token?input_token=${access_token}&access_token=${appToken}`
                    )
                    .then((re) => {
                        let user_id = re.data.data.user_id;
                        console.log("user_id ottenuto");
                        axios
                            .get(
                                `https://graph.facebook.com/${user_id}?fields=id,name&access_token=${access_token}`
                            )
                            .then((resp) => {
                                const username = resp.data.name;
                                const token = access_token;

                                req.session.cookie.nickname = username;

                                couch
                                    .get(
                                        config.db_database_name,
                                        config.db_document_facebook
                                    )
                                    .then(
                                        function (data, headers, status) {
                                            if (data.data.users.hasOwnProperty(user_id)) {
                                                res.redirect("/room")
                                            } else {
                                                data.data.users[user_id] = {
                                                    username: username,
                                                    token: access_token,
                                                };
                                                couch
                                                    .update(config.db_database_name, data.data)
                                                    .then(
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
                            })
                            .catch((err) => {
                                res.send(err);
                            });
                    })

                    .catch((err) => {
                        res.send(err);
                    });
            })
            .catch((err) => {
                console.log("mancavo io");
            });
    });
};
