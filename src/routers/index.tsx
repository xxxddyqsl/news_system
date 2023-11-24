import React, { useEffect, useState } from 'react'
import { useNavigate, useRoutes } from 'react-router-dom'
// 导入 封装的懒加载 组件
import lazyLoad from '../components/lazyLoad';
// 导入 封装的重定向 组件
import Redirect from '../components/Redirect';
// 导入 封装的路由拦截组件  验证 token
import AuthComponent from '../components/AuthComponent';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { getRightsList, fetchUserById } from '../redux/actionCreators/rightsSlice';
import { changMenuList } from '../redux/actionCreators/MenuSlice';
import { changeRoutersSlice } from '../redux/actionCreators/routersSlice';
import { RootState } from '../redux/store';
// 路由改变时 加载进度条 -   yarn add  nprogress  包 注意 在ts中 需要下载 yarn add  @types/nprogress  否则tsx 找不到导入的nprogress模块 语法会报错
import NProgress from 'nprogress'
// 导入nprogress 包 内的css
import 'nprogress/nprogress.css'
// ts 接口 约束 路由配置属性
interface RouteType {
    path?: string;
    element: any;
    exact?: boolean; // 可选属性 是否 精准匹配路径 可不写 v6版本 默认精准匹配路径
    title?: string;// 可选属性
    icon?: string;// 可选属性
    index?: boolean;// 可选属性 是否默认渲染该子路由
    children?: Array<RouteType>;// 可选属性 子路由 使用 RouteType 接口 约束属性
}
const routes: Array<RouteType> = [
    {
        path: '/',
        //AuthComponent  路由拦截组件  验证 token
        element: <AuthComponent>
            {lazyLoad('SandBox')}
        </AuthComponent>,
        children: [
            {
                // path: '',
                index: true, // 默认显示 home
                element: <Redirect to={'/home'} />,// 重定向
            },
            {
                path: '/home', // 路由一级 ：首页
                element: lazyLoad('SandBox/home'),
            },
            {
                path: '/user-manage', //路由一级 ： 用户管理
                element: lazyLoad('SandBox/user-manage'),
                children: [
                    {
                        // path: '',
                        index: true,// 默认显示 用户管理列表
                        element: <Redirect to={'/user-manage/list'} />,// 重定向
                    },
                    {
                        path: 'list',
                        element: lazyLoad('SandBox/user-manage/list'),
                    },
                ]
            },
            {
                path: '/right-manage', //路由一级 ： 权限管理
                element: lazyLoad('SandBox/right-manage'),
                children: [
                    {
                        // path: '',
                        index: true,// 默认显示 权限管理 角色列表
                        element: <Redirect to={'/right-manage/role/list'} />,// 重定向
                    },
                    {
                        path: 'role/list',
                        element: lazyLoad('SandBox/right-manage/role/list'),//权限管理 角色列表
                    },
                    {
                        path: 'right/list',
                        element: lazyLoad('SandBox/right-manage/right/list'),//权限管理 权限列表
                    },
                ]
            },

            {
                path: '/news-manage', //路由一级 ： 新闻管理
                element: lazyLoad('SandBox/news-manage'),
                children: [
                    {
                        // path: '',
                        index: true,// 默认显示 撰写新闻
                        element: <Redirect to={'/news-manage/add'} />,// 重定向
                    },
                    {
                        path: 'add',
                        element: lazyLoad('SandBox/news-manage/add'),//撰写新闻
                    },
                    {
                        path: 'drafts',
                        element: lazyLoad('SandBox/news-manage/drafts'),//草稿箱
                    },
                    {
                        path: 'category',
                        element: lazyLoad('SandBox/news-manage/category'),//新闻分类
                    },
                ]
            },
            {
                path: '/audit-manage', //路由一级 ： 审核管理
                element: lazyLoad('SandBox/audit-manage'),
                children: [
                    {
                        // path: '',
                        index: true,// 默认显示 用户管理列表
                        element: <Redirect to={'/audit-manage/audit'} />,// 重定向
                    },
                    {
                        path: 'audit',
                        element: lazyLoad('SandBox/audit-manage/audit'),//审核新闻
                    },
                    {
                        path: 'list',
                        element: lazyLoad('SandBox/audit-manage/list'),//审核列表
                    },
                ]
            },
            {
                path: '/publish-manage', //路由一级 ： 发布管理
                element: lazyLoad('SandBox/publish-manage'),
                children: [
                    {
                        // path: '',
                        index: true,// 默认显示 待发布
                        element: <Redirect to={'/publish-manage/unpublished'} />,// 重定向
                    },
                    {
                        path: 'unpublished',
                        element: lazyLoad('SandBox/publish-manage/unpublished'),// 待发布
                    },
                    {
                        path: 'published',
                        element: lazyLoad('SandBox/publish-manage/published'),// 已发布
                    },
                    {
                        path: 'sunset',
                        element: lazyLoad('SandBox/publish-manage/sunset'),// 已下线
                    },
                ]
            },
        ]
    },
    {
        path: '/login',
        element: lazyLoad('Login'),
    },
    {
        path: '*',
        element: lazyLoad('NotFound'),
    },
]
// 枚举 - 后端返回的路由权限 对应  本地SandBox文件目录 下存在的资源 tsx渲染文件 存在添加该路由
const LocalRouterMap: any = {
    '/home': true,
    // 用户管理
    '/user-manage': true,// 一级
    '/user-manage/list': true,// 二级
    // 权限管理
    '/right-manage': true,
    '/right-manage/role/list': true,
    '/right-manage/right/list': true,
    // 新闻管理
    '/news-manage': true,
    '/news-manage/add': true,
    '/news-manage/drafts': true,
    '/news-manage/category': true,
    '/news-manage/preview': true,
    '/news-manage/update/:id':true,
    
    // 审核管理
    '/audit-manage': true,
    '/audit-manage/audit': true,
    '/audit-manage/list': true,
    // 发布管理
    '/publish-manage': true,
    '/publish-manage/unpublished': true,
    '/publish-manage/published': true,
    '/publish-manage/sunset': true,
}

function routesFilter(data: any, routes: any) {
    let is = false;
    data.map((item: any, index: number) => {
        let obj: any = null;
        if (LocalRouterMap[item.key]) {
            //   pagepermisson=1 为有权限显示  index=1 为 当前层默认显示的
            if (item.pagepermisson === 1 && item.index === 1) {
                routes.push({
                    // path: '',
                    index: true,// 默认显示 用户管理列表
                    element: <Redirect to={item.key.split('/:')[0]} />,// 重定向
                })
            }
            // routepermisson =1 说明是路由 但不在左侧菜单栏中创建显示，只有 pagepermisson=1 才能在左侧菜单栏中创建显示
            if (item.pagepermisson === 1 || item.routepermisson === 1 ) {
                obj = {
                    path: item.key,
                    // /: 为路由携带的参数 如 '/news-manage/preview/:id' 而本地资源文件没有这个路径 ，只是在 path中 告诉路由:id 是动态参数
                    element: lazyLoad(`SandBox${item.key.split('/:')[0]}`),
                }
            }
            if (item.pagepermisson === 1 && item.children && item.children.length > 0) {
                obj.children = routesFilter(item.children, [])
            }
            if (obj) {
                routes.push(obj)
            }
            // 当前层遍历完 没有默认显示（item.index=1 默认显示）
            if (item.index && item.index === 1) { is = true; }
            if (!is && (index + 1) == data.length) {
                // 过滤 pagepermisson=1 有权限显示的页面 设置为默认显示  设置过滤完的 第一个list[0] 为默认显示的项
                let list = data.filter((ktem: any) => ktem.pagepermisson === 1);
                // console.log(list)
                // 如果 过滤 的list 必须有值才能设置 否则不设置默认
                (list && list.length > 0) && routes.push({
                    // path: '',
                    index: true,// 默认显示
                    element: <Redirect to={list[0].key.split('/:')[0]} />,// 重定向
                })
            }

        }
    })
    return routes;
}
const defaultRoutes = [{
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

const createRoutes = (rightsList: any) => {
    return [{
        path: '/', // 一级路由
        //AuthComponent  路由拦截组件  验证 token
        element: <AuthComponent>
            {lazyLoad('SandBox')}
        </AuthComponent>,
        children: routesFilter(rightsList, []) // ....根据后端返回数据 动态添加路由

    },
    {
        path: '/login',
        element: lazyLoad('Login'),
    },
    {
        path: '*',
        element: lazyLoad('NotFound'),
    }]
}
export default function MRouters() {
    // 每次切换路由 发生改变时 顶部 加载进度条 -开启
    NProgress.start()
    useEffect(() => {
        // 渲染完成之后 - 关闭
        NProgress.done()
    })
    // 通过useSelector获取state数据，默认是监听state中保存的所有数据，当这些数据发送变化时，会重新执行传入useSelector的回调函数，组件也会重新渲染，但是当一个本组件中没有使用到的数据发生变化时，useSelector也会监听到并且重新渲染页面，浪费性能
    // 优化方案：useSelector传入第二个参数 shallowEqual 函数 这样每次有state发生变化时，都会与当前组件中使用到的数据进行浅层对比，只有发生发生变化时，才会重新渲染组件
    //根据store.js中设置的reducer名字，从 userSlice 空间获取state,useSelector
    const { userInfo } = useSelector((state: RootState) => { return state.userSlice }, shallowEqual);
    const { rightsList } = useSelector((state: RootState) => state.rightsSlice, shallowEqual);
    // const { routesList } = useSelector((state: any) => { return state.routersSlice });
    const [routesList, setRoutesList] = useState<any>(defaultRoutes)
    // 状态管理 - 设置
    const dispatch = useDispatch<any>();
    const navigate = useNavigate();
    useEffect(() => {
        if (userInfo && userInfo?.id) {
            //登录成功之后返回个人信息 存入redux 用户信息获取权限或个人信息发生变化重新获取权限
            dispatch(getRightsList(userInfo))
            // dispatch(getRightsList2(userInfo))
            // dispatch(fetchUserById(userInfo))
            console.log('获取rights-1')
        } else {
            //没有个人信息  重定向跳转到 login
            navigate('/login', { replace: true });
        }
        // console.log('获取rights-1',userInfo)
    }, [userInfo])
    useEffect(() => {
        if (rightsList.length > 0) {
            // 获取到权限列表 - 获取数据根据权限 设置左侧菜单栏
            dispatch(changMenuList({ value: rightsList, type: 'MenuList' }))
            // dispatch(changeRoutersSlice({ value: rightsList }))
            // 获取权限 动态创建 路由表
            setRoutesList(createRoutes(rightsList))

            console.log('获取权限-设置菜单栏+路由权限', routesList, createRoutes(rightsList))
        }
    }, [rightsList])
   
    // const Element = useRoutes(routes)
    const Element = useRoutes(routesList)
    return (
        Element
    )
}
