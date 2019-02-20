const express = require('express');
const knex = require('knex');
const knexConfig = require('../knexfile.js').development;

const db = knex(knexConfig);

const router = express.Router();

// error messages for SQL errors by errno
const errors = {
    '19': 'A record with that name already exists'
}

// cohorts endpoints

// get all cohorts
router.get('/', async (req, res) => {
    try {
        // grab all cohorts and return them
        const cohorts = await db('cohorts');
        res.status(200).json(cohorts);
    } catch (error) {
        res.status(500).json(error);
    }
})

// get cohort by id
router.get('/:id', async (req, res) => {
    try {
        // grab cohort with id matching input parameter
        const cohort = await db('cohorts')
            .where({ id: req.params.id })
            .first();
            // if nothing found, throw an error
            if (!cohort) {
                res.status(404).json({ message: `The cohort with id ${req.params.id} does not exist` });
            // if record round, return the record
            } else {
                res.status(200).json(cohort)
            }
    } catch (error) {
        res.status(500).json(error)
    }
})

// add new cohort
router.post('/', async (req, res) => {
    try {
        // make sure a name is passed in
        if (!req.body.name) {
            res.status(404).json({ message: 'name required' });
        } else {
            // grab id of new cohort after insertion
            const [id] = await db('cohorts').insert(req.body)
            // find cohort with corresponding new id
            const cohort = await db('cohorts')
                .where({ id })
                .first();

            // send successful post status with new cohort data
            res.status(201).json(cohort);
        }
        
    } catch (error) {
        const message = errors[error.errno] || 'There was a problem adding this cohort to the database';
        res.status(500).json({message});
    }
})

// delete cohort by id
router.delete('/:id', async (req, res) => {
    try {
        // find records where id matches input id and delete them
        const count = await db('cohorts')
            .where({ id: req.params.id })
            .del();

        // if record was delete, status 204 and stop
        if (count) {
            res.status(204).end()
        // if nothing deleted, throw error
        } else {
            res.status(404).json({ message: 'Record with that id not found' });
        }
    } catch (error) {
        res.status(500).json(error);
    }
})

router.put('/:id', async (req, res) => {
    try {
        // if no name provided, throw an error
        if (!req.body.name) {
            res.status(404).json({ message: 'Record must include a name' });
        } else {
            // find records where id matches given id and update with given data
            const count = await db('cohorts')
                .where({ id: req.params.id })
                .update(req.body);

            // if record was updated, show the updated record
            if (count) {
                const cohort = await db('cohorts')
                    .where({ id: req.params.id })
                    .first();
                
                res.status(200).json(cohort)
            // if record not found, throw an error
            } else {
                res.status(404).json({ message: 'Record with that id not found' });
            }
        }
    } catch (error) {
        const message = errors[error.errno] || 'Record could not be updated'
        res.status(500).json({ message });
    }
})

// subroute to get all students by cohort
router.get('/:id/students', async (req, res) => {
    // find the cohort of the given id
    const cohort = await db('cohorts')
        .where({ id: req.params.id })
        .first();
        // if the cohort doesn't exists send an error
        if (!cohort) {
            res.status(404).json({ message: `Cohort with id ${req.params.id} does not exist` });
        } else {
            // find the students in the given cohort id
            const students = await db('students')
                .where({ cohorts_id: req.params.id })
                // if no students in the cohort give an error
                if (students.length === 0) {
                    res.status(404).json({ message: `There are no students in the cohort with id ${req.params.id}` });
                } else {
                    res.status(200).json(students);
                }
        }
})



module.exports = router;