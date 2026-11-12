import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Employee from './src/models/Employee.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();

const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

const initialEmployees = [
  {
    fullName: 'Sarah Jenkins',
    email: 's.jenkins@organization.com',
    department: 'Engineering',
    designation: 'Staff Systems Architect',
    status: 'Active',
  },
  {
    fullName: 'Marcus Vance',
    email: 'm.vance@organization.com',
    department: 'Product Design',
    designation: 'Lead UX Researcher',
    status: 'Active',
  },
  {
    fullName: 'Amina Al-Mansoor',
    email: 'a.almansoor@organization.com',
    department: 'Operations',
    designation: 'HR Operations Specialist',
    status: 'Active',
  },
  {
    fullName: 'David Sterling',
    email: 'd.sterling@organization.com',
    department: 'Engineering',
    designation: 'Principal Security Architect',
    status: 'Inactive',
  },
  {
    fullName: 'Claire Beauchamp',
    email: 'c.beauchamp@organization.com',
    department: 'Finance',
    designation: 'Senior Financial Analyst',
    status: 'Active',
  },
  {
    fullName: 'Julian Moreau',
    email: 'j.moreau@organization.com',
    department: 'Marketing',
    designation: 'Brand Strategy Director',
    status: 'Active',
  },
];

const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB Atlas...');
    await mongoose.connect(uri);
    console.log('[Seed] Connected.');

    const existingCount = await Employee.countDocuments();
    if (existingCount === 0) {
      console.log(`[Seed] Inserting ${initialEmployees.length} initial employee records into MongoDB Atlas...`);
      await Employee.insertMany(initialEmployees);
      console.log('[Seed] Seed completed successfully!');
    } else {
      console.log(`[Seed] Database already contains ${existingCount} employee records. Skipping insertion.`);
    }
  } catch (error) {
    console.error(`[Seed Error] ${error.message}`);
  } finally {
    await mongoose.connection.close();
    console.log('[Seed] Connection closed.');
  }
};

seedDatabase();

