import { Router } from 'express';
import { loadProductInfo } from 'helpers/middlewares';
import {
  cartAddProduct,
  cartRemoveProduct,
} from 'controllers/controller.cart';

const router = new Router();

router.route('/add/:id')
  .post(loadProductInfo, cartAddProduct);

router.route('/remove/:id')
  .post(loadProductInfo, cartRemoveProduct);

export default router;
