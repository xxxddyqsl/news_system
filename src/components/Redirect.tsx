import {useEffect} from "react";
import {useNavigate } from "react-router-dom";
// 自定义 重定向函数 {to} 形参解构 取出 props内的 属性 to
function Redirect({to}:any){
    console.log(to)
    // useNavigate 路由提供的钩子 返回一个函数 可以导航到任意的路径位置
    const navigate = useNavigate()
    useEffect(()=>{
        //核心 - 只是使用导航功能 return 返回一个空即可
        // replace:true 取代 之前的那一个页面 重新打开 to 路径的页面
        navigate(to,{replace:true})
    })
    return null;
  }
export default Redirect