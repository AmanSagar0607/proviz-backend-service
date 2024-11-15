import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true, match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] },
  phone: { type: String, required: true, trim: true },
  statement: { type: String, required: true, trim: true }, // Personal Statement
  createdAt: { type: Date, default: Date.now }
});

export const Application = mongoose.model('Application', applicationSchema);
