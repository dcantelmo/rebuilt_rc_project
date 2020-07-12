const { Router } = require('express');
const axios = require('axios');
const getRandomWord = require('../../../randomWord');
const unirest = require('unirest')
//middlewares
fs = require('fs')
const router = Router();

module.exports = (app) => {
    app.use('/', router);    

    router.get("/", (req, res) => {
      res.send("yuuuiii");
    });

  router.get("/getRandomWord", (req, res) => {
      getRandomWord.then((word) => res.send(word));
  });

    /*
    router.get("/prova", (req,res) =>{
      var req = unirest(
          "POST",
          "https://google-translate1.p.rapidapi.com/language/translate/v2"
      );

      req.headers({
          "x-rapidapi-host": "google-translate1.p.rapidapi.com",
          "x-rapidapi-key":
              "0c47ec58c9msh1ddb040f7a973c8p1e27fbjsn01441202360c",
          "accept-encoding": "application/gzip",
          "content-type": "application/x-www-form-urlencoded",
          useQueryString: true,
      });

      req.form({
          source: "en",
          q: "Hello, world!",
          target: "it",
          format: "text",
      });

      req.end(function (res) {
          if (res.error) throw new Error(res.error);
          console.log(res.body.data.translations[0].translatedText);
      });
    }); */
}