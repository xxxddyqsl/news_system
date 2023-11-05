import React from 'react'
 import Redirect from './Redirect';
//  {/*路由拦截-token 验证   通过插槽传入 想要渲染的 组件  */}


// 模拟 获取token 是否登录 或者 授权
const isAuth = function isAuth() {
    let token = localStorage.getItem('token');
    console.log(token)
    let is = false;
    if (token) {
        is = true;
    } else {
        is = false;
    }
    return is;
}

//路由拦截组件的封装 公共的 验证 token - 是否渲染 想要渲染的组件(通过插槽传入) 或 重定向到 login
const AuthComponent = (props: any) => {
    // 通过插槽传入 想要渲染的 组件
    const { children } = props
    // console.log(children)
    // token 为真 渲染 组件 否则 重定向到 login
    return isAuth() ? children : <Redirect to='/login' />
}
export default   AuthComponent