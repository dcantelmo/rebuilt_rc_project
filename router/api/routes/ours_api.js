const { Router } = require("express");
const axios = require("axios");
const getWord = require("../../../randomWord");
const jwt = require("jsonwebtoken");
const db = require("node-couchdb");
const config = require("../../../config");
const path = require("path");

const couch = new db({
    auth: {
        user: config.db_username,
        password: config.db_password,
    },
});

//middlewares
fs = require("fs");
const router = Router();

module.exports = (app) => {
    app.use("/", router);

    router.get("/", (req, res) => {
        res.send("yuuuiii");
    });

    router.get("/getRandomWord", (req, res) => {
        let number = parseInt(req.query.num) || 1;
        if (req.query.lang == "it") {
            getWord
                .random(number)
                .then((parole) => {
                    getWord.translate(parole, req).then((result) => {
                        res.send(result);
                    });
                })
                .catch(() => console.log("err"));
            //{ res.send(getWord.translate(parole, req))})
        } else {
            getWord.random(number).then((words) => {
                res.send(words);
            });
        }
    });

    router.get("/getImage", (req, res) => {
        if (req.query.api_key) {
            console.log(req.query.api_key);
            let api_key = req.query.api_key;
            jwt.verify(api_key, "ajabana", (err, decode) => {
                if (err) {
                    console.log("errore verifica api_key");
                    console.log(err);
                    res.sendStatus(400);
                } else {
                    couch
                        .get(config.db_database_name, config.db_document)
                        .then((data, headers, status) => {
                            if (decode.user_id) {
                                let user_id = decode.user_id;
                                if (data.data.users[user_id]) {
                                    if(err)
                                        console.log(err)
                                    else
                                    fs.readdir('./user_images', (err,files) => {
                                        files.forEach(file => {
                                            console.log(file);
                                        });
                                    });
                                    /*res.send(
                                        "immagine di " +
                                            data.data.users[user_id].username
                                    );*/
                                } else res.send("utente non presente");
                            } else if (decode.username) {
                                let username = decode.username;
                                let password = decode.password;
                                if (
                                    data.data.users[username] &&
                                    data.data.users[username].password ==
                                        password
                                ) {
                                    fs.readdir(
                                        './user_images',
                                        (err, files) => {
                                            if(err)
                                                console.log(err)
                                            else
                                                files.forEach((file) => {
                                                    console.log(file);
                                                });
                                        }
                                    );
                                    /////////////////////////////////////////
                                    /*
                                    res.send(
                                        "immagine di " +
                                            data.data.users[username].username
                                    );*/
                                } else {
                                    res.send("utente non presente");
                                }
                            } else {
                                res.send(400);
                            }
                        });
                }
            });
        } else {
            res.sendStatus(400);
        }
    });
};
