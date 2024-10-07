import express from 'express';
import { generateIncidentReport } from '../controllers/report.controller';
import { checkPermission } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/incidents', checkPermission('VIEW_INCIDENTS'), generateIncidentReport);

export default router;