// src/controllers/appointmentController.js
import Appointment from '../models/Appointment.js';

export const createAppointment = async (req, res, next) => {
  try {
    const { dentistId, appointmentDate } = req.body;

    const appointment = new Appointment({
      user: req.user,
      dentist: dentistId,
      appointmentDate
    });

    await appointment.save();

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
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      req.body,
      { new: true }
    );

    if (!appointment)
      return res.status(404).json({ msg: 'Appointment not found' });

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

    res.json({ msg: 'Appointment deleted' });
  } catch (err) {
    next(err);
  }
};
