// 使用 createSlice 方法 创建一个slice。每一个slice里面包含了reducer和actions，可以实现模块化的封装。所有的相关操作都独立在一个文件中完成。
import { createSlice } from '@reduxjs/toolkit'
import { $axios } from '../../../util/request';
const initialState = {
    // 初始值
    rightsList:[],
}
export const rightsSlice = createSlice({
    // 命名空间，在调用action的时候会默认的设置为action的前缀 rightsSlice/changRightsList
    name: 'rightsSlice',
    // 初始值
    initialState: initialState,
    // 这里的属性会自动的导出为 rightsSlice.actions，在组件中可以直接通过dispatch进行触发
    reducers: {
        //{ payload }解构出来的payload是dispatch传递的数据对象
        changRightsList(state, action) {
            console.log(action)
            let type= action.payload.type
            switch (type) {
                case "rightsList":
                    state.rightsList = action.payload.value;
                    break;
                default:
                    break;
            }
            console.log('rightsSlice',state, action)
            // 内置了immutable不可变对象来管理state,不用再自己拷贝数据进行处理
        }
        // ... 可多个
    }
})
// 导出actions
export const { changRightsList } = rightsSlice.actions;
// 使用redux-thunk方式处理异步 RTK集成了redux-thunk来处理异步事件，所以可以按照之前thunk的写法来写异步请求
export const getRightsList = (params) =>{
    return (dispatch)=>{
        try{
            $axios({
                url: '/api/rights',
                method: 'get',
                params: {
                  id: params.id,
                },
              }).then(res => {
                let data = res.data.Data;
                dispatch(changRightsList({ value: data, type: 'rightsList' }));
              }).catch((err)=>{
                console.log(err)
            })
        }catch (err){
            console.log(err)
        }
        
    }
}

// 导出reducer，在创建store时使用到
export default rightsSlice.reducer