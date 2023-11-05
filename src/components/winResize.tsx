import React, { useEffect, useState } from 'react'
// 实时监听 获取 页面 宽高
export default function WinResize(props:any) {
    const [size,setSize]=useState({})
    const resizeUpdate=()=>{
        // // 获取页面高度
        // let w= e.target.innerWidth();
        // let h= e.target.innerHeight();
        // setSize({h,w});
        console.log(111,props.contentElem)
    }
    useEffect(()=>{
        // 组件销毁-移除监听
        window.addEventListener('resize',resizeUpdate)
        resizeUpdate()
        return ()=>{
            // 组件销毁-移除监听
            window.removeEventListener('resize',resizeUpdate)
        }
    },[])
    // 页面 宽高发送变化 调用 传入 回调函数 传入 页面 宽高
    useEffect(()=>{
        props.callback(size)
    },[size])
  return (
    <></>
  )
}
