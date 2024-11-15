import express from 'express';
import { Application } from '../models/Application.js';

const router = express.Router();

// POST route to submit a new application
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, statement } = req.body;
    const newApplication = new Application({ name, email, phone, statement });
    await newApplication.save();
    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ message: 'Error submitting application', error: error.message });
  }
});

// GET route to fetch all applications
router.get('/applications', async (req, res) => {
  try {
    const applications = await Application.find();
    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
});


export { router as applicationRouter };

