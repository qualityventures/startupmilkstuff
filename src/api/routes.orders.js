import { Router } from 'express';
import {
  createNewOrder,
  getMyOrders,
  getOrderDetails,
} from 'controllers/controller.orders';
import { checkUserAccess, loadOrderInfo } from 'helpers/middlewares';

const router = new Router();

router.route('/')
  .post(createNewOrder);

router.route('/my')
  .get(checkUserAccess, getMyOrders);

router.route('/:order_id')
  .get(checkUserAccess, loadOrderInfo, getOrderDetails);

export default router;
