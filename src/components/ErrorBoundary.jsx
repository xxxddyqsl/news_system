import React, { Component ,useState} from 'react'
// import React, { useState } from 'react'
// 定义 异步错误抛出工具
export const useThrowAsyncError = () => {
  const [error, setError] = useState()

  return (error) => {
    setError(() => {throw error})
  }
}
// 回调函数等错误  const onClickWithCatchError = useCallbackWithErrorHandler(onClick);
export const useCallbackWithErrorHandler = (callback) => {
  const [state, setState] = useState();

  return async (...args) => {
    try {
      await callback(...args);
    } catch(e) {
      setState(() =>  {throw e});
    }
  }
}
// 自定义 错误边界 组件写法
class ErrorComp extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hasError: false
    }
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error, errorInfo) {
    // 收集错误 -  同样可以将错误日志上报给服务器 等等操作
    console.group()
    console.log('error==>',error)
    console.info('errorInfo==>',errorInfo)
    console.groupEnd()
    // console.error('error==>',error,errorInfo)
  }

  render() {
    const { hasError, error } = this.state

    if (hasError) {
      return (
        <div>
          <p>出错了～ 😭</p>

          {error.message && <span>错误信息： {error.message}</span>}
        </div>
      )
    }
    return this.props.children
  }
}
// 模拟触发 - 错误 子组件
 const AppComponent = (props) => {
   
  const add=()=>{
    throw new Error('测试')
  }
  // 错误处理 错误边界 捕获 事件回调函数错误的用法 
  const onClickWithCatchError = useCallbackWithErrorHandler(add);
      const throwAsyncError  = useThrowAsyncError()
      // 错误处理 错误边界捕获异步错误的用法 
  // setTimeout(()=>{
  //   try {
  //     throw new Error('测试')
  //   } catch (error) {
  //     throwAsyncError(error)
  //   }
  // },2000)
  return <span onClick= {onClickWithCatchError}> qweqweqwe1</span>
}
export default ErrorComp