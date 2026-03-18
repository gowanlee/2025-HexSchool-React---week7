# Redux 與 Redux Toolkit

## 大綱

1. 主線任務說明
2. 後台路由
3. Redux 核心概念
4. Redux Toolkit 核心概念
5. 訊息通知系統實作
    1. Message Slice 
    2. 非同步訊息流程
6. 自定義 Hook 封裝
7. 路由守衛（登入驗證）

## 1. 主線任務說明

在先前的課程中，已經介紹了登入、產品列表的製作，請同學完成剩下功能，並整合至 Vite 中。

這週也會練習使用 Redux Toolkit 中的技巧，來完成通知訊息的功能。

另外還要請大家確定好最終作業的主題唷！

**後台**

**產品頁面：**

- 串接取得、新增、刪除、更新產品 API
- 啟用狀態顯示
- Modal 細節欄位
- 上傳圖片API
- 分頁功能

**通知訊息**

![](https://images.hexschool.com/common/MTc1Mzc2NDQzNDQ4MzQ1MzM5MDY=_2024-11-28T04:00:21Z.png)

作業須符合此[作業規範](https://hackmd.io/XbKPYiE9Ru6G0sAfB5PBJw)

每週主線任務範例：https://github.com/hexschool/react-training-chapter-2025

### 專案結構

```
week7/
├── src/
│   ├── layout/              # 版面配置
│   │   ├── FrontendLayout.jsx
│   │   └── AdminLayout.jsx
│   ├── views/
│   │   └── admin/         # 後台頁面
│   │       └── AdminProducts.jsx
│   ├── components/
│   │   ├── MessageToast.jsx
│   │   └── ProductModal.jsx
│   ├── hooks/
│   │   └── useMessage.js
│   ├── slice/             # 狀態定義
│   │   ├── messageSlice.js
│   └── store/             # 集中管理
│       └── store.js
├── App.jsx             # 主應用程式
├── router.jsx          # 路由配置
└── main.jsx            # 應用程式入口
```

## 2. 後台路由

### 增加後台路由配置

建立資料夾：/views/admin

建立元件：AdminLayout、AdminProducts（同第四週）、AdminOrders

Login 增加登入成功導到後台頁面

```jsx
// src/router.jsx
import { createHashRouter } from "react-router-dom";

export const router = createHashRouter([
  // 延續第七週前台配置
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "products",
        element: <AdminProducts />,
      },
      {
        path: "orders",
        element: <AdminOrders />,
      },
    ],
  },
  {
    path: "*", // 404 頁面
    element: <NotFound />,
  },
]);
```

###

### 後台 Layout

[navs-tabs](https://getbootstrap.com/docs/5.3/components/navs-tabs/#base-nav)

```jsx
// src/layout/AdminLayout.jsx
import { Outlet, Link } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div>
      <nav>
        <Link className="h4 mt-5 mx-2" to="/admin/products">
          後台產品頁面
        </Link>
        <Link className="h4 mt-5 mx-2" to="/admin/orders">
          後台訂單頁面
        </Link>
      </nav>
      <Outlet />
    </div>
  );
};

export default AdminLayout;
```

## 3. Redux 核心概念

### 為什麼需要 Redux？

- **中央化狀態管理**：所有狀態存放在單一 store
- **可預測性**：透過 action 和 reducer 的純函數模式
- **時間旅行**：可以追蹤和回放狀態變化
- **除錯工具**：Redux DevTools 強大的除錯能力

在 React 應用程式中，當組件樹變得複雜時，狀態管理會面臨以下問題：

```jsx
// 問題：多層級狀態傳遞（Prop Drilling）
function App() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  return (
    <div>
      <Header user={user} notifications={notifications} />
      <Main user={user} setNotifications={setNotifications} />
      <Footer user={user} />
    </div>
  );
}

function Main({ user, setNotifications }) {
  return (
    <div>
      <Sidebar user={user} setNotifications={setNotifications} />
      <Content user={user} setNotifications={setNotifications} />
    </div>
  );
}

// 繼續傳遞下去...
```

其實也可以用 Context API、props 組合

**Redux 的適用時機是：**

- 狀態需要跨「多個頁面」
- 多個功能都要用（如：登入狀態、通知、購物車）
- 狀態邏輯開始變複雜

## 4. Redux Toolkit (RTK)

- 集中管理狀態（store）
- 定義狀態怎麼改（slice）
- 處理非同步流程（createAsyncThunk）

### 安裝與基本設定

[redux-toolkit](https://redux-toolkit.js.org/introduction/getting-started#an-existing-app)

```bash
npm install @reduxjs/toolkit react-redux
```

### createSlice 核心概念

createSlice 是用來定義「某一類狀態要怎麼存、怎麼改」的工具

- 定義 state 的結構
- 定義 可以怎麼改 state
- 自動幫你產生 action

```jsx
const messageSlice = createSlice({
  name: "message",
  initialState: [],
  reducers: {
    createMessage(state, action) {
      state.push({
        id: action.payload.id,
        type: action.payload.success ? "success" : "danger",
        title: action.payload.success ? "成功" : "失敗",
        text: action.payload.message,
      });
    },
    removeMessage(state, action) {
      const index = state.findIndex(
        (item) => item.id === action.payload
      );
      if (index !== -1) {
			  state.splice(index, 1);
			}
    },
  },
});

export default messageSlice.reducer;
```

###

### Store 設定

```jsx
// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import messageReducer from "../slice/messageSlice";
import userReducer from "../slice/userSlice";
import productReducer from "../slice/productSlice";

export const store = configureStore({
  reducer: {
    message: messageReducer,
    user: userReducer,
    product: productReducer,
  },
});

export default store;
```

### Provider 設定

`Provider` 只需要包一次，通常放在 `main.jsx`

```jsx
// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

## 5. 訊息通知系統實作

訊息通知非常適合用 Redux，因為：

- 不屬於某一個元件
- 任一 API 成功 / 失敗都可能觸發
- 需要全域顯示與管理生命週期

### 實作 Message Slice

- 存所有訊息（陣列）
- 定義：
    - 加一則訊息
    - 移除一則訊息

```jsx
// src/slice/messageSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const messageSlice = createSlice({
  name: "message",
  initialState: [],
  reducers: {
    createMessage(state, action) {
      state.push({
        id: action.payload.id,
        type: action.payload.success ? "success" : "danger",
        title: action.payload.success ? "成功" : "失敗",
        text: action.payload.message,
      });
    },
    removeMessage(state, action) {
      const index = state.findIndex((item) => item.id === action.payload);
      if (index !== -1) {
			  state.splice(index, 1);
			}
    },
  },
});

// Action creators 自動生成
export const { createMessage } = messageSlice.actions;

// Reducer 匯出給 store 使用
export default messageSlice.reducer;

```

### 非同步訊息流程

- 立刻顯示訊息
- 等 2 秒
- 自動移除訊息
- [createAsyncThunk](https://redux-toolkit.js.org/api/createAsyncThunk)

```jsx
export const createAsyncMessage = createAsyncThunk(
  'message/createAsyncMessage',
  async (payload, { dispatch, requestId }) => {
    dispatch(messageSlice.actions.createMessage({
      ...payload,
      id: requestId,
    }));

    setTimeout(() => {
      dispatch(messageSlice.actions.removeMessage(requestId));
    }, 2000);
  }
);
```

### 訊息通知元件實作

MessageToast 本身**不負責產生訊息**，只負責根據 Redux state 顯示畫面

[toasts](https://getbootstrap.com/docs/5.3/components/toasts/#examples)

注意：要加上 show 才會顯示

`<div key={message.id} className="toast show">`

```jsx
// src/components/MessageToast.jsx
import { useSelector } from "react-redux";

function MessageToast() {
  const messages = useSelector((state) => state.message); 
  return (
    <div className="toast-container position-fixed top-0 end-0 p-3">
      {messages.map((message, index) => (
        <div
          key={message.id}
          className="toast show"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className={`toast-header text-white bg-${message.type}`}>
            <strong className="me-auto">{message.title}</strong>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="toast"
              aria-label="Close"
            />
          </div>
          <div className="toast-body">{message.text}</div>
        </div>
      ))}
    </div>
  );
}

export default MessageToast;
```

引入 MessageToast

```jsx
// App.jsx
function App() {
  return (
    <>
      <MessageToast />
      <RouterProvider router={router} />
    </>
  );
}
```

使用方式

```jsx
const dispatch = useDispatch();

dispatch(createAsyncMessage(response.data)); // 成功
dispatch(createAsyncMessage(error.response.data)); // 失敗
```

### 6. 自定義 Hook 封裝

為什麼要有 useMessage？

- 元件不該知道 Redux
- 元件只需要表達「我要顯示成功 / 失敗」

```jsx
Component (MessageToast 只負責顯示)
   ↓
useMessage（語意封裝）
   ↓
createAsyncMessage（Redux 行為）
   ↓
messageSlice（狀態實作）
```

- ❌ 不讓元件直接 `dispatch(createMessage(...))`
- ❌ 不讓元件知道 messageSlice 紀錄怎麼長
- ✅ 只關心「我要顯示成功 / 失敗訊息」

```jsx
// src/hooks/useMessage.js
import { useDispatch } from "react-redux";
import { createAsyncMessage } from "../slice/messageSlice";

/**
 * useMessage
 * 封裝訊息通知行為（呼叫 createAsyncMessage）
 */
export default function useMessage() {
  const dispatch = useDispatch();

  const showSuccess = (message) => {
    dispatch(
      createAsyncMessage({
        success: true,
        message,
      })
    );
  };

  const showError = (message) => {
    dispatch(
      createAsyncMessage({
        success: false,
        message,
      })
    );
  };

  return {
    showSuccess,
    showError,
  };
}
```

**元件中使用**

- 元件 **不 import slice**
- 元件 **不管 message 結構**
- 元件只表達「意圖」

```jsx
import useMessage from "../../hooks/useMessage";

function AdminProducts() {
  const { showSuccess, showError } = useMessage();

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`);
      showSuccess("產品刪除成功");
    } catch (error) {
      showError(error.response?.data?.message || "刪除失敗");
    }
  };

  return <button onClick={() => handleDelete(1)}>刪除產品</button>;
}
```

## 7. 路由守衛（登入驗證）

- `ProtectedRoute` 路由守衛的責任：
    - 決定能不能進頁面
    - 不負責登入流程
- 實務上只檢查 token 是否存在 **是不夠的**

```jsx
// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
```

- 在路由中使用

```jsx
// router.jsx
{
  path: '/admin',
  element: (
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  ),
}
```

### 實作路由守衛

前幾週寫在 `useEffect` 裡的 `checkAdmin`，**本質上就是一種路由守衛邏輯**，只是當時綁在頁面元件中

```jsx
const checkAdmin = async () => {
  try {
    await axios.post(`${API_BASE}/api/user/check`);
    setIsAuth(true);
  } catch (err) {
    console.log("權限檢查失敗：", err.response?.data?.message);
    setIsAuth(false);
  } finally {
    setLoading(false); // 無論成功或失敗都結束載入
  }
};
```

在實務上，是否能進入後台一定要由後端判斷 token 是否有效

因此我們將這段邏輯抽成 `ProtectedRoute` 元件

綁定於元件中的檢查可以移除

```jsx
// src/components/ProtectedRoute.jsx
function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 檢查登入狀態
	  const token = document.cookie
	    .split("; ")
	    .find((row) => row.startsWith("hexToken="))
	    ?.split("=")[1];
	
	  if (token) {
	    axios.defaults.headers.common.Authorization = token;
	  }
	  
	  // 路由守衛的實際驗證點
    checkAdmin()
  }, []);

  if (loading) return <RotatingLines />; // 載入中，避免跳轉
  if (!isAuth) return <Navigate to="/login" />;

  return children;
}

export default ProtectedRoute;
```

**流程**

```jsx
開始
 |
 v
是否 loading？
 |---------------是---------------|
 |                               |
 v                               v
顯示 <Loading />           是否 isAuth？
                                 |---------------否---------------|
                                 |                               |
                                 v                               v
                          渲染 children（受保護的內容）     <Navigate to="/login" />
```