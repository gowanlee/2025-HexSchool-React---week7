import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const messageSlice = createSlice({
    name: 'message',
    initialState: [
        // {
        //     id: 1,
        //     type: 'success',
        //     title: 'Success',
        //     text: 'test'
        // }
    ],
    reducers: {
        createMessage(state, action) {
            state.push({
                id: action.payload.id,
                type: action.payload.success ? 'success' : 'danger',
                title: action.payload.success ? 'Success' : 'Failed',
                text: action.payload.message,
            })
        },
        removeMessage(state, action) {
            // 先找到要移除陣列的位子序號
            const index = state.findIndex(message => message.id === action.payload);

            // 陣列移除指定位置
            if (index !== 1) {
                state.splice(index, 1);
            }
        }
    }
})

// 自訂秒數後message自動移除
export const createAsyncMessage = createAsyncThunk(
    'message/createAsyncMessage',
    async(payload, {dispatch, requestId}) => {
        dispatch(createMessage({
            ...payload,
            id: requestId
        }));

        // 5秒後自動移除
        setTimeout(() => {
            dispatch(removeMessage(requestId));
        }, 5000);
    }
)

// Action creators 自動生成
export const { createMessage, removeMessage } = messageSlice.actions;

// Reducer 匯出給 store 使用
export default messageSlice.reducer;