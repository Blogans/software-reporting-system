import express from 'express';
import { checkPermission } from '../middleware/authMiddleware';
import {
  getAllWarnings,
  createWarning,
  getWarningById,
  updateWarning,
  deleteWarning,
  getWarningsForOffender
} from '../controllers/warning.controller';

const router = express.Router();

// Get all warnings
router.get('/', checkPermission('VIEW_WARNINGS'), getAllWarnings);

// Create a new warning
router.post('/', checkPermission('MANAGE_WARNINGS'), createWarning);

// Get a specific warning by ID
router.get('/:id', checkPermission('VIEW_WARNINGS'), getWarningById);

// Update a warning
router.put('/:id', checkPermission('MANAGE_WARNINGS'), updateWarning);

// Delete a warning
router.delete('/:id', checkPermission('MANAGE_WARNINGS'), deleteWarning);

// Get warnings for a specific offender
router.get('/offender/:offenderId', checkPermission('VIEW_WARNINGS'), getWarningsForOffender);

export default router;