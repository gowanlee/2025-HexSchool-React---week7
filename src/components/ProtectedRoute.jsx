import axios from 'axios';
import { useEffect, useState } from 'react';
import { RotatingTriangles } from 'react-loader-spinner';
import { Navigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;


// 驗證過後才會顯示後台頁面
function ProtectedRoute({ children }) { // children 是指後台頁面
    // 登入狀態管理（控制顯示登入或產品頁）
    const [isAuth, setIsAuth] = useState(false);

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

        // 初始化搭配useEffect串接登入驗證 API
        // 檢查管理員權限並載入資料
        const checkAdmin = async() => {
            try {
                await axios.post(`${API_BASE}/api/user/check`);
                setIsAuth(true);
            } catch (error) {
                console.log(error.response.data.message);
            } finally {
                setLoading(false);
            }
        }
        

        checkAdmin();
    }, [])

    // loading狀態
    const [loading, setLoading] = useState(true);

    if (loading) return <RotatingTriangles />; 
    if (!isAuth) return <Navigate to="/login" />; // 如果驗證失敗就跳轉回login頁面

    return children;
}

export default ProtectedRoute;