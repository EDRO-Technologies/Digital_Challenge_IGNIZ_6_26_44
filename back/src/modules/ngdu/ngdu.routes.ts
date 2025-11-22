import { Router } from 'express';

import * as ngduController from './ngdu.controller';

const router = Router();

router.get('/list', ngduController.getNgduList);
router.get('/list/tables', ngduController.searchAllTables);
router.post('/graph', ngduController.getNgduGraph);

router.post('/object-exists', ngduController.objectExists);
router.post('/get-object-name', ngduController.objectByName);
router.post('/is-connected', ngduController.isConnected);

export default router;
