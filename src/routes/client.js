import RouteContact from './client-contact';
import RouteLicense from './client-license';
import RouteLogin from './client-login';
import RouteDashboard from './client-dashboard';
import { RouteClientProducts, fetchClientProducts } from './client-products';
import { RouteClientProduct, fetchClientProduct } from './client-product';

export default [
  { path: '/dashboard',
    key: 'dashboard',
    exact: false,
    component: RouteDashboard,
  },
  { path: '/login',
    key: 'login',
    exact: true,
    component: RouteLogin,
  },
  { path: '/contact',
    key: 'contact',
    exact: true,
    component: RouteContact,
  },
  { path: '/license',
    key: 'license',
    exact: true,
    component: RouteLicense,
  },
  { path: '/product/:url',
    key: 'user-product',
    exact: true,
    component: RouteClientProduct,
    fetchData: fetchClientProduct,
  },
  { path: '/products/:category',
    key: 'user-products',
    exact: true,
    component: RouteClientProducts,
    fetchData: fetchClientProducts,
  },
  { path: '/',
    key: 'index',
    exact: false,
    component: RouteClientProducts,
    fetchData: fetchClientProducts,
  },
];
