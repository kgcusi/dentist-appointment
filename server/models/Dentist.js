import mongoose from 'mongoose';

const DentistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    specialty: String,
    availability: [Date]
  },
  { timestamps: true }
);

const Dentist = mongoose.model('Dentist', DentistSchema);

export default Dentist;
