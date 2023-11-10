import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// 导入 react-redux库  Provider 注入器 负责把我们的 store 注入到全局 ,这样哪个组件都能用 Provider 供应商组件 必须接收一个 store属性（必写） 花括号{}内的store 来自 自己封装导出的 store.js Redux核心库
import {Provider} from 'react-redux'
// 导入 redux存储器 react-redux 管理状态存储的容器 persistor 是( 使用persistStore 数据持久化存储的 store )  store ( 数据未持久化存储的 状态 store )
import { store, persistor} from './redux/store'
// 导入数据持久化 网关 接收 persistor 属性 花括号{}内的 persistor 是( 使用persistStore 数据持久化存储的 store )
import { PersistGate } from 'redux-persist/integration/react'
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // 严格模式 - 防止 导致生命周期 重复执行
  // <React.StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <App />
    </PersistGate>
  </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
