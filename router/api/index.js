const { Router } = require('express');
const prova = require('./routes/prova');

module.exports = () => {
    
    const router = Router();
    prova(router);

    console.log("API Routes - OK");
    return router;
}