import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Dentist from '../models/Dentist.js';

dotenv.config();
connectDB();

const seedDentists = async () => {
  try {
    await Dentist.deleteMany();

    const dentists = [
      {
        name: 'Dr. John Doe',
        specialty: 'Orthodontist',
        schedule: {
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          startTime: '09:00 AM',
          endTime: '05:00 PM'
        }
      },
      {
        name: 'Dr. Jane Smith',
        specialty: 'Pediatric Dentist',
        schedule: {
          workingDays: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
          startTime: '10:00 AM',
          endTime: '06:00 PM'
        }
      },
      {
        name: 'Dr. Emily Johnson',
        specialty: 'General Dentist',
        schedule: {
          workingDays: ['Tuesday', 'Thursday', 'Saturday'],
          startTime: '08:00 AM',
          endTime: '03:00 PM'
        }
      }
    ];

    await Dentist.insertMany(dentists);
    console.log('Dentists seeded');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDentists();
