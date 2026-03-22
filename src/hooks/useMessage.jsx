import { useDispatch } from "react-redux";
import { createAsyncMessage } from "../slice/messageSlice";

function useMessage() {
    const dispatch = useDispatch();

    // 成功顯示的通知
    const showSuccess = (message) => {
        dispatch(
            createAsyncMessage({
                success: true,
                message,
            })
        );
    }

    // 失敗顯示的通知
    const showError = (message) => {
        dispatch(
            createAsyncMessage({
                success: false,
                message,
            })
        );
    }

    return{
        showSuccess,
        showError
    }
}

export default useMessage;