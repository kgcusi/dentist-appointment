// src/routes/appointmentRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment
} from '../controllers/appointmentController.js';

const router = express.Router();

// @route   POST /api/appointments
router.post('/', protect, createAppointment);

// @route   GET /api/appointments
router.get('/', protect, getAppointments);

// @route   PUT /api/appointments/:id
router.put('/:id', protect, updateAppointment);

// @route   DELETE /api/appointments/:id
router.delete('/:id', protect, deleteAppointment);

export default router;
