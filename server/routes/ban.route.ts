import express from 'express';
import { checkPermission } from '../middleware/authMiddleware';
import {
  getAllBans,
  createBan,
  getBanById,
  updateBan,
  deleteBan,
  getBansForOffender
} from '../controllers/ban.controller';

const router = express.Router();

// Get all bans
router.get('/', checkPermission('VIEW_BANS'), getAllBans);

// Create a new ban
router.post('/', checkPermission('MANAGE_BANS'), createBan);

// Get a specific ban by ID
router.get('/:id', checkPermission('VIEW_BANS'), getBanById);

// Update a ban
router.put('/:id', checkPermission('MANAGE_BANS'), updateBan);

// Delete a ban
router.delete('/:id', checkPermission('MANAGE_BANS'), deleteBan);

// Get bans for a specific offender
router.get('/offender/:offenderId', checkPermission('VIEW_BANS'), getBansForOffender);

export default router;