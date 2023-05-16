require('dotenv').config();

const knex = require('knex')({

    client: 'pg',

    connection: 'postgres://kdimywow:6SAdrtRXF2tzPs8LNDa6Av5CjHyIq-rA@babar.db.elephantsql.com/kdimywow'

    // host: process.env.HOST,
    // user: process.env.USER,
    // port: process.env.PORT,
    // password: process.env.PASSWORD,
    // database: process.env.DATABASE,

});

module.exports = knex;