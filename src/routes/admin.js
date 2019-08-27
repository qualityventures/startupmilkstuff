import RouteAdminProducts from './admin-products';
import RouteAdminProductEdit from './admin-product-edit';
import RouteAdminProductCreate from './admin-product-create';
import RouteAdminExport from './admin-export';

export default [
  { path: '/admin/export',
    key: 'admin-export',
    exact: true,
    component: RouteAdminExport,
  },
  { path: '/admin/product/create',
    key: 'admin-product-create',
    exact: true,
    component: RouteAdminProductCreate,
  },
  { path: '/admin/product/:id',
    key: 'admin-product-edit',
    exact: true,
    component: RouteAdminProductEdit,
  },
  { path: '/admin/products',
    key: 'admin-products',
    exact: true,
    component: RouteAdminProducts,
  },
  { path: '/',
    key: 'index',
    exact: false,
    component: RouteAdminProducts,
  },
];
