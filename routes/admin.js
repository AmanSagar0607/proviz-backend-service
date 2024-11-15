import express from 'express';
import { Application } from '../models/Application.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AdminUser } from '../models/AdminUser.js';

const router = express.Router();

// GET applications with pagination
router.get('/applications', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const applications = await Application.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Application.countDocuments();

    res.status(200).json({
      applications,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications' });
  }
});

// DELETE application with validation
router.delete('/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Application.findByIdAndDelete(id);
    
    if (!result) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting application' });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    
    // Validate input
    if (!name || !email || !username || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for existing user
    const existingUser = await AdminUser.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new AdminUser({
      name,
      email,
      username,
      password: hashedPassword
    });

    await newAdmin.save();

    // Generate token
    const token = jwt.sign(
      { userId: newAdmin._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      message: 'Admin account created successfully'
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error creating admin account' });
  }
});

export { router as adminRouter };