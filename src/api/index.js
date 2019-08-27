import { Router } from 'express';
import userRoutes from './routes.user';
import authRoutes from './routes.auth';
import cartRoutes from './routes.cart';
import productsRoutes from './routes.products';
import ordersRoutes from './routes.orders';
import downloadRoutes from './routes.download';
import exportRoutes from './routes.export';

const router = new Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/cart', cartRoutes);
router.use('/products', productsRoutes);
router.use('/orders', ordersRoutes);
router.use('/download', downloadRoutes);
router.use('/export', exportRoutes);

export default router;
