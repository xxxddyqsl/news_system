// 使用 createSlice 方法 创建一个slice。每一个slice里面包含了reducer和actions，可以实现模块化的封装。所有的相关操作都独立在一个文件中完成。
import { createSlice } from '@reduxjs/toolkit'
import {
    HomeOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
  } from '@ant-design/icons';

// 枚举 - 对应 菜单 显示icon 
const iconList = {
    '/home': <HomeOutlined />,
    '/user-manage': <UserOutlined />,// 一级
    '/user-manage/list': <UserOutlined />,// 二级
    '/right-manage': <UserOutlined />,
    '/right-manage/role/list': <UserOutlined />,
    '/right-manage/right/list': <UserOutlined />,
    '/news-manage': <UserOutlined />,
    '/audit-manage': <VideoCameraOutlined />,
    '/publish-manage': <UploadOutlined />,
  }
 
const initialState = {
    // 初始值
    MenuList:[],
}
// 优化 后端处理 数据库 权限pagepermisson（左侧栏中使用） 不等于1 没有权限显示的数据不返回 ，增加 icon字段 children数组为空 没有子节点 赋值空字符串 否则 影响子节点渲染
const rightsFilter = (data) => {
    // 过滤 权限pagepermisson
    let dataFilter = data.filter((item) => item.pagepermisson && item.pagepermisson === 1);
    // map 添加 icon属性 否则会报错
    dataFilter = dataFilter.map(item=>({...item,icon:''}));
    // 循环过滤  添加 icon字段  children重新赋值
    dataFilter.forEach((item) =>  (item.icon = iconList[item.key], item.children && item.pagepermisson === 1) && (item.children = rightsFilter(item.children), item.children.length <= 0 && delete (item.children)));
    return dataFilter;
  }
export const MenuSlice = createSlice({
    // 命名空间，在调用action的时候会默认的设置为action的前缀 MenuSlice/changMenuList
    name: 'MenuSlice',
    // 初始值
    initialState: initialState,
    // 这里的属性会自动的导出为 MenuSlice.actions，在组件中可以直接通过dispatch进行触发
    reducers: {
        //{ payload }解构出来的payload是dispatch传递的数据对象
        changMenuList(state, action) {
            // state.MenuList = action.payload.value.map(item=>({...item,icon:<HomeOutlined />}))
            state.MenuList = rightsFilter(action.payload.value)
            console.log('MenuSlice',state.MenuList)
            // 内置了immutable不可变对象来管理state,不用再自己拷贝数据进行处理
        }
        // ... 可多个
    }
})
// 导出actions
export const { changMenuList } = MenuSlice.actions;
 

// 导出reducer，在创建store时使用到
export default MenuSlice.reducer