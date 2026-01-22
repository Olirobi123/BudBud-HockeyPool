import { Router } from 'express';
import { migrationController } from '../controllers/migrationController';

const router = Router();

// POST /api/migration/populate-roster
router.post('/populate-roster', migrationController.populateTeamRoster);

export default router;
