import express from 'express';
import {
  getUserProfile,
  updateUserProfile
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { check } from 'express-validator';

const router = express.Router();

// @route   GET /api/users/profile
router.get('/profile', protect, getUserProfile);

// @route   PUT /api/users/profile
router.put(
  '/profile',
  protect,
  [
    check('name', 'Name is required').optional().notEmpty(),
    check('email', 'Please include a valid email')
      .optional()
      .isEmail()
      .normalizeEmail()
  ],
  updateUserProfile
);

export default router;
