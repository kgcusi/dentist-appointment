// models/Dentist.js

import mongoose from 'mongoose';

const DentistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    specialty: {
      type: String,
      required: true
    },
    schedule: {
      workingDays: [
        {
          type: String,
          enum: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'
          ],
          required: true
        }
      ],
      startTime: {
        type: String,
        required: true
      },
      endTime: {
        type: String,
        required: true
      },
      timeSlotInterval: {
        type: Number,
        default: 60
      }
    }
  },
  { timestamps: true }
);

const Dentist = mongoose.model('Dentist', DentistSchema);

export default Dentist;
