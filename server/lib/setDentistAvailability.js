// utilities/setDentistAvailability.js
import Dentist from '../models/Dentist.js';

export const setDentistAvailability = async (dentistId, date, timeSlots) => {
  try {
    const dentist = await Dentist.findById(dentistId);
    if (!dentist) {
      throw new Error('Dentist not found');
    }

    const existingAvailability = dentist.availability.find((a) =>
      a.date.toISOString().startsWith(date)
    );

    if (existingAvailability) {
      existingAvailability.timeSlots = timeSlots;
    } else {
      dentist.availability.push({ date: new Date(date), timeSlots });
    }

    await dentist.save();
  } catch (error) {
    console.error('Error setting availability:', error.message);
  }
};
