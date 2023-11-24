// 使用 createSlice 方法 创建一个slice。每一个slice里面包含了reducer和actions，可以实现模块化的封装。所有的相关操作都独立在一个文件中完成。
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'

const initialState = {
    // 初始值
    rolesList:[],
}
export const rolesSlice = createSlice({
     // 命名空间，在调用action的时候会默认的设置为action的前缀 rolesSlice/changRightsList
    name:'rolesSlice',
    initialState:initialState,
     // 这里的属性会自动的导出为 rolesSlice.actions，在组件中可以直接通过dispatch进行触发
    reducers:{
          //{ payload }解构出来的payload是dispatch传递的数据对象
        changeRolesList(state,action){
            let {payload} = action
            console.log(action)
            state.rolesList=payload.value
        },
    },
    extraReducers: (builder) => { // 处理 createAsyncThunk 异步设置状态
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase('rolesSlice/rolesList', (state, action) => {
          // Add user to the state array
        //   let {payload} = action
          console.log('rolesSlice', action);
        //   state.rolesList=action.payload
          // state.entities.push(action.payload)
        });
      },
})
// 导出actions
export const {changeRolesList} =rolesSlice.actions;
// 方式1 ：使用redux-thunk方式处理异步 RTK集成了redux-thunk来处理异步事件，所以可以按照之前thunk的写法来写异步请求
// export const getRolesList = (params) =>{
//     return dispatch=>{
//        try {
//         axios({
//             url: '/api/roles',
//             method: 'get',
//             // params: {
//             // id: params.id,
//             // },
//             }).then(res => {
//                 let data = res.data.Data;
//                 dispatch(changeRolesList({ value: data, type: 'rolesList' }));
//             }).catch((err)=>{
//                 console.log(err)
//             })
//        } catch (error) {
//         console.log(error)
//        }
//     }
// }
// 方式2
export const getRolesList = createAsyncThunk(
    'rolesSlice/rolesList',
    async (params:any,thunkAPI)=>{
        try {
            const res = await  axios({
                            url: '/api/roles',
                            method: 'get', });
            return res.data.Data
        } catch (error) {
            console.log(error)
        }
    }

)

// 导出reducer，在创建store时使用到
export default rolesSlice.reducer