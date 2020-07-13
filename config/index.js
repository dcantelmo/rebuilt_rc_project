const dotenv = require('dotenv');
const env = dotenv.config();

if (env.error) {
    throw new Error('Missing .env file');
}

module.exports = {
    serverURI: process.env.serverURI || "localhost",
    port: process.env.port || 4000,

    db_username: process.env.DB_USERNAME || "admin",
    db_password: process.env.DB_PASSWORD || "admin",
    db_database_name: process.env.DB_DATABASE_NAME || "",
    db_document: process.env.DB_DOC_ID || "",
    //databaseURL:

    //jwtSecret:

    api: {
        prefix: "/api",
    },
    client: {
        prefix: "/",
    },
};

