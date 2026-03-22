import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function ProductModal({
    modalType, 
    templateProduct,
    closeModal,
    getProducts,
}) {
    // 盡量不更動到原始資料
    const [tempData, setTempData] = useState(templateProduct);

    useEffect(() => {
        setTempData(templateProduct);
    }, [templateProduct])

    // 解構取得 修改modal input裡的 value 寫入templateProduct
    const handleModalInputChange = (e) => {
        const { name, value, checked, type } = e.target;
        setTempData((preData) => ({
            ...preData,    // 保留原有屬性
            [name]: type === 'checkbox' ? checked : value, // 更新特定屬性(type如果是checkbox就打勾，如不是就取值)
        }));
    }

    // 圖片處理
    // 取得 修改 modal input 裡副圖的 index, value 寫入templateProduct
    const handleModalImagesChange = (index, value) => {
        setTempData((preImage) => {
            const newImage = [...preImage.imagesUrl];
            newImage[index] = value;
        
            // 當值不為空 && 不是最後一筆時 && 最多5張照片
            // 填寫最後一個空輸入框時，自動新增空白輸入框
            if (value !== '' && index === newImage.length - 1 && newImage.length < 5) {
                newImage.push('');
            }

            // 當值為空 && 照片至少有一張 && 修改的值是最後一筆
            // 清空輸入框時，移除最後的空白輸入框
            if (value === '' && newImage.length > 1 && newImage[newImage.length - 1] === '') {
                newImage.pop();
            }

            return {
                ...preImage,
                imagesUrl: newImage
            };
        });
    }

    // modal 新增圖片
    const handleModalAddImage = () => {
        setTempData((preImage) => {
            const newImage = [...preImage.imagesUrl];

            // 在五筆內才能新增圖片
            if (tempData.imagesUrl.length < 5) {
                newImage.push(''); // 在圖片陣列中新增一筆在陣列最後面
            }

            return {
                ...preImage,
                imagesUrl: newImage
            };
        });
    }

    // modal 刪除圖片
    const handleModalRemoveImage = () => {
        setTempData((preImage) => {
            const newImage = [...preImage.imagesUrl];
            newImage.pop(); // 刪除圖片陣列中最後一筆
            return {
                ...preImage,
                imagesUrl: newImage
            };
        });
    }

    // 串接新增/更新產品列表 API
    const updateProduct = async(id) => {
        // 決定 API 端點和方法
        let url;
        let method;

        if (modalType === 'edit') {
            url = `${API_BASE}/api/${API_PATH}/admin/product/${id}`;
            method = 'put';
        } else if (modalType === 'create') {
            url = `${API_BASE}/api/${API_PATH}/admin/product`;
            method = 'post';
        }

        // 準備要送出的資料
        const productData = {
            data: {
                ...tempData,
                origin_price: Number(tempData.origin_price), // 轉換為數字
                price: Number(tempData.price), // 轉換為數字
                is_enabled: tempData.is_enabled ? 1 : 0, // 轉換為數字
                imagesUrl: tempData.imagesUrl.filter((url) => url !== ''), // 過濾空白
            },
        };

        try {
            await axios[method](url, productData);

            closeModal();  // 關閉 Modal 並重新載入資料
            getProducts(); // 取得產品列表
        } catch (error) {
            console.log(error)
        }
    }

    // 串接刪除產品 API
    const deleteProduct = async(id) => {
        try {
            await axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${id}`);

            closeModal();  // 關閉 Modal 並重新載入資料
            getProducts(); // 取得產品列表
        } catch (error) {
            console.log(error);
        }
    }

    // 串接上傳圖片 API
    const uploadImage = async(e) => {
        const file = e.target.files?.[0];
        if (!file) {
        return;
        }

        try {
            const formData = new FormData();
            formData.append('file-to-upload', file);

            const res = await axios.post(`${API_BASE}/api/${API_PATH}/admin/upload`, formData);
            setTempData((pre) => ({
                ...pre,
                imageUrl: res.data.imageUrl
            }))
        } catch (error) {
            console.log(error);
        }
    }

    return (<>
        {/* Modal */}
        <div
            id="productModal"
            className="modal fade"
            tabIndex="-1"
            aria-labelledby="productModalLabel"
            aria-hidden="true"
            >
            <div className="modal-dialog modal-xl">
                <div className="modal-content border-0">
                    {/* modal-header 顏色提示 */}
                    <div className={`modal-header bg-${modalType === 'delete' ? 'danger' : 'dark'} text-white`}>
                        <h5 id="productModalLabel" className="modal-title">
                        <span>{modalType === 'edit' ? '編輯產品' :
                            modalType === 'delete' ? '刪除產品' : '新增產品'}</span>
                        </h5>
                        <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        {/* modal-body 顯示內容 */}
                        {
                            modalType === 'delete' ? (
                                <p className="fs-4">
                                確定要刪除
                                <span className="text-danger"> {tempData.title} </span>嗎？
                                </p>
                            ) : (
                                <div className="row">
                                    <div className="col-sm-4">
                                        <div className="mb-2">
                                            {/* 上傳圖片 */}
                                            <div className="mb-3">
                                                <label htmlFor="fileUpload" className="form-label">
                                                    上傳圖片
                                                </label>
                                                <input
                                                    type="file"
                                                    id="fileUpload"
                                                    name="fileUpload"
                                                    className="form-control"
                                                    accept=".jpg, .jpeg, .png"
                                                    onChange={(e) => uploadImage(e)}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="imageUrl" className="form-label">
                                                    輸入圖片網址
                                                </label>
                                                <input
                                                    type="text"
                                                    id="imageUrl"
                                                    name="imageUrl"
                                                    className="form-control"
                                                    placeholder="請輸入圖片連結"
                                                    value={tempData.imageUrl}
                                                    onChange={(e) => handleModalInputChange(e)}
                                                />
                                            </div>
                                            {/* 如果有網址就顯示沒有就不用顯示 */}
                                            {tempData.imageUrl && (<img className="img-fluid" src={tempData.imageUrl} alt="主圖" />)}
                                        </div>
                                        <div>
                                            {
                                            tempData.imagesUrl.map((url, index) => (
                                                <div key={index}>
                                                <label htmlFor="imageUrl" className="form-label">
                                                輸入圖片網址
                                                </label>
                                                <input
                                                type="text"
                                                className="form-control"
                                                placeholder={`圖片網址${index + 1}`}
                                                value={url}
                                                onChange={(e) => handleModalImagesChange(index, e.target.value)}
                                                />
                                                {url && (<img
                                                className="img-fluid"
                                                src={url}
                                                alt={`副圖${index + 1}`}
                                                />)}
                                            </div>
                                            ))}
                                            {/* 最後一個input有值 且 圖片少於5張內 才顯示新增圖片按鈕 */}
                                            {tempData.imagesUrl[tempData.imagesUrl.length - 1] !== '' && tempData.imagesUrl.length < 5 && (<button type="button" className="btn btn-outline-primary btn-sm d-block w-100" onClick={() => handleModalAddImage()}>
                                            新增圖片
                                            </button>)}
                                        </div>
                                        <div>
                                            {/* imagesUrl 陣列有值時才顯示刪除按鈕 */}
                                            {tempData.imagesUrl.length >= 1 && (<button type="button" className="btn btn-outline-danger btn-sm d-block w-100" onClick={() => handleModalRemoveImage()}>
                                            刪除圖片
                                            </button>)}
                                        </div>
                                    </div>
                                    <div className="col-sm-8">
                                        <div className="mb-3">
                                            <label htmlFor="title" className="form-label">標題<span className='text-danger'>*</span></label>
                                            <input
                                            name="title"
                                            id="title"
                                            type="text"
                                            className="form-control"
                                            placeholder="請輸入標題"
                                            value={tempData.title}
                                            onChange={(e) => handleModalInputChange(e)}
                                            />
                                        </div>

                                        <div className="row">
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="category" className="form-label">分類<span className='text-danger'>*</span></label>
                                                <input
                                                    name="category"
                                                    id="category"
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="請輸入分類"
                                                    value={tempData.category}
                                                    onChange={(e) => handleModalInputChange(e)}
                                                />
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="unit" className="form-label">單位<span className='text-danger'>*</span></label>
                                                <input
                                                    name="unit"
                                                    id="unit"
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="請輸入單位"
                                                    value={tempData.unit}
                                                    onChange={(e) => handleModalInputChange(e)}
                                                />
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="origin_price" className="form-label">原價<span className='text-danger'>*</span></label>
                                                <input
                                                    name="origin_price"
                                                    id="origin_price"
                                                    type="number"
                                                    min="0"
                                                    className="form-control"
                                                    placeholder="請輸入原價"
                                                    value={tempData.origin_price}
                                                    onChange={(e) => handleModalInputChange(e)}
                                                />
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="price" className="form-label">售價<span className='text-danger'>*</span></label>
                                                <input
                                                    name="price"
                                                    id="price"
                                                    type="number"
                                                    min="0"
                                                    className="form-control"
                                                    placeholder="請輸入售價"
                                                    value={tempData.price}
                                                    onChange={(e) => handleModalInputChange(e)}
                                                />
                                            </div>
                                        </div>
                                        <hr />

                                        <div className="mb-3">
                                            <label htmlFor="description" className="form-label">產品描述<span className='text-danger'>*</span></label>
                                            <textarea
                                            name="description"
                                            id="description"
                                            className="form-control"
                                            placeholder="請輸入產品描述"
                                            value={tempData.description}
                                            onChange={(e) => handleModalInputChange(e)}
                                            ></textarea>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="content" className="form-label">說明內容<span className='text-danger'>*</span></label>
                                            <textarea
                                            name="content"
                                            id="content"
                                            className="form-control"
                                            placeholder="請輸入說明內容"
                                            value={tempData.content}
                                            onChange={(e) => handleModalInputChange(e)}
                                            ></textarea>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label" htmlFor="tempDelivery">寄送方式<span className='text-danger'>*</span></label>
                                            <select
                                                id="tempDelivery"
                                                name="tempDelivery"
                                                className="form-select"
                                                aria-label="Default select example"
                                                value={tempData.tempDelivery}
                                                onChange={(e) => handleModalInputChange(e)}
                                            >
                                                <option value="">請選擇</option>
                                                <option value="fridge">冷藏</option>
                                                <option value="rt">常溫</option>
                                                <option value="frz">冷凍</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <div className="form-check">
                                                <input
                                                    name="is_enabled"
                                                    id="is_enabled"
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={tempData.is_enabled}
                                                    onChange={(e)=> handleModalInputChange(e)}
                                                />
                                                <label className="form-check-label" htmlFor="is_enabled">
                                                    是否啟用
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    <div className="modal-footer">
                        {/* modal-footer 按鈕 */}
                        {
                            modalType === 'delete' ? (
                                <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => deleteProduct(tempData.id)}
                                >
                                刪除
                                </button>
                            ) : (
                                <>
                                    <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    data-bs-dismiss="modal"
                                    onClick={() => closeModal()}
                                    >
                                    取消
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={() => updateProduct(tempData.id)}>確認</button>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default ProductModal