import React, { useEffect, useState } from 'react'
import './App.css'
import './assets/css/style.scss'
import { BrowserRouter, useNavigate } from 'react-router-dom'
// react 处理错误库 -ErrorBoundary可以捕捉它们，但它不会捕捉异步代码和事件处理回调中的错误。
import { ErrorBoundary } from 'react-error-boundary'
import MRouters from './routers'
import { useDispatch } from 'react-redux'
// axios 返回状态码 401 需要重定向
import { SetupInterceptors } from './util/request'
import ErrorComp, { useCallbackWithErrorHandler, useThrowAsyncError } from './components/ErrorBoundary'
function NavigateFunctionComponent() {
  let navigate = useNavigate();
  const [ran, setRan] = useState(false);
  const dispatch = useDispatch();
  
  {/* 只运行一次安装程序 传入 navigate 重定向 hook */ }
  if (!ran) {
    SetupInterceptors(navigate,dispatch);
    setRan(true);
  }
  return <></>;
}


// 错误处理 - 渲染函数 - 未写完- 待研究
function MyFallbackComponent(props: any) {
  useEffect(()=>{
    console.error("Caught an error:",props.error);
  },[props.error])
  return (
    <div role="alert">
      <p>出错了～ 😭:</p>
      <pre>{props.error.message}</pre>
      <button onClick={props.resetErrorBoundary}>点击重试</button>
    </div>
  )
}

// 错误处理 - 上报函数
function logErrorToService(error: any, info: any) {
  // 错误上报逻辑...
  // console.error("Caught an error:", error, info);
  // 收集错误 -  同样可以将错误日志上报给服务器 等等操作
  console.group()
  console.log('error==>',error)
  console.info('errorInfo==>',info)
  console.groupEnd()
  // console.error('error==>',error,errorInfo)
}

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={MyFallbackComponent} onError={logErrorToService} onReset={(details) => {
      // Reset the state of your app so the error doesn't happen again
      console.error("details:", details);
    }}>
      <BrowserRouter >
        {/* 重定向 */}
        {<NavigateFunctionComponent></NavigateFunctionComponent>}
        <MRouters></MRouters>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
