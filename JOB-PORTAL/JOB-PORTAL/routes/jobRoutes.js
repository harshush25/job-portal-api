const express = require('express');
const { createJob, getJobs } = require('../controllers/jobController');

const router = express.Router();

// Route to create a job
router.post('/', createJob);

// Route to get all jobs
router.get('/', getJobs);

module.exports = router;
