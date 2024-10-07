import Appointment from '../models/Appointment.js';
import { validationResult } from 'express-validator';
import Dentist from '../models/Dentist.js';
import { format } from 'date-fns';
import { generateTimeSlots } from '../utils/generateTimeslots.js';

export const getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      user: req.user
    }).populate('dentist', 'name specialty');

    if (!appointment)
      return res.status(404).json({ msg: 'Appointment not found' });

    if (appointment.user.toString() !== req.user) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(appointment);
  } catch (err) {
    next(err);
  }
};

export const createAppointment = async (req, res, next) => {
  try {
    const { dentistId, appointmentDate, timeSlot } = req.body;

    const userId = req.user;

    const dentist = await Dentist.findById(dentistId);

    if (!dentist) {
      return res.status(404).json({ message: 'Dentist not found' });
    }

    const requestedDate = new Date(appointmentDate);
    const dayOfWeek = format(requestedDate, 'EEEE');

    if (!dentist.schedule.workingDays.includes(dayOfWeek)) {
      return res
        .status(400)
        .json({ message: 'Dentist is not working on this day' });
    }

    const allTimeSlots = generateTimeSlots(requestedDate, dentist.schedule);

    if (!allTimeSlots.includes(timeSlot)) {
      return res.status(400).json({ message: 'Invalid time slot' });
    }

    const existingAppointment = await Appointment.findOne({
      dentist: dentistId,
      appointmentDate: {
        $gte: new Date(appointmentDate),
        $lt: new Date(new Date(appointmentDate).getTime() + 24 * 60 * 60 * 1000)
      },
      timeSlot: timeSlot
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'Time slot is already booked' });
    }

    const appointment = new Appointment({
      user: userId,
      dentist: dentistId,
      appointmentDate: requestedDate,
      timeSlot: timeSlot
    });

    await appointment.save();

    await appointment.populate('dentist', 'name specialty');

    res.status(201).json(appointment);
  } catch (err) {
    next(err);
  }
};

export const getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ user: req.user })
      .populate('dentist', 'name specialty')
      .sort({ appointmentDate: 1 });

    res.json(appointments);
  } catch (err) {
    next(err);
  }
};

export const updateAppointment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const updates = req.body;

    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      updates,
      { new: true }
    );

    if (!appointment)
      return res.status(404).json({ msg: 'Appointment not found' });

    await appointment.populate('dentist', 'name specialty');

    res.json(appointment);
  } catch (err) {
    next(err);
  }
};

export const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOneAndDelete({
      _id: req.params.id,
      user: req.user
    });

    if (!appointment)
      return res.status(404).json({ msg: 'Appointment not found' });

    res.json({ msg: 'Appointment cancelled' });
  } catch (err) {
    next(err);
  }
};
