import React from 'react'
import { useRoutes } from 'react-router-dom'
// 导入 封装的懒加载 组件
import lazyLoad from '../components/lazyLoad';
// 导入 封装的重定向 组件
import Redirect from '../components/Redirect';
// 导入 封装的路由拦截组件  验证 token
import AuthComponent from '../components/AuthComponent';

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
                element: lazyLoad('SandBox/Home'),
            },
            {
                path: '/user-manage', //路由一级 ： 用户管理
                element: lazyLoad('SandBox/Users'),
                children: [
                    {
                        // path: '',
                        index: true,// 默认显示 用户管理列表
                        element: <Redirect to={'/user-manage/list'} />,// 重定向
                    },
                    {
                        path: 'list',
                        element: lazyLoad('SandBox/Users/list'),
                    },
                ]
            },
            {
                path: '/right-manage', //路由一级 ： 权限管理
                element: lazyLoad('SandBox/RightsManage'),
                children: [
                    {
                        // path: '',
                        index: true,// 默认显示 权限管理 角色列表
                        element: <Redirect to={'/right-manage/role/list'} />,// 重定向
                    },
                    {
                        path: 'role/list',
                        element: lazyLoad('SandBox/RightsManage/Role/list'),//权限管理 角色列表
                    },
                    {
                        path: 'right/list',
                        element: lazyLoad('SandBox/RightsManage/Right/list'),//权限管理 权限列表
                    },
                ]
            },

            {
                path: '/news-manage', //路由一级 ： 新闻管理
                element: lazyLoad('SandBox/News'),
                children: [
                    {
                        // path: '',
                        index: true,// 默认显示 撰写新闻
                        element: <Redirect to={'/news-manage/add'} />,// 重定向
                    },
                    {
                        path: 'add',
                        element: lazyLoad('SandBox/News/add'),//撰写新闻
                    },
                    {
                        path: 'drafts',
                        element: lazyLoad('SandBox/News/drafts'),//草稿箱
                    },
                    {
                        path: 'category',
                        element: lazyLoad('SandBox/News/category'),//新闻分类
                    },
                ]
            },
            {
                path: '/audit-manage', //路由一级 ： 审核管理
                element: lazyLoad('SandBox/Audit'),
                children: [
                    {
                        // path: '',
                        index: true,// 默认显示 用户管理列表
                        element: <Redirect to={'/news-manage/audit'} />,// 重定向
                    },
                    {
                        path: 'audit',
                        element: lazyLoad('SandBox/Audit/audit'),//审核新闻
                    },
                    {
                        path: 'list',
                        element: lazyLoad('SandBox/Audit/list'),//审核列表
                    },
                ]
            },
            {
                path: '/publish-manage', //路由一级 ： 发布管理
                element: lazyLoad('SandBox/Publish'),
                children: [
                    {
                        // path: '',
                        index: true,// 默认显示 待发布
                        element: <Redirect to={'/Publish-manage/unpublished'} />,// 重定向
                    },
                    {
                        path: 'unpublished',
                        element: lazyLoad('SandBox/Publish/unpublished'),// 待发布
                    },
                    {
                        path: 'published',
                        element: lazyLoad('SandBox/Publish/published'),// 已发布
                    },
                    {
                        path: 'sunset',
                        element: lazyLoad('SandBox/Publish/sunset'),// 已下线
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
export default function MRouters() {
    const Element = useRoutes(routes)
    return (
        Element
    )
}
