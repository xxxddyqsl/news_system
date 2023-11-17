import React, { useEffect, useState } from 'react'
// 实时监听 获取 页面 宽高
export default function WinResize(props:any) {
    const [size,setSize]=useState({})
    const resizeUpdate=()=>{
        // 获取页面高度 - 获取传入的 dom节点的宽高
        let obj = props.contentElem.current.getBoundingClientRect()
        setSize(obj);
        // console.log(111,props.contentElem, props.contentElem.current.getBoundingClientRect())
    }
    useEffect(()=>{
        // 组件-添加监听函数
        window.addEventListener('resize',resizeUpdate);
        return ()=>{
          console.log('组件销毁-移除监听',props.contentElem)
            // 组件销毁-移除监听
            window.removeEventListener('resize',resizeUpdate)
        }
    },[])
    // 页面 宽高发送变化 调用 传入 回调函数 传入 页面 宽高
    useEffect(()=>{
        props.callback(size)
        // console.log(111,props.contentElem, props.contentElem.current.getBoundingClientRect())
    },[size])
  return (
    <></>
  )
}
