// import type { AxiosRequestConfig,AxiosInterceptorManager ,InternalAxiosRequestConfig, AxiosResponse} from "axios";
import axios from "axios";
// 导出  navigate 接口类型 ts
import type { NavigateFunction } from 'react-router-dom'

//  个人信息 状态管理
import { changeUserSlice } from "../redux/actionCreators/userSlice";
import { changeLoading } from "../redux/loadingSlice";
// 导出  dispatch 接口类型 ts
import type { AppDispatch } from "../redux/store";
import { message } from "antd";
// axios的配置文件, 可以在这里去区分开发环境和生产环境等全局一些配置
const devBaseUrl:string = '/api' //本地环境 配置每一个请求的url 前缀 setupProxy.js 中配置了 /api 转发代理
const proBaseUrl:string = ''// 正式环境

// process.env返回的是一个包含用户的环境信息,它可以去区分是开发环境还是生产环境
console.log(process.env)
export const BASE_URL:string = process.env.NODE_ENV === 'development' ? devBaseUrl : proBaseUrl

export const TIMEOUT:number = 10 * 1000;
// 创建  实例
// export const $axios=axios.create({
//     baseURL: BASE_URL,
//     timeout: TIMEOUT // 超时时间
// })
// axios 设置 url 前面 默认拼接的地址
axios.defaults.baseURL = BASE_URL;
// axios 设置  默认 超时时间
axios.defaults.timeout = TIMEOUT;
 
// 初始化 - axios 拦截器
export const initialRequest = (navigate:NavigateFunction, dispatch:AppDispatch)=>{
    // 请求拦截器 在发起http请求之前的一些操作
    // 1、发送请求之前，加载一些组件
    // 响应拦截器
    axios.interceptors.request.use((config:any ) => {
        // 发起请求前 显示正在加载
        dispatch(changeLoading(true))
        // 过滤 login 登录请求 - 此时还没有 token
        let reg = /\/login/g;
        if (!reg.test(config.url)) {
            // 不是 login 相关业务
            let token = localStorage.getItem('token');
            // 给后端 传入 token 时 有一个不成文的规定 就是拼接上 Bearer+空格+ token ，当然不这么写 也是可以 只是推荐这样写
            config.headers.Authorization = `Bearer ${token}`;//拼接上 Bearer+空格+ token
            // console.log(' axios 拦截器', token)
        }
        return config
    }, error => {
        //错误 - 隐藏 正在加载
        dispatch(changeLoading(false))
        return Promise.reject(error);
    })

    // 响应拦截器
    axios.interceptors.response.use((response) => {
        //隐藏 正在加载
        dispatch(changeLoading(false))
        // 任何请求成功后 - 获取后端返回的 toke 存入本地
        // console.log('任何请求成功后触发', response.config.url)
        // 统一在拦截器中 获取后端设置在header头里面的token字段（前后端 共同约定的：Authorization）
        const { authorization } = response.headers; // header头里面的Authorization  A为小写
        // 如果后端返回的Authorization为真，token 存入 本地 
        authorization && localStorage.setItem('token', authorization)
        return response
    }, err => {
        //隐藏 正在加载
        dispatch(changeLoading(false))
        // error.response包含了服务器响应的详细信息
        const statusCode = err.response.status;
        const errorMessage = err.response.data.message;
        // 401 token 过期
        if (err && err.response && err.response.status === 401) {
            // 销毁 个人信息
            dispatch(changeUserSlice({ value: undefined, type: 'userInfo' }));
            // 清除token
            localStorage.removeItem('token');
            // 重定向
            navigate("/login");
        } else if (err && err.response && err.response.status === 403) {// 403 角色 被删除 拒绝访问 或 没有权限
            // 销毁 个人信息
            dispatch(changeUserSlice({ value: undefined, type: 'userInfo' }));
            // 清除token
            localStorage.removeItem('token');
            // 重定向
            navigate("/login");
        }
        // console.log(err)
        message.error(err.response.data.Message || err.message)

        return Promise.reject(err);
    })
}