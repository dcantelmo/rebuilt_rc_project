const fs = require("fs");
const express = require("express");
const config = require("./config");
const unirest = require("unirest");

module.exports = {
    random(num = 1) {
        return new Promise((resolve, reject) => {
            fs.readFile("names.txt", "utf8", (err, data) => {
                if (err) {
                    return console.log(err);
                }
                let names = data.split("\n").map((x) => x.trim());

                let words = [];
                for (let i = 0; i < num; i++) {
                    words.push(names[Math.floor(Math.random() * names.length)]);
                }

                resolve(words);
            });
        });
    },

    translate(words, req) {
        return new Promise((resolve, reject) => {
            let text = words.join(",");
            let result;
            console.log(text);

            req = unirest(
                "POST",
                "https://google-translate1.p.rapidapi.com/language/translate/v2"
            );

            req.headers({
                "x-rapidapi-host": "google-translate1.p.rapidapi.com",
                "x-rapidapi-key": config.translate_key,
                "accept-encoding": "application/gzip",
                "content-type": "application/x-www-form-urlencoded",
                useQueryString: true,
            });

            req.form({
                source: "en",
                q: text,
                target: "it",
                format: "text",
            });

            req.end(function (res) {
                if (res.error) {
                    console.log(res.error);
                    reject();
                } else {
                    result = res.body.data.translations[0].translatedText;
                    result = result.split(",");

                    //let result="ajabana,cicciobello,la cantina,il libro,la scuola,locapo,lo scaldabagno,malo sogno";
                    result = result.replace(/,il /g, ",");
                    result = result.replace(/,lo /g, ",");
                    result = result.replace(/,la /g, ",");
                    result = result.replace(/,i /g, ",");
                    result = result.replace(/,gli /g, ",");
                    result = result.replace(/,le /g, ",");
                    result = result.split(",");
                    resolve(result);
                }
            });
        });
    },
};
