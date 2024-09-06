import express from 'express';
import { checkPermission } from '../middleware/authMiddleware';
import * as offenderController from '../controllers/offender.controller';

const router = express.Router();

router.post('/', checkPermission('MANAGE_OFFENDERS'), offenderController.createOffender);
router.get('/', offenderController.getAllOffenders);
router.get('/:id', offenderController.getOffenderById);
router.put('/:id', checkPermission('MANAGE_OFFENDERS'), offenderController.updateOffender);
router.delete('/:id', checkPermission('MANAGE_OFFENDERS'), offenderController.deleteOffender);

export default router;