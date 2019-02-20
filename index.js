const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const knexConfig = require('./knexfile.js').development;

const db = knex(knexConfig);

const server = express();

server.use(helmet());
server.use(express.json());

const port = process.env.PORT || 4000
server.listen(port, () => {
    console.log(`\n*** Listening on http://localhost:${port} ***\n`)
})