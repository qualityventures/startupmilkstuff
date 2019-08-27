import { Router } from 'express';
import { userGetInfo, getUserEmails, getUserEmailCount } from 'controllers/controller.user';
import {
  checkAdminAccess,
} from 'helpers/middlewares';

const router = new Router();

router.route('/')
  .get(userGetInfo);

router.route('/users')
  .get(checkAdminAccess, getUserEmails);

router.route('/users-count')
  .get(checkAdminAccess, getUserEmailCount);


export default router;
