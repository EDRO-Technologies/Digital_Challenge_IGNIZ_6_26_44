import { Router } from 'express';

import * as ngduController from './ngdu.controller';

const router = Router();

router.get('/list', ngduController.getNgduList);
router.get('/list/tables', ngduController.getNgduList);
router.post('/graph', ngduController.getNgduGraph);

export default router;
