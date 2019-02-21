const express = require('express');
const knex = require('knex');
const knexConfig = require('../knexfile.js').development;

const db = knex(knexConfig);

const router = express.Router();

// students endpoints
router.get('/', async (req, res) => {
    try {
        const students = await db('students')
        res.status(200).json(students)
    } catch (error) {
        res.status(500).json(error);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const student = await db('students')
            .where({ id: req.params.id })
            .first();

            if (!student) {
                res.status(404).json({ message: `Student ${req.params.id} does not exist` });
            } else {
                const cohort = await db('cohorts')
                    .where({ id: student.cohorts_id })
                    .first();
                console.log(cohort);
                res.status(200).json({
                    id: student.id,
                    name: student.name,
                    cohort: cohort.name
                });
            }
    } catch (error) {
        res.status(500).json(error);
    }
})

router.post('/', async (req, res) => {
    try {
        if (!req.body.name) {
            res.status(404).json({ message: 'name required' })
        } else if (!req.body.cohorts_id) {
            res.status(404).json({ message: 'cohorts_id required' })
        } else {
            const cohort = await db('cohorts')
                .where({ id: req.body.cohorts_id })
                .first();
                console.log(cohort);
            
            if (!cohort) {
                res.status(404).json({ message: 'Cannot add student to non-existant cohort' });
            } else {
                const [id] = await db('students').insert(req.body)
    
                const student = await db('students')
                    .where({ id })
                    .first()
    
                res.status(201).json(student);
            }
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const count = await db('students')
            .where({ id: req.params.id })
            .del();
        
        if (count) {
            res.status(204).end()
        } else {
            res.status(404).json({ message: `Student ${req.params.id} does not exist` });
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

router.put('/:id', async (req, res) => {
    try {
        if (!req.body.name || !req.body.cohorts_id) {
            res.status(404).json({ message: 'Please include a cohort name and cohorts_id' });
        } else {
            const cohort = await db('cohorts')
                .where({ id: req.body.cohorts_id })
                .first();
            
            if (!cohort) {
                res.status(404).json({ message: `Cannot add student into non-existant cohort` });
            } else {
                const count = await db('students')
                    .where({ id: req.params.id })
                    .update(req.body)
        
                if (count) {
                    const student = await db('students')
                        .where({ id: req.params.id })
                        .first();
                    
                        res.status(200).json(student)
                } else {
                    res.status(404).json({ message: `Student ${req.params.id} wasn't found` });
                }
            }
        }
    } catch (error) {
        res.status(500).json(error);
    }
})



module.exports = router;