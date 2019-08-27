import RouteDashboardOrder from './dashboard-order';
import RouteDashboardOrders from './dashboard-orders';

export default [
  { path: '/dashboard/order/:order_id',
    key: 'dashboard-order',
    exact: true,
    component: RouteDashboardOrder,
  },
  { path: '/',
    key: 'orders',
    exact: false,
    component: RouteDashboardOrders,
  },
];
