const express = require('express');
const knex = require('knex');
const knexConfig = require('../knexfile.js').development;

const db = knex(knexConfig);

const router = express.Router();

// cohorts endpoints



module.exports = router;