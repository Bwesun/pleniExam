const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validation.middleware');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole,
  updateUserStatus
} = require('../controllers/user.controller');

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Validation rules
const updateUserValidation = [
  body('username').optional().trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').optional().isEmail().withMessage('Please provide a valid email')
];

const updateRoleValidation = [
  body('role').isIn(['candidate', 'instructor', 'admin']).withMessage('Invalid role')
];

const updateStatusValidation = [
  body('isActive').isBoolean().withMessage('isActive must be a boolean')
];

// Routes
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUserValidation, validate, updateUser);
router.delete('/:id', deleteUser);
router.put('/:id/role', updateRoleValidation, validate, updateUserRole);
router.put('/:id/status', updateStatusValidation, validate, updateUserStatus);

module.exports = router;
