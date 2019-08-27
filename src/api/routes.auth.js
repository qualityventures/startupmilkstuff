import { Router } from 'express';
import { authLogin, authRecover, authRegister } from 'controllers/controller.auth';

const router = new Router();

router.route('/login')
  .post(authLogin);

router.route('/recover')
  .post(authRecover);

router.route('/register')
  .post(authRegister);

export default router;
