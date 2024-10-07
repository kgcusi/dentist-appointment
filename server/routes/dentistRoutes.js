import express from 'express';
import {
  getAvailableTimeSlots,
  getDentists
} from '../controllers/dentistController.js';

const router = express.Router();

// @route   GET /api/dentists
router.get('/', getDentists);

// @route GET /api/dentists/available-timeslots
router.get('/available-timeslots', getAvailableTimeSlots);

export default router;
