import { createHashRouter } from 'react-router-dom';
import FrontendLayout from "./layout/FrontendLayout";
import Home from "./views/frontend/Home";
import Products from "./views/frontend/Products";
import SingleProduct from "./views/frontend/SingleProduct";
import Cart from "./views/frontend/Cart";
import NotFound from "./views/frontend/NotFound";
import Checkout from './views/frontend/Checkout';
import Login from './views/Login';
import AdminLayout from './layout/AdminLayout';
import AdminProducts from './views/admin/AdminProducts';
import AdminOrders from './views/admin/AdminOrders';

export const router = createHashRouter([
    // 前台頁面
    {
        path: '/',
        element: <FrontendLayout />,
        children: [
            {
                index: true,
                element: <Home />
            }, 
            {
                path: 'products',
                element: <Products />
            },
            {
                path: 'product/:id',
                element: <SingleProduct />
            },
            {
                path: 'cart',
                element: <Cart />
            },
            {
                path: 'checkout',
                element: <Checkout />
            },
            {
                path: 'login',
                element: <Login />
            }
        ]
    },

    // 後台頁面
    {
        path: 'admin',
        element: <AdminLayout />,
        children: [
            {
                path: 'product',
                element: <AdminProducts />
            },
            {
                path: 'order',
                element: <AdminOrders />
            }
        ]
    },

    // 錯誤頁面
    {
        path: '*',
        element: <NotFound />
    }
])