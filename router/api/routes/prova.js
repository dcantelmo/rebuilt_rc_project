const { Router } = require('express');
//middlewares

const router = Router();

module.exports = (app) => {
    app.use('/prova', router);    

    router.get("/", (req, res) => {
      res.send("yuuuiii");
    });
}