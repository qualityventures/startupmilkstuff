import { Router } from 'express';
import {
  loadProductInfo,
  loadOrderInfo,
  checkAdminAccess,
  checkUserAccess,
} from 'helpers/middlewares';
import {
  downloadFile,
} from 'controllers/controller.download';

const router = new Router();

router.route('/:id/:file_id/:order_id')
  .get(checkUserAccess, loadProductInfo, loadOrderInfo, downloadFile);

router.route('/:id/:file_id')
  .get(checkAdminAccess, loadProductInfo, downloadFile);

export default router;
