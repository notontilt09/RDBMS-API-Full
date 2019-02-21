const express = require('express');
const helmet = require('helmet');

const cohortsRouter = require('./cohorts/cohorts-router.js');
const studentsRouter = require('./students/students-router.js');

const server = express();

server.use(helmet());
server.use(express.json());

//routers 

server.use('/api/cohorts', cohortsRouter);
server.use('/students', studentsRouter);

module.exports = server;