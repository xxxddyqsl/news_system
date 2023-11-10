import React, { useState } from 'react'
import './App.css'
import './assets/css/style.scss'
import { BrowserRouter, useNavigate } from 'react-router-dom'
// react 处理错误库 - 未写完- 待研究
import { ErrorBoundary } from 'react-error-boundary'
import MRouters from './routers'
// axios 返回状态码 401 需要重定向
import { SetupInterceptors } from './util/request'
function NavigateFunctionComponent() {
  let navigate = useNavigate();
  const [ran, setRan] = useState(false);
  {/* 只运行一次安装程序 传入 navigate 重定向 hook */ }
  if (!ran) {
    SetupInterceptors(navigate);
    setRan(true);
  }
  return <></>;
}
// 错误处理 - 渲染函数 - 未写完- 待研究
function MyFallbackComponent(props: any) {
  return (
    <div role="alert">
      <p>出错啦:</p>
      <pre>{props.error.message}</pre>
      <button onClick={props.resetErrorBoundary}>点击重试</button>
    </div>
  )
}
// 错误处理 - 上报函数 - 未写完- 待研究
function logErrorToService(error: any, info: any) {
  // 错误上报逻辑...
  console.error("Caught an error:", error, info);
}

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={MyFallbackComponent} onError={logErrorToService}>
      <BrowserRouter >
        {/* 重定向 */}
        {<NavigateFunctionComponent></NavigateFunctionComponent>}
        <MRouters></MRouters>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
