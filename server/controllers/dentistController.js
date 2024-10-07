import Dentist from '../models/Dentist.js';
import Appointment from '../models/Appointment.js';
import { format } from 'date-fns';
import { generateTimeSlots } from '../utils/generateTimeslots.js';

export const getDentists = async (req, res, next) => {
  try {
    const dentists = await Dentist.find();
    res.json(dentists);
  } catch (err) {
    next(err);
  }
};

export const getAvailableTimeSlots = async (req, res, next) => {
  try {
    const { dentistId, date } = req.query;

    const dentist = await Dentist.findById(dentistId);

    if (!dentist) {
      return res.status(404).json({ message: 'Dentist not found' });
    }

    const requestedDate = new Date(date);
    const dayOfWeek = format(requestedDate, 'EEEE');

    if (!dentist.schedule.workingDays.includes(dayOfWeek)) {
      return res
        .status(400)
        .json({ message: 'Dentist is not working on this day' });
    }

    const allTimeSlots = generateTimeSlots(requestedDate, dentist.schedule);

    const appointments = await Appointment.find({
      dentist: dentistId,
      appointmentDate: {
        $gte: new Date(date),
        $lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
      }
    });

    const bookedTimeSlots = appointments.map(
      (appointment) => appointment.timeSlot
    );

    const availableTimeSlots = allTimeSlots.filter(
      (timeSlot) => !bookedTimeSlots.includes(timeSlot)
    );

    res.json(availableTimeSlots);
  } catch (err) {
    next(err);
  }
};
