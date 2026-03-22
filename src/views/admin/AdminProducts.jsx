import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as bootstrap  from 'bootstrap';  

import Pagination from '../../components/Pagination';
import ProductModal from '../../components/ProductModal';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

// 建立初始化的資料
const INITIAL_TEMPLATE_DATA = {
    id: '',
    title: '',
    category: '',
    origin_price: '',
    price: '',
    unit: '',
    description: '',
    content: '',
    is_enabled: false,
    imageUrl: '',
    imagesUrl: [],
    tempDelivery: '',
}

function AdminProducts() {
    // 登入狀態管理（控制顯示登入或產品頁）
    const [isAuth, setIsAuth] = useState(false);

    // 產品資料狀態
    const [products, setProducts] = useState([]);

    // 產品表單資料模板
    const [templateProduct, setTemplateProduct] = useState(INITIAL_TEMPLATE_DATA);

    // Modal 控制相關狀態
    const [modalType, setModalType] = useState(''); // "create", "edit", "delete"
    const productModalRef = useRef(null);

    // 分頁狀態
    // API 文件說明：回傳的資料格式
    const [pagination, setPagination] = useState({});

    // modal 開啟
    const openModal = (type, product) => {
        // 設定 Modal 類型並顯示
        setModalType(type);

        setTemplateProduct(({
        ...INITIAL_TEMPLATE_DATA,
        ...product,
        }));

        productModalRef.current.show();
    }

    // modal 關閉
    const closeModal = () => {
        productModalRef.current.hide();
    }

    // 串接產品列表 API
    const getProducts = async(page = 1) => {
    try {
        const res = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products?page=${page}`);
        setProducts(res.data.products); // 寫入產品列表
        setPagination(res.data.pagination); // 寫入分頁資料
    } catch (error) {
        console.log(error.response.data.message);
    }
    }

    // 初始化
    useEffect(() => {
    // 讀取 cookie
    const token = document.cookie
        .split(';')
        .find((row) => row.startsWith('hexToken='))
        ?.split('=')[1];

    // 如果有拿到 token 再帶入headers   
    if (token) {
        axios.defaults.headers.common['Authorization'] = token; // 修改實體建立時所指派的預設配置（登入成功後，API請求都會自動帶上token）
    }

    // 初始化 Bootstrap Modal
    productModalRef.current = new bootstrap.Modal('#productModal', {
        keyboard: false
    })

    // Modal 關閉時移除焦點
    document
        .querySelector("#productModal")
        .addEventListener("hide.bs.modal", () => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    });

    // 初始化搭配useEffect串接登入驗證 API
    // 檢查管理員權限並載入資料
    const checkAdmin = async() => {
        try {
        await axios.post(`${API_BASE}/api/user/check`);
        setIsAuth(true);
        getProducts(); // 載入產品資料
        } catch (error) {
        console.log(error.response.data.message);
        }
    }

    checkAdmin();
    }, [])

    return (
    <>
        <div className="container">
            <h2 className="mt-4">產品列表</h2>

            {/* 新增產品按鈕 */}
            <div className="text-start mt-4">
                <button type="button" className="btn btn-primary" onClick={()=> openModal('create', INITIAL_TEMPLATE_DATA)}>建立新的產品</button>
            </div>

            {/* 產品列表表格 */}
            <table className="table mt-4">
            <thead>
                <tr>
                <th>分類</th>
                <th>產品名稱</th>
                <th>原價</th>
                <th>售價</th>
                <th>是否啟用</th>
                <th>編輯</th>
                </tr>
            </thead>
            <tbody>
                {products.map((product) => (
                <tr key={product.id}>
                    <td>{product.category}</td>
                    <td>{product.title}</td>
                    <td>{product.origin_price}</td>
                    <td>{product.price}</td>
                    <td className={`${product.is_enabled ? ('text-success') : ('text-black-50')}`}>{product.is_enabled ? '啟用' : '未啟用'}</td>
                    <td>
                    <div className="btn-group" role="group" aria-label="Basic example">
                        <button type="button" className="btn btn-outline-primary btn-sm" onClick={()=>{openModal('edit', product)}}>編輯</button>
                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => openModal('delete', product)}>刪除</button>
                    </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>

            {/* Pagination */}
            <div className="mt-4">
                <Pagination pagination={pagination} onChangePage={getProducts} />
            </div>
        </div>

        {/* Modal */}
        <ProductModal
        modalType={modalType} 
        templateProduct={templateProduct}
        closeModal={closeModal}
        getProducts={getProducts}
        />
    </>
    )
}

export default AdminProducts;
