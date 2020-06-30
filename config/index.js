const dotenv = require('dotenv');
const env = dotenv.config();

if (env.error) {
    throw new Error('Missing .env file');
}

module.exports = {
    serverURI: process.env.serverURI || 'localhost',
    port: process.env.port || 4000,

    //databaseURL: 

    //jwtSecret:

    api: {
        prefix: '/api',
    },
    client: {
        prefix: '/',
    }
}

