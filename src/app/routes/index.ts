import { lazy } from 'react';

export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  name: string;
  icon: string;
}

const Products = lazy(() =>
  import('@features/products').then((module) => ({
    default: module.Products,
  }))
);

export const routes: RouteConfig[] = [
  {
    path: '/products',
    element: Products,
    name: 'Products',
    icon: 'box',
  },
];
