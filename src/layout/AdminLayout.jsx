import { Link, NavLink, Outlet } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminLayout() {
    return (<>
        <nav className="p-5 mb-5 navbar navbar-dark bg-dark">
            <ul className="nav">
                <li className="nav-item">
                    <Link className="nav-link link-light" to="/admin/product">後台產品列表</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link link-light" to="/admin/order">後台訂單列表</Link>
                </li>
            </ul>
        </nav>
        <main style={{minHeight: '95vh'}}>
            <Outlet />
        </main>
        <footer className="bg-dark text-center text-light p-3 mt-5">
            <p>© 2025 我的網站</p>
        </footer>
    </>)
}

export default AdminLayout;