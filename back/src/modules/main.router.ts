import { Router } from 'express';

import ngduRouter from './ngdu/ngdu.routes';

const router = Router();

router.use('/ngdu', ngduRouter);

export default router;
