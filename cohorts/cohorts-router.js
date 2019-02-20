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
        const cohorts = await db('cohorts');
        res.status(200).json(cohorts);
    } catch (error) {
        res.status(500).json(error);
    }
})

// get cohort by id
router.get('/:id', async (req, res) => {
    try {
        const cohort = await db('cohorts')
            .where({ id: req.params.id });

            if (cohort.length === 0) {
                res.status(404).json({ message: `The cohort with id ${req.params.id} does not exist` });
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
            const [id] = await db('cohorts').insert(req.body)
            
            const cohort = await db('cohorts')
                .where({ id })
                .first();

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
        const count = await db('cohorts')
            .where({ id: req.params.id })
            .del();

        if (count) {
            res.status(204).end()
        } else {
            res.status(404).json({ message: 'Record with that id not found' });
        }
    } catch (error) {
        res.status(500).json(error);
    }
})

router.put('/:id', async (req, res) => {
    try {
        if (!req.body.name) {
            res.status(404).json({ message: 'Record must include a name' });
        } else {
            const count = await db('cohorts')
                .where({ id: req.params.id })
                .update(req.body);
    
            if (count) {
                const cohort = await db('cohorts')
                    .where({ id: req.params.id })
                    .first();
                
                res.status(200).json(cohort)
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
    const cohort = await db('cohorts')
        .where({ id: req.params.id })
        .first();

        if (!cohort) {
            res.status(404).json({ message: `Cohort with id ${req.params.id} does not exist` });
        } else {
            const students = await db('students')
                .where({ cohorts_id: req.params.id })
        
                if (students.length === 0) {
                    res.status(404).json({ message: `There are no students in the cohort with id ${req.params.id}` });
                } else {
                    res.status(200).json(students);
                }
        }
})



module.exports = router;