import { Router } from 'express';
import { exportCSVEmails } from 'controllers/controller.export';
import {
  checkAdminAccess,
} from 'helpers/middlewares';

const router = new Router();

router.route('/csv-emails')
  .get(checkAdminAccess, exportCSVEmails);

export default router;
