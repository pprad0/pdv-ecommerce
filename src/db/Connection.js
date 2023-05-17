require('dotenv').config();

const knex = require('knex')({

    client: 'pg',

    connection: {

        host: process.env.HOST,
        user: process.env.USER,
        port: process.env.PORT,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
    }
});

module.exports = knex;