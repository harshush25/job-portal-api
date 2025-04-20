const Job = require('../models/job');  // Ensure the correct path to your Job model

// Create a new job
const createJob = async (req, res) => {
    const { title, description, company, location } = req.body;

    // Simple validation
    if (!title || !description || !company || !location) {
        return res.status(400).json({ message: "All fields (title, description, company, location) are required" });
    }

    try {
        // Create a new job entry
        const newJob = new Job({ title, description, company, location });
        await newJob.save();  // Save the new job to MongoDB
        res.status(201).json(newJob);  // Return the created job as a response
    } catch (err) {
        console.error("Error creating job:", err);  // Log the error for debugging
        res.status(500).json({ message: "Internal server error. Could not create job." });
    }
};

// Get all jobs
const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find();  // Fetch all jobs from the database
        if (jobs.length === 0) {
            return res.status(404).json({ message: "No jobs found" });  // If no jobs are found
        }
        res.status(200).json(jobs);  // Return all jobs in response
    } catch (err) {
        console.error("Error fetching jobs:", err);  // Log the error for debugging
        res.status(500).json({ message: "Internal server error. Could not fetch jobs." });
    }
};

// Export controller functions
module.exports = { createJob, getJobs };
