import { Router } from 'express';
import * as controller from '../controllers/catalogController';

const router = Router();

router.post('/create', controller.create);
router.post('/delete', controller.remove);
router.post('/move', controller.move);
router.get('/list', controller.list);

export default router;
