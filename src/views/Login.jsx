import '../assets/style.css';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { emailValidation, passwordValidation } from '../utils/validation';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Login() {
    // 路由切換
    const navigate = useNavigate();

    // react-hook-form
    const {
        register,
        handleSubmit,
        formState: {errors, isValid},
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            username: '',
            password: ''
        }
    })

    // 串接登入API
    const onSubmit = async(formData) => {
        try {
        const res = await axios.post(`${API_BASE}/admin/signin`, formData);
        console.log(res.data);

        const { token, expired } = res.data; // 解構 token, expired

        document.cookie = `hexToken=${token};expires=${new Date(expired)}`; // 設定 cookie
        axios.defaults.headers.common['Authorization'] = token; // 修改實體建立時所指派的預設配置（登入成功後，API請求都會自動帶上token）

        navigate('/admin/product'); // 登入成功時自動轉到此網址

        //setIsAuth(true); // 登入狀態改為 true
        //getProducts(); // 取得產品列表資料
        } catch (error) {
        setIsAuth(false); // 登入狀態改為 false
        console.log(error.response.data.message);
        }
    }

    return (
        <div className="container login">
            <h2 className='mb-5'>後台登入</h2>
            <div>
            <form className="form-floating" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-floating mb-3">
                    <input type="email" className="form-control" name="username" placeholder="name@example.com" 
                    {...register('username', emailValidation)}/>
                    <label htmlFor="username">Email address</label>
                    {
                        errors.username && (
                            <p className='text-danger text-end pt-2'>{errors.username.message}</p>
                        ) 
                    }
                </div>
                <div className="form-floating mb-3">
                <input type="password" className="form-control" name="password" placeholder="Password" 
                {...register('password', passwordValidation)}/>
                <label htmlFor="password">Password</label>
                    {
                        errors.password && (
                            <p className='text-danger text-end pt-2'>{errors.password.message}</p>
                        ) 
                    }
                </div>
                <button type="submit" className="btn btn-warning w-100 mb-5" disabled={!isValid}>登入</button>
            </form>
            </div>
        </div>
    )
}

export default Login;
