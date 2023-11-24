// 使用 createSlice 方法 创建一个slice。每一个slice里面包含了reducer和actions，可以实现模块化的封装。所有的相关操作都独立在一个文件中完成。
import { createSlice} from '@reduxjs/toolkit'
// 创建 接口
interface initialStateType{
    loading:boolean
}
// 将接口 initialStateType 赋值给 initialState 约束限制对象initialState的形状
const initialState:initialStateType={
    loading:false
}
export const loadingSlice = createSlice({
        name:'loadingSlice',
        // 初始值
        initialState:initialState,
        reducers:{
            // 控制 loading 是否显示
            changeLoading(state,action){
                // console.log('loadingSlice==>',state,action)
                state.loading = action.payload;
            }
        }

})
// 导出actions
export const {changeLoading} = loadingSlice.actions;
// 导出reducer，在创建store时使用到
export default loadingSlice.reducer;