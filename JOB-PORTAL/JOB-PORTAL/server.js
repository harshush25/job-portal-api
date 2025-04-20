const express = require('express');
const mongoose = require('mongoose');
const Job = require('./models/job');  // Assuming the Job model is in the 'models' folder
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize express application
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());  // Enable CORS for all routes

// Serve static files from the "public" folder (where your HTML file is)
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection using environment variables
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://JOB_ADMIN:admin@clusteraip.gb7i5gy.mongodb.net/jobPortal?retryWrites=true&w=majority';
mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Default route (Homepage)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));  // Serve the HTML page
});

// Route to get all jobs
app.get('/api/jobs', async (req, res) => {
    try {
        const jobs = await Job.find();  // Fetch all jobs from the database
        res.status(200).json(jobs);  // Return all jobs as JSON response
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Error fetching jobs' });
    }
});

// Route to create a new job
app.post('/api/jobs', async (req, res) => {
    const { title, description, company, location } = req.body;

    // Simple validation
    if (!title || !description || !company || !location) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Create a new job entry
        const newJob = new Job({ title, description, company, location });
        await newJob.save(); // Save the new job to MongoDB
        res.status(201).json(newJob);  // Return the created job as a response
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ message: 'Error creating job' });
    }
});

// Route to delete a specific job by ID
app.delete('/api/jobs/:id', async (req, res) => {
    const jobId = req.params.id;
    try {
        const result = await Job.findByIdAndDelete(jobId);  // Delete job by ID
        if (!result) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({ message: 'Error deleting job' });
    }
});

// Route to delete all jobs
app.delete('/api/jobs', async (req, res) => {
    try {
        await Job.deleteMany();  // Delete all jobs from the database
        res.json({ message: 'All jobs deleted successfully' });
    } catch (error) {
        console.error('Error deleting jobs:', error);
        res.status(500).json({ message: 'Error deleting jobs' });
    }
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
