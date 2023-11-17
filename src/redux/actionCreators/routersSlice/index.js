// 使用 createSlice 方法 创建一个slice。每一个slice里面包含了reducer和actions，可以实现模块化的封装。所有的相关操作都独立在一个文件中完成。
import { createSlice } from '@reduxjs/toolkit'
import Redirect from '../../../components/Redirect';
import lazyLoad from '../../../components/lazyLoad';
import AuthComponent from '../../../components/AuthComponent';

const defaultRoutes=[{
    path: '/', // 一级路由
    //AuthComponent  路由拦截组件  验证 token
    element: <AuthComponent>
        {lazyLoad('SandBox')}
    </AuthComponent>,
    children: []// ....根据后端返回数据 动态添加路由

},
{
    path: '/login',
    element: lazyLoad('Login'),
},
{
    path: '*',
    element: lazyLoad('NotFound'),
}]
const initialState = {
    // 初始值
    routesList: defaultRoutes,
}

// let routesData =
function routesFilter(data, routes) {
    data.map(item => {
        let obj = null;
        if (item.pagepermisson === 1 && item.index === 1) {
            routes.push({
                // path: '',
                index: true,// 默认显示 用户管理列表
                element: <Redirect to={item.key} />,// 重定向
            })
        }
        if (item.pagepermisson === 1) {
            obj = {
                path: item.key,
                element: lazyLoad(`SandBox${item.key}`),
            }
        }
        if (item.children && item.children.length > 0) {
            obj.children = routesFilter(item.children, [])
        }
        if (obj) {
            routes.push(obj)
        }
    })
    return routes;
}
export const routersSlice = createSlice({
    // 命名空间，在调用action的时候会默认的设置为action的前缀 routersSlice/changeroutersSlice
    name: 'routersSlice',
    // 初始值
    initialState: initialState,
    // 这里的属性会自动的导出为 routersSlice.actions，在组件中可以直接通过dispatch进行触发
    reducers: {
        //{ payload }解构出来的payload是dispatch传递的数据对象
        changeRoutersSlice(state, action) {
            console.log(state, action)
            // 内置了immutable不可变对象来管理state,不用再自己拷贝数据进行处理
            state.routesList = [{
                path: '/', // 一级路由
                //AuthComponent  路由拦截组件  验证 token
                element: <AuthComponent>
                    {lazyLoad('SandBox')}
                </AuthComponent>,
                children: routesFilter(action.payload.value, [])// ....根据后端返回数据 动态添加路由

            },
            {
                path: '/login',
                element: lazyLoad('Login'),
            },
            {
                path: '*',
                element: lazyLoad('NotFound'),
            },
            ];
        }
        // ... 可多个
    }
})
// 导出actions
export const { changeRoutersSlice } = routersSlice.actions;
// 导出reducer，在创建store时使用到
export default routersSlice.reducer