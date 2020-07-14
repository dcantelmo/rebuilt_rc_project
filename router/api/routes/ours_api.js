const { Router } = require("express");
const axios = require("axios");
const getWord = require("../../../randomWord");

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
            getWord.random(number).then((parole) => { getWord.translate(parole, req).then((result) => {
                res.send(result);
            })}).catch(() => console.log('err'));
           //{ res.send(getWord.translate(parole, req))})
        } else {
            getWord.random(number).then((words) => {res.send(words);});
        }
    });
};
