import { Router } from 'express';
import { checkAdminAccess, loadProductInfo } from 'helpers/middlewares';
import {
  createNewProduct,
  getProductByUrl,
  getProductById,
  getProducts,
  updateProduct,
  addProductImage,
  moveProductImage,
  deleteProductImage,
  addProductFile,
  deleteProductFile,
  updateProductFile,
  updateProductRelated,
} from 'controllers/controller.products';

const router = new Router();

router.route('/')
  .get(getProducts);

router.route('/getByUrl/:url')
  .get(getProductByUrl);

router.route('/getById/:id')
  .get(checkAdminAccess, loadProductInfo, getProductById);

router.route('/:id/images/')
  .post(checkAdminAccess, loadProductInfo, addProductImage);

router.route('/:id/images/move')
  .patch(checkAdminAccess, loadProductInfo, moveProductImage);

router.route('/:id/images/delete')
  .patch(checkAdminAccess, loadProductInfo, deleteProductImage);

router.route('/:id/files/')
  .post(checkAdminAccess, loadProductInfo, addProductFile);

router.route('/:id/files/delete')
  .patch(checkAdminAccess, loadProductInfo, deleteProductFile);

router.route('/:id/files/:file_id/formats')
  .patch(checkAdminAccess, loadProductInfo, updateProductFile);

router.route('/')
  .post(checkAdminAccess, createNewProduct);

router.route('/:id')
  .patch(checkAdminAccess, updateProduct);

router.route('/:id/related/')
  .post(checkAdminAccess, loadProductInfo, updateProductRelated);

export default router;
