import express from 'express';
import {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
  getAppointment
} from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { check } from 'express-validator';

const router = express.Router();

// @route   POST /api/appointments
router.post(
  '/',
  protect,
  [
    check('dentistId', 'Dentist ID is required').notEmpty(),
    check('appointmentDate', 'Valid appointment date is required').isISO8601()
  ],
  createAppointment
);

// @route   GET /api/appointments
router.get('/', protect, getAppointments);

// @route  GET /api/appointments/:id
router.get('/:id', protect, getAppointment);

// @route   PUT /api/appointments/:id
router.put(
  '/:id',
  protect,
  [
    check('appointmentDate', 'Valid appointment date is required')
      .optional()
      .isISO8601(),
    check('status', 'Invalid status')
      .optional()
      .isIn(['Scheduled', 'Completed', 'Cancelled'])
  ],
  updateAppointment
);

// @route   DELETE /api/appointments/:id
router.delete('/:id', protect, deleteAppointment);

export default router;
