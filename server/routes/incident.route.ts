import express from 'express';
import { checkPermission } from '../middleware/authMiddleware';
import * as incidentController from '../controllers/incident.controller';

const router = express.Router();

router.get('/', checkPermission('VIEW_INCIDENTS'), incidentController.getAllIncidents);
router.post('/', checkPermission('MANAGE_INCIDENTS'), incidentController.createIncident);
router.get('/venue/:venueId', checkPermission('VIEW_INCIDENTS'), incidentController.getIncidentsForVenue);
router.get('/:id', checkPermission('VIEW_INCIDENTS'), incidentController.getIncidentById);
router.put('/:id', checkPermission('MANAGE_INCIDENTS'), incidentController.updateIncident);
router.delete('/:id', checkPermission('MANAGE_INCIDENTS'), incidentController.deleteIncident);

export default router;