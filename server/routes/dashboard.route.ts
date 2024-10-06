import express from 'express';
import { getRecentIncidents, getRecentWarnings, getRecentBans, getDashboardStats } from '../controllers/dashboard.controller';

const router = express.Router();

router.get('/recent/incidents', getRecentIncidents);
router.get('/recent/warnings', getRecentWarnings);
router.get('/recent/bans', getRecentBans);
router.get('/stats', getDashboardStats);

export default router;