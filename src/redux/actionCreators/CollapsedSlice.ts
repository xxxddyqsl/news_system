// 使用 createSlice 方法 创建一个slice。每一个slice里面包含了reducer和actions，可以实现模块化的封装。所有的相关操作都独立在一个文件中完成。
import {createSlice} from '@reduxjs/toolkit'

const initialState= {
    // 初始值 - 控制左侧菜单栏 true折叠 展开false
    collapsed:false,
}
export const collapsedSlice = createSlice({
    // 命名空间，在调用action的时候会默认的设置为action的前缀collapsedSlice/changeCollapsed
    name:'collapsedSlice',
    // 初始值
    initialState:initialState,
    // 这里的属性会自动的导出为collapsedSlice.actions，在组件中可以直接通过dispatch进行触发
    reducers:{
        //{ payload }解构出来的payload是dispatch传递的数据对象
        changeCollapsed(state,action){
            console.log(state,action)
            // 控制左侧菜单栏 折叠 展开 内置了immutable不可变对象来管理state,不用再自己拷贝数据进行处理
            state.collapsed = action.payload.value;
        }
        // ... 可多个
    }
})
// 导出actions
export const { changeCollapsed } = collapsedSlice.actions;
// 导出reducer，在创建store时使用到
export default collapsedSlice.reducer