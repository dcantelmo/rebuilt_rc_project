const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require("cookie-parser");
const cors = require('cors');
const routesApi = require('../router/api');
const routesClient = require("../router/client");


const config = require('../config');

module.exports = (app) => {
    app.get('/status', (req, res) => {
        res.status(200).end();
    });
    app.head('/status', (req, res) => {
        res.status(200).end();
    });

    app.use(cors());

    app.use(
        bodyParser.urlencoded({
            extended: false,
        })
    );

    app.use(cookieParser());
    app.use(
        session({
            secret: "secret",
            resave: true,
            saveUninitialized: true,
        })
    );

    app.use(config.api.prefix, routesApi());
    
    
    
    app.use(routesClient());
    app.use('/public', express.static(path.join(__dirname, "../client/public")));
}